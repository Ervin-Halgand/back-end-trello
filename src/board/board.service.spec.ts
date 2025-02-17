import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Board } from './models/board.model';
import { BoardMembers } from './models/boardMembers.model';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('BoardService', () => {
  let service: BoardService;
  let boardModel: typeof Board;
  let boardMembersModel: typeof BoardMembers;
  const BOARD_NOT_FOUND = -1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getModelToken(Board),
          useValue: {
            create: jest.fn(),
            findByPk: jest.fn(),
            findAll: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: getModelToken(BoardMembers),
          useValue: { create: jest.fn(), findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    boardModel = module.get<typeof Board>(getModelToken(Board));
    boardMembersModel = module.get<typeof BoardMembers>(
      getModelToken(BoardMembers),
    );

    jest
      .spyOn(service, 'getBoard' as any)
      .mockImplementation((boardId: number) => {
        if (boardId === BOARD_NOT_FOUND) {
          throw new NotFoundException('Board not found');
        }
        return {
          id: boardId,
          createdBy: 1,
          title: 'Test Board',
        };
      });
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const createBoardDto = { title: 'Test Board' };
      const userId = 1;
      const createdBoard = { id: 1, createdBy: userId, ...createBoardDto };

      const spy = jest
        .spyOn(boardModel, 'create')
        .mockResolvedValue(createdBoard);

      const result = await service.create(createBoardDto, userId);
      expect(result).toEqual(createdBoard);
      expect(spy).toHaveBeenCalledWith({
        ...createBoardDto,
        createdBy: userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of boards', async () => {
      const userId = 1;
      const boards = [{ id: 1, createdBy: userId, title: 'Test Board' }];

      jest.spyOn(boardModel, 'findAll' as any).mockResolvedValue(boards);

      const result = await service.findAll(userId);
      expect(result).toEqual(boards);
    });
  });

  describe('findOne', () => {
    it('should return the board', async () => {
      const boardId = 1;
      const userId = 1;
      const mockBoard = { id: boardId, createdBy: userId, title: 'Test Board' };

      jest.spyOn(boardModel, 'findByPk' as any).mockResolvedValue(mockBoard);

      const result = await service.findOne(boardId);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('addMember', () => {
    it('should add a member to the board', async () => {
      const boardId = 1;
      const userId = 2;

      const spy = jest.spyOn(boardMembersModel, 'create').mockResolvedValue({
        boardId,
        userId,
      });

      const result = await service.addMember(boardId, userId);
      expect(result).toEqual({ boardId, userId });
      expect(spy).toHaveBeenCalledWith({
        boardId,
        userId,
      });
    });
  });
});
