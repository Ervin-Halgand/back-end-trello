import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/models/user.model';
import { HashingService } from '../common/hashing/hashing.service';
import { LoginResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await this.hashingService.comparePasswords(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(credentials: CreateUserDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );

    return this.refreshToken(user.id);
  }

  refreshToken(id: number): LoginResponseDto {
    const payload = { id };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshAccessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    };
  }
}
