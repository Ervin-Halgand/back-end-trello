import { Test, TestingModule } from '@nestjs/testing';
import { ColumnService } from './column.service';
import { Column } from './models/Column.model';
import { Board } from '../models/board.model';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('ColumnService', () => {
  let service: ColumnService;
  let columnModel: typeof Column;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnService,
        {
          provide: getModelToken(Column),
          useValue: {
            create: jest.fn(),
            findByPk: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: getModelToken(Board),
          useValue: {
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ColumnService>(ColumnService);
    columnModel = module.get<typeof Column>(getModelToken(Column));
  });

  describe('create', () => {
    it('should create a column', async () => {
      const boardId = 1;
      const columnName = 'To Do';
      const createdColumn = { id: 1, boardId, name: columnName };

      const spy = jest
        .spyOn(columnModel, 'create')
        .mockResolvedValue(createdColumn);

      const result = await service.create(boardId, columnName);

      expect(result).toEqual(createdColumn);
      expect(spy).toHaveBeenCalledWith({
        boardId,
        name: columnName,
      });
    });
  });

  describe('findAll', () => {
    it('should return all columns for a board', async () => {
      const boardId = 1;
      const columns = [{ id: 1, boardId, name: 'To Do' }];

      const spy = jest
        .spyOn(columnModel, 'findAll' as any)
        .mockResolvedValue(columns);

      const result = await service.findAll(boardId);

      expect(result).toEqual(columns);
      expect(spy).toHaveBeenCalledWith({ where: { boardId } });
    });
  });

  describe('findOne', () => {
    it('should return a column if found', async () => {
      const columnId = 1;
      const mockColumn = { id: columnId, boardId: 1, name: 'To Do' };

      jest.spyOn(columnModel, 'findByPk' as any).mockResolvedValue(mockColumn);

      const result = await service.findOne(columnId);

      expect(result).toEqual(mockColumn);
    });

    it('should throw NotFoundException if column is not found', async () => {
      jest.spyOn(columnModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a column', async () => {
      const columnId = 1;
      const newName = 'Updated Column';
      const mockColumn = {
        id: columnId,
        boardId: 1,
        name: 'To Do',
        update: jest.fn(),
      };

      jest.spyOn(service, 'findOne' as any).mockResolvedValue(mockColumn);

      await service.update(columnId, newName);

      expect(mockColumn.update).toHaveBeenCalledWith({ name: newName });
    });
  });

  describe('remove', () => {
    it('should delete a column', async () => {
      const columnId = 1;

      const mockColumn = { id: columnId, destroy: jest.fn() };

      jest.spyOn(columnModel, 'findByPk' as any).mockResolvedValue(mockColumn);

      const result = await service.remove(columnId);

      expect(mockColumn.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'column successfully deleted' });
    });

    it('should throw NotFoundException if column does not exist', async () => {
      jest.spyOn(columnModel, 'findByPk').mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
