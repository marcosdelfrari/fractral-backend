export interface IUser {
    id: number;
    email: string;
    nome: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserData {
    email: string;
    nome: string;
}
export declare class User {
    static create(data: CreateUserData): Promise<IUser>;
    static findByEmail(email: string): Promise<IUser | null>;
    static findById(id: number): Promise<IUser | null>;
}
