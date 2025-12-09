import { ApiProperty } from '@nestjs/swagger';
import { FollowUserProfileDto } from './follow-user-profile.dto';

export class FollowerItemDto {
  @ApiProperty({
    example: 'f1b2c3d4-0000-1111-2222-333344445555',
    description: 'Identificador de la relación de seguimiento',
  })
  id: string;

  @ApiProperty({
    example: '2025-12-02T10:15:30.000Z',
    description: 'Fecha en la que este usuario empezó a seguir al otro',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Usuario que sigue (el seguidor)',
    type: FollowUserProfileDto,
  })
  follower: FollowUserProfileDto;
}

