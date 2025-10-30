import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Check,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name'])
@Check(`"xpReward" >= 0`)
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; 

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true, length: 2048 })
  iconUrl?: string; 

  @Column({ type: 'int', default: 0 })
  xpReward: number; 

  @CreateDateColumn()
  createdAt: Date;
}

