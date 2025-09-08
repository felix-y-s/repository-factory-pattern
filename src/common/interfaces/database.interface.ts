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
