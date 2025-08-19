import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './create-tenant.dto';
import { Tenant } from './tenant.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('public/tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTenant(@Body() tenantData: CreateTenantDto): Promise<Tenant> {
    return await this.tenantService.createTenant(tenantData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllTenants(): Promise<Tenant[]> {
    return await this.tenantService.getAll();
  }
}
