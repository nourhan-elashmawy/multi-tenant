import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
// import { ProductModule } from './product/product.module';
// import { DatabaseConfig } from 'src/config/database.config';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PrivateModule {}
