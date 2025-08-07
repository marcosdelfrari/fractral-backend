import { Request, Response } from 'express';
export declare class OrderController {
    static createOrder(req: Request, res: Response): Promise<void>;
    static getOrderById(req: Request, res: Response): Promise<void>;
    static getUserOrders(req: Request, res: Response): Promise<void>;
    static getAllOrders(req: Request, res: Response): Promise<void>;
    static updateOrderStatus(req: Request, res: Response): Promise<void>;
    static cancelOrder(req: Request, res: Response): Promise<void>;
    static getOrderStats(req: Request, res: Response): Promise<void>;
    static getOrdersByStatus(req: Request, res: Response): Promise<void>;
    static getRecentOrders(req: Request, res: Response): Promise<void>;
}
