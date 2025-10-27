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
  name: string; // nombre único del logro

  @Column({ type: 'text', nullable: true })
  description?: string; // descripción opcional

  @Column({ nullable: true, length: 2048 })
  iconUrl?: string; // URL del icono o imagen del logro

  @Column({ type: 'int', default: 0 })
  xpReward: number; // puntos de experiencia otorgados

  @CreateDateColumn()
  createdAt: Date;
}

