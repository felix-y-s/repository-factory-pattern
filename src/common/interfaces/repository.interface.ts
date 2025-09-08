/**
 * Repository Interfaces
 * 
 * Repository 패턴의 핵심 인터페이스들을 정의
 * 모든 Repository 구현체가 따라야 하는 계약을 명시
 */

import { PaginatedResult, QueryOptions } from '../types/query.types';

/**
 * 기본 Repository 인터페이스
 * CRUD 작업과 쿼리 기능을 정의하는 기본 Repository 계약
 * 
 * @template T 엔티티 타입 (예: User, Post)
 * @template CreateDto 생성 DTO 타입
 * @template UpdateDto 수정 DTO 타입
 */
export interface IBaseRepository<T, CreateDto, UpdateDto> {
  // ==================== 단일 조회 ====================
  /**
   * ID로 단일 엔티티 조회
   * @param id 엔티티 ID
   * @returns 조회된 엔티티 또는 null
   */
  findById(id: string | number): Promise<T | null>;

  /**
   * 조건으로 첫 번째 엔티티 조회
   * @param where 검색 조건
   * @returns 조회된 엔티티 또는 null
   */
  findOne(where: Partial<T>): Promise<T | null>;

  /**
   * 쿼리 옵션을 포함한 단일 엔티티 조회
   * @param options 쿼리 옵션 (where, include, select 등)
   * @returns 조회된 엔티티 또는 null
   */
  findOneWithOptions(options?: QueryOptions<T>): Promise<T | null>;

  // ==================== 다중 조회 ====================
  /**
   * 쿼리 옵션으로 다중 엔티티 조회
   * @param options 쿼리 옵션 (where, include, select, orderBy 등)
   * @returns 조회된 엔티티 배열
   */
  findAll(options?: QueryOptions<T>): Promise<T[]>;

  /**
   * 단순 조건으로 다중 엔티티 조회
   * @param where 검색 조건
   * @returns 조회된 엔티티 배열
   */
  findMany(where: Partial<T>): Promise<T[]>;

  /**
   * 복합 쿼리 옵션으로 다중 엔티티 조회
   * @param options 쿼리 옵션 (where, include, select, orderBy, pagination 등)
   * @returns 조회된 엔티티 배열
   */
  findManyWithOptions(options?: QueryOptions<T>): Promise<T[]>;

  /**
   * 페이지네이션을 지원하는 다중 엔티티 조회
   * @param options 쿼리 옵션 (page, limit, where, include, select 등)
   * @returns 페이지네이션 결과
   */
  findAllPaginated(options: QueryOptions<T>): Promise<PaginatedResult<T>>;

  // ==================== 계수 및 존재 확인 ====================
  /**
   * 조건에 맞는 엔티티 개수 조회
   * @param where 검색 조건 (옵션)
   * @returns 엔티티 개수
   */
  count(where?: Partial<T>): Promise<number>;

  /**
   * ID로 엔티티 존재 여부 확인
   * @param id 엔티티 ID
   * @returns 존재 여부
   */
  exists(id: string | number): Promise<boolean>;

  /**
   * 조건으로 엔티티 존재 여부 확인
   * @param where 검색 조건
   * @returns 존재 여부
   */
  existsBy(where: Partial<T>): Promise<boolean>;

  // ==================== 생성 ====================
  /**
   * 단일 엔티티 생성
   * @param data 생성 데이터
   * @returns 생성된 엔티티
   */
  create(data: CreateDto): Promise<T>;

  /**
   * 다중 엔티티 생성
   * @param data 생성 데이터 배열
   * @returns 생성된 엔티티 개수
   */
  createMany(data: CreateDto[]): Promise<{ count: number }>;

  // ==================== 수정 ====================
  /**
   * ID로 단일 엔티티 수정
   * @param id 엔티티 ID
   * @param data 수정 데이터
   * @returns 수정된 엔티티
   */
  update(id: string | number, data: UpdateDto): Promise<T>;

  /**
   * 조건에 맞는 다중 엔티티 수정
   * @param where 검색 조건
   * @param data 수정 데이터
   * @returns 수정된 엔티티 개수
   */
  updateMany(where: Partial<T>, data: UpdateDto): Promise<{ count: number }>;

  /**
   * Upsert 작업 (있으면 수정, 없으면 생성)
   * @param where 검색 조건
   * @param create 생성 데이터
   * @param update 수정 데이터
   * @returns 생성 또는 수정된 엔티티
   */
  upsert(where: Partial<T>, create: CreateDto, update: UpdateDto): Promise<T>;

  // ==================== 삭제 ====================
  /**
   * ID로 단일 엔티티 삭제
   * @param id 엔티티 ID
   */
  delete(id: string | number): Promise<void>;

  /**
   * 조건에 맞는 다중 엔티티 삭제
   * @param where 검색 조건
   * @returns 삭제된 엔티티 개수
   */
  deleteMany(where: Partial<T>): Promise<{ count: number }>;

  /**
   * 소프트 삭제 (선택적 구현)
   * @param id 엔티티 ID
   * @returns 소프트 삭제된 엔티티
   */
  softDelete?(id: string | number): Promise<T>;

  // ==================== 유틸리티 ====================
  /**
   * 엔티티 새로고침 (최신 데이터로 재조회)
   * @param entity 새로고침할 엔티티
   * @returns 새로고침된 엔티티 또는 null
   */
  refresh(entity: T): Promise<T | null>;
}

/**
 * 트랜잭션 지원 Repository 인터페이스
 * 데이터베이스 트랜잭션을 지원하는 Repository에서 구현
 * 
 * @template T 엔티티 타입
 * @template CreateDto 생성 DTO 타입  
 * @template UpdateDto 수정 DTO 타입
 */
export interface ITransactionalRepository<T, CreateDto, UpdateDto>
  extends IBaseRepository<T, CreateDto, UpdateDto> {
  /**
   * 트랜잭션 내에서 Repository 작업 실행
   * @param callback 트랜잭션 내에서 실행할 콜백 함수
   * @returns 콜백 함수의 실행 결과
   */
  withTransaction<R>(
    callback: (repo: IBaseRepository<T, CreateDto, UpdateDto>) => Promise<R>,
  ): Promise<R>;
}