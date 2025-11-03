import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';
import { User } from '../../entities/user.entity'

@Entity('user_session')
@Index(['refreshToken'], { unique: true })
@Index(['user'])
@Index(['revoked', 'expiresAt'])
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;
  
  @Column()
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  lastUsedAt: Date;

  @Column({ default: false })
  revoked: boolean;
}
