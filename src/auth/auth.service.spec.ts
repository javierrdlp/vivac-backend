import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { MailService } from '../mail/mail.service';
import { SessionService } from './services/session.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        // 🔹 Repositorios TypeORM (OBLIGATORIO así)
        {
          provide: getRepositoryToken(User),
          useValue: {} as Partial<Repository<User>>,
        },
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: {} as Partial<Repository<PasswordResetToken>>,
        },

        // 🔹 Servicios
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendPasswordReset: jest.fn(),
          },
        },
        {
          provide: SessionService,
          useValue: {
            createSession: jest.fn(),
            revokeByToken: jest.fn(),
            findValidByToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
