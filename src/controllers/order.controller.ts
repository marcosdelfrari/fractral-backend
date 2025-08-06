import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { shippingAddress, paymentMethod } = req.body;

      if (!shippingAddress || !paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'shippingAddress e paymentMethod são obrigatórios'
        });
        return;
      }

      const order = await OrderService.createOrder(userId, shippingAddress, paymentMethod);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Pedido criado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar pedido'
      });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(parseInt(orderId));

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar pedido'
      });
    }
  }

  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const orders = await OrderService.getUserOrders(userId);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar pedidos do usuário'
      });
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await OrderService.getAllOrders();

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar todos os pedidos'
      });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
        return;
      }

      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
        return;
      }

      const order = await OrderService.updateOrderStatus(parseInt(orderId), status);

      res.json({
        success: true,
        data: order,
        message: 'Status do pedido atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar status do pedido'
      });
    }
  }

  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await OrderService.cancelOrder(parseInt(orderId));

      res.json({
        success: true,
        data: order,
        message: 'Pedido cancelado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao cancelar pedido'
      });
    }
  }

  static async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await OrderService.getOrderStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter estatísticas dos pedidos'
      });
    }
  }

  static async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
        return;
      }

      const orders = await OrderService.getOrdersByStatus(status as any);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar pedidos por status'
      });
    }
  }

  static async getRecentOrders(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const orders = await OrderService.getRecentOrders(limit);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar pedidos recentes'
      });
    }
  }
} 