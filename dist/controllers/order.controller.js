"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
class OrderController {
    static async createOrder(req, res) {
        try {
            const userId = req.user.id;
            const { shippingAddress, paymentMethod } = req.body;
            if (!shippingAddress || !paymentMethod) {
                res.status(400).json({
                    success: false,
                    message: 'shippingAddress e paymentMethod são obrigatórios'
                });
                return;
            }
            const order = await order_service_1.OrderService.createOrder(userId, shippingAddress, paymentMethod);
            res.status(201).json({
                success: true,
                data: order,
                message: 'Pedido criado com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao criar pedido'
            });
        }
    }
    static async getOrderById(req, res) {
        try {
            const { orderId } = req.params;
            const order = await order_service_1.OrderService.getOrderById(parseInt(orderId));
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao buscar pedido'
            });
        }
    }
    static async getUserOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await order_service_1.OrderService.getUserOrders(userId);
            res.json({
                success: true,
                data: orders
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao buscar pedidos do usuário'
            });
        }
    }
    static async getAllOrders(req, res) {
        try {
            const orders = await order_service_1.OrderService.getAllOrders();
            res.json({
                success: true,
                data: orders
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao buscar todos os pedidos'
            });
        }
    }
    static async updateOrderStatus(req, res) {
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
            const order = await order_service_1.OrderService.updateOrderStatus(parseInt(orderId), status);
            res.json({
                success: true,
                data: order,
                message: 'Status do pedido atualizado com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao atualizar status do pedido'
            });
        }
    }
    static async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;
            const order = await order_service_1.OrderService.cancelOrder(parseInt(orderId));
            res.json({
                success: true,
                data: order,
                message: 'Pedido cancelado com sucesso'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao cancelar pedido'
            });
        }
    }
    static async getOrderStats(req, res) {
        try {
            const stats = await order_service_1.OrderService.getOrderStats();
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao obter estatísticas dos pedidos'
            });
        }
    }
    static async getOrdersByStatus(req, res) {
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
            const orders = await order_service_1.OrderService.getOrdersByStatus(status);
            res.json({
                success: true,
                data: orders
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao buscar pedidos por status'
            });
        }
    }
    static async getRecentOrders(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const orders = await order_service_1.OrderService.getRecentOrders(limit);
            res.json({
                success: true,
                data: orders
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro ao buscar pedidos recentes'
            });
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map