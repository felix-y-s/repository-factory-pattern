import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(PrismaService.name);

  constructor() {
    super();
    this.logger.debug(`🏭 Create PrismaService`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`✅ 디비 서버에 접속 완료`);
    } catch (error) {
      this.logger.error(`❌ 디비 접속에 실패했습니다.`, error);
      throw error;
    }
  }
}
