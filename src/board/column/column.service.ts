import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Column } from './models/Column.model';
import { PermissionService } from '../services/permission.service';
import { Board } from '../models/board.model';
import { RemoveColumnResponseDto } from './dto/responses/remove-column-response.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectModel(Column) private ColumnModel: typeof Column,
    @InjectModel(Board) private boardModel: typeof Board,
    private readonly permissionService: PermissionService,
  ) {}

  private async hasPermission(boardId: number, userId: number) {
    const board = await this.boardModel.findByPk(boardId);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.permissionService.checkPermission(
      board.createdBy,
      boardId,
      userId,
      'get',
    );
  }

  async create(boardId: number, userId: number, name: string): Promise<Column> {
    await this.hasPermission(boardId, userId);
    return await this.ColumnModel.create({ boardId, name });
  }

  async findAll(boardId: number, userId: number): Promise<Column[]> {
    await this.hasPermission(boardId, userId);
    return await this.ColumnModel.findAll({ where: { boardId } });
  }

  async findOne(
    columnId: number,
    boardId: number,
    userId: number,
  ): Promise<Column> {
    await this.hasPermission(boardId, userId);
    const column = await this.ColumnModel.findByPk(columnId);

    if (!column) {
      throw new NotFoundException('column not found');
    }
    return column;
  }

  async update(
    columnId: number,
    boardId: number,
    userId: number,
    name: string,
  ): Promise<Column> {
    const column = await this.findOne(columnId, boardId, userId);

    return await column.update({ name });
  }

  async remove(
    columnId: number,
    boardId: number,
    userId: number,
  ): Promise<RemoveColumnResponseDto> {
    await this.hasPermission(boardId, userId);
    const column = await this.ColumnModel.findByPk(columnId);

    if (!column) {
      throw new NotFoundException('column not found');
    }

    await column.destroy();

    return { message: 'column successfully deleted' };
  }
}
