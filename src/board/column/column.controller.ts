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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreateColumnDto } from './dto/create-column.dto';
import { RemoveColumnResponseDto } from './dto/responses/remove-column-response.dto';
import { ColumnService } from './column.service';
import { BoardMemberGuard } from '../guards/board-member.guard';
import { GetColumnResponseDto } from './dto/responses/get-column-response.dto';

@ApiTags('Boards')
@ApiBearerAuth()
@ApiParam({ name: 'id', type: Number })
@Controller('board/:id/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Create a new column' })
  @ApiResponse({
    status: 201,
    description: 'The column has been successfully created.',
    type: GetColumnResponseDto,
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
    type: GetColumnResponseDto,
    isArray: true,
  })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.columnService.findAll(id);
  }

  @Get(':columnId')
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Get a specific column' })
  @ApiResponse({
    status: 200,
    description: 'The requested column',
    type: GetColumnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'column not found' })
  findOne(@Param('columnId', ParseIntPipe) columnId: number) {
    return this.columnService.findOne(columnId);
  }

  @Patch(':columnId')
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully updated.',
    type: GetColumnResponseDto,
  })
  update(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: CreateColumnDto,
  ) {
    return this.columnService.update(columnId, body.name);
  }

  @Delete(':columnId')
  @UseGuards(AuthGuard('jwt'), BoardMemberGuard)
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully deleted.',
    type: RemoveColumnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'column not found' })
  remove(@Param('columnId', ParseIntPipe) columnId: number) {
    return this.columnService.remove(columnId);
  }
}
