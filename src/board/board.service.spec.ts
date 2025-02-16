import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Board } from './models/board.model';
import { BoardMembers } from './models/boardMembers.model';
import { PermissionService } from './services/permission.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('BoardService', () => {
  let service: BoardService;
  let boardModel: typeof Board;
  let boardMembersModel: typeof BoardMembers;
  let permissionService: PermissionService;
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
        {
          provide: PermissionService,
          useValue: {
            checkPermission: jest.fn(),
            isBoardMember: jest.fn(),
            isCreator: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    boardModel = module.get<typeof Board>(getModelToken(Board));
    boardMembersModel = module.get<typeof BoardMembers>(
      getModelToken(BoardMembers),
    );
    permissionService = module.get<PermissionService>(PermissionService);

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
    it('should throw NotFoundException if board not found', async () => {
      const userId = 1;

      jest.spyOn(boardModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(BOARD_NOT_FOUND, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the board if it exists', async () => {
      const boardId = 1;
      const userId = 1;
      const mockBoard = { id: boardId, createdBy: userId, title: 'Test Board' };

      jest.spyOn(boardModel, 'findByPk' as any).mockResolvedValue(mockBoard);

      const result = await service.findOne(boardId, userId);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('addMember', () => {
    it('should throw NotFoundException if user is already a member', async () => {
      const boardId = 1;
      const userId = 2;
      const userTokenId = 1;

      jest.spyOn(permissionService, 'isBoardMember').mockResolvedValue(true);

      await expect(
        service.addMember(boardId, userId, userTokenId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should add a member to the board', async () => {
      const boardId = 1;
      const userId = 2;
      const userTokenId = 1;

      jest.spyOn(permissionService, 'isBoardMember').mockResolvedValue(false);

      const spy = jest.spyOn(boardMembersModel, 'create').mockResolvedValue({
        boardId,
        userId,
      });

      const result = await service.addMember(boardId, userId, userTokenId);
      expect(result).toEqual({ boardId, userId });
      expect(spy).toHaveBeenCalledWith({
        boardId,
        userId,
      });
    });
  });

  describe('removeMember', () => {
    it('should throw ForbiddenException if user is not the creator', async () => {
      const boardId = 1;
      const userIdToRemove = 2;
      const userTokenId = 3;

      jest.spyOn(permissionService, 'isCreator').mockReturnValue(false);

      await expect(
        service.removeMember(boardId, userIdToRemove, userTokenId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should remove a member from the board', async () => {
      const boardId = 1;
      const userIdToRemove = 2;
      const userTokenId = 1;

      jest.spyOn(permissionService, 'isCreator').mockReturnValue(true);

      const spy = jest
        .spyOn(boardMembersModel, 'findOne' as any)
        .mockResolvedValue({
          destroy: jest.fn(),
        });

      await service.removeMember(boardId, userIdToRemove, userTokenId);
      expect(spy).toHaveBeenCalledWith({
        where: { boardId, userId: userIdToRemove },
      });
    });
  });

  describe('removeBoard', () => {
    it('should throw ForbiddenException if user is not the creator', async () => {
      const boardId = 1;
      const userTokenId = 2;

      jest.spyOn(permissionService, 'isCreator').mockReturnValue(false);

      await expect(service.removeBoard(boardId, userTokenId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
