import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseDelegate } from 'src/common';
import { PrismaService } from 'src/database/prisma.service';

/**
 * 통합 데이터베이스 어댑터 팩토리
 * 환경 설정에 따라 적절한 ORM 어댑터를 생성
 */
@Injectable()
export class DatabaseAdapterFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 모델명을 기반으로 데이터베이스 어댑터 생성
   * 환경 설정(ORM_TYPE)에 따라 적절한 ORM 어댑터를 반환
   *
   * @param modelName 모델명 (예: 'User', 'Post')
   * @returns DatabaseDelegate 인터페이스를 구현한 어댑터
   * @throws Error 지원되지 않는 ORM 타입이거나 모델을 찾을 수 없는 경우
   *
   * @example
   * // 환경 변수 ORM_TYPE=prisma인 경우
   * const userAdapter = factory.createAdapter('User');
   * // Prisma User Delegate를 반환
   *
   * // 환경 변수 ORM_TYPE=typeorm인 경우 (미래 확장)
   * const userAdapter = factory.createAdapter('User');
   * // TypeORM User Repository 어댑터를 반환
   */
  createAdapter(modelName: string): DatabaseDelegate {
    const ormType = this.configService.get<string>('ORM_TYPE') || 'prisma';

    switch (ormType) {
      case 'prisma':
        return this.createPrismaAdapter(modelName);
      case 'typeorm':
        return this.createTypeOrmAdapter(modelName);
      default:
        throw new Error(
          `지원되지 않는 ORM 타입: ${ormType}. ` +
          `지원 가능한 타입: prisma, typeorm`
        );
    }
  }

  /**
   * 사용자 모델 전용 어댑터 생성
   * @returns 사용자 모델 데이터베이스 어댑터
   */
  createUserAdapter(): DatabaseDelegate {
    return this.createAdapter('User');
  }

  /**
   * 게시글 모델 전용 어댑터 생성
   * @returns 게시글 모델 데이터베이스 어댑터
   */
  createPostAdapter(): DatabaseDelegate {
    return this.createAdapter('Post');
  }

  /**
   * Prisma ORM 어댑터 생성
   * Prisma Client의 모델 델리게이트를 직접 반환
   *
   * @private
   * @param modelName 모델명
   * @returns Prisma 모델 델리게이트 (DatabaseDelegate 호환)
   * @throws Error 모델을 찾을 수 없는 경우
   */
  private createPrismaAdapter(modelName: string): DatabaseDelegate {
    const modelKey = modelName.toLowerCase();
    const adapter = this.prismaService[modelKey];

    if (!adapter) {
      throw new Error(
        `Prisma 모델 '${modelName}'을 찾을 수 없습니다. ` +
        `사용 가능한 모델: ${Object.keys(this.prismaService)
          .filter(key => typeof this.prismaService[key] === 'object' &&
                        this.prismaService[key] !== null)
          .join(', ')}`
      );
    }

    return adapter;
  }

  /**
   * TypeORM 어댑터 생성 (미래 확장용)
   * TypeORM Repository를 DatabaseDelegate 인터페이스로 변환
   *
   * @private
   * @param _modelName 모델명 (현재 미사용)
   * @returns TypeORM Repository 어댑터
   * @throws Error 현재 구현되지 않음
   */
  private createTypeOrmAdapter(_modelName: string): DatabaseDelegate {
    // 미래 확장: TypeORM 지원
    // const repository = this.typeormService.getRepository(modelName);
    // return {
    //   findUnique: (args) => repository.findOne(args.where),
    //   findFirst: (args) => repository.findOne(args.where),
    //   findMany: (args) => repository.find(args),
    //   count: (args) => repository.count(args.where),
    //   create: (args) => repository.save(args.data),
    //   createMany: async (args) => {
    //     const result = await repository.save(args.data);
    //     return { count: result.length };
    //   },
    //   update: (args) => repository.save({ ...args.where, ...args.data }),
    //   updateMany: async (args) => {
    //     const result = await repository.update(args.where, args.data);
    //     return { count: result.affected || 0 };
    //   },
    //   upsert: async (args) => {
    //     const existing = await repository.findOne(args.where);
    //     if (existing) {
    //       return repository.save({ ...existing, ...args.update });
    //     } else {
    //       return repository.save(args.create);
    //     }
    //   },
    //   delete: (args) => repository.remove(args.where),
    //   deleteMany: async (args) => {
    //     const result = await repository.delete(args.where);
    //     return { count: result.affected || 0 };
    //   },
    // };

    throw new Error(
      `TypeORM 어댑터는 아직 구현되지 않았습니다. ` +
      `현재 지원되는 ORM: prisma`
    );
  }
}
