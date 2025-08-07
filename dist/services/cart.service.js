"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const Cart_1 = require("../models/Cart");
class CartService {
    static async getCart(userId) {
        try {
            return await Cart_1.Cart.findByUserId(userId);
        }
        catch (error) {
            throw new Error(`Erro ao buscar carrinho: ${error}`);
        }
    }
    static async addItemToCart(data) {
        try {
            return await Cart_1.Cart.addItem(data);
        }
        catch (error) {
            throw new Error(`Erro ao adicionar item ao carrinho: ${error}`);
        }
    }
    static async updateItemQuantity(data) {
        try {
            return await Cart_1.Cart.updateItemQuantity(data);
        }
        catch (error) {
            throw new Error(`Erro ao atualizar quantidade: ${error}`);
        }
    }
    static async removeItemFromCart(cartItemId) {
        try {
            await Cart_1.Cart.removeItem(cartItemId);
        }
        catch (error) {
            throw new Error(`Erro ao remover item do carrinho: ${error}`);
        }
    }
    static async clearCart(userId) {
        try {
            await Cart_1.Cart.clearCart(userId);
        }
        catch (error) {
            throw new Error(`Erro ao limpar carrinho: ${error}`);
        }
    }
    static async getCartTotal(userId) {
        try {
            return await Cart_1.Cart.getCartTotal(userId);
        }
        catch (error) {
            throw new Error(`Erro ao calcular total do carrinho: ${error}`);
        }
    }
    static async getCartSummary(userId) {
        try {
            const cart = await Cart_1.Cart.findByUserId(userId);
            const total = await Cart_1.Cart.getCartTotal(userId);
            return {
                items: cart?.items || [],
                total,
                itemCount: cart?.items.length || 0
            };
        }
        catch (error) {
            throw new Error(`Erro ao obter resumo do carrinho: ${error}`);
        }
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map