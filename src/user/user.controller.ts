import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Get('email/:email')
  async getUserByEmailParam(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @Get('id/:id')
  async getUserByIdParam(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }
}
