import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { TENANT_USER_REPOSITORY } from 'src/config/tenant-repo/tenant-rep.tokens';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(TENANT_USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const existinguser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existinguser) {
      throw new ConflictException('user with email already exists');
    }

    const user = this.userRepository.create(userData);
    const saveduser = await this.userRepository.save(user);

    return saveduser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
