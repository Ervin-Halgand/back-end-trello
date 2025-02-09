import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = { ...createUserDto, id: 1 } as User;

    const spyService = jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createUserDto)).toEqual(result);
    expect(spyService).toHaveBeenCalledTimes(1);
    expect(spyService).toHaveBeenCalledWith(createUserDto);
  });

  it('should throw ConflictException if user already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest
      .spyOn(service, 'create')
      .mockRejectedValue(new ConflictException('User already exists'));

    await expect(controller.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should return a user by id', async () => {
    const user = { id: 1, email: 'test@example.com' } as User;

    const spyService = jest.spyOn(service, 'findOne').mockResolvedValue(user);

    expect(await controller.findOne(1)).toEqual(user);
    expect(spyService).toHaveBeenCalledWith(1);
  });

  it('should update an existing user', async () => {
    const updateUserDto: UpdateUserDto = { password: 'newPassword123' };

    const updatedUser = { id: 1, name: 'halgand' } as UpdateUserDto;

    const spyService = jest
      .spyOn(service, 'update')
      .mockResolvedValue(updatedUser as User);

    expect(await controller.update(1, updateUserDto)).toEqual(updatedUser);
    expect(spyService).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should throw ConflictException if user not found for update', async () => {
    const updateUserDto: UpdateUserDto = { password: 'newPassword123' };

    jest
      .spyOn(service, 'update')
      .mockRejectedValue(new ConflictException('User not found'));

    await expect(controller.update(1, updateUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should remove a user by id', async () => {
    const userId = 1;

    const spyService = jest.spyOn(service, 'remove').mockResolvedValue(userId);

    expect(await controller.remove(userId)).toBe(userId);
    expect(spyService).toHaveBeenCalledWith(userId);
  });
});
