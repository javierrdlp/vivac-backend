import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { VivacPoint } from './vivac-point.entity';

@Entity()
@Unique(['user', 'vivacPoint'])
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number; // 1–5 estrellas

  @Column({ type: 'text', nullable: true })
  comment?: string; 

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.ratings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => VivacPoint, (vivac) => vivac.ratings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  vivacPoint: VivacPoint;
}



