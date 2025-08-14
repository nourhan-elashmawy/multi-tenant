import { ConflictException, Injectable } from '@nestjs/common';
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
    const existingTenant = await this.tenantRepository.findOne({
      where: { name },
    });

    if (existingTenant) {
      throw new ConflictException(`Tenant with name '${name}' already exists`);
    }

    const tenant = this.tenantRepository.create({
      name,
      description,
      schemaName: this.generateSchemaName(name),
    });

    const savedTenant = await this.tenantRepository.save(tenant);

    await this.tenantConnectionService.createTenantSchema(
      savedTenant.schemaName,
    );

    return savedTenant;
  }

  async findById(id: number): Promise<Tenant | null> {
    return this.tenantRepository.findOneBy({ id });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.tenantRepository.countBy({ id });
    return count > 0;
  }

  private generateSchemaName(tenantName: string): string {
    return tenantName.toLowerCase().replace(/\s+/g, '_'); // Replace spaces with underscores
  }
}
