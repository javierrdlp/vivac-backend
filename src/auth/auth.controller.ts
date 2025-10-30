import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// DTOs
// Datos que se reciben en el registro
class RegisterDto {
  userName: string;
  email: string;
  password: string;
}
// Datos que se reciben en el login
class LoginDto {
  email: string;
  password: string;
}
// Datos que se reciben en la solicitud de reseteo
class PasswordResetRequestDto {
  email: string;
}
// Datos que se reciben en el reseteo de contraseña
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
    // Llama al servicio de registro con los datos recibidos
    return this.auth.register(dto.userName, dto.email, dto.password);
  }  
  // LOGIN DE USUARIO
  // POST /auth/login  
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // Llama al servicio de login para validar credenciales
    return this.auth.login(dto.email, dto.password);
  }  
  // SOLICITUD DE RESETEO DE CONTRASEÑA
  // POST /auth/request-password-reset  
  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    // Recibe el email del usuario y envía el correo de recuperación
    return this.auth.requestPasswordReset(dto.email);
  }
  // RESETEAR CONTRASEÑA USANDO TOKEN
  // POST /auth/reset-password  
  @Post('reset-password')
  async resetPassword(@Body() dto: PasswordResetDto) {
    // Recibe el token y la nueva contraseña desde el frontend
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }
}

