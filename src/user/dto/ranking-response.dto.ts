import { ApiProperty } from '@nestjs/swagger';

class RankingUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userName: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty()
  userExperience: string;

  @ApiProperty()
  xpPoints: number;

  @ApiProperty()
  vivacsCreated: number;

  @ApiProperty()
  reviewsWritten: number;
}

export class RankingResponseDto {
  @ApiProperty({ example: 1250 })
  position: number;

  @ApiProperty({ example: 230 })
  userXp: number;

  @ApiProperty({ type: [RankingUserDto] })
  top100: RankingUserDto[];
}
