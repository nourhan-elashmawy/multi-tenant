import { Body, Controller, Get, Req } from '@nestjs/common';
import * as tenantContextMiddleware from 'src/common/middleware/tenant-context.middleware';
import { UserService } from './user/user.service';

@Controller('private')
export class PrivateController {
  constructor(private userService: UserService) {}

  // TO DO
  @Get('health')
  tenantHealth(@Req() req: tenantContextMiddleware.TenantRequest) {
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

  // @Post('users')
  // async createUser(
  //   @Body() createUserDto: CreateTenantUserDto,
  //   @Req() req: tenantContextMiddleware.TenantRequest,
  // ) {
  //   return this.userService.create(createUserDto, req.tenantConnection);
  // }

  // @Get('users')
  // async getUsers(@Req() req: tenantContextMiddleware.TenantRequest) {
  //   return this.userService.findAll(req.tenantConnection);
  // }
}
