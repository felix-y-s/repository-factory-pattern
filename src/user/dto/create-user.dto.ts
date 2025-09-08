import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(200)
  email: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  // FIXME: ⁉️ Post 연결 가능한지 확인
}
