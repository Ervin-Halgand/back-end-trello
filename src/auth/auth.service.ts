import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { UsersService } from '../users/users.service';
import { HashingService } from '../utils/hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await this.hashingService.comparePasswords(password, user.password))
    ) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: User): LoginDto {
    const payload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
