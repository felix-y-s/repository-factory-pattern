import { Inject, Injectable } from '@nestjs/common';
import { DatabaseAdapterFactory } from 'src/adapters';
import {
  DATABASE_ADAPTER_FACTORY,
  DEFAULT_LIMIT_TOKEN,
  DatabaseDelegate,
  PaginatedResult,
  QueryOptions,
} from 'src/common';

@Injectable()
export abstract class BaseRepository<
  T,
  CreateDto extends Partial<T> = Partial<T>,
  UpdateDto extends Partial<T> = Partial<T>
> {
  protected abstract readonly modelName: string;
  private _database?: DatabaseDelegate;

  constructor(
    @Inject(DATABASE_ADAPTER_FACTORY) // ← 써도 되고 안 써도 됨 (무시됨): 실제 인스턴스화되는 자식 클래스에서 인스턴스화 됨
    protected readonly adapterFactory: DatabaseAdapterFactory,
    @Inject(DEFAULT_LIMIT_TOKEN) // ← 써도 되고 안 써도 됨 (무시됨)
    protected readonly defaultLimit: number = 20,
  ) {}

  // NOTE: 🔴 포인트
  // 지연 초기화: 추상 프로퍼티는 생성자에서 접근이 불가능
  protected get database(): DatabaseDelegate {
    if (!this._database) {
      this._database = this.adapterFactory.createAdapter(this.modelName);
    }
    return this._database;
  }

  async findById(id: string | number): Promise<T | null> {
    return await this.database.findUnique({
      where: { id },
    });
  }

  async findOne(where: Partial<T>): Promise<T | null> {
    return await this.database.findFirst({ where });
  }

  async findOneWithOptions(options: QueryOptions<T>): Promise<T | null> {
    const args = this.buildQueryArgs(options);
    return this.database.findFirst(args);
  }

  async findAll(options: QueryOptions<T>): Promise<T[]> {
    const args = this.buildQueryArgs(options);
    return this.database.findMany(args);
  }

  /**
   * 단순 조건으로 다중 레코드 조회
   * @param where - 검색 조건
   * @returns 매칭되는 레코드 배열
   * @example
   * const activeUsers = await repo.findMany({ active: true });
   */
  async findMany(where: Partial<T>): Promise<T[]> {
    const args = this.buildQueryArgs({ where });
    return await this.database.findMany(args);
  }

  /**
   *
   * @param options - 쿼리 옵션 (where, include, select, orderBy, pagination 등)
   * @returns 매칭되는 레코드 배열
   * @example
   * const users = await repo.findManyWithOptions({
   *   where: { active: true },
   *   include: { posts: true },
   *   orderBy: { createAt: 'desc' },
   *   take: 10
   * })
   */
  async findManyWithOptions(options?: QueryOptions<T>): Promise<T[]> {
    const args = this.buildQueryArgs(options);
    return await this.database.findMany(args);
  }

  /**
   * 페이지네이션을 지원하는 다중 레코드 조회
   * @param options - 쿼리 옵션 (page, limit, where, include, select 등)
   * @returns 페이지네이션 데이터의 메타 정보
   * @example
   * const result = await repo.findAllPaginated({
   *   page: 1,
   *   limit: 10,
   *   where: { active: true },
   *   orderBy: { createAt: 'desc' }
   * });
   * console.log(result.data);
   * console.log(result.totalPages);
   */
  async findAllPaginated(
    options: QueryOptions<T>,
  ): Promise<PaginatedResult<T>> {
    const page = options?.page || 1;
    const limit = options?.limit || this.defaultLimit;
    const skip = options?.skip || (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.database.findMany(
        this.buildQueryArgs({ ...options, skip, take: limit }),
      ),
      this.database.count({ where: options?.where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async count(where?: Partial<T>): Promise<number> {
    return await this.database.count({ where });
  }

  async exists(id: number | string): Promise<boolean> {
    const result = await this.database.findUnique({
      where: { id },
      select: { id: true },
    });
    return result !== null;
  }

  async existsBy(where: Partial<T>): Promise<boolean> {
    const result = await this.database.findUnique({
      where,
      select: { id: true },
    });
    return result !== null;
  }

  async create(data: CreateDto): Promise<T> {
    return await this.database.create({ data });
  }

  async createMany(data: CreateDto[]): Promise<{ count: number }> {
    const result = await this.database.createMany({ data });

    return {
      count: result.count,
    };
  }

  async update(id: string | number, data: UpdateDto): Promise<T> {
    return await this.database.update({
      where: { id },
      data,
    });
  }

  async updateMany(
    where: Partial<T>,
    data: UpdateDto,
  ): Promise<{ count: number }> {
    return await this.database.updateMany({
      where,
      data,
    });
  }

  async upsert(
    where: Partial<T>,
    create: CreateDto,
    update: UpdateDto,
  ): Promise<T> {
    return await this.database.upsert({
      where,
      create,
      update,
    });
  }

  async delete(id: string | number): Promise<void> {
    await this.database.delete({ where: { id } });
  }

  async deleteMany(where: Partial<T>): Promise<{ count: number }> {
    return await this.database.deleteMany({ where });
  }

  async refresh(entity: T): Promise<T | null> {
    const id = (entity as any).id;
    return await this.findById(id);
  }

  protected buildQueryArgs(options?: QueryOptions<T>): any {
    const args: any = {};

    if (options?.where) args.where = options.where;
    if (options?.include) args.include = options.include;
    if (options?.select) args.select = options.select;
    if (options?.orderBy) args.orderBy = options.orderBy;
    if (options?.skip !== undefined) args.skip = options.skip; // 0 허용
    if (options?.take !== undefined) args.take = options.take; // 0 허용

    return args;
  }
}
