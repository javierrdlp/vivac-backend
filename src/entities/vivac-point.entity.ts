import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Rating } from './rating.entity';

import { AccessDifficulty } from '../enums/access-difficulty.enum';
import { Environment } from '../enums/environment.enum';
import { Privacity } from '../enums/privacity.enum';
import { TerrainType } from '../enums/terrain-type.enum';

@Entity()
@Check(`"latitude" BETWEEN -90 AND 90`)
@Check(`"longitude" BETWEEN -180 AND 180`)
export class VivacPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'int', nullable: true })
  elevation?: number;

  @Column({ type: 'enum', enum: AccessDifficulty, default: AccessDifficulty.EASY })
  accessDifficulty: AccessDifficulty;

  @Column({ type: 'enum', enum: Environment, nullable: true })
  environment?: Environment;

  @Column({ type: 'enum', enum: Privacity, nullable: true })
  privacity?: Privacity;

  @Column({ type: 'enum', enum: TerrainType, nullable: true })
  terrainType?: TerrainType;

  @Column('text', { array: true, nullable: true })
  photoUrls?: string[];

  @Column({ type: 'boolean', default: false })
  petFriendly: boolean;

  @Column({ type: 'float', nullable: true })
  avgRating?: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @ManyToOne(() => User, (user) => user.vivacs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => Rating, (rating) => rating.vivacPoint)
  ratings: Rating[];

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

