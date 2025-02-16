import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'To do',
    description: 'The name of the column to create',
    required: true,
  })
  name: string;
}
