import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { BoardMembers } from '../models/boardMembers.model';

// Mock de BoardMembers
jest.mock('../models/boardMembers.model');

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionService],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isCreator', () => {
    it('should return true if the user is the creator', () => {
      const result = service.isCreator(1, 1);
      expect(result).toBe(true);
    });

    it('should return false if the user is not the creator', () => {
      const result = service.isCreator(1, 2);
      expect(result).toBe(false);
    });
  });

  describe('isBoardMember', () => {
    it('should return true if the user is a member of the board', async () => {
      const mockFindOne = jest
        .fn()
        .mockResolvedValue({ boardId: 1, userId: 1 });
      BoardMembers.findOne = mockFindOne;

      const result = await service.isBoardMember(1, 1);
      expect(result).toBe(true);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { boardId: 1, userId: 1 },
      });
    });

    it('should return false if the user is not a member of the board', async () => {
      const mockFindOne = jest.fn().mockResolvedValue(null);
      BoardMembers.findOne = mockFindOne;

      const result = await service.isBoardMember(1, 1);
      expect(result).toBe(false);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { boardId: 1, userId: 1 },
      });
    });
  });

  describe('checkPermission', () => {
    it('should throw ForbiddenException if user is not the creator and tries to remove', async () => {
      const mockIsCreator = jest
        .spyOn(service, 'isCreator')
        .mockReturnValue(false);
      const mockIsBoardMember = jest
        .spyOn(service, 'isBoardMember')
        .mockResolvedValue(false);

      await expect(
        service.checkPermission(1, 1, 2, 'remove'),
      ).rejects.toThrowError(ForbiddenException);

      mockIsCreator.mockRestore();
      mockIsBoardMember.mockRestore();
    });

    it('should throw ForbiddenException if user is not creator or member and tries to add', async () => {
      const mockIsCreator = jest
        .spyOn(service, 'isCreator')
        .mockReturnValue(false);
      const mockIsBoardMember = jest
        .spyOn(service, 'isBoardMember')
        .mockResolvedValue(false);

      await expect(
        service.checkPermission(1, 1, 2, 'add'),
      ).rejects.toThrowError(ForbiddenException);

      mockIsCreator.mockRestore();
      mockIsBoardMember.mockRestore();
    });

    it('should throw ForbiddenException if user is not creator or member and tries to get', async () => {
      const mockIsCreator = jest
        .spyOn(service, 'isCreator')
        .mockReturnValue(false);
      const mockIsBoardMember = jest
        .spyOn(service, 'isBoardMember')
        .mockResolvedValue(false);

      await expect(
        service.checkPermission(1, 1, 2, 'get'),
      ).rejects.toThrowError(ForbiddenException);

      mockIsCreator.mockRestore();
      mockIsBoardMember.mockRestore();
    });

    it('should allow the creator to remove members', async () => {
      const mockIsCreator = jest
        .spyOn(service, 'isCreator')
        .mockReturnValue(true);

      await expect(
        service.checkPermission(1, 1, 1, 'remove'),
      ).resolves.not.toThrow();

      mockIsCreator.mockRestore();
    });

    it('should allow the creator or a member to add members', async () => {
      const mockIsCreator = jest
        .spyOn(service, 'isCreator')
        .mockReturnValue(true);
      const mockIsBoardMember = jest
        .spyOn(service, 'isBoardMember')
        .mockResolvedValue(true);

      await expect(
        service.checkPermission(1, 1, 1, 'add'),
      ).resolves.not.toThrow();
      await expect(
        service.checkPermission(1, 1, 2, 'add'),
      ).resolves.not.toThrow();

      mockIsCreator.mockRestore();
      mockIsBoardMember.mockRestore();
    });
  });
});
