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
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepo: Repository<PasswordResetToken>,

    private readonly jwt: JwtService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
  ) { }

  // Registro normal
  async register(userName: string, email: string, password: string) {
    console.log('🧩 Registro de usuario:', { userName, email });

    const existing = await this.usersRepo.findOne({
      where: [{ email }, { userName }],
    });

    if (existing) {
      if (existing.email === email) throw new UnauthorizedException('Email already registered');
      if (existing.userName === userName) throw new UnauthorizedException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Hash generado:', hashedPassword);

    const user = this.usersRepo.create({
      userName,
      email,
      passwordHash: hashedPassword,
    });

    await this.usersRepo.save(user);
    console.log('✅ Usuario guardado en DB:', user.email);

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

  // Login normal
  async login(email: string, password: string, req: Request) {
    console.log('📩 Intento de login:', { email });

    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    // Si es cuenta Google, no puede loguear con contraseña
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account uses Google login. Please sign in with Google.'
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await this.sessionService.createSession({
      user,
      refreshToken,
      ipAddress: (req as any).ip,
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    console.log('✅ Login correcto, sesión creada en DB');

    return {
      user: { id: user.id, userName: user.userName, email },
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 14400,
    };
  }


  // GOOGLE: 1) Verificar token con Google  
  private async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (err) {
      console.error('❌ Error verificando token Google', err);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  // GOOGLE: 2) Buscar usuario o crearlo
  private async findOrCreateGoogleUser(payload: any): Promise<User> {
    const { sub: googleId, email, name, picture } = payload;

    // Buscar por googleId
    let user = await this.usersRepo.findOne({ where: { googleId } });

    // Buscar por email si no tenemos googleId 
    if (!user && email) {
      user = await this.usersRepo.findOne({ where: { email } });
    }

    if (!user) {
      // Crear usuario 
      user = this.usersRepo.create({
        googleId, 
        email,
        userName: name ?? email.split('@')[0],
        avatarUrl: picture,
        
      });

      user = await this.usersRepo.save(user);
      console.log('🆕 Usuario creado vía Google:', user.email);
    } else {
      // Actualizar googleId/imagen si hace falta
      let updated = false;

      if (!user.googleId && googleId) {
        user.googleId = googleId;
        updated = true;
      }

      if (picture && user.avatarUrl !== picture) {
        user.avatarUrl = picture;
        updated = true;
      }

      if (updated) {
        await this.usersRepo.save(user);
      }

      console.log('ℹ️ Usuario Google encontrado:', user.email);
    }

    return user;
  }
  // GOOGLE: 3) Login final con sesiones  
  async googleLogin(idToken: string, req: Request) {
    console.log('🔐 Intento de login con Google');

    const payload = await this.verifyGoogleToken(idToken);

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Google token invalid: no email');
    }

    const user = await this.findOrCreateGoogleUser(payload);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await this.sessionService.createSession({
      user,
      refreshToken,
      ipAddress: (req as any).ip,
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    console.log('✅ Login Google exitoso');

    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 14400,
    };
  }

  // Refresh token
  async refresh(refreshToken: string) {
    const session = await this.sessionService.findValidByToken(refreshToken);
    if (!session) throw new UnauthorizedException('Invalid or expired refresh token');

    const user = session.user;

    const newRefresh = this.generateRefreshToken();

    await this.sessionService.revokeByToken(refreshToken);
    await this.sessionService.createSession({ user, refreshToken: newRefresh });

    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      refreshToken: newRefresh,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }

  // Logout
  async logout(refreshToken: string) {
    await this.sessionService.revokeByToken(refreshToken);
    console.log('🚪 Sesión revocada');
    return { success: true };
  }

  // Reset password request
  async requestPasswordReset(email: string) {
    console.log('📩 Solicitud reset password:', email);

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const token = randomBytes(32).toString('hex');
    const expiresAt = addMinutes(new Date(), 15);

    const record = this.passwordResetRepo.create({ user, token, expiresAt });
    await this.passwordResetRepo.save(record);

    await this.mailService.sendPasswordReset(email, token);
    console.log('📨 Email de recuperación enviado');

    return { message: 'Password reset email sent' };
  }

  // Reset password
  async resetPassword(token: string, newPassword: string) {
    console.log('🔑 Reset password con token:', token);

    const record = await this.passwordResetRepo.findOne({
      where: { token, used: false },
      relations: ['user'],
    });

    if (!record) throw new UnauthorizedException('Invalid or used token');
    if (record.expiresAt < new Date()) throw new UnauthorizedException('Token expired');

    const hashed = await bcrypt.hash(newPassword, 10);

    record.user.passwordHash = hashed;
    record.used = true;

    await this.usersRepo.save(record.user);
    await this.passwordResetRepo.save(record);

    console.log('✅ Contraseña actualizada');

    return { message: 'Password updated successfully' };
  }


  // Token helpers  
  private generateAccessToken(user: { id: string; email: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }
}
