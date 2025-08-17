import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAdminDto } from './create-admin.dto';
import { Admin } from './admin.entity';
import { Tenant } from '../tenant/tenant.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Tenant, 'public')
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Admin, 'public')
    private adminRepository: Repository<Admin>,
    @InjectDataSource('public') private dataSource: DataSource,
  ) {}

  async createAdmin(adminData: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: adminData.email },
    });
    if (existingAdmin) {
      throw new ConflictException('Admin with email already exists');
    }

    const admin = this.adminRepository.create(adminData);
    const savedAdmin = await this.adminRepository.save(admin);

    return savedAdmin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { id } });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
