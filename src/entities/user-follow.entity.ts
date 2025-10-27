import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['follower', 'followed'])
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Usuario que sigue
  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @Column()
  followerId: string;

  // Usuario seguido
  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followedId' })
  followed: User;

  @Column()
  followedId: string;

  @CreateDateColumn()
  createdAt: Date;
}
