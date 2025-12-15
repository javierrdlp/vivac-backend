import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  PasswordResetRequestDto,
  PasswordResetDto,
  RefreshDto,
  LogoutDto,
} from './dto/auth.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@ApiTags('auth') // Agrupación Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o email ya existente.' })
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.userName, dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve tokens JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password, req);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens JWT usando refreshToken' })
  @ApiResponse({ status: 200, description: 'Token refrescado correctamente.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión del usuario actual' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente.' })
  @ApiResponse({ status: 401, description: 'Token no válido o no autorizado.' })
  async logout(@Body() dto: LogoutDto) {
    return this.auth.logout(dto.refreshToken);
  }

  @Post('request-password-reset')
  @ApiOperation({
    summary: 'Enviar correo con enlace de recuperación de contraseña',
  })
  @ApiResponse({
    status: 200,
    description:
      'Si el email existe, se enviará un correo con el enlace de recuperación.',
  })
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña mediante token recibido por email',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, usado o expirado.',
  })
  async resetPassword(@Body() dto: PasswordResetDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }

  @Post('google')
  @ApiOperation({ summary: 'Inicio de sesión con Google' })
  @ApiResponse({
    status: 200,
    description: 'Login con Google exitoso, devuelve tokens JWT.',
  })
  @ApiResponse({ status: 401, description: 'Token de Google inválido.' })
  async googleLogin(@Req() req: Request, @Body() dto: GoogleLoginDto) {
    return this.auth.googleLogin(dto.idToken, req);
  }
}
