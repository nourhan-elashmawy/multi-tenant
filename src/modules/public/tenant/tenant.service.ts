import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantConnectionService } from '../../tenancy/tenant-connection.service';
import { CreateTenantDto } from './create-tenant.dto';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant, 'public')
    private tenantRepository: Repository<Tenant>,
    private tenantConnectionService: TenantConnectionService,
    @InjectDataSource('public') private dataSource: DataSource,
    private adminService: AdminService,
  ) {}

  // TO DO: Decouple the admin creation and tenant creation !!! this is a mess

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

    await this.tenantConnectionService.createTenantSchema(
      savedTenant.schemaName,
    );

    return savedTenant;
  }

  private generateSchemaName(tenantName: string): string {
    return tenantName
      .toLowerCase()
      .replace(/['’]/g, '') // remove straight ' and curly ’
      .replace(/\s+/g, '_');
  }
}
