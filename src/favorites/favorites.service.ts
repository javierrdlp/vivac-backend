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

  // Listar todos los vivacs favoritos del usuario
  async getAllFavoriteVivacs(userId: string) {
    const favorites = await this.favoriteRepo.find({
      where: { userId },
      relations: ['vivac'],
      order: { createdAt: 'DESC' },
    });

    return favorites.map(fav => fav.vivac);
  }

  // Crear carpeta
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

  // Listar carpetas
  async getUserFolders(userId: string) {
    return await this.folderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Eliminar carpeta
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

  // Añadir vivac a favoritos
  async addFavorite(userId: string, folderId: string, vivacId: string) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, userId },
    });

    if (!folder) throw new NotFoundException('Carpeta no encontrada');

    const vivac = await this.vivacRepo.findOne({ where: { id: vivacId } });
    if (!vivac) throw new NotFoundException('Vivac no encontrado');

    // Evitar duplicados por usuario (aunque intente meterlo en otra carpeta)
    const exists = await this.favoriteRepo.findOne({
      where: { userId, vivacId },
    });

    if (exists) {
      throw new ConflictException('Este vivac ya está en favoritos');
    }

    const favorite = this.favoriteRepo.create({
      userId,
      folderId,
      vivacId,
    });

    return await this.favoriteRepo.save(favorite);
  }

  // Eliminar favorito
  async removeFavorite(userId: string, favoriteId: string) {
    const fav = await this.favoriteRepo.findOne({
      where: { id: favoriteId, userId },
    });

    if (!fav) throw new NotFoundException('Favorito no encontrado');

    await this.favoriteRepo.remove(fav);
    return { message: 'Eliminado de favoritos' };
  }

  // Listar favoritos de una carpeta
  async getFavoritesInFolder(userId: string, folderId: string) {
    // Asegurar que la carpeta es del usuario
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, userId },
    });

    if (!folder) throw new NotFoundException('Carpeta no encontrada');

    // Traer favoritos de esa carpeta (y que además sean del usuario)
    return await this.favoriteRepo.find({
      where: { folderId, userId },
      relations: ['vivac'],
      order: { createdAt: 'DESC' },
    });
  }

  // Mover favorito a otra carpeta
  async moveFavorite(userId: string, favoriteId: string, newFolderId: string) {
    // Asegurar que el favorito pertenece al usuario
    const favorite = await this.favoriteRepo.findOne({
      where: { id: favoriteId, userId },
    });

    if (!favorite) throw new NotFoundException('Favorito no encontrado');

    // Asegurar que la carpeta destino es del usuario
    const newFolder = await this.folderRepo.findOne({
      where: { id: newFolderId, userId },
    });

    if (!newFolder) throw new NotFoundException('Carpeta destino no encontrada');

    favorite.folderId = newFolderId;
    return await this.favoriteRepo.save(favorite);
  }

   // Eliminar favorito por vivacId
  async removeFavoriteByVivacId(userId: string, vivacId: string) {
    const fav = await this.favoriteRepo.findOne({
      where: { userId, vivacId },
    });

    if (!fav) throw new NotFoundException('Favorito no encontrado');

    await this.favoriteRepo.remove(fav);
    return { message: 'Eliminado de favoritos' };
  }

}
