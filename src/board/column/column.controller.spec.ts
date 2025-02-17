import { Test, TestingModule } from '@nestjs/testing';

import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnController } from './column.controller';

describe('ColumnController', () => {
  let columnController: ColumnController;
  let columnService: ColumnService;
  const mockResolveValue = { name: 'To Do' };

  const mockColumnService = {
    create: jest.fn().mockResolvedValue({ id: 1, ...mockResolveValue }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, ...mockResolveValue }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, ...mockResolveValue }),
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

      const result = await columnController.create(boardId, mockResolveValue);

      const spy = jest.spyOn(columnService, 'create');

      expect(spy).toHaveBeenCalledWith(boardId, mockResolveValue.name);
      expect(result).toEqual({ id: boardId, ...mockResolveValue });
    });
  });

  describe('findAll', () => {
    it('should return an array of columns', async () => {
      const boardId = 1;

      const result = await columnController.findAll(boardId);
      const spy = jest.spyOn(columnService, 'findAll');

      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ id: boardId, ...mockResolveValue }]);
    });
  });

  describe('findOne', () => {
    it('should return a specific column', async () => {
      const columnId = 1;

      const result = await columnController.findOne(columnId);
      const spy = jest.spyOn(columnService, 'findOne');

      expect(spy).toHaveBeenCalledWith(columnId);
      expect(result).toEqual({ id: 1, ...mockResolveValue });
    });
  });

  describe('update', () => {
    it('should update a column', async () => {
      const columnId = 1;
      const updateDto: CreateColumnDto = { name: 'Updated Column' };

      const result = await columnController.update(columnId, updateDto);

      const spy = jest.spyOn(columnService, 'update');

      expect(spy).toHaveBeenCalledWith(1, updateDto.name);
      expect(result).toEqual({ id: columnId, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a column', async () => {
      const columnId = 1;

      const result = await columnController.remove(columnId);
      const spy = jest.spyOn(columnService, 'remove');
      expect(spy).toHaveBeenCalledWith(columnId);
      expect(result).toEqual({ success: true });
    });
  });
});
