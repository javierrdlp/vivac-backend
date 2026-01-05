import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { FavoriteFolder } from './favorite-folder.entity';
import { VivacPoint } from './vivac-point.entity';

@Entity()
@Unique(['userId', 'vivacId'])
export class UserFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; 

  @ManyToOne(() => FavoriteFolder, folder => folder.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folderId' })
  folder: FavoriteFolder;

  @Column()
  folderId: string;

  @ManyToOne(() => VivacPoint, vivac => vivac.favoritedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vivacId' })
  vivac: VivacPoint;

  @Column()
  vivacId: string;

  @CreateDateColumn()
  createdAt: Date;
}