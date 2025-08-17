import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/tenant.entity';
import { Admin } from './admin/admin.entity';
import { TenantService } from './tenant/tenant.service';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PublicController } from './public.controller';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { TenantController } from './tenant/tenant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Admin], 'public'), TenancyModule],
  providers: [TenantService, AdminService],
  controllers: [PublicController, AdminController, TenantController],
  exports: [TenantService, AdminService],
})
export class PublicModule {}
