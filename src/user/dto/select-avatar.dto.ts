import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SelectAvatarDto {
  @ApiProperty({
    example: 'avatar_1.png',
    description: 'Nombre del avatar elegido por el usuario. Debe existir en la galería.',
  })
  @IsString()
  avatar: string;
}
