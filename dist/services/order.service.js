"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = require("../models/Order");
class OrderService {
    static async createOrder(userId, shippingAddress, paymentMethod) {
        try {
            return await Order_1.Order.createFromCart(userId, shippingAddress, paymentMethod);
        }
        catch (error) {
            throw new Error(`Erro ao criar pedido: ${error}`);
        }
    }
    static async getOrderById(orderId) {
        try {
            return await Order_1.Order.findById(orderId);
        }
        catch (error) {
            throw new Error(`Erro ao buscar pedido: ${error}`);
        }
    }
    static async getUserOrders(userId) {
        try {
            return await Order_1.Order.findByUserId(userId);
        }
        catch (error) {
            throw new Error(`Erro ao buscar pedidos do usuário: ${error}`);
        }
    }
    static async getAllOrders() {
        try {
            return await Order_1.Order.findAll();
        }
        catch (error) {
            throw new Error(`Erro ao buscar todos os pedidos: ${error}`);
        }
    }
    static async updateOrderStatus(orderId, status) {
        try {
            await Order_1.Order.updateStatus(orderId, status);
            const order = await Order_1.Order.findById(orderId);
            if (!order) {
                throw new Error('Pedido não encontrado');
            }
            return order;
        }
        catch (error) {
            throw new Error(`Erro ao atualizar status do pedido: ${error}`);
        }
    }
    static async cancelOrder(orderId) {
        try {
            return await Order_1.Order.cancelOrder(orderId);
        }
        catch (error) {
            throw new Error(`Erro ao cancelar pedido: ${error}`);
        }
    }
    static async getOrderStats() {
        try {
            return await Order_1.Order.getOrderStats();
        }
        catch (error) {
            throw new Error(`Erro ao obter estatísticas dos pedidos: ${error}`);
        }
    }
    static async getOrdersByStatus(status) {
        try {
            const allOrders = await Order_1.Order.findAll();
            return allOrders.filter(order => order.status === status);
        }
        catch (error) {
            throw new Error(`Erro ao buscar pedidos por status: ${error}`);
        }
    }
    static async getRecentOrders(limit = 10) {
        try {
            const allOrders = await Order_1.Order.findAll();
            return allOrders.slice(0, limit);
        }
        catch (error) {
            throw new Error(`Erro ao buscar pedidos recentes: ${error}`);
        }
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map