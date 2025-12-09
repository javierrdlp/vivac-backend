import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc5Nm...",
    description: "Google ID Token enviado por el frontend"
  })
  @IsString()
  idToken: string;
}
