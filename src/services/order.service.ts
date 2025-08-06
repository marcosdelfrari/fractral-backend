import { Order, IOrderWithItems, OrderStatus } from '../models/Order';

export class OrderService {
  static async createOrder(
    userId: number,
    shippingAddress: string,
    paymentMethod: string
  ): Promise<IOrderWithItems> {
    try {
      return await Order.createFromCart(userId, shippingAddress, paymentMethod);
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error}`);
    }
  }

  static async getOrderById(orderId: number): Promise<IOrderWithItems | null> {
    try {
      return await Order.findById(orderId);
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error}`);
    }
  }

  static async getUserOrders(userId: number): Promise<IOrderWithItems[]> {
    try {
      return await Order.findByUserId(userId);
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos do usuário: ${error}`);
    }
  }

  static async getAllOrders(): Promise<IOrderWithItems[]> {
    try {
      return await Order.findAll();
    } catch (error) {
      throw new Error(`Erro ao buscar todos os pedidos: ${error}`);
    }
  }

  static async updateOrderStatus(orderId: number, status: OrderStatus): Promise<IOrderWithItems> {
    try {
      await Order.updateStatus(orderId, status);
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }
      return order;
    } catch (error) {
      throw new Error(`Erro ao atualizar status do pedido: ${error}`);
    }
  }

  static async cancelOrder(orderId: number): Promise<IOrderWithItems> {
    try {
      return await Order.cancelOrder(orderId);
    } catch (error) {
      throw new Error(`Erro ao cancelar pedido: ${error}`);
    }
  }

  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    try {
      return await Order.getOrderStats();
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas dos pedidos: ${error}`);
    }
  }

  static async getOrdersByStatus(status: OrderStatus): Promise<IOrderWithItems[]> {
    try {
      const allOrders = await Order.findAll();
      return allOrders.filter(order => order.status === status);
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos por status: ${error}`);
    }
  }

  static async getRecentOrders(limit: number = 10): Promise<IOrderWithItems[]> {
    try {
      const allOrders = await Order.findAll();
      return allOrders.slice(0, limit);
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos recentes: ${error}`);
    }
  }
} 