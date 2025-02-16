import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoardMembers } from './models/boardMembers.model';
import { Board } from './models/board.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

import { PermissionService } from './services/permission.service';
import { Module } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
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
  providers: [BoardService, PermissionService, ColumnService],
  exports: [BoardService],
})
export class BoardModule {}
