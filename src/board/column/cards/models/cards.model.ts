import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Column as ColumnModel } from '../../models/Column.model';
import { User } from '../../../../users/models/user.model';

@Table
export class Cards extends Model<Cards> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => ColumnModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  columnId: ColumnModel;

  @BelongsTo(() => ColumnModel)
  column: ColumnModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  assignedUserId: User;

  @BelongsTo(() => User)
  user: User;
}
