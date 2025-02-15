import { Column, ForeignKey, Table, Model } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Board } from './board.model';

@Table
export class BoardMembers extends Model<BoardMembers> {
  @ForeignKey(() => Board)
  @Column
  boardId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
