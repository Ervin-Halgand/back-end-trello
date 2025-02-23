import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from './services/jwt-auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { RefreshJwtStrategy } from './services/refresh-jwt-auth.service';
import { HashingModule } from '../common/hashing/hashing.module';

@Module({
  imports: [
    HashingModule,
    PassportModule,
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
