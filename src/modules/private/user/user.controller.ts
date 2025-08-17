import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import type { TenantRequest } from '../../../common/middleware/tenant-context.middleware';

@Controller('private/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() userData: CreateUserDto, @Req() req: TenantRequest) {
    if (!req.tenantConnection) {
      throw new Error('Tenant connection not available');
    }
    return this.userService.create(userData, req.tenantConnection);
  }
}
