import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoardMembers } from './models/boardMembers.model';
import { Board } from './models/board.model';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

import { Module } from '@nestjs/common';
import { User } from '..//users/models/user.model';
import { ColumnController } from './column/column.controller';

import { ColumnService } from './column/column.service';
import { Column } from './column/models/Column.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Board, BoardMembers, User, Column]),
    UsersModule,
    AuthModule,
  ],
  controllers: [BoardController, ColumnController],
  providers: [BoardService, ColumnService],
  exports: [BoardService],
})
export class BoardModule {}
