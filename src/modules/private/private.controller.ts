import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { TenantRequest } from 'src/common/middleware/tenant-context.middleware';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/create-user.dto';

@Controller('private')
export class PrivateController {
  constructor(private userService: UserService) {}

  // TO DO
  @Get('health')
  tenantHealth(@Req() req: TenantRequest) {
    return {
      status: 'ok',
      message: 'Tenant API is running',
      tenantSchema: req.tenantSchema,
      connectionStatus: req.tenantConnection?.isInitialized
        ? 'connected'
        : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('users')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: TenantRequest,
  ) {
    if (!req.tenantConnection) {
      throw new Error('Tenant connection not available');
    }
    return this.userService.create(createUserDto, req.tenantConnection);
  }

  @Get('users')
  async getUsers(@Req() req: TenantRequest) {
    if (!req.tenantConnection) {
      throw new Error('Tenant connection not available');
    }
    return this.userService.findAll(req.tenantConnection);
  }
}
