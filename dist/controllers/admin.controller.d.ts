import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare class AdminController {
    static getDashboard(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getProducts(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateProduct(req: AuthenticatedRequest, res: Response): Promise<void>;
    static deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateStock(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getLowStockProducts(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getOrders(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateOrdersStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getSalesReport(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getInventoryReport(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getUserDetails(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getNotifications(req: AuthenticatedRequest, res: Response): Promise<void>;
}
