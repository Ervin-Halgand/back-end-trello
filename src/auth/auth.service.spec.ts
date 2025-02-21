import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HashingService } from '../common/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let hashingService: HashingService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userModelMock: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            comparePasswords: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mockedValue'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    hashingService = module.get<HashingService>(HashingService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    userModelMock = module.get<typeof User>(getModelToken(User));
  });

  it('should return the user if credentials are valid', async () => {
    const credentials: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const userMock = {
      id: 1,
      email: credentials.email,
      password: 'hashedPassword',
    } as User;

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(userMock);
    jest.spyOn(hashingService, 'comparePasswords').mockResolvedValue(true);

    const result = await authService['validateUser'](
      credentials.email,
      credentials.password,
    );

    expect(result).toEqual(userMock);
  });

  it('should throw NotFoundException if user is not found', async () => {
    const credentials: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(null);

    await expect(
      authService['validateUser'](credentials.email, credentials.password),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const credentials: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const userMock = {
      id: 1,
      email: credentials.email,
      password: 'hashedPassword',
    } as User;

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(userMock);
    jest.spyOn(hashingService, 'comparePasswords').mockResolvedValue(false);

    await expect(
      authService['validateUser'](credentials.email, credentials.password),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return a login DTO with an access and refresh token', () => {
    const userMock = { id: 1 } as User;
    jest.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');
    jest.spyOn(configService, 'get').mockReturnValue('mockedSecret');

    const result = authService.refreshToken(userMock.id);

    expect(result).toEqual({
      accessToken: 'mockedAccessToken',
      refreshAccessToken: 'mockedAccessToken',
    });
  });
});
