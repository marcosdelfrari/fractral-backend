export declare class AuthService {
    static generatePin(): string;
    static generateToken(userId: number): string;
    static verifyToken(token: string): any;
    static sendPinEmail(email: string, pin: string): Promise<void>;
    static requestPin(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    static verifyPin(email: string, pin: string): Promise<{
        success: boolean;
        message: string;
        token?: string;
        user?: any;
    }>;
}
