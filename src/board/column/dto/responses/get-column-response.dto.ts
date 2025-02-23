import { ApiProperty } from '@nestjs/swagger';

export class GetColumnResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Unique identifier of the requested board',
    example: 1,
  })
  boardId: number;

  @ApiProperty({
    description: 'The name of the column',
    example: 'To do',
  })
  name: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-02-15T14:00:00Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2025-02-16T14:00:00Z',
    required: false,
  })
  updatedAt?: Date;
}
