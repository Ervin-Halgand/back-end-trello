import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HashingService } from '../common/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let hashingService: HashingService;
  let jwtService: JwtService;
  let userModelMock: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(true),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
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
            sign: jest.fn().mockReturnValue('mockedAccessToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    hashingService = module.get<HashingService>(HashingService);
    jwtService = module.get<JwtService>(JwtService);
    userModelMock = module.get<typeof User>(getModelToken(User));
  });

  it('should return the user if credentials are valid', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userMock = { id: 1, email, password: 'hashedPassword' } as User;

    const spyeHashingService = jest
      .spyOn(hashingService, 'comparePasswords')
      .mockResolvedValue(true);

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(userMock);

    const result = await authService.validateUser(email, password);
    expect(result).toEqual(userMock);

    expect(spyeHashingService).toHaveBeenCalledWith(
      password,
      userMock.password,
    );
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    jest.spyOn(usersService, 'findByEmail' as any).mockResolvedValue(null);

    await expect(authService.validateUser(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userMock = { id: 1, email, password: 'hashedPassword' } as User;

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userMock);
    jest.spyOn(hashingService, 'comparePasswords').mockResolvedValue(false);

    await expect(authService.validateUser(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return a login DTO with an access token', () => {
    const userMock = { id: 1 } as User;
    const result = authService.login(userMock);

    const spyJwt = jest.spyOn(jwtService, 'sign');

    expect(result).toEqual({ accessToken: 'mockedAccessToken' });
    expect(spyJwt).toHaveBeenCalledWith({
      id: userMock.id,
      email: userMock.email,
    });
  });
});
