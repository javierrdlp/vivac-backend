import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

// DTO para registro
export class RegisterDto {
  @ApiProperty({ example: 'Javi', description: 'Nombre de usuario visible' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  userName: string;

  @ApiProperty({ example: 'javi@mail.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}

// DTO para login
export class LoginDto {
  @ApiProperty({ example: 'javi@mail.com' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}

// DTO para solicitar restablecimiento de contraseña
export class PasswordResetRequestDto {
  @ApiProperty({
    example: 'javi@mail.com',
    description: 'Correo para enviar el enlace de recuperación',
  })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;
}

// DTO para restablecer la contraseña con token
export class PasswordResetDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de recuperación recibido por email',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'nuevaPassword123',
    description: 'Nueva contraseña del usuario (mínimo 8 caracteres)',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}

// DTO para refrescar tokens
export class RefreshDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token válido',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

// DTO para cerrar sesión
export class LogoutDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token de la sesión actual',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
