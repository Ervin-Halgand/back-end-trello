import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from '../common/hashing/hashing.service';
import { UserResponseDto } from './dto/responses/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly hashService: HashingService,
  ) {}
  async create(userData: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({
      where: { email: userData.email },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashService.hashPassword(
      userData.password,
    );

    const newUser = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    } as User);

    return {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt as Date,
    };
  }

  async update(id: number, userData: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      throw new ConflictException('User not found');
    }

    const password = userData.password
      ? await this.hashService.hashPassword(userData.password)
      : null;

    const updatedUser = await user.update({
      ...userData,
      password: password ?? user.password,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      updatedAt: updatedUser.updatedAt as Date,
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({
      where: { id },
      attributes: ['id', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: number): Promise<{ message: string }> {
    const deletedUserId = await this.userModel.destroy({ where: { id } });

    if (!deletedUserId) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User successfully deleted' };
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt as Date,
    };
  }
}
