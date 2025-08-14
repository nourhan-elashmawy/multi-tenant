import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';

export class CreateTenantDto {
  name: string;
  description: string;
}

@Controller('public')
export class PublicController {
  constructor(private tenantService: TenantService) {}

  @Post('tenants')
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(
      createTenantDto.name,
      createTenantDto.description,
    );
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
