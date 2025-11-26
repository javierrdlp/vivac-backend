import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';

@Injectable()
export class AchievementSeeder {
    private readonly logger = new Logger(AchievementSeeder.name);

    constructor(
        @InjectRepository(Achievement)
        private readonly achievementRepo: Repository<Achievement>,
    ) {}

    async seed() {
        const achievements = [
            // --- Vivacs ---
            {
                name: 'Primer Vivac',
                description: 'Has creado tu primer punto de vivac.',
                iconUrl: null,
                xpReward: 5,
            },
            {
                name: '5 Vivacs',
                description: 'Has creado 5 puntos de vivac.',
                iconUrl: null,
                xpReward: 20,
            },
            {
                name: '25 Vivacs',
                description: 'Has creado 25 puntos de vivac.',
                iconUrl: null,
                xpReward: 100,
            },
            {
                name: '50 Vivacs',
                description: 'Has creado 50 puntos de vivac.',
                iconUrl: null,
                xpReward: 125,
            },
            {
                name: '100 Vivacs',
                description: 'Has creado 100 puntos de vivac.',
                iconUrl: null,
                xpReward: 250,
            },
            {
                name: '150 Vivacs',
                description: 'Has creado 150 puntos de vivac.',
                iconUrl: null,
                xpReward: 250,
            },
            {
                name: '200 Vivacs',
                description: 'Has creado 200 puntos de vivac.',
                iconUrl: null,
                xpReward: 250,
            },

            // --- Reseñas ---
            {
                name: 'Primera Reseña',
                description: 'Has escrito tu primera reseña.',
                iconUrl: null,
                xpReward: 5,
            },
            {
                name: '10 Reseñas',
                description: 'Has escrito 10 reseñas.',
                iconUrl: null,
                xpReward: 10,
            },
            {
                name: '25 Reseñas',
                description: 'Has escrito 25 reseñas.',
                iconUrl: null,
                xpReward: 20,
            },
            {
                name: '50 Reseñas',
                description: 'Has escrito 50 reseñas.',
                iconUrl: null,
                xpReward: 30,
            },
            {
                name: '100 Reseñas',
                description: 'Has escrito 100 reseñas.',
                iconUrl: null,
                xpReward: 40,
            },
            {
                name: '250 Reseñas',
                description: 'Has escrito 250 reseñas.',
                iconUrl: null,
                xpReward: 75,
            },
            {
                name: '500 Reseñas',
                description: 'Has escrito 500 reseñas.',
                iconUrl: null,
                xpReward: 75,
            },

            // --- Perfil ---
            {
                name: 'Perfil Completo',
                description: 'Completaste todos los detalles de tu perfil.',
                iconUrl: null,
                xpReward: 100,
            },

            // --- Seguidores ---
            {
                name: 'Primer Seguidor',
                description: 'Has conseguido tu primer seguidor.',
                iconUrl: null,
                xpReward: 5,
            },
            {
                name: '10 Seguidores',
                description: 'Has alcanzado 10 seguidores.',
                iconUrl: null,
                xpReward: 10,
            },
            {
                name: '50 Seguidores',
                description: 'Has alcanzado 50 seguidores.',
                iconUrl: null,
                xpReward: 25,
            },
            {
                name: '100 Seguidores',
                description: 'Has alcanzado 100 seguidores.',
                iconUrl: null,
                xpReward: 35,
            },
            {
                name: '250 Seguidores',
                description: 'Has alcanzado 250 seguidores.',
                iconUrl: null,
                xpReward: 75,
            },
            {
                name: '500 Seguidores',
                description: 'Has alcanzado 500 seguidores.',
                iconUrl: null,
                xpReward: 100,
            },
            {
                name: '1000 Seguidores',
                description: 'Has alcanzado 1000 seguidores.',
                iconUrl: null,
                xpReward: 100,
            },
        ];

        for (const data of achievements) {
            const exists = await this.achievementRepo.findOne({
                where: { name: data.name },
            });

            if (!exists) {
                const achievement = this.achievementRepo.create(data);
                await this.achievementRepo.save(achievement);
                this.logger.log(`Seeder: Achievement creado → ${data.name}`);
            } else {
                this.logger.log(`Seeder: Achievement ya existe → ${data.name}`);
            }
        }

        this.logger.log('Seeder de achievements completado');
    }
}
