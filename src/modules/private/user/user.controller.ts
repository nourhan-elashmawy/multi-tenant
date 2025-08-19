import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';

@Controller('private/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('')
  fndAll() {
    return this.userService.findAll();
  }
}
