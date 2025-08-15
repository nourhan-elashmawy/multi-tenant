import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './create-admin.dto';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin, 'public')
    private adminRepository: Repository<Admin>,
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
}
