import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFollow } from '../entities/user-follow.entity';
import { User } from '../entities/user.entity';
import { UserFollowService } from './user-follow.service';
import { UserFollowController } from './user-follow.cotroller';

@Module({
  imports: [TypeOrmModule.forFeature([UserFollow, User])],
  controllers: [UserFollowController],
  providers: [UserFollowService],
  exports: [UserFollowService],
})
export class UserFollowModule {}
