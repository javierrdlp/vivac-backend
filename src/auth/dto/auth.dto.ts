import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  MinLength
} from 'class-validator';

// DTO para registro
export class RegisterDto {
  @ApiProperty({ example: 'Javi', description: 'Nombre de usuario visible' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  userName: string;

  @ApiProperty({
    example: 'javi@mail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description:
      'Contraseña del usuario (mínimo 8 caracteres, una mayúscula y un símbolo)',
  })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.',
  })
  password: string;
}

// DTO para login
export class LoginDto {
  @ApiProperty({ example: 'javi@mail.com' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
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
    example: 'NuevaPass@123',
    description:
      'Nueva contraseña del usuario (mínimo 8 caracteres, una mayúscula y un símbolo)',
  })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un símbolo.',
  })
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
