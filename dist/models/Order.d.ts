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
export declare class Order {
    static create(data: CreateOrderData): Promise<IOrder>;
    static findById(id: number): Promise<IOrderWithItems | null>;
    static findByUserId(userId: number): Promise<IOrderWithItems[]>;
    static findAll(): Promise<IOrderWithItems[]>;
    static createFromCart(userId: number, shippingAddress: string, paymentMethod: string): Promise<IOrderWithItems>;
    static updateStatus(orderId: number, status: OrderStatus): Promise<IOrder>;
    static cancelOrder(orderId: number): Promise<IOrderWithItems>;
    static getOrderStats(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    }>;
}
