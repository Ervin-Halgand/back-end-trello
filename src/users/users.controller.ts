import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ValidationPipe,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/common/types/authenticated_request.type';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a user' })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Req() payload: AuthenticatedRequest) {
    return this.usersService.findOne(payload.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a user' })
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() payload: AuthenticatedRequest,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(payload.user.id, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a user' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Req() payload: AuthenticatedRequest) {
    return this.usersService.remove(payload.user.id);
  }
}
