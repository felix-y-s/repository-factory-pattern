/**
 * Prisma Adapter Factory
 * 
 * Prisma ORM을 위한 DatabaseAdapterFactory의 구체적인 구현체
 * Prisma Client를 사용하여 데이터베이스 어댑터를 생성
 */

import { Injectable } from '@nestjs/common';
import { DatabaseAdapterFactory, DatabaseDelegate } from '../interfaces/database.interface';

@Injectable()
export class PrismaAdapterFactory extends DatabaseAdapterFactory {
  constructor(private readonly databaseClient: any) {
    super();
  }

  /**
   * 모델명을 기반으로 Prisma 어댑터 생성
   * @param modelName 모델명 (예: 'User', 'Post') 
   * @returns Prisma 모델 델리게이트
   * @throws Error 모델을 찾을 수 없는 경우
   * 
   * @example
   * // 'User' 모델 어댑터 생성
   * const userAdapter = factory.createAdapter('User');
   * // 실제로는 databaseClient.user를 반환
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