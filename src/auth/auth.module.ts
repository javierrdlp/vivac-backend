import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<import('@nestjs/jwt').JwtModuleOptions> => {
        const secret = configService.get<string>('JWT_SECRET') || 'fallbackSecret';
        const expiresIn = configService.get<string>('JWT_EXPIRES') || '15m';

        console.log('🔐 Cargando JWT_SECRET desde .env:', secret);

        return {
          secret,
          signOptions: { expiresIn: expiresIn as any }, // ✅ corregido
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}


