/**
 * Database Interface
 *
 * ORM 독립적인 데이터베이스 인터페이스 정의
 * Prisma, TypeORM, Sequelize 등 다양한 ORM과 호환 가능한 추상화
 */

/**
 * 기본 쿼리 조건 타입
 */
export type WhereCondition = Record<string, any>;

/**
 * 정렬 조건 타입
 */
export type OrderByCondition = Record<string, 'asc' | 'desc'>;

/**
 * 페이징 옵션 타입
 */
export interface PaginationOptions {
  skip?: number;
  take?: number;
}

/**
 * 데이터베이스 쿼리 옵션 타입
 */
export interface DatabaseQueryOptions extends PaginationOptions {
  where?: WhereCondition;
  orderBy?: OrderByCondition | OrderByCondition[];
  select?: Record<string, boolean>;
  include?: Record<string, boolean | object>;
}

/**
 * 업데이트 결과 타입
 */
export interface UpdateResult {
  count: number;
}

/**
 * 생성 결과 타입
 */
export interface CreateManyResult {
  count: number;
}

/**
 * 데이터베이스 델리게이트 인터페이스
 * 실제 ORM의 모델 메서드들을 추상화한 인터페이스
 * 제네릭을 통해 타입 안전성 제공
 */
export interface DatabaseDelegate {
  // 조회 메서드
  findUnique: (args: { where: WhereCondition; select?: Record<string, boolean> }) => Promise<any>;
  findFirst: (args: DatabaseQueryOptions) => Promise<any>;
  findMany: (args?: DatabaseQueryOptions) => Promise<any[]>;
  count: (args?: { where?: WhereCondition }) => Promise<number>;

  // 생성 메서드
  create: (args: { data: any }) => Promise<any>;
  createMany: (args: { data: any[] }) => Promise<CreateManyResult>;

  // 수정 메서드
  update: (args: { where: WhereCondition; data: any }) => Promise<any>;
  updateMany: (args: { where: WhereCondition; data: any }) => Promise<UpdateResult>;
  upsert: (args: {
    where: WhereCondition;
    create: any;
    update: any
  }) => Promise<any>;

  // 삭제 메서드
  delete: (args: { where: WhereCondition }) => Promise<any>;
  deleteMany: (args: { where: WhereCondition }) => Promise<UpdateResult>;
}
