import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'In  progress',
    description: 'The new name of the column',
    required: true,
  })
  name: string;
}
