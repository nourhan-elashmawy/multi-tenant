import { Module } from '@nestjs/common';

import { TenancyModule } from './tenant/tenancy.module';
import { PublicController } from './public.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [TenancyModule, AdminModule],
  controllers: [PublicController],
})
export class PublicModule {}
