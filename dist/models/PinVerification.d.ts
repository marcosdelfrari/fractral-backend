export interface IPinVerification {
    id: number;
    email: string;
    pin: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
export interface CreatePinData {
    email: string;
    pin: string;
    expiresAt: Date;
}
export declare class PinVerification {
    static create(data: CreatePinData): Promise<IPinVerification>;
    static findByEmailAndPin(email: string, pin: string): Promise<IPinVerification | null>;
    static markAsUsed(id: number): Promise<void>;
    static deleteExpiredPins(): Promise<void>;
}
