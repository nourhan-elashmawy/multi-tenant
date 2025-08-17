import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  // async findAll(ds: DataSource): Promise<User[]> {
  //   const repo = this.getRepo(ds);
  //   return repo.find();
  // }

  // async findByEmail(ds: DataSource, email: string): Promise<User> {
  //   const repo = this.getRepo(ds);
  //   const user = await repo.findOne({ where: { email } });
  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }
}
