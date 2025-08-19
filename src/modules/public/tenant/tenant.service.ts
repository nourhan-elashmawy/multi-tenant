import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantConnectionService } from '../../../config/tenant-connection.service';
import { CreateTenantDto } from './create-tenant.dto';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private tenantConnectionService: TenantConnectionService,
    private adminService: AdminService,
  ) {}

  async createTenant(tenantData: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenantRepository.findOne({
      where: { name: tenantData.name },
    });
    if (existingTenant) {
      throw new ConflictException('Tenant with name already exists');
    }

    const admin = await this.adminService.findById(tenantData.adminId);
    if (!admin) throw new NotFoundException('Admin not found');

    const tenant = this.tenantRepository.create({
      name: tenantData.name,
      description: tenantData.description,
      schemaName: this.generateSchemaName(tenantData.name),
      admin: { id: tenantData.adminId } as Admin,
    });
    const savedTenant = await this.tenantRepository.save(tenant);

    await this.tenantConnectionService.createTenantConnection(
      savedTenant.schemaName,
    );

    return savedTenant;
  }

  async getAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  private generateSchemaName(tenantName: string): string {
    return tenantName
      .toLowerCase()
      .replace(/['’]/g, '') // remove straight ' and curly ’
      .replace(/\s+/g, '_');
  }
}
