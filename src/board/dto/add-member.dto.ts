import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({
    example: '20',
    description: 'list id of the user to add',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
