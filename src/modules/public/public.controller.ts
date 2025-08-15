import { Controller, Post, Body, Get } from '@nestjs/common';
import { TenantService } from './tenant/tenant.service';
import { CreateTenantDto } from './tenant/create-tenant.dto';
import { CreateAdminDto } from './admin/create-admin.dto';
import { CreateTenantWithAdminDto } from './CreateTenantWithAdmin.dto';

@Controller('public')
export class PublicController {
  constructor(private tenantService: TenantService) {}

  @Post('tenants')
  async createTenant(@Body() body: { tenantData: CreateTenantWithAdminDto }) {
    return this.tenantService.createTenantWithAdmin(body.tenantData);
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      message: 'Public API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
