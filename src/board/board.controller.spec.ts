import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { AuthenticatedRequest } from 'src/common/types/authenticated_request.type';

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: {
            create: jest.fn(() => {}),
            findAll: jest.fn(() => {}),
            findOne: jest.fn(() => {}),
            addMember: jest.fn(() => {}),
            removeMember: jest.fn(() => {}),
            removeBoard: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto = { title: 'Test Board' };
    const userId = 1;
    const spy = jest.spyOn(service, 'create');

    await controller.create(dto, { user: userId } as AuthenticatedRequest);

    expect(spy).toHaveBeenCalledWith(dto, userId);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call service.findAll', async () => {
    const userId = 1;
    const spy = jest.spyOn(service, 'findAll');

    await controller.findAll({ user: userId } as AuthenticatedRequest);

    expect(spy).toHaveBeenCalledWith(userId);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call service.findOne', async () => {
    const boardId = 1;
    const spy = jest.spyOn(service, 'findOne');

    await controller.findOne(boardId);

    expect(spy).toHaveBeenCalledWith(boardId);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call service.addMember', async () => {
    const boardId = 1;
    const userId = 2;

    const dto = { userId };
    const spy = jest.spyOn(service, 'addMember');

    await controller.addMember(boardId, dto);

    expect(spy).toHaveBeenCalledWith(boardId, userId);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call service.removeMember', async () => {
    const boardId = 1;
    const userIdToRemove = 2;

    const spy = jest.spyOn(service, 'removeMember');

    await controller.removeMember(boardId, userIdToRemove);

    expect(spy).toHaveBeenCalledWith(boardId, userIdToRemove);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call service.removeBoard', async () => {
    const boardId = 1;

    const spy = jest.spyOn(service, 'removeBoard');

    await controller.removeBoard(boardId);

    expect(spy).toHaveBeenCalledWith(boardId);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
