# Repository Factory Pattern 프로젝트

이 프로젝트는 Repository Factory Pattern을 사용하여 구현된 현대적인 NestJS 애플리케이션입니다. Repository 패턴과 Factory 패턴을 조합하여 데이터 접근 계층의 추상화와 확장성을 제공합니다.

## 🚀 프로젝트 개요

**Repository Factory Pattern 프로젝트**는 NestJS와 Prisma를 사용하여 구현된 현대적인 웹 애플리케이션입니다. 이 프로젝트는 Repository 패턴과 Factory 패턴을 조합하여 데이터 접근 계층의 추상화와 확장성을 제공합니다.

### 주요 특징
- ✨ **모듈화된 아키텍처**: 관심사별로 명확히 분리된 구조
- 🏗️ **Repository Factory 패턴**: ORM 독립적인 데이터 접근 계층
- 🔒 **타입 안전성**: TypeScript를 통한 강력한 타입 시스템
- 🔧 **확장 가능성**: 새로운 ORM이나 데이터베이스 쉽게 추가 가능

## 🛠️ 기술 스택

### Backend Framework
- **NestJS 11.0.1**: Enterprise급 Node.js 프레임워크
- **TypeScript 5.7.3**: 정적 타입 검사 및 최신 JavaScript 기능

### Database & ORM
- **Prisma 6.15.0**: 차세대 TypeScript ORM
- **PostgreSQL**: 프로덕션용 관계형 데이터베이스

### Validation & Mapping
- **class-validator 0.14.2**: 클래스 기반 유효성 검증
- **class-transformer 0.5.1**: 데이터 변환 및 직렬화
- **@nestjs/mapped-types 2.1.0**: DTO 매핑 유틸리티

### Testing & Development Tools
- **Jest 30.0.0**: 테스팅 프레임워크
- **ESLint 9.18.0**: 코드 품질 검사
- **Prettier 3.4.2**: 코드 포맷팅

## 📁 프로젝트 구조

```
repository-factory-pattern/
├── src/                          # 소스 코드 디렉토리
│   ├── common/                   # 공통 모듈
│   │   ├── adapters/            # 데이터베이스 어댑터 구현체
│   │   ├── constants/           # DI 토큰 및 상수
│   │   ├── interfaces/          # 추상 인터페이스
│   │   └── types/              # TypeScript 타입 정의
│   ├── database/               # 데이터베이스 설정
│   ├── repositories/           # Repository 구현체
│   ├── user/                   # 사용자 도메인
│   └── app.module.ts          # 애플리케이션 루트 모듈
├── prisma/                     # Prisma 스키마 및 마이그레이션
├── test/                       # 테스트 파일
├── docs/                       # 프로젝트 문서
└── dist/                       # 빌드 결과물
```

## 📋 사전 요구사항

프로젝트를 시작하기 전에 다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **PostgreSQL**: 13.x 이상
- **Git**: 2.x 이상

### 시스템 요구사항
- **OS**: macOS, Linux, Windows (WSL2 권장)
- **메모리**: 최소 4GB RAM
  - Node.js 런타임 (~500MB)
  - PostgreSQL (~500MB-1GB)
  - 개발 도구 (VS Code, 브라우저 등 ~2GB)
  - 여유 메모리 (~1GB)
- **저장공간**: 최소 1GB 여유 공간

## 🚀 시작하기

### 1. 프로젝트 클론 및 설정

```bash
# 프로젝트 클론
git clone <repository-url>
cd repository-factory-pattern

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정하세요:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/repository_pattern_db"

# Application
NODE_ENV=development
PORT=3000

# Prisma
PRISMA_LOG_LEVEL=info
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 샘플 데이터 추가 (선택사항)
npx prisma db seed
```

### 4. 애플리케이션 실행

```bash
# 개발 서버 실행
npm run start:dev

# 애플리케이션 접속
# http://localhost:3000
```

### 5. 코드 품질 관리

```bash
# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 타입 검사
npm run build
```

### 6. 테스트 실행

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 🏗️ 아키텍처

### Repository Pattern
데이터 접근 로직을 비즈니스 로직에서 분리하여 코드의 가독성과 테스트 용이성을 향상시킵니다.

### Factory Pattern
다양한 데이터베이스 어댑터를 생성하고 관리하는 유연한 방법을 제공합니다.

