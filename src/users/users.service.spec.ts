import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { ConflictException, NotFoundException } from '@nestjs/common';
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
            findByPk: jest.fn(),
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

    const createdUser = {
      email: createUserDto.email,
      createdAt: '2025-02-16T14:00:00Z',
      id: 1,
    } as User;

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(null);
    jest.spyOn(userModelMock, 'create').mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);
    expect(result).toEqual(createdUser);
  });

  it('should throw ConflictException if user already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue({} as User);

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw ConflictException if user not found', async () => {
    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(null);

    await expect(
      service.update(1, { password: 'newPassword123' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return a user by id', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      createdAt: '2025-02-16T14:00:00Z',
      updatedAt: '2025-03-16T14:00:00Z',
    } as User;
    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(result).toEqual(user);
  });

  it('should remove a user by id', async () => {
    const deletedMessage = { message: 'User successfully deleted' };
    jest.spyOn(userModelMock, 'destroy').mockResolvedValue(1);

    const result = await service.remove(1);
    expect(result).toStrictEqual(deletedMessage);
  });

  it('should return a user by email if found', async () => {
    const email = 'test@example.com';
    const userMock = {
      id: 1,
      email,
      createdAt: '2025-02-16T14:00:00Z',
    } as User;

    const spyUser = jest
      .spyOn(userModelMock, 'findOne')
      .mockResolvedValue(userMock);

    const result = await service.findByEmail(email);
    expect(result).toEqual(userMock);
    expect(spyUser).toHaveBeenCalledWith({ where: { email } });
  });

  it('should throw NotFoundException if no user is found', async () => {
    const email = 'notfound@example.com';

    jest.spyOn(userModelMock, 'findOne').mockResolvedValue(null);

    await expect(service.findByEmail(email)).rejects.toThrow(NotFoundException);
  });
});
