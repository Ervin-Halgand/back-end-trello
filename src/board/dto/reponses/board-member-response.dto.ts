import { ApiProperty } from '@nestjs/swagger';

export class BoardMemberResponseDto {
  @ApiProperty({ description: 'The ID of the board', example: 1 })
  boardId: number;

  @ApiProperty({
    description: 'The ID of the user who is a member of the board',
    example: 5,
  })
  userId: number;
}
