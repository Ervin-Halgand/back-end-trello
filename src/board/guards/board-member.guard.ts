import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Board } from '../models/board.model';
import { BoardMembers } from '../models/boardMembers.model';
import { BoardRequest } from './board-request.type';

@Injectable()
export class BoardMemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: BoardRequest = context.switchToHttp().getRequest();
    const userId = request.user;
    const id = parseInt(request.params.id, 10);

    const board = await Board.findByPk(id);

    if (!board) {
      throw new ForbiddenException('Board not found');
    }

    const isCreator = board.createdBy === userId;
    const isMember = !!(await BoardMembers.findOne({
      where: { boardId: id, userId },
    }));

    if (!isCreator && !isMember) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return true;
  }
}
