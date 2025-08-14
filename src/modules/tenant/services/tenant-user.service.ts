import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

export interface CreateTenantUserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable()
export class TenantUserService {
  async findAll(tenantConnection: DataSource): Promise<User[]> {
    const userRepository = tenantConnection.getRepository(User);
    return userRepository.find();
  }

  async finByEmail(
    email: string,
    tenantConnection: DataSource,
  ): Promise<User | null> {
    const userRepository = tenantConnection.getRepository(User);
    return userRepository.findOneBy({ email });
  }

  async create(
    userData: CreateTenantUserDto,
    tenantConnection: DataSource,
  ): Promise<User> {
    const userRepository = tenantConnection.getRepository(User);
    const user = userRepository.create(userData);
    return userRepository.save(user);
  }
}
