import { prisma } from '../lib/prisma';

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

export class User {
  static async create(data: CreateUserData): Promise<IUser> {
    return await prisma.user.create({
      data
    });
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id: number): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }
} 