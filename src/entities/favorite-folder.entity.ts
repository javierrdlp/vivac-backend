import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { UserFavorite } from './user-favorite.entity';

@Entity()
@Unique(['user', 'name'])
export class FavoriteFolder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => User, user => user.favoriteFolders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => UserFavorite, fav => fav.folder)
  favorites: UserFavorite[];

  @CreateDateColumn()
  createdAt: Date;
}
