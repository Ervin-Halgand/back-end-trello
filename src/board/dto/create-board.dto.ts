import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: 'project X',
    description: 'name of the board',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}
