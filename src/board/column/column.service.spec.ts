import { Test, TestingModule } from '@nestjs/testing';
import { ColumnService } from './column.service';
import { Column } from './models/Column.model';
import { Board } from '../models/board.model';
import { PermissionService } from '../services/permission.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('ColumnService', () => {
  let service: ColumnService;
  let columnModel: typeof Column;

  const COLUMN_NOT_FOUND = -1;

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
        {
          provide: PermissionService,
          useValue: {
            checkPermission: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ColumnService>(ColumnService);
    columnModel = module.get<typeof Column>(getModelToken(Column));

    jest
      .spyOn(service as any, 'hasPermission')
      .mockImplementation((boardId: number) => {
        if (boardId === COLUMN_NOT_FOUND) {
          throw new NotFoundException('Board not found');
        }
      });
  });

  describe('create', () => {
    it('should create a column', async () => {
      const boardId = 1;
      const userId = 1;
      const columnName = 'To Do';
      const createdColumn = { id: 1, boardId, name: columnName };

      const spy = jest
        .spyOn(columnModel, 'create')
        .mockResolvedValue(createdColumn);

      const result = await service.create(boardId, userId, columnName);

      expect(result).toEqual(createdColumn);
      expect(spy).toHaveBeenCalledWith({
        boardId,
        name: columnName,
      });
    });

    it('should throw NotFoundException if board does not exist', async () => {
      await expect(
        service.create(COLUMN_NOT_FOUND, 1, 'To Do'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all columns for a board', async () => {
      const boardId = 1;
      const userId = 1;
      const columns = [{ id: 1, boardId, name: 'To Do' }];

      const spy = jest
        .spyOn(columnModel, 'findAll' as any)
        .mockResolvedValue(columns);

      const result = await service.findAll(boardId, userId);

      expect(result).toEqual(columns);
      expect(spy).toHaveBeenCalledWith({ where: { boardId } });
    });
  });

  describe('findOne', () => {
    it('should return a column if found', async () => {
      const columnId = 1;
      const boardId = 1;
      const userId = 1;
      const mockColumn = { id: columnId, boardId, name: 'To Do' };

      jest.spyOn(columnModel, 'findByPk' as any).mockResolvedValue(mockColumn);

      const result = await service.findOne(columnId, boardId, userId);

      expect(result).toEqual(mockColumn);
    });

    it('should throw NotFoundException if column is not found', async () => {
      jest.spyOn(columnModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(99, 1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a column', async () => {
      const columnId = 1;
      const boardId = 1;
      const userId = 1;
      const newName = 'Updated Column';
      const mockColumn = {
        id: columnId,
        boardId,
        name: 'To Do',
        update: jest.fn(),
      };

      jest.spyOn(service, 'findOne' as any).mockResolvedValue(mockColumn);

      await service.update(columnId, boardId, userId, newName);

      expect(mockColumn.update).toHaveBeenCalledWith({ name: newName });
    });
  });

  describe('remove', () => {
    it('should delete a column', async () => {
      const columnId = 1;
      const boardId = 1;
      const userId = 1;
      const mockColumn = { id: columnId, destroy: jest.fn() };

      jest.spyOn(columnModel, 'findByPk' as any).mockResolvedValue(mockColumn);

      const result = await service.remove(columnId, boardId, userId);

      expect(mockColumn.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'column successfully deleted' });
    });

    it('should throw NotFoundException if column does not exist', async () => {
      jest.spyOn(columnModel, 'findByPk').mockResolvedValue(null);

      await expect(service.remove(99, 1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
