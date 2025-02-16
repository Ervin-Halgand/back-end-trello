import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({
    description: 'A confirmation message for the deletion',
    example: 'Board/User successfully deleted',
  })
  message: string;
}
