import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TenantRepoModule } from 'src/config/tenant-repo/tenant-repo.module';

@Module({
  imports: [TenantRepoModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
