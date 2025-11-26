import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Achievement } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,

    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // desbloqueo de logros
  async unlockAchievement(userId: string, achievementName: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const achievement = await this.achievementRepo.findOne({
      where: { name: achievementName },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');

    const already = await this.userAchievementRepo.findOne({
      where: {
        user: { id: userId },
        achievement: { id: achievement.id },
      },
    });

    if (already) return already;

    const userAchievement = this.userAchievementRepo.create({
      user,
      achievement,
    });

    await this.userAchievementRepo.save(userAchievement);

    user.xpPoints = (user.xpPoints || 0) + achievement.xpReward;
    await this.userRepo.save(user);

    return userAchievement;
  }

  // todos los logros
  async getAllAchievements() {
    return this.achievementRepo.find({
      order: { createdAt: 'ASC' },
    });
  }

  // logros desbloqueados del usuario
  async getUnlockedAchievements(userId: string) {
    return this.userAchievementRepo.find({
      where: { user: { id: userId } },
      relations: ['achievement'],
      order: { unlockedAt: 'ASC' },
    });
  }
}

