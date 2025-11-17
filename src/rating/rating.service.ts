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
    const vivac = await this.vivacRepo.findOne({ where: { id: dto.vivacId } });
    if (!vivac) throw new NotFoundException('Vivac no encontrado');

    const existing = await this.ratingRepo.findOne({
      where: {
        user: { id: userId },
        vivacPoint: { id: dto.vivacId },
      },
    });

    if (existing) {
      throw new BadRequestException('Ya has valorado este vivac');
    }

    const rating = this.ratingRepo.create({
      rating: dto.rating,
      comment: dto.comment,
      user: { id: userId },
      vivacPoint: { id: dto.vivacId },
    });

    await this.ratingRepo.save(rating);

    // Recalcular media
    await this.updateVivacAverage(dto.vivacId);

    // Actualizar contador de reseñas del usuario
    await this.userRepo.increment({ id: userId }, 'reviewsWritten', 1);

    return rating;
  }

  async update(userId: string, id: string, dto: UpdateRatingDto) {
    const rating = await this.ratingRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!rating) throw new NotFoundException('Reseña no encontrada');
    if (rating.user.id !== userId) throw new BadRequestException('No puedes editar esta reseña');

    Object.assign(rating, dto);
    await this.ratingRepo.save(rating);

    await this.updateVivacAverage(rating.vivacPoint.id);

    return rating;
  }

  async delete(userId: string, id: string) {
    const rating = await this.ratingRepo.findOne({
      where: { id },
      relations: ['user', 'vivacPoint'],
    });

    if (!rating) throw new NotFoundException('Reseña no encontrada');
    if (rating.user.id !== userId) throw new BadRequestException('No puedes borrar esta reseña');

    await this.ratingRepo.remove(rating);

    await this.updateVivacAverage(rating.vivacPoint.id);
    await this.userRepo.decrement({ id: userId }, 'reviewsWritten', 1);

    return { message: 'Reseña eliminada' };
  }

  async getReviewsForVivac(vivacId: string) {
    return this.ratingRepo.find({
      where: { vivacPoint: { id: vivacId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewsByUser(userId: string) {
    return this.ratingRepo.find({
      where: { user: { id: userId } },
      relations: ['vivacPoint'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updateVivacAverage(vivacId: string) {
    const ratings = await this.ratingRepo.find({
      where: { vivacPoint: { id: vivacId } },
    });

    const avg = ratings.length ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length : 0;

    await this.vivacRepo.update({ id: vivacId }, { avgRating: avg });
  }
}
