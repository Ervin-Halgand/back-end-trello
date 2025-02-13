import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HashingService } from '../common/hashing/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingModule } from '../common/hashing/hashing.module';

describe('UsersService', () => {
  let service: UsersService;
  let userModelMock: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HashingModule],

      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
        HashingService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModelMock = module.get<typeof User>(getModelToken(User));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const createdUser = { ...createUserDto, id: 1 } as User;

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(null); // No user found
    jest.spyOn(userModelMock, 'create').mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);
    expect(result).toEqual(createdUser);
  });

  it('should throw ConflictException if user already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue({} as User); // Simulate existing user

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userModelMock, 'findOne').mockRejectedValue(new Error()); // Simulate internal error

    await expect(service.create(createUserDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw ConflictException if user not found', async () => {
    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(null);

    await expect(
      service.update(1, { password: 'newPassword123' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return a user by id', async () => {
    const user = { id: 1, email: 'test@example.com' } as User;
    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(result).toEqual(user);
  });

  it('should remove a user by id', async () => {
    jest.spyOn(userModelMock, 'destroy').mockResolvedValue(1);

    const result = await service.remove(1);
    expect(result).toBe(1);
  });

  it('should return a user by eamil if found', async () => {
    const email = 'test@example.com';
    const userMock = { id: 1, email, password: 'hashedPassword' } as User;

    const spyUser = jest
      .spyOn(userModelMock, 'findOne')
      .mockResolvedValue(userMock);

    const result = await service.findByEmail(email);
    expect(result).toEqual(userMock);
    expect(spyUser).toHaveBeenCalledWith({ where: { email } });
  });

  it('should return null if no user is found', async () => {
    const email = 'notfound@example.com';

    const spyUser = jest
      .spyOn(userModelMock, 'findOne')
      .mockResolvedValue(null);

    const result = await service.findByEmail(email);
    expect(result).toBeNull();
    expect(spyUser).toHaveBeenCalledWith({ where: { email } });
  });
});
