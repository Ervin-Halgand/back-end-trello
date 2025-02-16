import { Injectable, ForbiddenException } from '@nestjs/common';
import { BoardMembers } from '../models/boardMembers.model';

@Injectable()
export class PermissionService {
  // Vérifie si l'utilisateur est le créateur du board
  isCreator(createdBy: number, userId: number): boolean {
    return createdBy === userId;
  }

  // Vérifie si l'utilisateur est membre du board
  async isBoardMember(boardId: number, userId: number): Promise<boolean> {
    try {
      const boardMember = await BoardMembers.findOne({
        where: { boardId, userId },
      });

      return !!boardMember;
    } catch {
      return false;
    }
  }

  // Vérifie si l'utilisateur a les autorisations nécessaires pour certaines actions
  async checkPermission(
    createdBy: number,
    boardId: number,
    userId: number,
    action: 'remove' | 'add' | 'get',
  ) {
    const isCreator = this.isCreator(createdBy, userId);
    const isMember = await this.isBoardMember(boardId, userId);

    switch (action) {
      case 'remove':
        if (!isCreator) {
          throw new ForbiddenException(
            'Only the board creator can remove members',
          );
        }
        break;
      case 'add':
        if (!(isCreator || isMember)) {
          throw new ForbiddenException('You do not have access to this board');
        }
        break;
      case 'get':
        if (!(isCreator || isMember)) {
          throw new ForbiddenException('You do not have access to this board');
        }
        break;
      default:
        throw new Error('Invalid action');
    }
  }
}
