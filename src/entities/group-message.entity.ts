import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity()
@Index(['group', 'createdAt'])
export class GroupMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messagesSent, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => Group, (group) => group.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  group: Group;

  // Si este mensaje es una respuesta a otro
  @ManyToOne(() => GroupMessage, { nullable: true, onDelete: 'SET NULL' })
  parentMessage?: GroupMessage;
}

