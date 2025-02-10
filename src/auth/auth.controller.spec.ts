import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/models/user.model';

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

    const userMock = { id: 1, email: credentials.email } as User;
    const accessTokenMock = { accessToken: 'mockedAccessToken' };

    const spyAuthValidateUser = jest
      .spyOn(authService, 'validateUser')
      .mockResolvedValue(userMock);
    const spyAuthLogin = jest
      .spyOn(authService, 'login')
      .mockReturnValue(accessTokenMock);

    const result = await authController.login(credentials);

    expect(result).toEqual(accessTokenMock);
    expect(spyAuthValidateUser).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
    );
    expect(spyAuthLogin).toHaveBeenCalledWith(userMock);
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    const credentials: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest
      .spyOn(authService, 'validateUser')
      .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

    await expect(authController.login(credentials)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
