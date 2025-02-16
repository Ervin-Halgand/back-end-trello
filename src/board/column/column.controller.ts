import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Delete,
  ParseIntPipe,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../common/types/authenticated_request.type';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Column } from './models/Column.model';
import { CreateColumnDto } from './dto/create-column.dto';
import { RemoveColumnResponseDto } from './dto/responses/remove-column-response.dto';
import { ColumnService } from './column.service';

@Controller('board/:boardId/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new column' })
  @ApiResponse({
    status: 201,
    description: 'The column has been successfully created.',
    type: Column,
  })
  create(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Req() payload: AuthenticatedRequest,
    @Body() body: CreateColumnDto,
  ) {
    return this.columnService.create(boardId, payload.user.id, body.name);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all columns for a specific board' })
  @ApiResponse({
    status: 200,
    description: 'column of all columns',
    type: Column,
    isArray: true,
  })
  findAll(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.columnService.findAll(boardId, payload.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a specific column' })
  @ApiResponse({
    status: 200,
    description: 'The requested column',
    type: Column,
  })
  @ApiResponse({ status: 404, description: 'column not found' })
  findOne(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('id', ParseIntPipe) columnId: number,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.columnService.findOne(columnId, boardId, payload.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully updated.',
    type: Column,
  })
  update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('id', ParseIntPipe) columnId: number,
    @Body() body: CreateColumnDto,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.columnService.update(
      columnId,
      boardId,
      payload.user.id,
      body.name,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully deleted.',
    type: RemoveColumnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'column not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('boardId') boardId: number,
    @Req() payload: AuthenticatedRequest,
  ) {
    return this.columnService.remove(id, boardId, payload.user.id);
  }
}
