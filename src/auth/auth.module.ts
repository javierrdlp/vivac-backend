import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity'; 
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [    
    ConfigModule,
    TypeOrmModule.forFeature([User, PasswordResetToken]),
    MailModule,
    //Configuración asíncrona de JWT usando variables del .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<import('@nestjs/jwt').JwtModuleOptions> => {        
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES');
        // ✅ Configuración final del módulo JWT
        return {
          secret: secret || 'fallbackSecret',
          signOptions: { expiresIn: expiresIn as any }, // ✅ corregido
        };
      },
    }),
  ],

  // 🧩 Providers: servicios disponibles en este módulo
  providers: [AuthService],

  // 📬 Controladores HTTP asociados
  controllers: [AuthController],
})
export class AuthModule {}
