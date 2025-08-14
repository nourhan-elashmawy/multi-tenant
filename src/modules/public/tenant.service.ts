import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';
import { TenantConnectionService } from '../tenancy/tenant-connection.service';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant, 'public')
    private tenantRepository: Repository<Tenant>,
    private tenantConnectionService: TenantConnectionService,
  ) {}

  async createTenant(name: string, description: string): Promise<Tenant> {
    const tenant = this.tenantRepository.create({
      name,
      description,
      schemaName: '',
    });

    const savedTenant = await this.tenantRepository.save(tenant);

    const schemaName = `tenant_${savedTenant.id}`;
    savedTenant.schemaName = schemaName;
    await this.tenantRepository.save(savedTenant);

    await this.tenantConnectionService.createTenantSchema(schemaName);

    return savedTenant;
  }

  async findById(id: number): Promise<Tenant | null> {
    return this.tenantRepository.findOneBy({ id });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.tenantRepository.countBy({ id });
    return count > 0;
  }
}
