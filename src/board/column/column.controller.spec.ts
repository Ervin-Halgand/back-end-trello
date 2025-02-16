import { Test, TestingModule } from '@nestjs/testing';

import { ColumnService } from './column.service';
import { AuthenticatedRequest } from '../../common/types/authenticated_request.type';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnController } from './column.controller';

describe('ColumnController', () => {
  let columnController: ColumnController;
  let columnService: ColumnService;

  const mockColumnService = {
    create: jest.fn().mockResolvedValue({ id: 1, name: 'To Do' }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'To Do' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'To Do' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Column' }),
    remove: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnController],
      providers: [{ provide: ColumnService, useValue: mockColumnService }],
    }).compile();

    columnController = module.get<ColumnController>(ColumnController);
    columnService = module.get<ColumnService>(ColumnService);
  });

  it('should be defined', () => {
    expect(columnController).toBeDefined();
  });

  describe('create', () => {
    it('should create a column', async () => {
      const boardId = 1;
      const payload: AuthenticatedRequest = {
        user: { id: 1 },
      } as AuthenticatedRequest;
      const createColumnDto: CreateColumnDto = { name: 'To Do' };

      const result = await columnController.create(
        boardId,
        payload,
        createColumnDto,
      );

      const spy = jest.spyOn(columnService, 'create');

      expect(spy).toHaveBeenCalledWith(1, 1, 'To Do');
      expect(result).toEqual({ id: 1, name: 'To Do' });
    });
  });

  describe('findAll', () => {
    it('should return an array of columns', async () => {
      const boardId = 1;
      const payload: AuthenticatedRequest = {
        user: { id: 1 },
      } as AuthenticatedRequest;

      const result = await columnController.findAll(boardId, payload);
      const spy = jest.spyOn(columnService, 'findAll');

      expect(spy).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual([{ id: 1, name: 'To Do' }]);
    });
  });

  describe('findOne', () => {
    it('should return a specific column', async () => {
      const boardId = 1;
      const columnId = 1;
      const payload: AuthenticatedRequest = {
        user: { id: 1 },
      } as AuthenticatedRequest;

      const result = await columnController.findOne(boardId, columnId, payload);
      const spy = jest.spyOn(columnService, 'findOne');

      expect(spy).toHaveBeenCalledWith(1, 1, 1);
      expect(result).toEqual({ id: 1, name: 'To Do' });
    });
  });

  describe('update', () => {
    it('should update a column', async () => {
      const boardId = 1;
      const columnId = 1;
      const payload: AuthenticatedRequest = {
        user: { id: 1 },
      } as AuthenticatedRequest;
      const updateDto: CreateColumnDto = { name: 'Updated Column' };

      const result = await columnController.update(
        boardId,
        columnId,
        updateDto,
        payload,
      );

      const spy = jest.spyOn(columnService, 'update');

      expect(spy).toHaveBeenCalledWith(1, 1, 1, 'Updated Column');
      expect(result).toEqual({ id: 1, name: 'Updated Column' });
    });
  });

  describe('remove', () => {
    it('should remove a column', async () => {
      const boardId = 1;
      const columnId = 1;
      const payload: AuthenticatedRequest = {
        user: { id: 1 },
      } as AuthenticatedRequest;

      const result = await columnController.remove(columnId, boardId, payload);
      const spy = jest.spyOn(columnService, 'remove');
      expect(spy).toHaveBeenCalledWith(1, 1, 1);
      expect(result).toEqual({ success: true });
    });
  });
});
