/**
 * Prisma Adapter Factory
 *
 * Prisma ORM을 위한 DatabaseAdapterFactory의 구체적인 구현체
 * Prisma Client를 사용하여 데이터베이스 어댑터를 생성
 */

import { Injectable } from '@nestjs/common';
import { DatabaseDelegate } from '../common';
import { DatabaseAdapterFactory } from './database-adapter.factory';

@Injectable()
export class PrismaAdapterFactory extends DatabaseAdapterFactory {
  constructor(private readonly databaseClient: any) {
    super();
  }

  /**
   * 모델명을 기반으로 Prisma 어댑터 생성
   *
   * 현재 구현 설명:
   * - DatabaseDelegate 인터페이스가 Prisma ORM 기준으로 설계되어 있음
   * - Prisma의 모델 델리게이트(예: prismaClient.user)가 DatabaseDelegate와 호환됨
   * - 따라서 별도의 어댑터 변환 로직 없이 직접 반환 가능
   *
   * 미래 확장성:
   * - 다른 ORM(TypeORM, Sequelize 등) 지원 시 진짜 어댑터 로직이 필요
   * - 예: TypeORM의 경우
   *   adapter = {
   *     findUnique: (args) => repository.findOne(args),    // findOne → findUnique 변환
   *     findMany: (args) => repository.find(args),         // find → findMany 변환
   *     create: (args) => repository.save(args.data),      // save → create 변환
   *     // ... 기타 메서드 변환
   *   }
   *
   * @param modelName 모델명 (예: 'User', 'Post')
   * @returns DatabaseDelegate 호환 어댑터 (현재는 Prisma 모델 델리게이트 직접 반환)
   * @throws Error 모델을 찾을 수 없는 경우
   *
   * @example
   * // 'User' 모델 어댑터 생성
   * const userAdapter = factory.createAdapter('User');
   * // 실제로는 databaseClient.user (Prisma User Delegate)를 반환
   * // adapter.findUnique(), adapter.create() 등의 메서드 사용 가능
   */
  createAdapter(modelName: string): DatabaseDelegate {
    const modelKey = modelName.toLowerCase();
    const adapter = this.databaseClient[modelKey];

    if (!adapter) {
      throw new Error(
        `Database model '${modelName}' not found in DatabaseClient. ` +
          `Available models: ${Object.keys(this.databaseClient).join(', ')}`,
      );
    }

    return adapter;
  }

  /**
   * 사용자 모델 전용 어댑터 생성
   * @returns Prisma User 모델 델리게이트
   */
  createUserAdapter(): DatabaseDelegate {
    return this.databaseClient.user;
  }

  /**
   * 게시글 모델 전용 어댑터 생성
   * @returns Prisma Post 모델 델리게이트
   */
  createPostAdapter(): DatabaseDelegate {
    return this.databaseClient.post;
  }
}
