import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Achievement } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';
import { User } from '../entities/user.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';

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

  /**
   * Desbloquea un logro para un usuario.
   */
  async unlockAchievement(userId: string, achievementName: string) {
    // 1. Usuario
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // 2. Logro
    const achievement = await this.achievementRepo.findOne({
      where: { name: achievementName },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');

    // 3. ¿Ya lo tiene?
    const already = await this.userAchievementRepo.findOne({
      where: {
        user: { id: userId },
        achievement: { id: achievement.id },
      },
    });

    if (already) return null; // Nada que hacer ⇒ ya lo tenía

    // 4. Registrar el logro
    const userAchievement = this.userAchievementRepo.create({
      user,
      achievement,
    });

    await this.userAchievementRepo.save(userAchievement);

    // 5. Sumar XP del logro
    user.xpPoints = (user.xpPoints || 0) + achievement.xpReward;
    await this.userRepo.save(user);

    return userAchievement;
  }

  /**
   * Devuelve todos los logros disponibles.
   */
  async getAllAchievements() {
    return this.achievementRepo.find({
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Devuelve los logros desbloqueados por un usuario.
   */
  async getUserAchievements(userId: string) {
    return this.userAchievementRepo.find({
      where: { user: { id: userId } },
      relations: ['achievement'],
      order: { unlockedAt: 'ASC' },
    });
  }

  async createAchievement(dto: CreateAchievementDto) {
  const achievement = this.achievementRepo.create(dto);
  return this.achievementRepo.save(achievement);
}
}
