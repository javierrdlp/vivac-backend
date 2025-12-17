import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '../entities/rating.entity';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { VivacPoint } from '../entities/vivac-point.entity';
import { User } from '../entities/user.entity';
import { AchievementModule } from '../achievements/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating, VivacPoint, User]),
    AchievementModule
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
