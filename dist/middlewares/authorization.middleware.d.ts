import { Request, Response, NextFunction } from 'express';
export interface AuthorizedRequest extends Request {
    user?: {
        userId: number;
        role?: string;
    };
}
export declare const requireAdmin: (req: AuthorizedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireOwnership: (resourceType: "cart" | "order" | "user") => (req: AuthorizedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requireOrderModificationPermission: (req: AuthorizedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requireOrderCancellationPermission: (req: AuthorizedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
