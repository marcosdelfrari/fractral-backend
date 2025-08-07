import { Request, Response, NextFunction } from 'express';
export interface SecureRequest extends Request {
    user?: {
        userId: number;
        role?: string;
    };
}
export declare const createRateLimit: (windowMs: number, max: number, message?: string) => import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const orderRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const cartRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const adminRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const sanitizeInput: (req: SecureRequest, res: Response, next: NextFunction) => void;
export declare const validateContentType: (req: SecureRequest, res: Response, next: NextFunction) => void;
export declare const validatePayloadSize: (maxSize?: number) => (req: SecureRequest, res: Response, next: NextFunction) => void;
export declare const securityLogger: (req: SecureRequest, res: Response, next: NextFunction) => void;
export declare const validateOrigin: (allowedOrigins?: string[]) => (req: SecureRequest, res: Response, next: NextFunction) => void;
export declare const detectAttacks: (req: SecureRequest, res: Response, next: NextFunction) => void;
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const morganConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
