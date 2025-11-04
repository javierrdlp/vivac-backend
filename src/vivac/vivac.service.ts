import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateVivacDto, userId: string): Promise<VivacPoint> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const vivac = this.vivacRepository.create({
      ...dto,
      createdBy: user,
    });
    return await this.vivacRepository.save(vivac);
  }

  async findAll(): Promise<VivacPoint[]> {
    return await this.vivacRepository.find({
      relations: ['createdBy', 'ratings'],
    });
  }

  async findOne(id: string): Promise<VivacPoint> {
    const vivac = await this.vivacRepository.findOne({
      where: { id },
      relations: ['createdBy', 'ratings'],
    });
    if (!vivac) throw new NotFoundException('Vivac not found');
    return vivac;
  }

  async update(id: string, dto: UpdateVivacDto): Promise<VivacPoint> {
    const vivac = await this.findOne(id);
    Object.assign(vivac, dto);
    return await this.vivacRepository.save(vivac);
  }

  async remove(id: string): Promise<void> {
    const vivac = await this.findOne(id);
    await this.vivacRepository.remove(vivac);
  }

  async findByUser(userId: string): Promise<VivacPoint[]> {
    return await this.vivacRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'ratings'],
    });
  }
}
