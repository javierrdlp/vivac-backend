import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { UserGroup } from './user-group.entity';
import { GroupMessage } from './group-message.entity';

@Entity()
@Check(`length("name") > 0`)
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true, length: 2048 })
  photoUrl?: string;

  @Column({ default: false })
  isPrivate: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.groupsCreated, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => UserGroup, (ug) => ug.group)
  memberships: UserGroup[];

  @OneToMany(() => GroupMessage, (msg) => msg.group)
  messages: GroupMessage[];
}

