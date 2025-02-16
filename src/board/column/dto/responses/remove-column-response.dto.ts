import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RemoveColumnResponseDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Remove a column from the board',
  })
  message: string;
}
