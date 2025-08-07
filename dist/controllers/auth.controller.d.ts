import { Request, Response } from 'express';
export declare class AuthController {
    static requestPin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static verifyPin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
