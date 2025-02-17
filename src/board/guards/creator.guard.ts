import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Board } from '../models/board.model';
import { BoardRequest } from './board-request.type';

@Injectable()
export class BoardCreatorGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: BoardRequest = context.switchToHttp().getRequest();

    const userId = request.user;
    const boardId = parseInt(request.params.id, 10);

    const board = await Board.findByPk(boardId);

    if (!board) {
      throw new ForbiddenException('Board not found');
    }

    if (board.createdBy !== userId) {
      throw new ForbiddenException(
        'Only the board creator can perform this action',
      );
    }

    return true;
  }
}
