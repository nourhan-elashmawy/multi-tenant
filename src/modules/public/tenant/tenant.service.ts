import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantConnectionService } from '../../tenancy/tenant-connection.service';
import { ADMIN_ROLES } from 'src/common/constants/enums';
import { CreateTenantWithAdminDto } from '../CreateTenantWithAdmin.dto';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant, 'public')
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Admin, 'public')
    private adminRepository: Repository<Admin>,
    private tenantConnectionService: TenantConnectionService,
    @InjectDataSource('public') private dataSource: DataSource,
  ) {}

  async createTenantWithAdmin(
    dto: CreateTenantWithAdminDto,
  ): Promise<{ tenant: Tenant; admin: Admin }> {
    return await this.dataSource.transaction(async (manager) => {
      // Check if tenant already exists
      const existingTenant = await manager.getRepository(Tenant).findOne({
        where: { name: dto.name },
      });
      if (existingTenant) {
        throw new ConflictException(`Tenant '${dto.name}' already exists`);
      }

      // Create tenant
      const tenant = manager.getRepository(Tenant).create({
        name: dto.name,
        description: dto.description,
        email: dto.email,
        schemaName: this.generateSchemaName(dto.name),
      });
      const savedTenant = await manager.getRepository(Tenant).save(tenant);

      // Check if admin already exists
      const existingAdmin = await manager.getRepository(Admin).findOne({
        where: { email: dto.email },
      });
      if (existingAdmin) {
        throw new ConflictException(
          `Admin with email '${dto.email}' already exists`,
        );
      }

      // Create admin (linked to newly created tenant)
      const admin = manager.getRepository(Admin).create({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: ADMIN_ROLES.TENANT, // ensure your ROLES enum matches this
      });
      const savedAdmin = await manager.getRepository(Admin).save(admin);

      // Create DB schema for tenant
      await this.tenantConnectionService.createTenantSchema(
        savedTenant.schemaName,
      );

      return { tenant: savedTenant, admin: savedAdmin };
    });
  }

  private generateSchemaName(tenantName: string): string {
    return tenantName.toLowerCase().replace(/\s+/g, '_');
  }
}
