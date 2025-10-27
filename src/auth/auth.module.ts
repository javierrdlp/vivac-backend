import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';

@Module({  
  imports: [    
    TypeOrmModule.forFeature([User]),    
    JwtModule.register({      
      secret: process.env.JWT_SECRET,      
      signOptions: { expiresIn: process.env.JWT_EXPIRES as any || '15m' },    }),
  ],  
  providers: [AuthService],  
  controllers: [AuthController],
})
export class AuthModule {}
