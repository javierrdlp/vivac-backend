import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { VivacPoint } from 'src/entities/vivac-point.entity';
import { readdirSync } from 'fs';
import { join } from 'path';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(VivacPoint)
        private readonly vivacRepo: Repository<VivacPoint>,
    ) { }

    async findById(id: string, includePrivate = false) {
        const user = await this.userRepo.findOne({
            where: { id },
            select: includePrivate
                ? undefined // devuelve todo menos passwordHash
                : ['id', 'userName', 'avatarUrl', 'description', 'userExperience', 'createdAt'],
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        await this.userRepo.update({ id }, dto);
        return this.findById(id, true);
    }

    async delete(id: string) {
        // Verificar si tiene vivacs creados
        const vivacs = await this.vivacRepo.count({
            where: { createdBy: { id } },
        });

        if (vivacs > 0) {
            throw new BadRequestException(
                'No puedes borrar tu cuenta porque tienes vivacs creados.',
            );
        }

        // Borrar usuario
        await this.userRepo.delete(id);

        return { message: 'Cuenta eliminada correctamente' };
    }

    async getPublicProfile(id: string) {
        const user = await this.userRepo.findOne({
            where: { id },
            select: [
                'id',
                'userName',
                'avatarUrl',
                'description',
                'userExperience',
                'xpPoints',
                'vivacsCreated',
                'reviewsWritten',
                'createdAt',
            ],
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        return user;
    }

    async getMyRanking(userId: string) {
        // Usuario actual
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const usersAbove = await this.userRepo.count({
            where: { xpPoints: MoreThan(user.xpPoints) },
        });

        const position = usersAbove + 1;

        const top100 = await this.userRepo.find({
            order: { xpPoints: 'DESC' },
            take: 100,
            select: [
                'id',
                'userName',
                'avatarUrl',
                'userExperience',
                'xpPoints',
                'vivacsCreated',
                'reviewsWritten',
            ],
        });

        return {
            position,
            userXp: user.xpPoints,
            top100,
        };
    }

    getAvailableAvatars() {
        const avatarsPath = join(process.cwd(), 'uploads', 'avatars');
        const files = readdirSync(avatarsPath);

        return files.map(file => ({
            name: file,
            url: `/uploads/avatars/${file}`,
        }));
    }

    async selectAvatar(userId: string, avatar: string) {        
        const validAvatars = this.getAvailableAvatars().map(a => a.name);
        
        if (!validAvatars.includes(avatar)) {
            throw new BadRequestException('Avatar no válido.');
        }
        
        await this.userRepo.update(userId, {
            avatarUrl: `/uploads/avatars/${avatar}`,
        });
        
        return this.findById(userId, true);
    }

}
