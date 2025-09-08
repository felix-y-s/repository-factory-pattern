import { Inject, Injectable } from '@nestjs/common';

// 데이터베이스 어댑터 토큰들
export const DATABASE_ADAPTER_FACTORY = Symbol('DatabaseAdapterFactory');
export const USER_ADAPTER_TOKEN = Symbol('UserAdapter');
export const POST_ADAPTER_TOKEN = Symbol('PostAdapter');
export const COMMENT_ADAPTER_TOKEN = Symbol('CommentAdapter');
export const DEFAULT_LIMIT_TOKEN = Symbol('DefaultLimit'); // 조회 시 가져오기 행 수 기본값

// 페이지네이션 파라미터
export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}

// 정렬 옵션
export interface SortOptions<T = any> {
  filter: keyof T;
  direction: 'asc' | 'desc';
}

// 필터링 옵션
export interface FilterOptions<T = any> {
  where?: Partial<T>;
  include?: Record<string, any>;
  select?: Record<string, any>;
}

// 페이지내이션 응답
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 쿼리 옵션(조합형)
export interface QueryOptions<T = any>
  extends PaginationParams,
    FilterOptions<T> {
  orderBy?: SortOptions<T>[];
}

// 데이터베이스 델리게이트 타입 (ORM 독립적)
export interface DatabaseDelegate {
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  findMany: (args: any) => Promise<any>;
  count: (args: any) => Promise<number>;
  create: (args: { data: any }) => Promise<any>;
  createMany: (args: { data: any[] }) => Promise<{ count: number }>;
  update: (args: { where: any; data: any }) => Promise<any>;
  updateMany: (args: { where: any; data: any }) => Promise<{ count: number }>;
  upsert: (args: { where: any; create: any; update: any }) => Promise<any>;
  delete: (args: { where: any }) => Promise<any>;
  deleteMany: (args: { where: any }) => Promise<{ count: number }>;
}

// 기본 Repository 인터페이스
export interface IBaseRepository<T, CreateDto, UpdateDto> {
  // 단일 조회
  findById(id: string | number): Promise<T | null>;
  findOne(where: Partial<T>): Promise<T | null>;
  findOneWithOptions(options?: QueryOptions<T>): Promise<T | null>;

  // 다중 조회
  findAll(options?: QueryOptions<T>): Promise<T[]>;
  findMany(where: Partial<T>, options?: QueryOptions<T>): Promise<T[]>;
  findManyWithOptions(options?: QueryOptions<T>): Promise<T[]>;
  findAllPaginated(options: QueryOptions<T>): Promise<PaginatedResult<T>>;

  // 계수 및 존재 확인
  count(where?: Partial<T>): Promise<number>;
  exists(id: string | number): Promise<boolean>;
  existsBy(where: Partial<T>): Promise<boolean>; // 🔴 exists 함수와 기능을 분리한 이유는?

  // 생성
  create(data: CreateDto): Promise<T>;
  createMany(data: CreateDto[]): Promise<{ count: number }>;

  // 수정
  update(id: string | number, data: UpdateDto): Promise<T>;
  updateMany(where: Partial<T>, data: UpdateDto): Promise<{ count: number }>;
  upsert(where: Partial<T>, create: CreateDto, update: UpdateDto): Promise<T>;

  // 삭제
  delete(id: string | number): Promise<void>;
  deleteMany(where: Partial<T>): Promise<{ count: number }>;
  softDelete?(id: string | number): Promise<T>;

  // 유틸리티
  refresh(entity: T): Promise<T | null>;
}

// 트랜잭션 지원 인터페이스
export interface ITransactionalRepository<T, CreateDto, UpdateDto>
  extends IBaseRepository<T, CreateDto, UpdateDto> {
  // 🔴
  withTransaction<R>(
    callback: (repo: IBaseRepository<T, CreateDto, UpdateDto>) => Promise<R>,
  ): Promise<R>;
}

export abstract class DatabaseAdapterFactory {
  abstract createAdapter(modelName: string): DatabaseDelegate;
  abstract createUserAdapter(): DatabaseDelegate;
  abstract createPostAdapter(): DatabaseDelegate;
}

@Injectable()
export class PrismaAdapterFactory extends DatabaseAdapterFactory {
  constructor(private readonly databaseClient: any) {
    super();
  }

  createAdapter(modelName: string): DatabaseDelegate {
    const modelKey = modelName.toLowerCase();
    const adapter = this.databaseClient[modelKey];

    if (!adapter) {
      throw new Error(
        `Database model '${modelName}' not found in DatabaseClient`,
      );
    }

    return adapter;
  }

  createUserAdapter(): DatabaseDelegate {
    return this.databaseClient.user;
  }
  createPostAdapter(): DatabaseDelegate {
    return this.databaseClient.post;
  }
}
