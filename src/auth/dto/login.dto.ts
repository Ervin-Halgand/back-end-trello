import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoidGVzdDBAZ21haWwuY29tIiwiaWF0IjoxNzM5MjA3MTYyLCJleHAiOjE3MzkyMDcyMjJ9.pT5iaB8qob2o4O1qVqvUzg8Wbyz0DiLvxszDNhMOiS4',
    description: 'API bearer token',
  })
  readonly accessToken: string;
}
