import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Board } from './models/board.model';
import { BoardMembers } from './models/boardMembers.model';
import { PermissionService } from './services/permission.service';
import { User } from '../users/models/user.model';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board) private boardModel: typeof Board,
    @InjectModel(BoardMembers) private boardMembersModel: typeof BoardMembers,
    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: number) {
    return await this.boardModel.create({
      ...createBoardDto,
      createdBy: userId,
    } as Board);
  }

  async findAll(userId: number) {
    const boards = await this.boardModel.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          required: false,
        },
      ],
      where: {
        [Op.or]: [{ createdBy: userId }, { '$members.id$': userId }],
      },
      raw: true,
      nest: true,
    });

    return boards.map(({ members, createdBy, ...board }) => board);
  }

  private async getBoard(boardId: number) {
    const board = await this.boardModel.findByPk(boardId);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async findOne(boardId: number, userId: number) {
    const board = await this.getBoard(boardId);
    await this.permissionService.checkPermission(
      board.createdBy,
      boardId,
      userId,
      'get',
    );

    return board;
  }

  async addMember(boardId: number, userId: number, userTokenId: number) {
    const board = await this.getBoard(boardId);
    await this.permissionService.checkPermission(
      board.createdBy,
      boardId,
      userTokenId,
      'add',
    );

    const isMember = await this.permissionService.isBoardMember(
      boardId,
      userId,
    );

    if (isMember) {
      throw new NotFoundException('User is already a member of this board');
    }

    return this.boardMembersModel.create({ boardId, userId } as BoardMembers);
  }

  async removeMember(
    boardId: number,
    userIdToRemove: number,
    userTokenId: number,
  ) {
    const board = await this.getBoard(boardId);
    const isCreator = this.permissionService.isCreator(
      board.createdBy,
      userTokenId,
    );
    if (!isCreator) {
      throw new ForbiddenException('Only the board creator can remove members');
    }

    const memberToRemove = await this.boardMembersModel.findOne({
      where: { boardId, userId: userIdToRemove },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Member not found in this board');
    }

    return await memberToRemove.destroy();
  }

  async removeBoard(boardId: number, userTokenId: number) {
    const board = await this.getBoard(boardId);
    const isCreator = this.permissionService.isCreator(
      board.createdBy,
      userTokenId,
    );

    if (!isCreator) {
      throw new ForbiddenException(
        'Only the board creator can delete the board',
      );
    }

    return await board.destroy();
  }

  async getMembers(boardId: number, userId: number) {
    const board = await this.getBoard(boardId);
    await this.permissionService.checkPermission(
      board.createdBy,
      boardId,
      userId,
      'get',
    );

    return await this.boardMembersModel.findAll({ where: { boardId } });
  }
}
