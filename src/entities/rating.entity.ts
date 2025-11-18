import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { VivacPoint } from './vivac-point.entity';

@Entity()
@Unique(['userId', 'vivacPointId'])
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  // FK del usuario
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  // FK del vivac
  @Column()
  vivacPointId: string;

  @ManyToOne(() => VivacPoint, (vivac) => vivac.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vivacPointId' })
  vivacPoint: VivacPoint;
}




