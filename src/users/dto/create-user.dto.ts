import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'matt.rogers@gmail.com',
    description: 'User email',
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'newPaswword123',
    description: 'User password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
