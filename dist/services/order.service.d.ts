import { IOrderWithItems, OrderStatus } from '../models/Order';
export declare class OrderService {
    static createOrder(userId: number, shippingAddress: string, paymentMethod: string): Promise<IOrderWithItems>;
    static getOrderById(orderId: number): Promise<IOrderWithItems | null>;
    static getUserOrders(userId: number): Promise<IOrderWithItems[]>;
    static getAllOrders(): Promise<IOrderWithItems[]>;
    static updateOrderStatus(orderId: number, status: OrderStatus): Promise<IOrderWithItems>;
    static cancelOrder(orderId: number): Promise<IOrderWithItems>;
    static getOrderStats(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    }>;
    static getOrdersByStatus(status: OrderStatus): Promise<IOrderWithItems[]>;
    static getRecentOrders(limit?: number): Promise<IOrderWithItems[]>;
}
