import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { tenantRepositoryProviders } from './tenant-repo.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...tenantRepositoryProviders],
  exports: tenantRepositoryProviders.map((p) => p.provide),
})
export class TenantRepoModule {}
