import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VivacPoint } from '../entities/vivac-point.entity';
import { CreateVivacDto } from './dto/create-vivac.dto';
import { UpdateVivacDto } from './dto/update-vivac.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class VivacService {
  constructor(
    @InjectRepository(VivacPoint)
    private vivacRepository: Repository<VivacPoint>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Crear vivac
  async create(dto: CreateVivacDto, userId: string): Promise<VivacPoint> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const vivac = this.vivacRepository.create({
      ...dto,
      createdBy: user,
    });
    return await this.vivacRepository.save(vivac);
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
  async findOne(id: string): Promise<VivacPoint> {
    const vivac = await this.vivacRepository.findOne({
      where: { id },
      relations: ['createdBy', 'ratings'],
    });
    if (!vivac) throw new NotFoundException('Vivac not found');
    return vivac;
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

    await this.vivacRepository.remove(vivac);
  }

  // Vivacs creados por usuario
  async findByUser(userId: string): Promise<VivacPoint[]> {
    return await this.vivacRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'ratings'],
    });
  }

  // Añadir foto — solo el creador puede hacerlo
  async addPhoto(vivacId: string, photoUrl: string, userId: string): Promise<VivacPoint> {
    const vivac = await this.vivacRepository.findOne({
      where: { id: vivacId },
      relations: ['createdBy'],
    });
    if (!vivac) throw new NotFoundException('Vivac not found');

    if (vivac.createdBy.id !== userId) {
      throw new ForbiddenException('No tienes permiso para añadir fotos a este vivac');
    }

    vivac.photoUrls = vivac.photoUrls ? [...vivac.photoUrls, photoUrl] : [photoUrl];
    return await this.vivacRepository.save(vivac);
  }

  // Eliminar foto — solo el creador puede hacerlo
  async removePhoto(vivacId: string, imageUrl: string, userId: string): Promise<VivacPoint> {
    const vivac = await this.vivacRepository.findOne({
      where: { id: vivacId },
      relations: ['createdBy'],
    });
    if (!vivac) throw new NotFoundException('Vivac not found');

    if (vivac.createdBy.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar fotos de este vivac');
    }

    if (!vivac.photoUrls || !vivac.photoUrls.includes(imageUrl)) {
      throw new NotFoundException('Image not found in vivac');
    }

    vivac.photoUrls = vivac.photoUrls.filter(url => url !== imageUrl);
    return await this.vivacRepository.save(vivac);
  }
}

