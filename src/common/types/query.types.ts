/**
 * Query Types
 *
 * Repository 패턴에서 사용되는 쿼리, 페이지네이션, 정렬, 필터링 관련 타입 정의
 * 데이터베이스 조회 작업에 필요한 모든 타입들을 포함
 */

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

// 페이지네이션 응답 결과
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 쿼리 옵션 (조합형 인터페이스)
export interface QueryOptions<T = any>
  extends PaginationParams,
    FilterOptions<T> {
  orderBy?: SortOptions<T>[];
}

