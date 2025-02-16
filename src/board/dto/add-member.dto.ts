import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({
    example: 5,
    description: 'ID of the user to add to the board',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
