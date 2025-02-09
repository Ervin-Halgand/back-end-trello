import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';
import * as bcrypt from 'bcrypt';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a hashed password', async () => {
    const password = 'plainPassword123';
    const hashedPassword = 'hashedPassword';
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);

    const result = await service.hashPassword(password);
    expect(result).toBe(hashedPassword);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
  });

  it('should return true when passwords match', async () => {
    const plainText = 'plainPassword123';
    const hashed = 'hashedPassword';
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

    const result = await service.comparePasswords(plainText, hashed);
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hashed);
  });

  it('should return false when passwords do not match', async () => {
    const plainText = 'plainPassword123';
    const hashed = 'differentHashedPassword';
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

    const result = await service.comparePasswords(plainText, hashed);
    expect(result).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hashed);
  });
});
