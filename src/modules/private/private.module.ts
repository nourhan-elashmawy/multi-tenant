import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { PrivateController } from './private.controller';
import { TenantRepoModule } from 'src/config/tenant-repo/tenant-repo.module';

@Module({
  imports: [UserModule, ProductModule, TenantRepoModule],
  controllers: [PrivateController],
  exports: [UserModule, ProductModule, TenantRepoModule],
})
export class PrivateModule {}
