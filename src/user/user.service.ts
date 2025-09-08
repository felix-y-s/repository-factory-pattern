import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from 'src/repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedResult } from 'src/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user === null) {
      throw new NotFoundException(
        `사용자를 찾을 수 없습니다. (email: ${email})`,
      );
    }
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다. (id: ${id})`);
    }
    return user;
  }

  async getPaginatedUsers(page: number = 1): Promise<PaginatedResult<User>> {
    return this.userRepository.findAllPaginated({ page, limit: 10 });
  }
}
