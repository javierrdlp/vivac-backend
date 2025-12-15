import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await this.resend.emails.send({
        from: process.env.MAIL_FROM!,
        to: email,
        subject: '🔐 Restablecer contraseña - Wild Spot',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2e7d32;">Restablecer tu contraseña</h2>
            <p>Hola 👋,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Wild Spot</strong>.</p>
            <p>Puedes hacerlo desde el siguiente enlace:</p>
            <p>
              <a href="${resetLink}" style="background-color: #2e7d32; color: white; padding: 10px 15px; border-radius: 6px; text-decoration: none;">
                Restablecer contraseña
              </a>
            </p>
            <p>Este enlace expirará en 15 minutos.</p>
            <p>Si tú no realizaste esta solicitud, puedes ignorar este mensaje.</p>
            <br/>
            <p>— El equipo de Wild Spot 🌿</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      throw new InternalServerErrorException(
        'No se pudo enviar el correo de recuperación',
      );
    }
  }
}


