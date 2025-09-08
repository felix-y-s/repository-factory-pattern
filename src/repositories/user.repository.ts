import { Inject, Injectable, Optional } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from '@prisma/client';
import { DATABASE_ADAPTER_FACTORY, DatabaseAdapterFactory, DEFAULT_LIMIT_TOKEN } from 'src/common/interface/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  protected readonly modelName = 'User';

  constructor(
    @Inject(DATABASE_ADAPTER_FACTORY)
    adapterFactory // NOTE: NestJS 의존성 주입 시스템이 UserRepository 인스턴스 생성 시 어떤 의존성을 주입할지 알려주기 위해 필요
    // BaseRepository의 @Inject는 BaseRepository를 직접 인스턴스화할 때만 작동하고,
    // 상속받은 클래스에서는 각자의 생성자에 @Inject가 있어야 NestJS가 의존성을 주입할 수 있음
    : DatabaseAdapterFactory,
    @Optional() @Inject(DEFAULT_LIMIT_TOKEN)
    defaultLimit?: number, //
  ) {
    super(adapterFactory, defaultLimit);
  }

  // 도메인 특화 메서드 추가
  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}