import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Board } from './models/board.model';
import { BoardMembers } from './models/boardMembers.model';

import { User } from '../users/models/user.model';
import { BoardResponseDto } from './dto/reponses/board-response.dto';
import { BoardMemberResponseDto } from './dto/reponses/board-member-response.dto';
import { DeleteResponseDto } from './dto/reponses/delete-response.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board) private boardModel: typeof Board,
    @InjectModel(BoardMembers) private boardMembersModel: typeof BoardMembers,
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
          attributes: [],
        },
      ],
      where: {
        [Op.or]: [
          { createdBy: userId }, // If the user is the board creator
          { '$members.id$': userId }, // If the user is a board member (access User table and check on 'Id')
        ],
      },
      attributes: ['id', 'title', 'createdBy'],
    });

    return boards;
  }

  private async getBoard(boardId: number): Promise<Board> {
    const board = await this.boardModel.findByPk(boardId);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async findOne(boardId: number): Promise<BoardResponseDto> {
    const board = await this.getBoard(boardId);

    return {
      id: board.id,
      title: board.title,
      createdBy: board.createdBy,
    };
  }

  async addMember(
    boardId: number,
    userId: number,
  ): Promise<BoardMemberResponseDto> {
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
  ): Promise<DeleteResponseDto> {
    const board = await this.getBoard(boardId);

    const memberToRemove = await this.boardMembersModel.findOne({
      where: { boardId, userId: userIdToRemove },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Member not found');
    }

    await memberToRemove.destroy();

    return {
      message: `Member ${memberToRemove.id} successfully deleted from board ${board.title}`,
    };
  }

  async removeBoard(boardId: number): Promise<DeleteResponseDto> {
    const board = await this.getBoard(boardId);

    await board.destroy();

    return { message: 'Board successfully deleted' };
  }

  async getMembers(boardId: number): Promise<BoardMembers[]> {
    return await this.boardMembersModel.findAll({ where: { boardId } });
  }
}
