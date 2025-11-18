import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { VivacPoint } from '../entities/vivac-point.entity';
import { User } from '../entities/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,

    @InjectRepository(VivacPoint)
    private readonly vivacRepo: Repository<VivacPoint>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateRatingDto) {
    // Comprobar que el vivac existe
    const vivac = await this.vivacRepo.findOne({ where: { id: dto.vivacPointId } });
    if (!vivac) throw new NotFoundException('Vivac no encontrado');

    // Comprobar si ya existe una reseña del mismo usuario para este vivac
    const existing = await this.ratingRepo.findOne({
      where: {
        userId: userId,
        vivacPointId: dto.vivacPointId,
      },
    });

    if (existing) {
      throw new BadRequestException('Ya has valorado este vivac');
    }

    // Crear reseña
    const rating = this.ratingRepo.create({
      rating: dto.rating,
      comment: dto.comment,
      userId: userId,
      vivacPointId: dto.vivacPointId,
    });

    await this.ratingRepo.save(rating);

    // Incrementar contador de reseñas del vivac
    await this.vivacRepo.increment(
      { id: dto.vivacPointId },
      'reviewCount',
      1,
    );

    // Recalcular media
    await this.updateVivacAverage(dto.vivacPointId);

    // Actualizar contador de reseñas del usuario
    await this.userRepo.increment({ id: userId }, 'reviewsWritten', 1);

    return rating;
  }

  async update(userId: string, id: string, dto: UpdateRatingDto) {
    const rating = await this.ratingRepo.findOne({
      where: { id },
    });

    if (!rating) throw new NotFoundException('Reseña no encontrada');
    if (rating.userId !== userId)
      throw new BadRequestException('No puedes editar esta reseña');

    Object.assign(rating, dto);
    await this.ratingRepo.save(rating);

    await this.updateVivacAverage(rating.vivacPointId);

    return rating;
  }

  async delete(userId: string, id: string) {
    const rating = await this.ratingRepo.findOne({
      where: { id },
    });

    if (!rating) throw new NotFoundException('Reseña no encontrada');
    if (rating.userId !== userId)
      throw new BadRequestException('No puedes borrar esta reseña');

    await this.ratingRepo.remove(rating);

    // Decrementar contador del vivac
    await this.vivacRepo.decrement(
      { id: rating.vivacPointId },
      'reviewCount',
      1,
    );

    await this.updateVivacAverage(rating.vivacPointId);

    await this.userRepo.decrement({ id: userId }, 'reviewsWritten', 1);

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
