import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { addDays } from 'date-fns';
import { User } from '../../entities/user.entity';
import { UserSession } from '../entities/user-session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly repo: Repository<UserSession>,
  ) {}

  // Crea una nueva sesión en la base de datos
  // Se guarda el refreshToken, la IP, el userAgent y la fecha de expiración
  async createSession(params: {
    user: User;
    refreshToken: string;
    ipAddress?: string;
    userAgent?: string;
    days?: number;
  }): Promise<UserSession> {
    const { user, refreshToken, ipAddress, userAgent, days = 7 } = params;

    const expiresAt = addDays(new Date(), days);
    const session = this.repo.create({
      user,
      refreshToken,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return this.repo.save(session);
  }

  // Busca una sesión válida por su refreshToken.
  // Solo devuelve la sesión si no está revocada y no ha expirado.
  async findValidByToken(refreshToken: string): Promise<UserSession | null> {
    return this.repo.findOne({
      where: {
        refreshToken,
        revoked: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });
  }

  // Marca una sesión como revocada (logout individual)
  async revokeByToken(refreshToken: string): Promise<void> {
    await this.repo.update({ refreshToken }, { revoked: true });
  }

  // Revoca todas las sesiones de un usuario
  // Útil cuando el usuario cambia la contraseña o se quiere forzar logout en todos los dispositivos
  async revokeAllForUser(userId: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(UserSession)
      .set({ revoked: true })
      .where('"userId" = :userId', { userId })
      .execute();
  }

  // Borra de la base de datos las sesiones que ya han expirado
  // Se puede llamar de forma manual o con una tarea automática (cron)
  async cleanExpired(): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(UserSession)
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}

