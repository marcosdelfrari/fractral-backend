import { Request, Response } from 'express';
export declare class CartController {
    static getCart(req: Request, res: Response): Promise<void>;
    static addItemToCart(req: Request, res: Response): Promise<void>;
    static updateItemQuantity(req: Request, res: Response): Promise<void>;
    static removeItemFromCart(req: Request, res: Response): Promise<void>;
    static clearCart(req: Request, res: Response): Promise<void>;
    static getCartSummary(req: Request, res: Response): Promise<void>;
    static getCartTotal(req: Request, res: Response): Promise<void>;
}
