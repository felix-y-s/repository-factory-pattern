import { IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  id: number;
  // FIXME: ⁉️ Post 연결 가능한지 확인
}
