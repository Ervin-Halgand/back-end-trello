import { BoardMemberGuard } from './board-member.guard';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Board } from '../models/board.model';
import { BoardMembers } from '../models/boardMembers.model';

jest.mock('../models/board.model');
jest.mock('../models/boardMembers.model');

describe('BoardMemberGuard', () => {
  let guard: BoardMemberGuard;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    guard = new BoardMemberGuard();

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

  it('should return true if user is a board member', async () => {
    (Board.findByPk as jest.Mock).mockResolvedValue({ id: 1, createdBy: 2 });
    (BoardMembers.findOne as jest.Mock).mockResolvedValue({
      boardId: 1,
      userId: 1,
    });

    const result = await guard.canActivate(mockContext as ExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user is neither creator nor member', async () => {
    (Board.findByPk as jest.Mock).mockResolvedValue({ id: 1, createdBy: 2 });
    (BoardMembers.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      guard.canActivate(mockContext as ExecutionContext),
    ).rejects.toThrow(ForbiddenException);
  });
});
