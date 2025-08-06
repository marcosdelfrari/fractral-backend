import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  // POST /auth/request-pin
  static async requestPin(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      const result = await AuthService.requestPin(email);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Erro no requestPin:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // POST /auth/verify-pin
  static async verifyPin(req: Request, res: Response) {
    try {
      const { email, pin } = req.body;

      if (!email || !pin) {
        return res.status(400).json({
          success: false,
          message: 'Email e PIN são obrigatórios'
        });
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      // Validação do PIN (deve ser numérico e ter 6 dígitos)
      if (!/^\d{6}$/.test(pin)) {
        return res.status(400).json({
          success: false,
          message: 'PIN deve ser um número de 6 dígitos'
        });
      }

      const result = await AuthService.verifyPin(email, pin);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          token: result.token,
          user: result.user
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Erro no verifyPin:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
} 