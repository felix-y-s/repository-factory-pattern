import { DatabaseDelegate } from 'src/common';

/**
 * 데이터베이스 어댑터 팩토리 추상 클래스
 * 다양한 모델에 대한 데이터베이스 어댑터 생성을 담당
 */
export abstract class DatabaseAdapterFactory {
  /**
   * 모델명을 기반으로 데이터베이스 어댑터 생성
   * @param modelName 모델명 (예: 'User', 'Post')
   * @returns DatabaseDelegate 인터페이스를 구현한 어댑터
   */
  abstract createAdapter(modelName: string): DatabaseDelegate;

  /**
   * 사용자 모델 전용 어댑터 생성
   * @returns 사용자 모델 데이터베이스 어댑터
   */
  abstract createUserAdapter(): DatabaseDelegate;

  /**
   * 게시글 모델 전용 어댑터 생성
   * @returns 게시글 모델 데이터베이스 어댑터
   */
  abstract createPostAdapter(): DatabaseDelegate;
}
