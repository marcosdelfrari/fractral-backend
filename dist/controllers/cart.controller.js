"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("../services/cart.service");
class CartController {
    static async getCart(req, res) {
        try {
            const userId = req.user.id;
            const cart = await cart_service_1.CartService.getCart(userId);
            res.json({
                success: true,
                data: cart
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao buscar carrinho'
            });
        }
    }
    static async addItemToCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            if (!productId || !quantity) {
                res.status(400).json({
                    success: false,
                    message: 'productId e quantity são obrigatórios'
                });
                return;
            }
            if (quantity <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Quantidade deve ser maior que zero'
                });
                return;
            }
            const cartItem = await cart_service_1.CartService.addItemToCart({
                userId,
                productId,
                quantity
            });
            res.status(201).json({
                success: true,
                data: cartItem,
                message: 'Item adicionado ao carrinho com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao adicionar item ao carrinho'
            });
        }
    }
    static async updateItemQuantity(req, res) {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;
            if (!quantity || quantity <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Quantidade deve ser maior que zero'
                });
                return;
            }
            const cartItem = await cart_service_1.CartService.updateItemQuantity({
                cartItemId: parseInt(cartItemId),
                quantity
            });
            res.json({
                success: true,
                data: cartItem,
                message: 'Quantidade atualizada com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao atualizar quantidade'
            });
        }
    }
    static async removeItemFromCart(req, res) {
        try {
            const { cartItemId } = req.params;
            await cart_service_1.CartService.removeItemFromCart(parseInt(cartItemId));
            res.json({
                success: true,
                message: 'Item removido do carrinho com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao remover item do carrinho'
            });
        }
    }
    static async clearCart(req, res) {
        try {
            const userId = req.user.id;
            await cart_service_1.CartService.clearCart(userId);
            res.json({
                success: true,
                message: 'Carrinho limpo com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao limpar carrinho'
            });
        }
    }
    static async getCartSummary(req, res) {
        try {
            const userId = req.user.id;
            const summary = await cart_service_1.CartService.getCartSummary(userId);
            res.json({
                success: true,
                data: summary
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao obter resumo do carrinho'
            });
        }
    }
    static async getCartTotal(req, res) {
        try {
            const userId = req.user.id;
            const total = await cart_service_1.CartService.getCartTotal(userId);
            res.json({
                success: true,
                data: { total }
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao calcular total do carrinho'
            });
        }
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map