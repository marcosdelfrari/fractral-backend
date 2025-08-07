"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const prisma_1 = require("../lib/prisma");
class Order {
    static async create(data) {
        return await prisma_1.prisma.order.create({
            data
        });
    }
    static async findById(id) {
        return await prisma_1.prisma.order.findUnique({
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
    static async findByUserId(userId) {
        return await prisma_1.prisma.order.findMany({
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
    static async findAll() {
        return await prisma_1.prisma.order.findMany({
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
    static async createFromCart(userId, shippingAddress, paymentMethod) {
        const cart = await prisma_1.prisma.cart.findUnique({
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
        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.product.preco * item.quantity);
        }, 0);
        for (const item of cart.items) {
            if (item.product.estoque < item.quantity) {
                throw new Error(`Produto ${item.product.nome} não tem estoque suficiente`);
            }
        }
        const order = await prisma_1.prisma.order.create({
            data: {
                userId,
                totalAmount,
                shippingAddress,
                paymentMethod,
                status: 'pending'
            }
        });
        const orderItems = await Promise.all(cart.items.map(async (item) => {
            const orderItem = await prisma_1.prisma.orderItem.create({
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
            await prisma_1.prisma.product.update({
                where: { id: item.productId },
                data: {
                    estoque: {
                        decrement: item.quantity
                    }
                }
            });
            return orderItem;
        }));
        await prisma_1.prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        return {
            ...order,
            items: orderItems
        };
    }
    static async updateStatus(orderId, status) {
        return await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
    }
    static async cancelOrder(orderId) {
        const order = await this.findById(orderId);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }
        if (order.status === 'delivered') {
            throw new Error('Não é possível cancelar um pedido entregue');
        }
        await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' }
        });
        if (order.status === 'pending') {
            for (const item of order.items) {
                await prisma_1.prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        estoque: {
                            increment: item.quantity
                        }
                    }
                });
            }
        }
        return await this.findById(orderId);
    }
    static async getOrderStats() {
        const orders = await prisma_1.prisma.order.findMany({
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
            stats[order.status]++;
        });
        return stats;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map