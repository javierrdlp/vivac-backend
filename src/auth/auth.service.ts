import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import { SessionService } from './services/session.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepo: Repository<PasswordResetToken>,

    private readonly jwt: JwtService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
  ) {}

  // -------------------------
  // Registro de nuevo usuario
  // -------------------------
  async register(userName: string, email: string, password: string) {
    console.log('🧩 Registro de usuario:', { userName, email });

    // Comprobamos si ya existe un usuario con ese email o username
    const existing = await this.usersRepo.findOne({
      where: [{ email }, { userName }],
    });

    if (existing) {
      if (existing.email === email) {
        throw new UnauthorizedException('Email already registered');
      }
      if (existing.userName === userName) {
        throw new UnauthorizedException('Username already taken');
      }
    }

    // Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Hash generado:', hashedPassword);

    // Creamos el nuevo usuario
    const user = this.usersRepo.create({
      userName,
      email,
      passwordHash: hashedPassword,
    });

    await this.usersRepo.save(user);
    console.log('✅ Usuario guardado en la base de datos:', user.email);

    // Generamos un access token (solo acceso rápido)
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
      accessToken,
    };
  }

  // -------------------------
  // Login de usuario existente
  // -------------------------
  async login(email: string, password: string, req: Request) {
    console.log('📩 Intento de login:', { email });

    // Buscamos el usuario incluyendo el hash de la contraseña
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      console.log('⚠️ Usuario no encontrado');
      throw new NotFoundException('User not found');
    }

    // Comprobamos la contraseña
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log('🚫 Contraseña incorrecta');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Si la contraseña es válida, generamos tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    // Guardamos la sesión en la base de datos
    await this.sessionService.createSession({
      user,
      refreshToken,
      ipAddress: (req as any).ip,
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    console.log('✅ Login correcto, sesión creada en DB');

    // Devolvemos ambos tokens
    return {
      user: { id: user.id, userName: user.userName, email },
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutos
    };
  }

  // -------------------------
  // Refrescar el access token
  // -------------------------
  async refresh(refreshToken: string) {
    // Buscamos la sesión en la base de datos
    const session = await this.sessionService.findValidByToken(refreshToken);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = session.user;

    // Rotamos el refresh token por seguridad
    const newRefresh = this.generateRefreshToken();

    await this.sessionService.revokeByToken(refreshToken);
    await this.sessionService.createSession({
      user,
      refreshToken: newRefresh,
    });

    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      refreshToken: newRefresh,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }

  // -------------------------
  // Logout: cerrar sesión
  // -------------------------
  async logout(refreshToken: string) {
    await this.sessionService.revokeByToken(refreshToken);
    console.log('🚪 Sesión revocada correctamente');
    return { success: true };
  }

  // -------------------------
  // Solicitud de reseteo de contraseña
  // -------------------------
  async requestPasswordReset(email: string) {
    console.log('📩 Solicitud de reseteo de contraseña para:', email);

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const token = randomBytes(32).toString('hex');
    const expiresAt = addMinutes(new Date(), 15);

    const resetToken = this.passwordResetRepo.create({
      user,
      token,
      expiresAt,
    });
    await this.passwordResetRepo.save(resetToken);

    await this.mailService.sendPasswordReset(email, token);
    console.log('📨 Email de recuperación enviado a:', email);

    return { message: 'Email de recuperación enviado correctamente' };
  }

  // -------------------------
  // Restablecer contraseña
  // -------------------------
  async resetPassword(token: string, newPassword: string) {
    console.log('🔑 Intentando restablecer contraseña con token:', token);

    const record = await this.passwordResetRepo.findOne({
      where: { token, used: false },
      relations: ['user'],
    });

    if (!record) throw new UnauthorizedException('Invalid or used token');
    if (record.expiresAt < new Date())
      throw new UnauthorizedException('Token expired');

    const hashed = await bcrypt.hash(newPassword, 10);

    record.user.passwordHash = hashed;
    record.used = true;

    await this.usersRepo.save(record.user);
    await this.passwordResetRepo.save(record);

    console.log('✅ Contraseña actualizada correctamente para:', record.user.email);

    return { message: 'Contraseña restablecida correctamente' };
  }

  // -------------------------
  // Funciones auxiliares
  // -------------------------
  private generateAccessToken(user: { id: string; email: string }) {
    return this.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }
}



