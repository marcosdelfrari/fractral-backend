import { Request, Response, NextFunction } from 'express';
export interface ValidatedRequest extends Request {
    user?: {
        userId: number;
        role?: string;
    };
}
export declare const authValidations: {
    requestPin: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
    verifyPin: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const cartValidations: {
    addItem: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
    updateItem: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const orderValidations: {
    createOrder: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
    updateStatus: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const productValidations: {
    createProduct: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
};
export declare const adminValidations: {
    updateStock: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
    batchUpdateOrders: ((req: ValidatedRequest, res: Response, next: NextFunction) => void)[];
};
