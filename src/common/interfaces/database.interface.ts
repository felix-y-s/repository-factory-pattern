/**
 * Database Interface
 *
 * ORM 독립적인 데이터베이스 인터페이스 정의
 * Prisma, TypeORM, Sequelize 등 다양한 ORM과 호환 가능한 추상화
 */

/**
 * 데이터베이스 델리게이트 인터페이스
 * 실제 ORM의 모델 메서드들을 추상화한 인터페이스
 */
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
