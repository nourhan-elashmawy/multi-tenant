import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { TenantUserService } from './services/tenant-user.service';
import * as tenantContextMiddleware from 'src/common/middleware/tenant-context.middleware';
import * as tenantContextMiddleware_1 from 'src/common/middleware/tenant-context.middleware';

export class CreateTenantUserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

@Controller('tenant')
export class TenantController {
  constructor(private tenantUserService: TenantUserService) {}

  // TO DO
  @Get('health')
  tenantHealth(@Req() req: tenantContextMiddleware.TenantRequest) {
    return {
      status: 'ok',
      message: 'Tenant API is running',
      tenantId: req.tenantId,
      tenantSchema: req.tenantSchema,
      connectionStatus: req.tenantConnection?.isInitialized
        ? 'connected'
        : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('users')
  async createUser(
    @Body() createUserDto: CreateTenantUserDto,
    @Req() req: tenantContextMiddleware.TenantRequest,
  ) {
    return this.tenantUserService.create(createUserDto, req.tenantConnection);
  }

  @Get('users')
  async getUsers(@Req() req: tenantContextMiddleware_1.TenantRequest) {
    return this.tenantUserService.findAll(req.tenantConnection);
  }
}
