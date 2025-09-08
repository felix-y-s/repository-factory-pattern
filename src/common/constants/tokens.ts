/**
 * Dependency Injection Tokens
 *
 * 이 파일은 NestJS 의존성 주입에서 사용되는 모든 토큰을 정의합니다.
 * Symbol을 사용하여 전역적으로 고유한 토큰을 보장합니다.
 */

// 데이터베이스 어댑터 관련 토큰
export const DATABASE_ADAPTER_FACTORY = Symbol('DatabaseAdapterFactory');

// 모델별 어댑터 토큰 (특정 모델에 특화된 어댑터가 필요한 경우)
export const USER_ADAPTER_TOKEN = Symbol('UserAdapter');
export const POST_ADAPTER_TOKEN = Symbol('PostAdapter');
export const COMMENT_ADAPTER_TOKEN = Symbol('CommentAdapter');

// 설정 관련 토큰
export const DEFAULT_LIMIT_TOKEN = Symbol('DefaultLimit'); // 조회 시 가져오기 행 수 기본값
