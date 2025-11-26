import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';
import { User } from '../entities/user.entity';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, UserAchievement, User]),
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
