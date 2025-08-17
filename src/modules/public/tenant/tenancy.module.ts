import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { AdminModule } from '../admin/admin.module';
import { DatabaseModule } from 'src/config/database.config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), AdminModule, DatabaseModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenancyModule {}
