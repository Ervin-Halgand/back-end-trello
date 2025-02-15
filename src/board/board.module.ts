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

@Module({
  imports: [
    SequelizeModule.forFeature([Board, BoardMembers, User]),
    UsersModule,
    AuthModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, PermissionService],
  exports: [BoardService],
})
export class BoardModule {}
