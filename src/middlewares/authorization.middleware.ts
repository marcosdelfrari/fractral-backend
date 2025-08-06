import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export interface AuthorizedRequest extends Request {
  user?: {
    userId: number;
    role?: string;
  };
}

// Middleware para verificar se o usuário é admin
export const requireAdmin = async (req: AuthorizedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Acesso negado - usuário não autenticado'
      });
      return;
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    // Por enquanto, vamos considerar admin se o email contém 'admin'
    // Em um sistema real, você teria uma coluna 'role' na tabela de usuários
    const isAdmin = user.email.includes('admin') || user.role === 'admin';
    
    if (!isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Acesso negado - requer privilégios de administrador'
      });
      return;
    }

    req.user.role = isAdmin ? 'admin' : 'user';
    next();
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se o usuário é o proprietário do recurso
export const requireOwnership = (resourceType: 'cart' | 'order' | 'user') => {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Acesso negado - usuário não autenticado'
        });
      }

      const resourceId = req.params.id || req.params.orderId || req.params.cartItemId;
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'ID do recurso não fornecido'
        });
      }

      // Verificar se o usuário é admin (admins podem acessar qualquer recurso)
      const user = await User.findById(req.user.userId);
      const isAdmin = user?.email.includes('admin') || user?.role === 'admin';
      
      if (isAdmin) {
        req.user.role = 'admin';
        return next();
      }

      // Para recursos específicos, verificar propriedade
      let isOwner = false;

      switch (resourceType) {
        case 'cart':
          // O carrinho já é filtrado por usuário no controller
          isOwner = true;
          break;
        case 'order':
          // Verificar se o pedido pertence ao usuário
          const { Order } = require('../models/Order');
          const order = await Order.findById(Number(resourceId));
          isOwner = order && order.userId === req.user.userId;
          break;
        case 'user':
          // Verificar se o usuário está acessando seus próprios dados
          isOwner = Number(resourceId) === req.user.userId;
          break;
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado - você não tem permissão para acessar este recurso'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para verificar se o usuário tem permissão para modificar pedidos
export const requireOrderModificationPermission = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado - usuário não autenticado'
      });
    }

    const orderId = req.params.orderId || req.params.id;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'ID do pedido não fornecido'
      });
    }

    // Verificar se o usuário é admin
    const user = await User.findById(req.user.userId);
    const isAdmin = user?.email.includes('admin') || user?.role === 'admin';
    
    if (isAdmin) {
      req.user.role = 'admin';
      return next();
    }

    // Verificar se o pedido pertence ao usuário
    const { Order } = require('../models/Order');
    const order = await Order.findById(Number(orderId));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado - você não tem permissão para modificar este pedido'
      });
    }

    // Verificar se o pedido pode ser modificado
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível modificar um pedido entregue ou cancelado'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de permissão de modificação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se o usuário tem permissão para cancelar pedidos
export const requireOrderCancellationPermission = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado - usuário não autenticado'
      });
    }

    const orderId = req.params.orderId || req.params.id;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'ID do pedido não fornecido'
      });
    }

    // Verificar se o usuário é admin
    const user = await User.findById(req.user.userId);
    const isAdmin = user?.email.includes('admin') || user?.role === 'admin';
    
    if (isAdmin) {
      req.user.role = 'admin';
      return next();
    }

    // Verificar se o pedido pertence ao usuário
    const { Order } = require('../models/Order');
    const order = await Order.findById(Number(orderId));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado - você não tem permissão para cancelar este pedido'
      });
    }

    // Verificar se o pedido pode ser cancelado
    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar um pedido entregue'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Pedido já foi cancelado'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de permissão de cancelamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}; 