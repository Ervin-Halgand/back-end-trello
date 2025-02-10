import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from '../utils/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly hashService: HashingService,
  ) {}
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        where: { email: userData.email },
      });

      if (user) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await this.hashService.hashPassword(
        userData.password,
      );

      return await this.userModel.create({
        ...userData,
        password: hashedPassword,
      } as User);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, userData: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findOne({ where: { id } });

      if (!user) {
        throw new ConflictException('User not found');
      }

      const password = userData.password
        ? await this.hashService.hashPassword(userData.password)
        : null;

      return await user.update({
        ...userData,
        password: password ?? user.password,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async findOne(id: number) {
    return await this.userModel.findOne({ where: { id } });
  }

  async remove(id: number): Promise<number> {
    return await this.userModel.destroy({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }
}
