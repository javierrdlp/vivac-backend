import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteFolder } from 'src/entities/favorite-folder.entity';
import { UserFavorite } from 'src/entities/user-favorite.entity';
import { VivacPoint } from '../entities/vivac-point.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteFolder,
      UserFavorite,
      VivacPoint,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
