import { ApiProperty } from '@nestjs/swagger';

export class UserProfileFollowInfoDto {
  @ApiProperty()
  followersCount: number;

  @ApiProperty()
  followingCount: number;

  @ApiProperty()
  isFollowedByCurrentUser: boolean;
}
