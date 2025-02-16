import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'matt.rogers@gmail.com',
  })
  email: string;

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
