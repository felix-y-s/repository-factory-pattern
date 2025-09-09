/**
 * Repository Interfaces
 *
 * Repository 패턴의 공통 타입들을 정의
 * Repository 구현체에서 사용할 기본 타입들을 제공
 */

import { PaginatedResult, QueryOptions } from '../types/query.types';

/**
 * Repository 기본 메서드들의 타입 정의
 * BaseRepository 추상 클래스에서 구현해야 하는 메서드들의 시그니처를 정의
 *
 * 참고: 이전에는 IBaseRepository 인터페이스가 있었지만,
 *       과도한 추상화로 판단되어 제거하고 BaseRepository 추상 클래스만 사용
 */
export type RepositoryMethodSignatures<T, CreateDto, UpdateDto> = {
  // 단일 조회
  findById(id: string | number): Promise<T | null>;
  findOne(where: Partial<T>): Promise<T | null>;
  findOneWithOptions(options?: QueryOptions<T>): Promise<T | null>;

  // 다중 조회
  findAll(options?: QueryOptions<T>): Promise<T[]>;
  findMany(where: Partial<T>): Promise<T[]>;
  findManyWithOptions(options?: QueryOptions<T>): Promise<T[]>;
  findAllPaginated(options: QueryOptions<T>): Promise<PaginatedResult<T>>;

  // 계수 및 존재 확인
  count(where?: Partial<T>): Promise<number>;
  exists(id: string | number): Promise<boolean>;
  existsBy(where: Partial<T>): Promise<boolean>;

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
};

/**
 * 트랜잭션 콜백 함수 타입
 * TransactionalBaseRepository의 withTransaction 메서드에서 사용
 */
export type TransactionCallback<T, CreateDto, UpdateDto, R> = (
  repo: RepositoryMethodSignatures<T, CreateDto, UpdateDto>,
) => Promise<R>;
