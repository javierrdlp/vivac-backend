import { ApiProperty } from '@nestjs/swagger';
import { FollowUserProfileDto } from './follow-user-profile.dto';

export class FollowingItemDto {
  @ApiProperty({
    example: 'aabbccdd-0000-1111-2222-333344445555',
    description: 'Identificador de la relación de seguimiento',
  })
  id: string;

  @ApiProperty({
    example: '2025-12-02T10:15:30.000Z',
    description: 'Fecha en la que empezaste a seguir a este usuario',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Usuario al que sigues',
    type: FollowUserProfileDto,
  })
  followed: FollowUserProfileDto;
}

