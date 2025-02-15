import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { BoardMembers } from './boardMembers.model';

@Table
export class Board extends Model<Board> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @BelongsToMany(() => User, () => BoardMembers)
  members: User[];
}
