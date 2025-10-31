import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// DTOs
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

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}  
  // REGISTRO DE USUARIO
  // POST /auth/register
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.userName, dto.email, dto.password);
  }  
  // LOGIN DE USUARIO
  // POST /auth/login  
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }  
  // SOLICITUD DE RESETEO DE CONTRASEÑA
  // POST /auth/request-password-reset  
  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    return this.auth.requestPasswordReset(dto.email);
  }
  // RESETEAR CONTRASEÑA USANDO TOKEN
  // POST /auth/reset-password  
  @Post('reset-password')
  async resetPassword(@Body() dto: PasswordResetDto) {   
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }
}

