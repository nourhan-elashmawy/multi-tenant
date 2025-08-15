import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TenantService } from './tenant/tenant.service';
import { CreateTenantDto } from './tenant/create-tenant.dto';

@Controller('public')
export class PublicController {
  constructor(private tenantService: TenantService) {}

  @Post('tenants')
  async createTenant(@Body() tenantData: CreateTenantDto) {
    return this.tenantService.createTenant(tenantData);
  }

  @Get('tenants/:id')
  async getTenant(@Param('id') id: number) {
    return this.tenantService.findById(id);
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
