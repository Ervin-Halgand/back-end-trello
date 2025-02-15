import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { HashingService } from '../common/hashing/hashing.service';
import { LoginResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await this.hashingService.comparePasswords(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: User): LoginResponseDto {
    const payload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