### Dependency Injection
NestJS의 DI 컨테이너를 활용하여 느슨한 결합과 높은 테스트 용이성을 달성합니다.

## 🔧 핵심 컴포넌트

### 1. Common 모듈 (`src/common/`)
공통적으로 사용되는 구성 요소들을 포함합니다.

- **`constants/tokens.ts`**: 의존성 주입 토큰 정의
- **`interfaces/repository.interface.ts`**: Repository 계약 인터페이스
- **`interfaces/database.interface.ts`**: 데이터베이스 추상화 계층
- **`types/query.types.ts`**: 쿼리, 페이지네이션 관련 타입
- **`adapters/prisma-adapter.factory.ts`**: Prisma 어댑터 구현체

### 2. Repository 패턴 (`src/repositories/`)
데이터 접근 계층의 핵심 구현체들을 포함합니다.

- **`base.repository.ts`**: 모든 Repository의 기본 클래스
- **`user.repository.ts`**: 사용자 도메인 Repository
- **`transactional.base.repository.ts`**: 트랜잭션 지원 Repository

## 📖 API 문서

### 사용자 관리 API

#### 사용자 생성
```http
POST /user
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "홍길동"
}
```

**응답 예시:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "createAt": "2025-01-10T10:00:00.000Z",
  "updateAt": "2025-01-10T10:00:00.000Z"
}
```

#### 이메일로 사용자 조회
```http
GET /user/email/{email}
```

**응답 예시:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "createAt": "2025-01-10T10:00:00.000Z",
  "updateAt": "2025-01-10T10:00:00.000Z"
}
```

#### ID로 사용자 조회
```http
GET /user/id/{id}
```

## 💡 사용 예제

### Repository 패턴 사용법

```typescript
// UserService에서 Repository 사용 (src/user/user.service.ts)
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 존재하는 이메일입니다');
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  // 페이지네이션이 포함된 사용자 목록 조회
  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResult<User>> {
    return this.userRepository.findAllPaginated({
      page,
      limit,
      orderBy: [{ filter: 'createAt', direction: 'desc' }]
    });
  }
}
```

### 새로운 Repository 추가하기

```typescript
// 1. DTO 정의 (src/post/dto/create-post.dto.ts)
export class CreatePostDto {
  @IsString()
  title: string;
  
  @IsString()
  content: string;
  
  @IsNumber()
  authorId: number;
}

// 2. Repository 구현 (src/repositories/post.repository.ts)
@Injectable()
export class PostRepository extends BaseRepository<Post, CreatePostDto, UpdatePostDto> {
  protected readonly modelName = 'Post';

  constructor(
    @Inject(DATABASE_ADAPTER_FACTORY)
    adapterFactory: DatabaseAdapterFactory,
  ) {
    super(adapterFactory);
  }

  // 도메인 특화 메서드
  async findByAuthor(authorId: number): Promise<Post[]> {
    return this.findMany({ authorId });
  }

  async findPublished(): Promise<Post[]> {
    return this.findMany({ published: true });
  }
}

// 3. Service 구현 (src/post/post.service.ts)
@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(postData: CreatePostDto): Promise<Post> {
    return this.postRepository.create(postData);
  }

  async getPostsByAuthor(authorId: number): Promise<Post[]> {
    return this.postRepository.findByAuthor(authorId);
  }
}

// 4. Controller 구현 (src/post/post.controller.ts)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() dto: CreatePostDto) {
    return this.postService.createPost(dto);
  }

  @Get('author/:authorId')
  async getPostsByAuthor(@Param('authorId') authorId: number) {
    return this.postService.getPostsByAuthor(authorId);
  }
}

// 5. Module 구성 (src/post/post.module.ts)
@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
```

## 📚 문서

### 기술 문서
- **[Repository Pattern 가이드](./docs/REPOSITORY_PATTERN.md)**: Repository Factory Pattern 구현 가이드
- **[Prisma 설정 가이드](./docs/PRISMA_SETUP.md)**: 데이터베이스 설정 및 사용법

## ⚙️ 환경 변수 설정

### 필수 환경 변수

| 변수명 | 설명 | 기본값 | 예시 |
|-------|------|-------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | - | `postgresql://user:pass@localhost:5432/db` |
| `NODE_ENV` | 실행 환경 | `development` | `development` \| `production` \| `test` |
| `PORT` | 서버 포트 | `3000` | `3000` |

