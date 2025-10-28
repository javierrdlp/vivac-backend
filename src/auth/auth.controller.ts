import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterDto {
  userName: string;
  email: string;
  password: string;
}

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth') 
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  //Endpoint de registro: POST /auth/register
  @Post('register')
  async register(@Body() dto: RegisterDto) {    
    return this.auth.register(dto.userName, dto.email, dto.password);
  }
  //Endpoint de login: POST /auth/login
  @Post('login')
  async login(@Body() dto: LoginDto) {    
    return this.auth.login(dto.email, dto.password);
  }
}

