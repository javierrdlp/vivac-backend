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
import { MailService } from '../mail/mail.service'; // ✅ ruta relativa corregida
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>, // 🧱 Repositorio principal de usuarios

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepo: Repository<PasswordResetToken>, // 🔑 Tokens de recuperación

    private readonly jwt: JwtService, // 🔐 Servicio de JWT para firmar tokens
    private readonly mailService: MailService, // 💌 Servicio de envío de correos
  ) {}

  // ========================================================
  // 🧩 REGISTRO DE NUEVO USUARIO
  // ========================================================
  async register(userName: string, email: string, password: string) {
    console.log('🧩 Registro de usuario:', { userName, email });

    // 🔎 Comprobamos si ya existe un usuario con ese email o username
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

    // 🔐 Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Hash generado:', hashedPassword);

    // 🧱 Creamos el nuevo usuario (usando el campo correcto)
    const user = this.usersRepo.create({
      userName,
      email,
      passwordHash: hashedPassword, // ⚠️ importante: usar passwordHash, no password
    });

    // 💾 Guardamos el usuario en la base de datos
    await this.usersRepo.save(user);
    console.log('✅ Usuario guardado en la base de datos:', user.email);

    // 🎟️ Generamos el token JWT
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email });

    // 📤 Devolvemos la respuesta al frontend
    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
      accessToken,
    };
  }

  // ========================================================
  // 🔑 LOGIN DE USUARIO EXISTENTE
  // ========================================================
  async login(email: string, password: string) {
    console.log('📩 Login attempt:', { email, password });

    // 🔍 Buscamos el usuario incluyendo el hash de la contraseña
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash') // ⚙️ select: false → debemos añadirlo manualmente
      .where('user.email = :email', { email })
      .getOne();

    console.log('🧱 Resultado de búsqueda de usuario:', user);

    // ⚠️ Si no se encuentra el usuario, lanzamos error
    if (!user) {
      console.log('⚠️ Usuario no encontrado');
      throw new NotFoundException('User not found');
    }

    // 🧩 Verificación previa de datos
    if (!password || !user.passwordHash) {
      console.log('❌ Faltan datos para comparar con bcrypt:', {
        password,
        passwordHash: user.passwordHash,
      });
      throw new UnauthorizedException('Missing password or password hash');
    }

    try {
      // 🔍 Comparamos la contraseña introducida con el hash almacenado
      const valid = await bcrypt.compare(password, user.passwordHash);
      console.log('✅ Resultado de bcrypt.compare:', valid);

      if (!valid) {
        console.log('🚫 Contraseña incorrecta');
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('✅ Contraseña válida, generando token...');
      const token = this.jwt.sign({ sub: user.id, email: user.email });

      // 📤 Respuesta con el JWT
      return {
        user: { id: user.id, userName: user.userName, email },
        accessToken: token,
      };
    } catch (error) {
      console.error('💥 Error en bcrypt.compare:', error);
      throw new UnauthorizedException('Error comparing password');
    }
  }
  
  //SOLICITUD DE RESTABLECIMIENTO DE CONTRASEÑA
 
  async requestPasswordReset(email: string) {
    console.log('📩 Solicitud de reseteo de contraseña para:', email);

    // 1️⃣ Buscamos el usuario por email
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ Generamos un token aleatorio y una fecha de expiración (1 hora)
    const token = randomBytes(32).toString('hex');
    const expiresAt = addMinutes(new Date(), 15);

    // 3️⃣ Creamos y guardamos el registro del token
    const resetToken = this.passwordResetRepo.create({
      user,
      token,
      expiresAt,
    });
    await this.passwordResetRepo.save(resetToken);

    // 4️⃣ Enviamos el correo de recuperación
    await this.mailService.sendPasswordReset(email, token);

    console.log('📨 Email de recuperación enviado a:', email);

    // 5️⃣ Respondemos al frontend
    return { message: 'Email de recuperación enviado correctamente' };
  }

  // ========================================================
  // 🧱 RESTABLECER CONTRASEÑA USANDO TOKEN
  // ========================================================
  async resetPassword(token: string, newPassword: string) {
    console.log('🔑 Intentando restablecer contraseña con token:', token);

    // 1️⃣ Buscamos el token en la base de datos
    const record = await this.passwordResetRepo.findOne({
      where: { token, used: false },
      relations: ['user'], // ⚙️ Incluimos el usuario relacionado
    });

    // 2️⃣ Validamos el token
    if (!record) throw new UnauthorizedException('Invalid or used token');
    if (record.expiresAt < new Date())
      throw new UnauthorizedException('Token expired');

    // 3️⃣ Hasheamos la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Actualizamos el usuario y marcamos el token como usado
    record.user.passwordHash = hashed;
    record.used = true;

    await this.usersRepo.save(record.user);
    await this.passwordResetRepo.save(record);

    console.log('✅ Contraseña actualizada correctamente para:', record.user.email);

    // 5️⃣ Respondemos al frontend
    return { message: 'Contraseña restablecida correctamente' };
  }
}


