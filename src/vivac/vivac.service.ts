import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VivacPoint } from '../entities/vivac-point.entity';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { User } from '../entities/user.entity';
import { AchievementService } from '../achievements/achievement.service';
import { UserFollowService } from 'src/user-follow/user-follow.service';

@Injectable()
export class VivacService {
  constructor(
    @InjectRepository(VivacPoint)
    private vivacRepository: Repository<VivacPoint>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly achievementService: AchievementService,

    private readonly userFollowService: UserFollowService,
  ) { }

  // Crear vivac
  async create(dto: CreateVivacDto, userId: string): Promise<VivacPoint> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const vivac = this.vivacRepository.create({
      ...dto,
      createdBy: user,
    });

    await this.vivacRepository.save(vivac);

    // contador de vivacs creados
    user.vivacsCreated = (user.vivacsCreated || 0) + 1;

    // xp base por crear un vivac
    const XP_POR_VIVAC = 5;
    user.xpPoints += XP_POR_VIVAC;

    await this.userRepository.save(user);

    // logros de vivacs creados
    await this.achievementService.unlockAchievement(user.id, 'Primer Vivac');

    if (user.vivacsCreated >= 5) await this.achievementService.unlockAchievement(user.id, '5 Vivacs');
    if (user.vivacsCreated >= 25) await this.achievementService.unlockAchievement(user.id, '25 Vivacs');
    if (user.vivacsCreated >= 50) await this.achievementService.unlockAchievement(user.id, '50 Vivacs');
    if (user.vivacsCreated >= 100) await this.achievementService.unlockAchievement(user.id, '100 Vivacs');
    if (user.vivacsCreated >= 150) await this.achievementService.unlockAchievement(user.id, '150 Vivacs');
    if (user.vivacsCreated >= 200) await this.achievementService.unlockAchievement(user.id, '200 Vivacs');

    return vivac;
  }

  // Buscar vivacs con filtros
  async findAll(filters: any): Promise<VivacPoint[]> {
    const query = this.vivacRepository
      .createQueryBuilder('vivac')
      .leftJoinAndSelect('vivac.createdBy', 'user');

    if (filters.privacity) {
      query.andWhere('vivac.privacity = :privacity', { privacity: filters.privacity });
    }

    if (filters.accessDifficulty) {
      query.andWhere('vivac.accessDifficulty = :accessDifficulty', {
        accessDifficulty: filters.accessDifficulty,
      });
    }

    if (filters.minElevation) {
      query.andWhere('vivac.elevation >= :minElevation', { minElevation: +filters.minElevation });
    }
    if (filters.maxElevation) {
      query.andWhere('vivac.elevation <= :maxElevation', { maxElevation: +filters.maxElevation });
    }

    // Filtro geográfico
    if (filters.lat && filters.lon && filters.radius) {
      const lat = parseFloat(filters.lat);
      const lon = parseFloat(filters.lon);
      const radiusKm = parseFloat(filters.radius);

      const adjustedRadiusKm = radiusKm * Math.SQRT2;
      const deltaLat = adjustedRadiusKm / 111;
      const deltaLon = adjustedRadiusKm / (111 * Math.cos((lat * Math.PI) / 180));

      query.andWhere(
        'vivac.latitude BETWEEN :minLat AND :maxLat AND vivac.longitude BETWEEN :minLon AND :maxLon',
        {
          minLat: lat - deltaLat,
          maxLat: lat + deltaLat,
          minLon: lon - deltaLon,
          maxLon: lon + deltaLon,
        },
      );
    }

    query.orderBy('vivac.createdAt', 'DESC');

    const candidates = await query.getMany();

    if (filters.lat && filters.lon && filters.radius) {
      const { lat, lon, radius } = filters;
      return candidates.filter(
        v => this.haversine(+v.latitude, +v.longitude, +lat, +lon) <= +radius,
      );
    }

    return candidates;
  }

  // Fórmula Haversine
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Obtener un vivac
  async findOne(id: string, currentUserId?: string): Promise<any> {
    const vivac = await this.vivacRepository.findOne({
      where: { id },
      relations: ['createdBy', 'ratings'],
    });

    if (!vivac) throw new NotFoundException('Vivac not found');

    // Follow status del creador
    const isFollowed =
      currentUserId
        ? await this.userFollowService.isFollowedByCurrentUser(
          currentUserId,
          vivac.createdBy.id
        )
        : false;

    return {
      ...vivac,
      createdBy: {
        ...vivac.createdBy,
        isFollowedByCurrentUser: isFollowed,
      },
    };
  }

  // Actualizar — solo el creador puede hacerlo
  async update(id: string, dto: UpdateVivacDto, userId: string): Promise<VivacPoint> {
    const vivac = await this.findOne(id);

    if (vivac.createdBy.id !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar este vivac');
    }

    Object.assign(vivac, dto);
    return await this.vivacRepository.save(vivac);
  }

  // Eliminar — solo el creador puede hacerlo
  async remove(id: string, userId: string): Promise<void> {
    const vivac = await this.findOne(id);

    if (vivac.createdBy.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este vivac');
    }

    // borrar vivac
    await this.vivacRepository.remove(vivac);

    // actualizar contador y xp del usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // bajar contador
    user.vivacsCreated = Math.max(0, (user.vivacsCreated || 0) - 1);

    // restar xp base del vivac eliminado
    const XP_POR_VIVAC = 5;
    user.xpPoints = Math.max(0, user.xpPoints - XP_POR_VIVAC);

    await this.userRepository.save(user);
  }

  // Vivacs creados por usuario
  async findByUser(userId: string): Promise<VivacPoint[]> {
    return await this.vivacRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'ratings'],
    });
  }

  // Añadir una o varias fotos — solo el creador puede hacerlo
  async addPhotos(vivacId: string, photoUrls: string[], userId: string): Promise<VivacPoint> {
    const vivac = await this.vivacRepository.findOne({
      where: { id: vivacId },
      relations: ['createdBy'],
    });
    if (!vivac) throw new NotFoundException('Vivac not found');

    if (vivac.createdBy.id !== userId) {
      throw new ForbiddenException('No tienes permiso para añadir fotos a este vivac');
    }

    vivac.photoUrls = [...(vivac.photoUrls || []), ...photoUrls];
    return await this.vivacRepository.save(vivac);
  }

  // Eliminar una o varias fotos — solo el creador puede hacerlo
  async removePhotos(vivacId: string, imageUrls: string[], userId: string): Promise<VivacPoint> {
    const vivac = await this.vivacRepository.findOne({
      where: { id: vivacId },
      relations: ['createdBy'],
    });
    if (!vivac) throw new NotFoundException('Vivac not found');

    if (vivac.createdBy.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar fotos de este vivac');
    }

    if (!vivac.photoUrls || vivac.photoUrls.length === 0) {
      throw new NotFoundException('El vivac no tiene fotos registradas');
    }

    vivac.photoUrls = vivac.photoUrls.filter(url => !imageUrls.includes(url));

    return await this.vivacRepository.save(vivac);
  }
}
