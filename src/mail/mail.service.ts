import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {    
    //Configuración SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  
  // Envío correo de recuperación  
  async sendPasswordReset(email: string, token: string): Promise<void> {

    const resetLink = `https://vivacweb.com/reset-password?token=${token}`;

    try {      
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: '🔐 Restablecer contraseña - VivacGo',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2e7d32;">Restablecer tu contraseña</h2>
            <p>Hola 👋,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>VivacGo</strong>.</p>
            <p>Puedes hacerlo desde el siguiente enlace:</p>
            <p>
              <a href="${resetLink}" style="background-color: #2e7d32; color: white; padding: 10px 15px; border-radius: 6px; text-decoration: none;">
                Restablecer contraseña
              </a>
            </p>
            <p> Este enlace expirará en 15 minutos.</p>
            <p>Si tú no realizaste esta solicitud, puedes ignorar este mensaje.</p>
            <br/>
            <p>— El equipo de VivacGo 🌿</p>
          </div>
        `,
      });

      console.log('Email de recuperación enviado:', info.messageId);
    } catch (err) {
      console.error('Error al enviar el correo:', err);
      throw new InternalServerErrorException('No se pudo enviar el correo de recuperación');
    }
  }
}

