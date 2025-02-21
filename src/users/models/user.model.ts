import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Board } from '../../board/models/board.model';

@Table
export class User extends Model<User> {
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
  lastName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Board)
  column: Board[];
}
