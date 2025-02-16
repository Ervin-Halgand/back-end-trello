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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BoardResponseDto } from './dto/reponses/board-response.dto';
import { DeleteResponseDto } from './dto/reponses/delete-response.dto';
import { BoardMemberResponseDto } from './dto/reponses/board-member-response.dto';

@ApiTags('Boards')
@ApiBearerAuth()
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({
    status: 201,
    description: 'Board created successfully',
    type: BoardResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createBoardDto: CreateBoardDto,
    @Req() payload: AuthenticatedRequest,
  ): Promise<BoardResponseDto> {
    return this.boardService.create(createBoardDto, payload.user.id);
  }

  @Post(':id/member')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a member to a board' })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully',
    type: BoardMemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Board or user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  addMember(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() addMember: AddMemberDto,
    @Req() payload: AuthenticatedRequest,
  ): Promise<BoardMemberResponseDto> {
    return this.boardService.addMember(
      boardId,
      addMember.userId,
      payload.user.id,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all boards of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of boards retrieved successfully',
    type: BoardResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Req() payload: AuthenticatedRequest): Promise<BoardResponseDto[]> {
    return this.boardService.findAll(payload.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a board by ID' })
  @ApiResponse({
    status: 200,
    description: 'Board found',
    type: BoardResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(
    @Param('id', ParseIntPipe) boardId: number,
    @Req() payload: AuthenticatedRequest,
  ): Promise<BoardResponseDto> {
    return this.boardService.findOne(boardId, payload.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a board' })
  @ApiResponse({
    status: 200,
    description: 'Board deleted successfully',
    type: DeleteResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Only the creator can delete the board',
  })
  removeBoard(
    @Param('id', ParseIntPipe) boardId: number,
    @Req() payload: AuthenticatedRequest,
  ): Promise<DeleteResponseDto> {
    return this.boardService.removeBoard(boardId, payload.user.id);
  }

  @Delete(':id/member/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remove a member from a board' })
  @ApiResponse({
    status: 200,
    description: 'Member removed successfully',
    example: 'Member 15 successfully deleted from board X',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  removeMember(
    @Param('id', ParseIntPipe) boardId: number,
    @Param('userId', ParseIntPipe) userIdToRemove: number,
    @Req() payload: AuthenticatedRequest,
  ): Promise<DeleteResponseDto> {
    return this.boardService.removeMember(
      boardId,
      userIdToRemove,
      payload.user.id,
    );
  }
}
