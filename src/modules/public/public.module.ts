import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';
import { PublicController } from './public.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [TenantModule, AdminModule],
  controllers: [PublicController],
  exports: [AdminModule, TenantModule],
})
export class PublicModule {}
