import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Column } from './models/Column.model';

import { Board } from '../models/board.model';
import { RemoveColumnResponseDto } from './dto/responses/remove-column-response.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectModel(Column) private ColumnModel: typeof Column,
    @InjectModel(Board) private boardModel: typeof Board,
  ) {}

  async create(boardId: number, name: string): Promise<Column> {
    return await this.ColumnModel.create({ boardId, name });
  }

  async findAll(boardId: number): Promise<Column[]> {
    return await this.ColumnModel.findAll({ where: { boardId } });
  }

  async findOne(columnId: number): Promise<Column> {
    const column = await this.ColumnModel.findByPk(columnId);

    if (!column) {
      throw new NotFoundException('column not found');
    }
    return column;
  }

  async update(columnId: number, name: string): Promise<Column> {
    const column = await this.findOne(columnId);

    return await column.update({ name });
  }

  async remove(columnId: number): Promise<RemoveColumnResponseDto> {
    const column = await this.ColumnModel.findByPk(columnId);

    if (!column) {
      throw new NotFoundException('column not found');
    }

    await column.destroy();

    return { message: 'column successfully deleted' };
  }
}
