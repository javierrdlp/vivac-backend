import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity()
@Unique(['user', 'group'])
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.groups, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Group, (group) => group.memberships, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  group: Group;

  @CreateDateColumn()
  joinedAt: Date;
}

