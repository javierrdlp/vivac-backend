import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';


// DTOs (puedes separarlos en archivos más adelante si quieres)
class RegisterDto {
  userName: string;
  email: string;
  password: string;
}

class LoginDto {
  email: string;
  password: string;
}

class PasswordResetRequestDto {
  email: string;
}

class PasswordResetDto {
  token: string;
  newPassword: string;
}

class RefreshDto {
  refreshToken: string;
}

class LogoutDto {
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Registro de nuevo usuario
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.userName, dto.email, dto.password);
  }

  // Login de usuario
  // Pasamos también el objeto Request para obtener IP y User-Agent
  @Post('login')
  async login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password, req);
  }

  // Refrescar token de acceso (usar el refresh token)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  // Cerrar sesión (logout)
  @Post('logout')
  async logout(@Body() dto: LogoutDto) {
    return this.auth.logout(dto.refreshToken);
  }

  // Solicitud de restablecimiento de contraseña
  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  // Restablecer contraseña con token recibido por email
  @Post('reset-password')
  async resetPassword(@Body() dto: PasswordResetDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }
}


