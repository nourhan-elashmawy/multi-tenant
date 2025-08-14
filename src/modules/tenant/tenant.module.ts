import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantUserService } from './services/tenant-user.service';
import { TenantProductService } from './services/tenant-product.service';

@Module({
  controllers: [TenantController],
  providers: [TenantUserService, TenantProductService],
  exports: [TenantUserService, TenantProductService],
})
export class TenantModule {}
