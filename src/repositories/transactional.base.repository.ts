import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseAdapterFactory, IBaseRepository, ITransactionalRepository } from 'src/common';

@Injectable()
export abstract class TransactionalBaseRepository<T, CreateDto, UpdateDto>
  extends BaseRepository<T, CreateDto, UpdateDto>
  implements ITransactionalRepository<T, CreateDto, UpdateDto>
{
  constructor(
    adapterFactory: DatabaseAdapterFactory,
    protected readonly databaseClient: any,
    defaultLimit?: number,
  ) {
    super(adapterFactory, defaultLimit);
  }

  async withTransaction<R>(
    callback: (repo: IBaseRepository<T, CreateDto, UpdateDto>) => Promise<R>,
  ): Promise<R> {
    return await this.databaseClient.$transaction(async (tx: any) => {
      const transactionalRepo = Object.create(Object.getPrototypeOf(this));
      transactionalRepo.database = tx[this.modelName.toLowerCase()];
      transactionalRepo.modelName = this.modelName;
      transactionalRepo.defaultLimit = this.defaultLimit;

      return await callback(transactionalRepo);
    });
  }
}
