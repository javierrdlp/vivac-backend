import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { VivacPoint } from '../entities/vivac-point.entity';
import { User } from '../entities/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AchievementService } from '../achievements/achievement.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,

    @InjectRepository(VivacPoint)
    private readonly vivacRepo: Repository<VivacPoint>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly achievementService: AchievementService,
  ) {}

  async create(userId: string, dto: CreateRatingDto) {
    // buscar usuario y vivac
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const vivac = await this.vivacRepo.findOne({ where: { id: dto.vivacPointId } });
    if (!vivac) throw new NotFoundException('Vivac no encontrado');

    // evitar reseña duplicada
    const existing = await this.ratingRepo.findOne({
      where: { userId, vivacPointId: dto.vivacPointId },
    });

    if (existing) {
      throw new BadRequestException('Ya has valorado este vivac');
    }

    // crear reseña
    const rating = this.ratingRepo.create({
      rating: dto.rating,
      comment: dto.comment,
      userId,
      vivacPointId: dto.vivacPointId,
    });

    await this.ratingRepo.save(rating);

    // aumentar contador de reseñas del vivac
    await this.vivacRepo.increment({ id: dto.vivacPointId }, 'reviewCount', 1);

    // recalcular media del vivac
    await this.updateVivacAverage(dto.vivacPointId);

    // actualizar contador de reseñas del usuario en memoria
    user.reviewsWritten = (user.reviewsWritten || 0) + 1;

    // calcular xp base por reseña según longitud del comentario
    const texto = (rating.comment ?? '').toString().trim();
    const len = texto.length;

    let xpGanada = 0;
    if (len > 5 && len <= 30) xpGanada = 1;
    else if (len > 30) xpGanada = 2;

    // sumar xp al usuario
    user.xpPoints += xpGanada;

    // guardar cambios del usuario (xp + contador de reseñas)
    await this.userRepo.save(user);

    // comprobación de logros
    await this.achievementService.unlockAchievement(user.id, 'Primera Reseña');

    if (user.reviewsWritten >= 10) {
      await this.achievementService.unlockAchievement(user.id, '10 Reseñas');
    }
    if (user.reviewsWritten >= 25) {
      await this.achievementService.unlockAchievement(user.id, '25 Reseñas');
    }
    if (user.reviewsWritten >= 50) {
      await this.achievementService.unlockAchievement(user.id, '50 Reseñas');
    }
    if (user.reviewsWritten >= 100) {
      await this.achievementService.unlockAchievement(user.id, '100 Reseñas');
    }
    if (user.reviewsWritten >= 250) {
      await this.achievementService.unlockAchievement(user.id, '250 Reseñas');
    }
    if (user.reviewsWritten >= 500) {
      await this.achievementService.unlockAchievement(user.id, '500 Reseñas');
    }

    return rating;
  }

  async update(userId: string, id: string, dto: UpdateRatingDto) {
    // buscar reseña
    const rating = await this.ratingRepo.findOne({ where: { id } });

    if (!rating) throw new NotFoundException('Reseña no encontrada');
    if (rating.userId !== userId) throw new BadRequestException('No puedes editar esta reseña');

    // actualizar reseña
    Object.assign(rating, dto);
    await this.ratingRepo.save(rating);

    // actualizar media del vivac
    await this.updateVivacAverage(rating.vivacPointId);

    return rating;
  }

  async delete(userId: string, id: string) {
    // buscar reseña
    const rating = await this.ratingRepo.findOne({ where: { id } });
    if (!rating) throw new NotFoundException('Reseña no encontrada');

    // comprobar propietario
    if (rating.userId !== userId) {
      throw new BadRequestException('No puedes borrar esta reseña');
    }

    // eliminar reseña
    await this.ratingRepo.remove(rating);

    // bajar contador del vivac
    await this.vivacRepo.decrement(
      { id: rating.vivacPointId },
      'reviewCount',
      1,
    );

    // recalcular media del vivac
    await this.updateVivacAverage(rating.vivacPointId);

    // cargar user para actualizar xp y contador
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // bajar contador de reseñas del usuario
    user.reviewsWritten = Math.max(0, (user.reviewsWritten || 0) - 1);

    // calcular xp base que dio esta reseña y restarla
    const texto = (rating.comment ?? '').toString().trim();
    const len = texto.length;

    let xpQuitada = 0;
    if (len > 5 && len <= 30) xpQuitada = 1;
    else if (len > 30) xpQuitada = 2;

    user.xpPoints = Math.max(0, user.xpPoints - xpQuitada);

    // guardar cambios del usuario
    await this.userRepo.save(user);

    return { message: 'Reseña eliminada' };
  }

  async getReviewsForVivac(vivacPointId: string) {
    return this.ratingRepo.find({
      where: { vivacPointId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewsByUser(userId: string) {
    return this.ratingRepo.find({
      where: { userId },
      relations: ['vivacPoint'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updateVivacAverage(vivacPointId: string) {
    const ratings = await this.ratingRepo.find({
      where: { vivacPointId },
    });

    const avg =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
        : 0;

    await this.vivacRepo.update({ id: vivacPointId }, { avgRating: avg });
  }
}
