import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async create(userData: CreateUserDto, dataSource: DataSource): Promise<User> {
    const userRepository = dataSource.getRepository(User);

    const existinguser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (existinguser) {
      throw new ConflictException('user with email already exists');
    }

    const user = userRepository.create(userData);
    const saveduser = await userRepository.save(user);

    return saveduser;
  }

  async findAll(dataSource: DataSource): Promise<User[]> {
    const userRepository = dataSource.getRepository(User);
    return userRepository.find();
  }

  async findByEmail(
    dataSource: DataSource,
    email: string,
  ): Promise<User | null> {
    const userRepository = dataSource.getRepository(User);
    return userRepository.findOne({ where: { email } });
  }
}
