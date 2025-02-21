import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { AuthenticatedRequest } from '../../src/common/types/authenticated_request.type';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return an access token if the user is validated successfully', async () => {
    const credentials: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const accessTokenMock = {
      accessToken: 'mockedAccessToken',
      refreshAccessToken: 'mockedRefreshToken',
    };

    const spy = jest
      .spyOn(authService, 'login')
      .mockResolvedValue(accessTokenMock);

    const result = await authController.login(credentials);

    expect(result).toEqual(accessTokenMock);
    expect(spy).toHaveBeenCalledWith(credentials);
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    const credentials: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest
      .spyOn(authService, 'login')
      .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

    await expect(authController.login(credentials)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return a new access token on refresh', () => {
    const mockRequest: AuthenticatedRequest = {
      user: 1,
    } as AuthenticatedRequest;

    const newTokenMock = {
      accessToken: 'newMockedAccessToken',
      refreshAccessToken: 'newMockedRefreshToken',
    };
    const spy = jest
      .spyOn(authService, 'refreshToken')
      .mockReturnValue(newTokenMock);

    const result = authController.refresh(mockRequest);

    expect(result).toEqual(newTokenMock);
    expect(spy).toHaveBeenCalledWith(mockRequest.user);
  });
});
