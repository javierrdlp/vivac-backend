import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwt: JwtService,
  ) { }
  // MÉTODO DE REGISTRO
  async register(userName: string, email: string, password: string) {
    const existing = await this.usersRepo.findOne({
      where: [{ email }, { userName }],
    });
    
    if (existing) {
      if (existing.email === email) {
        throw new UnauthorizedException('Email already registered');
      }
      if (existing.userName === userName) {
        throw new UnauthorizedException('Username already taken');
      }
    }
    // Encriptamos la contraseña antes de guardarla
    const salt = await bcrypt.genSalt();
    
    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.usersRepo.create({ userName, email, passwordHash });

    await this.usersRepo.save(user);

    const token = this.jwt.sign({ sub: user.id, email: user.email });

    return { user: { id: user.id, userName, email }, accessToken: token };
  }

  // MÉTODO DE LOGIN
  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: user.id, email: user.email });

    return { user: { id: user.id, userName: user.userName, email }, accessToken: token };
  }
}

