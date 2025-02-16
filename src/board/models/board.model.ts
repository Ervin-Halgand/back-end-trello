import {
  BelongsToMany,
  Column as SequelizeColumn,
  DataType,
  ForeignKey,
  Table,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { BoardMembers } from './boardMembers.model';
import { Column } from '../column/models/Column.model';

@Table
export class Board extends Model<Board> {
  @SequelizeColumn({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @SequelizeColumn({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy: number;

  @SequelizeColumn({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @BelongsToMany(() => User, () => BoardMembers)
  members: User[];

  @HasMany(() => Column)
  column: Column[];
}
