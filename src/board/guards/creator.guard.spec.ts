import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Board } from '../models/board.model';
import { BoardCreatorGuard } from './creator.guard';

jest.mock('../models/board.model');

describe('BoardCreatorGuard', () => {
  let guard: BoardCreatorGuard;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    guard = new BoardCreatorGuard();

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: 1,
          params: { id: '1' },
        }),
      }),
    };
  });

  it('should throw ForbiddenException if board does not exist', async () => {
    (Board.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(
      guard.canActivate(mockContext as ExecutionContext),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should return true if user is the board creator', async () => {
    (Board.findByPk as jest.Mock).mockResolvedValue({ id: 1, createdBy: 1 });

    const result = await guard.canActivate(mockContext as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user is not the creator', async () => {
    (Board.findByPk as jest.Mock).mockResolvedValue({ id: 1, createdBy: 2 });

    await expect(
      guard.canActivate(mockContext as ExecutionContext),
    ).rejects.toThrow(ForbiddenException);
  });
});
