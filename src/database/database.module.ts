import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import {
  DEFAULT_LIMIT_TOKEN,
  USER_ADAPTER_TOKEN,
} from 'src/common';
import { DatabaseAdapterFactory } from 'src/adapters';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  providers: [
    PrismaService,
    // 조회 시 가져올 행 수 기본값 지정(옵셔널)
    {
      provide: DEFAULT_LIMIT_TOKEN,
      useValue: 10,
    },
    DatabaseAdapterFactory,
    // 개별 어댑터 토큰 (선택사항 - 더 세밀한 제어가 필요한 경우)
    {
      provide: USER_ADAPTER_TOKEN,
      useFactory: (factory: DatabaseAdapterFactory) =>
        factory.createUserAdapter(),
      inject: [DatabaseAdapterFactory],
    },
    UserRepository,
  ],
  exports: [UserRepository],
})
export class DatabaseModule {}
