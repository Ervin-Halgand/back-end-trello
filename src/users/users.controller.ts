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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/common/types/authenticated_request.type';
import { UserResponseDto } from './dto/responses/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' }) // Describes the action
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User already exists.',
  })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findOne(@Req() payload: AuthenticatedRequest) {
    return this.usersService.findOne(payload.user.id);
  }

  @ApiBearerAuth()
  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update the user details' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  update(
    @Req() payload: AuthenticatedRequest,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(payload.user.id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete the  user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  remove(@Req() payload: AuthenticatedRequest) {
    return this.usersService.remove(payload.user.id);
  }
}
