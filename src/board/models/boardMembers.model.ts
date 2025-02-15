import {
  Column,
  ForeignKey,
  Table,
  Model,
  DataType,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Board } from './board.model';

@Table
export class BoardMembers extends Model<BoardMembers> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Board)
  @Column
  boardId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
