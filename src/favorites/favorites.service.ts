import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteFolder } from 'src/entities/favorite-folder.entity';
import { UserFavorite } from 'src/entities/user-favorite.entity';
import { VivacPoint } from '../entities/vivac-point.entity';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FavoritesService {

  constructor(
    @InjectRepository(FavoriteFolder)
    private folderRepo: Repository<FavoriteFolder>,

    @InjectRepository(UserFavorite)
    private favoriteRepo: Repository<UserFavorite>,

    @InjectRepository(VivacPoint)
    private vivacRepo: Repository<VivacPoint>,
  ) { }

  // Carpetas
  async createFolder(userId: string, dto: CreateFolderDto) {
    const exists = await this.folderRepo.findOne({
      where: { userId, name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Ya existe una carpeta con ese nombre');
    }

    const folder = this.folderRepo.create({
      name: dto.name,
      userId,
    });

    return await this.folderRepo.save(folder);
  }

  async getUserFolders(userId: string) {
    return await this.folderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteFolder(userId: string, folderId: string) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, userId },
    });

    if (!folder) {
      throw new NotFoundException('Carpeta no encontrada');
    }

    await this.folderRepo.remove(folder);
    return { message: 'Carpeta eliminada' };
  }

  // Favoritos
  async addFavorite(userId: string, folderId: string, vivacId: string) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, userId },
    });

    if (!folder) throw new NotFoundException('Carpeta no encontrada');

    const vivac = await this.vivacRepo.findOne({ where: { id: vivacId } });
    if (!vivac) throw new NotFoundException('Vivac no encontrado');

    const exists = await this.favoriteRepo.findOne({
      where: {
        folderId,
        vivacId,
      },
    });

    if (exists) {
      throw new ConflictException('Este vivac ya está en la carpeta');
    }

    const favorite = this.favoriteRepo.create({
      folderId,
      vivacId,
    });

    return await this.favoriteRepo.save(favorite);
  }

  async removeFavorite(favoriteId: string) {
    const fav = await this.favoriteRepo.findOne({
      where: { id: favoriteId },
    });

    if (!fav) throw new NotFoundException('Favorito no encontrado');

    await this.favoriteRepo.remove(fav);
    return { message: 'Eliminado de favoritos' };
  }

  async getFavoritesInFolder(userId: string, folderId: string) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, userId },
    });

    if (!folder) throw new NotFoundException('Carpeta no encontrada');

    return await this.favoriteRepo.find({
      where: { folderId },
      relations: ['vivac'],
      order: { createdAt: 'DESC' },
    });
  }

  // Mover favorito
  async moveFavorite(userId: string, favoriteId: string, newFolderId: string) { 
    const favorite = await this.favoriteRepo.findOne({
      where: { id: favoriteId },
    });

    if (!favorite) throw new NotFoundException('Favorito no encontrado');
   
    const newFolder = await this.folderRepo.findOne({
      where: { id: newFolderId, userId },
    });

    if (!newFolder) throw new NotFoundException('Carpeta destino no encontrada');
    
    favorite.folderId = newFolderId;
   
    return await this.favoriteRepo.save(favorite);
  }

}
