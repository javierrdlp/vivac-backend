import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFollow } from '../entities/user-follow.entity';
import { User } from '../entities/user.entity';
import { FollowerItemDto } from './dto/follower-item.dto';
import { FollowingItemDto } from './dto/following-item.dto';
import { FollowUserProfileDto } from './dto/follow-user-profile.dto';


@Injectable()
export class UserFollowService {
  constructor(
    @InjectRepository(UserFollow)
    private readonly followRepo: Repository<UserFollow>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  // Seguir a un usario
  async followUser(followerId: string, targetId: string) {
    if (followerId === targetId) {
      throw new BadRequestException('No puedes seguirte a ti mismo.');
    }

    const follower = await this.userRepo.findOne({ where: { id: followerId } });
    const followed = await this.userRepo.findOne({ where: { id: targetId } });

    if (!follower || !followed) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const exists = await this.followRepo.findOne({
      where: { followerId, followedId: targetId },
    });

    if (exists) {
      throw new BadRequestException('Ya sigues a este usuario.');
    }

    const relation = this.followRepo.create({ follower, followed });
    return this.followRepo.save(relation);
  }

  // Dejar de seguir

  async unfollowUser(followerId: string, targetId: string) {
    const relation = await this.followRepo.findOne({
      where: { followerId, followedId: targetId },
    });

    if (!relation) {
      throw new NotFoundException('No sigues a este usuario.');
    }

    return this.followRepo.remove(relation);
  }

  // Lista de seguidores
  async getFollowers(userId: string): Promise<FollowerItemDto[]> {
    const relations = await this.followRepo.find({
      where: { followedId: userId },
      relations: ['follower'],
      select: {
        id: true,
        createdAt: true,
        follower: {
          id: true,
          userName: true,
          avatarUrl: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    return relations.map((rel) => {
      const profile: FollowUserProfileDto = {
        id: rel.follower.id,
        userName: rel.follower.userName,
        avatarUrl: rel.follower.avatarUrl ?? null,
      };

      const dto: FollowerItemDto = {
        id: rel.id,
        createdAt: rel.createdAt,
        follower: profile,
      };

      return dto;
    });
  }

  // Lista de seguidos

  async getFollowing(userId: string): Promise<FollowingItemDto[]> {
    const relations = await this.followRepo.find({
      where: { followerId: userId },
      relations: ['followed'],
      select: {
        id: true,
        createdAt: true,
        followed: {
          id: true,
          userName: true,
          avatarUrl: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    return relations.map((rel) => {
      const profile: FollowUserProfileDto = {
        id: rel.followed.id,
        userName: rel.followed.userName,
        avatarUrl: rel.followed.avatarUrl ?? null,
      };

      const dto: FollowingItemDto = {
        id: rel.id,
        createdAt: rel.createdAt,
        followed: profile,
      };

      return dto;
    });
  }

  // Contadores

  async followersCount(userId: string): Promise<number> {
    return this.followRepo.count({ where: { followedId: userId } });
  }

  async followingCount(userId: string): Promise<number> {
    return this.followRepo.count({ where: { followerId: userId } });
  }

  // Sigo al usuario actual?
  async isFollowedByCurrentUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<boolean> {
    if (!currentUserId) return false;

    const exists = await this.followRepo.findOne({
      where: { followerId: currentUserId, followedId: targetUserId },
    });

    return !!exists;
  }
}
