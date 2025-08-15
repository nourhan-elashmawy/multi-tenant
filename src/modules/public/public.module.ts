import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/tenant.entity';
import { Admin } from './admin/admin.entity';
import { TenantService } from './tenant/tenant.service';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PublicController } from './public.controller';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Admin], 'public'), TenancyModule],
  providers: [TenantService, Repository],
  controllers: [PublicController],
  exports: [TenantService],
})
export class PublicModule {}
