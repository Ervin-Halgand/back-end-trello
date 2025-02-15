import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Project X',
    description: 'Title of the board',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  title: string;
}
