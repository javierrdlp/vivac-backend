import { ApiProperty } from '@nestjs/swagger';

export class FollowUserProfileDto {
  @ApiProperty({
    example: 'c3df2f1a-4d1a-4b2e-9b7c-123456789abc',
    description: 'Identificador único del usuario',
  })
  id: string;

  @ApiProperty({
    example: 'JaviMountains',
    description: 'Nombre de usuario visible en la plataforma',
  })
  userName: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../avatar.png',
    description: 'URL del avatar del usuario (si tiene)',
    nullable: true,
  })
  avatarUrl?: string | null;
}

