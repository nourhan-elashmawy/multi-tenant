import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './create-tenant.dto';
import { Tenant } from './tenant.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ADMIN_ROLES } from 'src/common/constants/enums';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('public/tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  @Post('create')
  async createTenant(@Body() tenantData: CreateTenantDto): Promise<Tenant> {
    return await this.tenantService.createTenant(tenantData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  @Get('')
  async getAllTenants(): Promise<Tenant[]> {
    return await this.tenantService.getAll();
  }
}
