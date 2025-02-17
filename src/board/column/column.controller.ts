import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  ParseIntPipe,
  Get,
  Patch,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Column } from './models/Column.model';
import { CreateColumnDto } from './dto/create-column.dto';
import { RemoveColumnResponseDto } from './dto/responses/remove-column-response.dto';
import { ColumnService } from './column.service';
import { BoardMemberGuard } from '../guards/board-member.guard';

@Controller('board/:id/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Create a new column' })
  @ApiResponse({
    status: 201,
    description: 'The column has been successfully created.',
    type: Column,
  })
  create(@Param('id', ParseIntPipe) id: number, @Body() body: CreateColumnDto) {
    return this.columnService.create(id, body.name);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Get all columns for a specific board' })
  @ApiResponse({
    status: 200,
    description: 'column of all columns',
    type: Column,
    isArray: true,
  })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.columnService.findAll(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Get a specific column' })
  @ApiResponse({
    status: 200,
    description: 'The requested column',
    type: Column,
  })
  @ApiResponse({ status: 404, description: 'column not found' })
  findOne(@Param('id', ParseIntPipe) columnId: number) {
    return this.columnService.findOne(columnId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully updated.',
    type: Column,
  })
  update(
    @Param('id', ParseIntPipe) columnId: number,
    @Body() body: CreateColumnDto,
  ) {
    return this.columnService.update(columnId, body.name);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully deleted.',
    type: RemoveColumnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'column not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.columnService.remove(id);
  }
}
