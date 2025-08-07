import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AdminController {
  // Dashboard principal com estatísticas gerais
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Estatísticas de produtos
      const totalProducts = await prisma.product.count();
      const lowStockProducts = await prisma.product.count({
        where: { estoque: { lte: 10 } }
      });
      const outOfStockProducts = await prisma.product.count({
        where: { estoque: 0 }
      });

      // Estatísticas de pedidos
      const totalOrders = await prisma.order.count();
      const pendingOrders = await prisma.order.count({
        where: { status: 'pending' }
      });
      const confirmedOrders = await prisma.order.count({
        where: { status: 'confirmed' }
      });
      const shippedOrders = await prisma.order.count({
        where: { status: 'shipped' }
      });
      const deliveredOrders = await prisma.order.count({
        where: { status: 'delivered' }
      });
      const cancelledOrders = await prisma.order.count({
        where: { status: 'cancelled' }
      });

      // Estatísticas de usuários
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
              }
            }
          }
        }
      });

      // Receita total
      const orders = await prisma.order.findMany({
        where: { status: { not: 'cancelled' } },
        include: { items: true }
      });
      
      const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => {
          return itemSum + (item.unitPrice * item.quantity);
        }, 0);
        return sum + orderTotal;
      }, 0);

      // Receita do mês atual
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);

      const monthlyOrders = await prisma.order.findMany({
        where: {
          status: { not: 'cancelled' },
          createdAt: { gte: currentMonthStart }
        },
        include: { items: true }
      });

      const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => {
          return itemSum + (item.unitPrice * item.quantity);
        }, 0);
        return sum + orderTotal;
      }, 0);

      res.status(200).json({
        success: true,
        dashboard: {
          products: {
            total: totalProducts,
            lowStock: lowStockProducts,
            outOfStock: outOfStockProducts
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            confirmed: confirmedOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders
          },
          users: {
            total: totalUsers,
            active: activeUsers
          },
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados do dashboard'
      });
    }
  }

  // Gestão de Produtos - Listar todos com filtros
  static async getProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { 
        search, 
        categoria, 
        minPrice, 
        maxPrice, 
        inStock,
        orderBy = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (search) {
        where.OR = [
          { nome: { contains: search as string, mode: 'insensitive' } },
          { descricao: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      if (categoria) {
        where.categoria = categoria;
      }

      if (minPrice || maxPrice) {
        where.preco = {};
        if (minPrice) where.preco.gte = parseFloat(minPrice as string);
        if (maxPrice) where.preco.lte = parseFloat(maxPrice as string);
      }

      if (inStock === 'true') {
        where.estoque = { gt: 0 };
      } else if (inStock === 'false') {
        where.estoque = 0;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: { [orderBy as string]: order },
          skip,
          take: limitNum
        }),
        prisma.product.count({ where })
      ]);

      res.status(200).json({
        success: true,
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos'
      });
    }
  }

  // Atualizar produto
  static async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { nome, descricao, preco, estoque, categoria, imagem } = req.body;

      const product = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          ...(nome && { nome }),
          ...(descricao && { descricao }),
          ...(preco !== undefined && { preco }),
          ...(estoque !== undefined && { estoque }),
          ...(categoria && { categoria }),
          ...(imagem && { imagem })
        }
      });

      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        product
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar produto'
      });
    }
  }

  // Deletar produto
  static async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { productId } = req.params;

      // Verificar se o produto está em algum pedido
      const ordersWithProduct = await prisma.orderItem.count({
        where: { productId: parseInt(productId) }
      });

      if (ordersWithProduct > 0) {
        res.status(400).json({
          success: false,
          message: 'Produto não pode ser deletado pois está em pedidos existentes'
        });
        return;
      }

      await prisma.product.delete({
        where: { id: parseInt(productId) }
      });

      res.status(200).json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar produto'
      });
    }
  }

  // Gestão de Estoque - Atualizar estoque em lote
  static async updateStock(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { updates } = req.body; // Array de { productId, quantity, operation: 'add' | 'set' }

      const results = await Promise.all(
        updates.map(async (update: any) => {
          const { productId, quantity, operation } = update;
          
          if (operation === 'add') {
            return await prisma.product.update({
              where: { id: productId },
              data: {
                estoque: { increment: quantity }
              }
            });
          } else {
            return await prisma.product.update({
              where: { id: productId },
              data: { estoque: quantity }
            });
          }
        })
      );

      res.status(200).json({
        success: true,
        message: 'Estoque atualizado com sucesso',
        products: results
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar estoque'
      });
    }
  }

  // Produtos com baixo estoque
  static async getLowStockProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { threshold = '10' } = req.query;
      
      const products = await prisma.product.findMany({
        where: {
          estoque: { lte: parseInt(threshold as string) }
        },
        orderBy: { estoque: 'asc' }
      });

      res.status(200).json({
        success: true,
        products,
        total: products.length
      });
    } catch (error) {
      console.error('Erro ao buscar produtos com baixo estoque:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos com baixo estoque'
      });
    }
  }

  // Gestão de Pedidos - Listar todos com filtros avançados
  static async getOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        status,
        userId,
        startDate,
        endDate,
        minTotal,
        maxTotal,
        orderBy = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (userId) {
        where.userId = parseInt(userId as string);
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate as string);
        if (endDate) where.createdAt.lte = new Date(endDate as string);
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                nome: true
              }
            },
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
          orderBy: { [orderBy as string]: order },
          skip,
          take: limitNum
        }),
        prisma.order.count({ where })
      ]);

      // Calcular total de cada pedido
      const ordersWithTotal = orders.map(order => {
        const total = order.items.reduce((sum, item) => {
          return sum + (item.unitPrice * item.quantity);
        }, 0);
        return { ...order, total };
      });

      // Filtrar por total se necessário
      let filteredOrders = ordersWithTotal;
      if (minTotal || maxTotal) {
        filteredOrders = ordersWithTotal.filter(order => {
          if (minTotal && order.total < parseFloat(minTotal as string)) return false;
          if (maxTotal && order.total > parseFloat(maxTotal as string)) return false;
          return true;
        });
      }

      res.status(200).json({
        success: true,
        orders: filteredOrders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar pedidos'
      });
    }
  }

  // Atualizar status de múltiplos pedidos
  static async updateOrdersStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { orderIds, status } = req.body;

      const results = await Promise.all(
        orderIds.map((orderId: number) =>
          prisma.order.update({
            where: { id: orderId },
            data: { status }
          })
        )
      );

      res.status(200).json({
        success: true,
        message: `${results.length} pedidos atualizados com sucesso`,
        orders: results
      });
    } catch (error) {
      console.error('Erro ao atualizar pedidos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar pedidos'
      });
    }
  }

  // Relatório de vendas
  static async getSalesReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { period = 'month' } = req.query; // day, week, month, year

      let startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Calcular estatísticas
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => {
          return itemSum + (item.unitPrice * item.quantity);
        }, 0);
        return sum + orderTotal;
      }, 0);

      // Produtos mais vendidos
      const productSales: { [key: number]: { product: any; quantity: number; revenue: number } } = {};
      
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              product: item.product,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.unitPrice * item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Vendas por categoria
      const categorySales: { [key: string]: number } = {};
      
      Object.values(productSales).forEach(({ product, revenue }) => {
        if (!categorySales[product.categoria]) {
          categorySales[product.categoria] = 0;
        }
        categorySales[product.categoria] += revenue;
      });

      res.status(200).json({
        success: true,
        report: {
          period,
          startDate,
          endDate: new Date(),
          totalOrders,
          totalRevenue,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          topProducts,
          categorySales,
          ordersByStatus: {
            pending: orders.filter(o => o.status === 'pending').length,
            confirmed: orders.filter(o => o.status === 'confirmed').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length
          }
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de vendas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório de vendas'
      });
    }
  }

  // Relatório de estoque
  static async getInventoryReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { estoque: 'asc' }
      });

      const totalProducts = products.length;
      const totalValue = products.reduce((sum, product) => {
        return sum + (product.preco * product.estoque);
      }, 0);

      const outOfStock = products.filter(p => p.estoque === 0);
      const lowStock = products.filter(p => p.estoque > 0 && p.estoque <= 10);
      const normalStock = products.filter(p => p.estoque > 10);

      // Agrupar por categoria
      const byCategory: { [key: string]: { count: number; value: number; items: number } } = {};
      
      products.forEach(product => {
        if (!byCategory[product.categoria]) {
          byCategory[product.categoria] = { count: 0, value: 0, items: 0 };
        }
        byCategory[product.categoria].count++;
        byCategory[product.categoria].value += product.preco * product.estoque;
        byCategory[product.categoria].items += product.estoque;
      });

      res.status(200).json({
        success: true,
        report: {
          totalProducts,
          totalValue,
          totalItems: products.reduce((sum, p) => sum + p.estoque, 0),
          stockStatus: {
            outOfStock: outOfStock.length,
            lowStock: lowStock.length,
            normalStock: normalStock.length
          },
          outOfStockProducts: outOfStock,
          lowStockProducts: lowStock,
          byCategory
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de estoque:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório de estoque'
      });
    }
  }

  // Gestão de Usuários
  static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        search,
        hasOrders,
        orderBy = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { nome: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      if (hasOrders === 'true') {
        where.orders = { some: {} };
      } else if (hasOrders === 'false') {
        where.orders = { none: {} };
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            _count: {
              select: { orders: true }
            }
          },
          orderBy: { [orderBy as string]: order },
          skip,
          take: limitNum
        }),
        prisma.user.count({ where })
      ]);

      res.status(200).json({
        success: true,
        users: users.map(user => ({
          ...user,
          totalOrders: user._count.orders
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários'
      });
    }
  }

  // Detalhes de um usuário específico
  static async getUserDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          orders: {
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
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      // Calcular estatísticas do usuário
      const totalSpent = user.orders.reduce((sum, order) => {
        if (order.status === 'cancelled') return sum;
        const orderTotal = order.items.reduce((itemSum, item) => {
          return itemSum + (item.unitPrice * item.quantity);
        }, 0);
        return sum + orderTotal;
      }, 0);

      const stats = {
        totalOrders: user.orders.length,
        completedOrders: user.orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: user.orders.filter(o => o.status === 'cancelled').length,
        totalSpent,
        averageOrderValue: user.orders.length > 0 ? totalSpent / user.orders.length : 0
      };

      res.status(200).json({
        success: true,
        user: {
          ...user,
          stats
        }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar detalhes do usuário'
      });
    }
  }

  // Sistema de notificações - Obter notificações importantes
  static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const notifications = [];

      // Produtos sem estoque
      const outOfStock = await prisma.product.count({
        where: { estoque: 0 }
      });
      if (outOfStock > 0) {
        notifications.push({
          type: 'error',
          message: `${outOfStock} produtos sem estoque`,
          priority: 'high'
        });
      }

      // Produtos com baixo estoque
      const lowStock = await prisma.product.count({
        where: { estoque: { gt: 0, lte: 10 } }
      });
      if (lowStock > 0) {
        notifications.push({
          type: 'warning',
          message: `${lowStock} produtos com estoque baixo`,
          priority: 'medium'
        });
      }

      // Pedidos pendentes
      const pendingOrders = await prisma.order.count({
        where: { status: 'pending' }
      });
      if (pendingOrders > 0) {
        notifications.push({
          type: 'info',
          message: `${pendingOrders} pedidos aguardando confirmação`,
          priority: 'medium'
        });
      }

      // Pedidos confirmados aguardando envio
      const confirmedOrders = await prisma.order.count({
        where: { status: 'confirmed' }
      });
      if (confirmedOrders > 0) {
        notifications.push({
          type: 'info',
          message: `${confirmedOrders} pedidos aguardando envio`,
          priority: 'high'
        });
      }

      res.status(200).json({
        success: true,
        notifications,
        total: notifications.length
      });
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar notificações'
      });
    }
  }
}