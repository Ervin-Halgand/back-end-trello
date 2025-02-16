import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column as sequelizeColumn,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Board } from '../../models/board.model';

@Table
export class Column extends Model {
  @sequelizeColumn({ primaryKey: true, unique: true, autoIncrement: true })
  id: number;

  @sequelizeColumn({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ForeignKey(() => Board)
  @sequelizeColumn({
    type: DataType.INTEGER,
    allowNull: false,
  })
  boardId: number;

  @BelongsTo(() => Board)
  board: Board;
}
