import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VivacPoint } from '../entities/vivac-point.entity';
import { User } from '../entities/user.entity';
import { VivacService } from './vivac.service';
import { VivacController } from './vivac.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AchievementModule } from '../achievements/achievement.module';
import { UserFollowModule } from '../user-follow/user-follow.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([VivacPoint, User]),
    CloudinaryModule, AchievementModule, UserFollowModule
  ],
  controllers: [VivacController],
  providers: [VivacService],
})
export class VivacModule {}

