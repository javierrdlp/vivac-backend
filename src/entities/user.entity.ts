import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { VivacPoint } from './vivac-point.entity';
import { UserAchievement } from './user-achievement.entity';
import { UserFollow } from './user-follow.entity';
import { Rating } from './rating.entity';
import { Group } from './group.entity';
import { UserGroup } from './user-group.entity';
import { GroupMessage } from './group-message.entity';
import { UserExperience } from '../enums/user-experience.enum';
import { UserSession } from '../auth/entities/user-session.entity';
import { FavoriteFolder } from './favorite-folder.entity';


@Entity()
@Check(`"xpPoints" >= 0`)
@Check(`"vivacsCreated" >= 0`)
@Check(`"reviewsWritten" >= 0`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 50,
    transformer: {
      to: (v?: string) => v?.trim(),
      from: (v: string) => v,
    },
  })
  userName: string;

  @Column({
    unique: true,
    length: 254,
    transformer: {
      to: (v?: string) => v?.trim().toLowerCase(),
      from: (v: string) => v,
    },
  })
  email: string;
  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId?: string;

  @Column({ select: false, length: 255, nullable: true })
  passwordHash?: string;

  @Column({ nullable: true, length: 2048 })
  avatarUrl?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({
    type: 'enum',
    enum: UserExperience,
    default: UserExperience.BEGINNER,
  })
  userExperience: UserExperience;

  @Column({ default: 0 })
  xpPoints: number;

  @Column({ default: 0 })
  vivacsCreated: number;

  @Column({ default: 0 })
  reviewsWritten: number;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => VivacPoint, (vivac) => vivac.createdBy)
  vivacs: VivacPoint[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => UserAchievement, (ua) => ua.user)
  achievementsUnlocked: UserAchievement[];

  @OneToMany(() => UserFollow, (uf) => uf.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, (uf) => uf.followed)
  followers: UserFollow[];

  @OneToMany(() => UserGroup, (ug) => ug.user)
  groups: UserGroup[];

  @OneToMany(() => GroupMessage, (msg) => msg.sender)
  messagesSent: GroupMessage[];

  @OneToMany(() => Group, (group) => group.createdBy)
  groupsCreated: Group[];

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @OneToMany(() => FavoriteFolder, folder => folder.user)
  favoriteFolders: FavoriteFolder[];

}