### 선택적 환경 변수

| 변수명 | 설명 | 기본값 | 예시 |
|-------|------|-------|------|
| `PRISMA_LOG_LEVEL` | Prisma 로그 레벨 | `info` | `info` \| `warn` \| `error` |
| `DEFAULT_LIMIT` | 기본 페이지네이션 크기 | `20` | `10` |

### 환경별 설정 예시

#### 개발 환경 (`.env`)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/repository_pattern_dev"
NODE_ENV=development
PORT=3000
PRISMA_LOG_LEVEL=info
DEFAULT_LIMIT=20
```

#### 테스트 환경 (`.env.test`)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/repository_pattern_test"
NODE_ENV=test
PORT=3001
PRISMA_LOG_LEVEL=warn
DEFAULT_LIMIT=10
```

#### 프로덕션 환경 (`.env.production`)
```env
DATABASE_URL=${DATABASE_URL}
NODE_ENV=production
PORT=${PORT}
PRISMA_LOG_LEVEL=error
DEFAULT_LIMIT=50
```

## 🚀 배포

### Docker 배포

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/repository_pattern
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: repository_pattern
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 프로덕션 배포 체크리스트

- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 실행
- [ ] SSL/TLS 인증서 설정
- [ ] 로깅 및 모니터링 설정
- [ ] 백업 전략 수립
- [ ] 성능 테스트 완료

## 🔧 트러블슈팅

### 일반적인 문제

#### 1. 데이터베이스 연결 실패
```bash
Error: P1001: Can't reach database server
```

**해결 방법:**
- PostgreSQL 서비스가 실행 중인지 확인
- DATABASE_URL이 올바른지 확인
- 네트워크 연결 상태 점검

#### 2. 마이그레이션 오류
```bash
Error: Migration failed
```

**해결 방법:**
```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋
npx prisma migrate reset

# 새 마이그레이션 생성
npx prisma migrate dev --name init
```

#### 3. Prisma Client 오류
```bash
Error: Prisma Client is not configured
```

**해결 방법:**
```bash
# Prisma Client 재생성
npx prisma generate

# 개발 서버 재시작
npm run start:dev
```

### 성능 최적화

#### 1. 데이터베이스 최적화
```typescript
// 인덱스 추가 (prisma/schema.prisma)
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  
  @@index([email]) // 이메일 검색 최적화
}
```

#### 2. 쿼리 최적화
```typescript
// Service에서 Repository 사용 예시 (src/user/user.service.ts)

// 관계 데이터 포함 조회
const users = await userRepository.findAll({
  include: { posts: true },
  limit: 10
});

// 필요한 필드만 조회
const users = await userRepository.findAll({
  select: { id: true, email: true },
  limit: 10
});

// 복합 쿼리 옵션 사용
const activeUsers = await userRepository.findAllPaginated({
  page: 1,
  limit: 20,
  where: { 
    status: 'active',
    name: { contains: '김' }
  },
  include: { posts: { where: { published: true } } },
  orderBy: [
    { filter: 'createAt', direction: 'desc' },
    { filter: 'name', direction: 'asc' }
  ]
});
```

## 🤝 기여 가이드라인

### 개발 워크플로

1. **이슈 생성**: 버그 리포트나 기능 요청을 이슈로 등록
2. **브랜치 생성**: `feature/기능명` 또는 `fix/버그명` 형태로 브랜치 생성
3. **개발**: 코딩 컨벤션을 준수하여 개발
4. **테스트**: 변경사항에 대한 테스트 작성 및 실행
5. **Pull Request**: 상세한 설명과 함께 PR 생성

### 커밋 메시지 컨벤션

```
type(scope): subject

[optional body]

[optional footer]
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드 또는 도구 변경

**예시:**
```
feat(user): add user email validation

Add email format validation in CreateUserDto using class-validator

Closes #123
```

### 코드 품질 기준

- **테스트 커버리지**: 최소 80% 이상
- **ESLint**: 모든 규칙 준수
- **타입 안전성**: TypeScript strict 모드 준수
- **문서화**: 공개 API에 대한 JSDoc 작성

---

**마지막 업데이트**: 2025년 9월 8일  
**버전**: 0.0.1  
**상태**: 개발 중