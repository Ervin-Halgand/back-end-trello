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
import { BoardResponseDto } from './dto/reponses/board-response.dto';
import { BoardMemberResponseDto } from './dto/reponses/board-member-response.dto';
import { DeleteResponseDto } from './dto/reponses/delete-response.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board) private boardModel: typeof Board,
    @InjectModel(BoardMembers) private boardMembersModel: typeof BoardMembers,
    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: number,
  ): Promise<BoardResponseDto> {
    const board = await this.boardModel.create({
      ...createBoardDto,
      createdBy: userId,
    } as Board);

    return {
      id: board.id,
      title: board.title,
      createdBy: board.createdBy,
    };
  }

  async findAll(userId: number): Promise<BoardResponseDto[]> {
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

    return boards.map((board) => ({
      id: board.id,
      title: board.title,
      createdBy: board.createdBy,
    }));
  }

  private async getBoard(boardId: number): Promise<Board> {
    const board = await this.boardModel.findByPk(boardId);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async findOne(boardId: number, userId: number): Promise<BoardResponseDto> {
    const board = await this.getBoard(boardId);
    await this.permissionService.checkPermission(
      board.createdBy,
      boardId,
      userId,
      'get',
    );

    return {
      id: board.id,
      title: board.title,
      createdBy: board.createdBy,
    };
  }

  async addMember(
    boardId: number,
    userId: number,
    userTokenId: number,
  ): Promise<BoardMemberResponseDto> {
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

    const newMember = await this.boardMembersModel.create({
      boardId,
      userId,
    } as BoardMembers);

    return {
      boardId: newMember.boardId,
      userId: newMember.userId,
    };
  }

  async removeMember(
    boardId: number,
    userIdToRemove: number,
    userTokenId: number,
  ): Promise<DeleteResponseDto> {
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

    await memberToRemove.destroy();

    return {
      message: `Member ${memberToRemove.id} successfully deleted from board ${board.title}`,
    };
  }

  async removeBoard(
    boardId: number,
    userTokenId: number,
  ): Promise<DeleteResponseDto> {
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

    await board.destroy();

    return { message: 'Board successfully deleted' };
  }

  async getMembers(boardId: number, userId: number): Promise<BoardMembers[]> {
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
