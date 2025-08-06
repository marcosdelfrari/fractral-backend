import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role?: string;
    email?: string;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
      return;
    }

    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }

    // Verificar se o usuário ainda existe no banco
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    // Adicionar informações do usuário ao request
    req.user = {
      userId: decoded.userId,
      role: user.email.includes('admin') || user.role === 'admin' ? 'admin' : 'user',
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware opcional de autenticação (não bloqueia se não autenticado)
export const optionalAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(); // Continua sem autenticação
    }

    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return next(); // Continua sem autenticação
    }

    // Verificar se o usuário ainda existe no banco
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next(); // Continua sem autenticação
    }

    // Adicionar informações do usuário ao request
    req.user = {
      userId: decoded.userId,
      role: user.email.includes('admin') || user.role === 'admin' ? 'admin' : 'user',
      email: user.email
    };

    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
};

// Middleware para verificar se o token está próximo do vencimento
export const checkTokenExpiration = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return next();
    }

    // Verificar se o token expira em menos de 1 hora
    const tokenExp = decoded.exp * 1000; // Converter para milissegundos
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (tokenExp - now < oneHour) {
      // Adicionar header para indicar que o token está próximo do vencimento
      res.setHeader('X-Token-Expires-Soon', 'true');
    }

    next();
  } catch (error) {
    next();
  }
}; 