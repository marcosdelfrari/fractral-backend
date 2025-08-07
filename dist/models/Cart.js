"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const prisma_1 = require("../lib/prisma");
class Cart {
    static async create(data) {
        return await prisma_1.prisma.cart.create({
            data
        });
    }
    static async findByUserId(userId) {
        return await prisma_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                nome: true,
                                preco: true,
                                estoque: true
                            }
                        }
                    }
                }
            }
        });
    }
    static async findOrCreateByUserId(userId) {
        let cart = await this.findByUserId(userId);
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    nome: true,
                                    preco: true,
                                    estoque: true
                                }
                            }
                        }
                    }
                }
            });
        }
        return cart;
    }
    static async addItem(data) {
        const { userId, productId, quantity } = data;
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        if (product.estoque < quantity) {
            throw new Error('Quantidade insuficiente em estoque');
        }
        const cart = await this.findOrCreateByUserId(userId);
        const existingItem = await prisma_1.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        });
        if (existingItem) {
            return await prisma_1.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: {
                    product: {
                        select: {
                            id: true,
                            nome: true,
                            preco: true,
                            estoque: true
                        }
                    }
                }
            });
        }
        else {
            return await prisma_1.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            nome: true,
                            preco: true,
                            estoque: true
                        }
                    }
                }
            });
        }
    }
    static async updateItemQuantity(data) {
        const { cartItemId, quantity } = data;
        if (quantity <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }
        return await prisma_1.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
            include: {
                product: {
                    select: {
                        id: true,
                        nome: true,
                        preco: true,
                        estoque: true
                    }
                }
            }
        });
    }
    static async removeItem(cartItemId) {
        await prisma_1.prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    }
    static async clearCart(userId) {
        const cart = await this.findByUserId(userId);
        if (cart) {
            await prisma_1.prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }
    }
    static async getCartTotal(userId) {
        const cart = await this.findByUserId(userId);
        if (!cart)
            return 0;
        return cart.items.reduce((total, item) => {
            return total + (item.product?.preco || 0) * item.quantity;
        }, 0);
    }
}
exports.Cart = Cart;
//# sourceMappingURL=Cart.js.map