# Prisma ORM 설정 가이드

이 문서는 현재 프로젝트에서 사용 중인 Prisma ORM 설정 방법과 사용법을 안내합니다.

## 📋 목차

- [개요](#개요)
- [프로젝트 구조](#프로젝트-구조)
- [데이터베이스 설정](#데이터베이스-설정)
- [스키마 구성](#스키마-구성)
- [마이그레이션](#마이그레이션)
- [클라이언트 사용법](#클라이언트-사용법)
- [Scripts 및 Commands](#scripts-및-commands)
- [환경 변수](#환경-변수)
- [트러블슈팅](#트러블슈팅)

## 📖 개요

현재 프로젝트는 NestJS 프레임워크와 함께 Prisma ORM을 사용하여 PostgreSQL 데이터베이스를 관리합니다.

### 주요 구성 요소
- **Database Provider**: PostgreSQL
- **ORM**: Prisma v6.15.0
- **Client**: @prisma/client
- **Framework**: NestJS

## 🗂️ 프로젝트 구조

```
prisma/
├── schema.prisma           # 데이터베이스 스키마 정의
├── migrations/            # 데이터베이스 마이그레이션 파일들
│   ├── 20250906111651_init/
│   │   └── migration.sql  # 초기 테이블 생성 SQL
│   └── migration_lock.toml # 마이그레이션 잠금 파일
└── .env                   # 환경 변수 (DATABASE_URL)
```

## 🗄️ 데이터베이스 설정

### 연결 설정
```env
DATABASE_URL="postgres://admin:password123@localhost:5432/factory_db"
```

### 데이터베이스 스키마 구성
현재 프로젝트는 PostgreSQL의 `public` 스키마를 사용하고 있으며, 다음과 같은 테이블들이 정의되어 있습니다:

#### User 테이블
- `id`: 자동 증가하는 기본 키
- `email`: 유니크 제약조건이 있는 사용자 이메일
- `name`: 선택적 사용자 이름

#### Post 테이블
- `id`: 자동 증가하는 기본 키
- `authorId`: User 테이블과의 외래 키 (선택적)
- `createAt`: 생성 시각 (기본값: 현재 시각)
- `updateAt`: 수정 시각 (자동 업데이트)
- `title`: 게시글 제목
- `contents`: 게시글 내용 (선택적)
- `published`: 게시 여부 (기본값: false)
- `viewCount`: 조회수 (기본값: 0)

## 📝 스키마 구성

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id Int @id @default(autoincrement())
  email String @unique
  name String?
  posts Post[]
}

model Post {
  id Int @id @default(autoincrement())
  authorId Int?
  author User? @relation(fields: [authorId], references: [id])
  createAt DateTime @default(now())
  updateAt DateTime @updatedAt
  title String
  contents String?
  published Boolean @default(false)
  viewCount Int @default(0)
}
```

### 관계 설정
- **User ↔ Post**: One-to-Many 관계
- **Post.author**: User와의 선택적 관계 (authorId가 null일 수 있음)
- **외래 키 제약**: `ON DELETE SET NULL ON UPDATE CASCADE`

## 🚀 마이그레이션

### 초기 마이그레이션
프로젝트는 `20250906111651_init` 마이그레이션으로 초기 테이블 구조가 생성되었습니다.

### 마이그레이션 실행 방법

```bash
# 새로운 마이그레이션 생성
# 1. 마이그레이션 파일 생성 (스키마 변경이 있는 경우)
# 2. 데이터베이스에 마이그레이션 적용
# 3. 자동으로 npx prisma generate 실행 → 클라이언트 생성
npx prisma migrate dev --name <migration_name>

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (개발 환경 전용)
npx prisma migrate reset
```

## 💻 클라이언트 사용법

### Prisma Client 설치 및 생성

```bash
# 클라이언트 설치
npm install @prisma/client

# 클라이언트 생성/업데이트
# 키마는 변경하지 않고 클라이언트만 재생성하고 싶을 때(node_modules 삭제 후 재설치했을 때, CI/CD 환경에서 빌드 시)
npx prisma generate
```
> 언제 별도로 npx prisma generate가 필요한가?
>  - 스키마는 변경하지 않고 클라이언트만 재생성하고 싶을 때
>  - node_modules 삭제 후 재설치했을 때
>  - 클라이언트 타입이 제대로 인식되지 않을 때
>  - CI/CD 환경에서 빌드 시 (마이그레이션 없이 클라이언트만 필요)

### NestJS에서 사용 예시

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

// user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, name?: string) {
    return this.prisma.user.create({
      data: { email, name },
    });
  }

  async findUserWithPosts(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }
}
```

## 🛠️ Scripts 및 Commands

현재 프로젝트의 `package.json`에는 Prisma 관련 스크립트가 직접 정의되어 있지 않지만, 다음 명령어들을 사용할 수 있습니다:

```bash
# 데이터베이스 스키마 시각화
npx prisma studio

# 스키마 검증
npx prisma validate

# 데이터베이스 푸시 (개발 환경)
npx prisma db push

# 시드 데이터 실행
npx prisma db seed
```

### 권장 Scripts 추가

`package.json`에 다음 스크립트를 추가하는 것을 권장합니다:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "prisma db seed"
  }
}
```

## 🔧 환경 변수

### 필수 환경 변수

```env
# .env 파일
DATABASE_URL="postgres://admin:password123@localhost:5432/factory_db"
```

### 환경별 설정

```env
# 개발 환경
DATABASE_URL="postgres://admin:password123@localhost:5432/factory_db"

# 테스트 환경
DATABASE_URL="postgres://admin:password123@localhost:5432/factory_db_test"

# 프로덕션 환경
DATABASE_URL="postgres://prod_user:prod_password@prod_host:5432/factory_db_prod"
```

## ❗ 트러블슈팅

### 일반적인 문제들

#### 1. 마이그레이션 실패
```bash
# 스키마 리셋 후 재시작
npx prisma migrate reset
npx prisma migrate dev
```

#### 2. 클라이언트 타입 에러
```bash
# 클라이언트 재생성
npx prisma generate
npm run build
```

#### 3. 데이터베이스 연결 실패
- DATABASE_URL 환경 변수 확인
- 데이터베이스 서버 실행 상태 확인
- 네트워크 연결 및 방화벽 설정 확인

#### 4. 스키마 변경 반영 안됨
```bash
# 개발 환경에서 스키마 푸시
npx prisma db push

# 또는 마이그레이션 생성
npx prisma migrate dev --name schema_update
```

### 로그 확인

```typescript
// Prisma 로그 활성화
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 📚 추가 리소스

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [NestJS Prisma 통합 가이드](https://docs.nestjs.com/recipes/prisma)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)

---

**참고**: 이 문서는 현재 프로젝트의 구성을 기반으로 작성되었습니다. 프로젝트가 발전함에 따라 내용을 업데이트해 주세요.