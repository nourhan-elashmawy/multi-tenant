import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Admin } from './entities/admin.entity';
import { TenantService } from './tenant.service';
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
