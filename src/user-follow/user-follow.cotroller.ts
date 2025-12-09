import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserFollowService } from './user-follow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { FollowerItemDto } from './dto/follower-item.dto';
import { FollowingItemDto } from './dto/following-item.dto';


@ApiTags('User Follow')
@Controller('users')
export class UserFollowController {
  constructor(private readonly followService: UserFollowService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':targetId/follow')
  @ApiOperation({ summary: 'Seguir a un usuario' })
  follow(@Req() req, @Param('targetId') targetId: string) {
    return this.followService.followUser(req.user.id, targetId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':targetId/unfollow')
  @ApiOperation({ summary: 'Dejar de seguir a un usuario' })
  unfollow(@Req() req, @Param('targetId') targetId: string) {
    return this.followService.unfollowUser(req.user.id, targetId);
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: 'Lista de seguidores' })
  @ApiOkResponse({ type: FollowerItemDto, isArray: true })
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Lista de usuarios seguidos' })
  @ApiOkResponse({ type: FollowingItemDto, isArray: true })
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }
}
