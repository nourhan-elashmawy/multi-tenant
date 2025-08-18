import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { PrivateController } from './private.controller';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [PrivateController],
})
export class PrivateModule {}
