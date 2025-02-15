import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/common/types/authenticated_request.type';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createBoardDto: CreateBoardDto,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.boardService.create(createBoardDto, payload.user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() payload: AuthenticatedRequest) {
    return this.boardService.findAll(payload.user.id);
  }

  @Post(':id/member')
  @UseGuards(AuthGuard('jwt'))
  addMember(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() addMember: AddMemberDto,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.boardService.addMember(
      boardId,
      addMember.userId,
      payload.user.id,
    );
  }

  @Delete(':id/member/:userId')
  @UseGuards(AuthGuard('jwt'))
  removeMember(
    @Param('id', ParseIntPipe) boardId: number,
    @Param('userId', ParseIntPipe) userIdToRemove: number,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.boardService.removeMember(
      boardId,
      userIdToRemove,
      payload.user.id,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Param('id', ParseIntPipe) boardId: number,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.boardService.findOne(boardId, payload.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  removeBoard(
    @Param('id', ParseIntPipe) boardId: number,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.boardService.removeBoard(boardId, payload.user.id);
  }
}
