import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../tenant/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepositry: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepositry.findOne({
      where: { email },
    });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.userRepositry.create(userData);
    return this.userRepositry.save(user);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
