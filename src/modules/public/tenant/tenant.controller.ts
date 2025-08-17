import { Body, Controller, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './create-tenant.dto';
import { Tenant } from './tenant.entity';

@Controller('public/tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post('create')
  async createTenant(@Body() tenantData: CreateTenantDto): Promise<Tenant> {
    return await this.tenantService.createTenant(tenantData);
  }
}
