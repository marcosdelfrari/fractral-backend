import { prisma } from '../lib/prisma';

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

export class PinVerification {
  static async create(data: CreatePinData): Promise<IPinVerification> {
    return await prisma.pinVerification.create({
      data
    });
  }

  static async findByEmailAndPin(email: string, pin: string): Promise<IPinVerification | null> {
    return await prisma.pinVerification.findFirst({
      where: {
        email,
        pin,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
  }

  static async markAsUsed(id: number): Promise<void> {
    await prisma.pinVerification.update({
      where: { id },
      data: { used: true }
    });
  }

  static async deleteExpiredPins(): Promise<void> {
    await prisma.pinVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
} 