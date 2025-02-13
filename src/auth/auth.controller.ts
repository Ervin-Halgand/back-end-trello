import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) credentials: CreateUserDto) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );

    return this.authService.login(user);
  }
}
