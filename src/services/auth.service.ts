import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User';
import { PinVerification } from '../models/PinVerification';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';

// Configuração do transporter de email (opcional para testes)
let transporter: nodemailer.Transporter | null = null;

if (EMAIL_USER !== 'your-email@gmail.com' && EMAIL_PASS !== 'your-app-password') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

export class AuthService {
  // Gera um PIN numérico de 6 dígitos
  static generatePin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Gera um JWT token
  static generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  }

  // Verifica um JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Envia PIN por email
  static async sendPinEmail(email: string, pin: string): Promise<void> {
    if (transporter) {
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Seu PIN de acesso',
        html: `
          <h2>PIN de Acesso</h2>
          <p>Seu PIN de acesso é: <strong>${pin}</strong></p>
          <p>Este PIN expira em 5 minutos.</p>
          <p>Se você não solicitou este PIN, ignore este email.</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Para testes, apenas loga o PIN no console
      console.log(`\n📧 PIN enviado para ${email}: ${pin}\n`);
    }
  }

  // Solicita um novo PIN
  static async requestPin(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Limpa PINs expirados
      await PinVerification.deleteExpiredPins();

      // Gera novo PIN
      const pin = this.generatePin();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      // Salva PIN no banco
      await PinVerification.create({
        email,
        pin,
        expiresAt
      });

      // Envia email
      await this.sendPinEmail(email, pin);

      return {
        success: true,
        message: 'PIN enviado com sucesso para seu email'
      };
    } catch (error) {
      console.error('Erro ao solicitar PIN:', error);
      return {
        success: false,
        message: 'Erro ao enviar PIN'
      };
    }
  }

  // Verifica PIN e retorna token
  static async verifyPin(email: string, pin: string): Promise<{ success: boolean; message: string; token?: string; user?: any }> {
    try {
      // Busca PIN válido
      const pinVerification = await PinVerification.findByEmailAndPin(email, pin);

      if (!pinVerification) {
        return {
          success: false,
          message: 'PIN inválido ou expirado'
        };
      }

      // Marca PIN como usado
      await PinVerification.markAsUsed(pinVerification.id);

      // Busca ou cria usuário
      let user = await User.findByEmail(email);
      
      if (!user) {
        // Cria novo usuário se não existir
        user = await User.create({
          email,
          nome: email.split('@')[0] // Usa parte do email como nome
        });
      }

      // Gera token
      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome
        }
      };
    } catch (error) {
      console.error('Erro ao verificar PIN:', error);
      return {
        success: false,
        message: 'Erro ao verificar PIN'
      };
    }
  }
} 