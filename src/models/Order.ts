import { prisma } from '../lib/prisma';

export interface IOrder {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: number;
    nome: string;
    preco: number;
  };
}

export interface IOrderWithItems extends IOrder {
  items: IOrderItem[];
  user?: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface CreateOrderData {
  userId: number;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

export interface CreateOrderItemData {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export class Order {
  static async create(data: CreateOrderData): Promise<IOrder> {
    return await prisma.order.create({
      data
    });
  }

  static async findById(id: number): Promise<IOrderWithItems | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nome: true,
                preco: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  static async findByUserId(userId: number): Promise<IOrderWithItems[]> {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nome: true,
                preco: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findAll(): Promise<IOrderWithItems[]> {
    return await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nome: true,
                preco: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async createFromCart(
    userId: number,
    shippingAddress: string,
    paymentMethod: string
  ): Promise<IOrderWithItems> {
    // Buscar carrinho do usuário
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Carrinho vazio');
    }

    // Calcular total
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.preco * item.quantity);
    }, 0);

    // Verificar estoque
    for (const item of cart.items) {
      if (item.product.estoque < item.quantity) {
        throw new Error(`Produto ${item.product.nome} não tem estoque suficiente`);
      }
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: 'pending'
      }
    });

    // Criar itens do pedido
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.preco
          },
          include: {
            product: {
              select: {
                id: true,
                nome: true,
                preco: true
              }
            }
          }
        });

        // Atualizar estoque
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            estoque: {
              decrement: item.quantity
            }
          }
        });

        return orderItem;
      })
    );

    // Limpar carrinho
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return {
      ...order,
      items: orderItems
    };
  }

  static async updateStatus(orderId: number, status: OrderStatus): Promise<IOrder> {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }

  static async cancelOrder(orderId: number): Promise<IOrderWithItems> {
    const order = await this.findById(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    if (order.status === 'delivered') {
      throw new Error('Não é possível cancelar um pedido entregue');
    }

    // Atualizar status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' }
    });

    // Se o pedido ainda não foi confirmado, devolver itens ao estoque
    if (order.status === 'pending') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            estoque: {
              increment: item.quantity
            }
          }
        });
      }
    }

    return await this.findById(orderId) as IOrderWithItems;
  }

  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    const orders = await prisma.order.findMany({
      select: { status: true }
    });

    const stats = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      stats[order.status as keyof typeof stats]++;
    });

    return stats;
  }
} 