import { ApiProperty } from '@nestjs/swagger';

export class BoardResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the board',
    example: 1,
  })
  id: number;

  @ApiProperty({ description: 'The title of the board', example: 'Project X' })
  title: string;

  @ApiProperty({
    description: 'ID of the user who created the board',
    example: 10,
  })
  createdBy: number;
}
