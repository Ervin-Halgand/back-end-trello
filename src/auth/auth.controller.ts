import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '../../src/common/types/authenticated_request.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return an access token' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged in and token returned.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials.',
  })
  async login(
    @Body(ValidationPipe) credentials: CreateUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Refresh token is valid and return a new token.',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Req() payload: AuthenticatedRequest): LoginResponseDto {
    return this.authService.refreshToken(payload.user);
  }
}
