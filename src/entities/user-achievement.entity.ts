import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Achievement } from './achievement.entity';

@Entity()
@Unique(['user', 'achievement']) 
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.achievementsUnlocked, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Achievement, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  achievement: Achievement;

  @CreateDateColumn()
  unlockedAt: Date; 
}

