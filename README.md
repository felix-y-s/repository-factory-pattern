# Factory Pattern 적용된 Repository 시스템

## 🎯 개요

Factory Pattern을 적용하여 **ORM 독립성**을 보장한 Repository 시스템으로 
Prisma에서 다른 ORM으로 교체할 때 Repository 코드 수정 없이 Module 설정만 변경하면 되도록 구현한다.

## 🏗️ 아키텍처

### 1. 추상화 계층
- `DatabaseAdapterFactory`: 추상 팩토리 인터페이스
- `DatabaseDelegate`: 데이터베이스 작업 인터페이스
- `IBaseRepository`: Repository 비즈니스 로직 인터페이스

### 2. 구현 계층
- `PrismaAdapterFactory`: Prisma ORM 구현체
- `BaseRepository`: 기본 Repository 구현
- `TransactionalBaseRepository`: 트랜잭션 지원 Repository