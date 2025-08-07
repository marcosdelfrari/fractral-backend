"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinVerification = void 0;
const prisma_1 = require("../lib/prisma");
class PinVerification {
    static async create(data) {
        return await prisma_1.prisma.pinVerification.create({
            data
        });
    }
    static async findByEmailAndPin(email, pin) {
        return await prisma_1.prisma.pinVerification.findFirst({
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
    static async markAsUsed(id) {
        await prisma_1.prisma.pinVerification.update({
            where: { id },
            data: { used: true }
        });
    }
    static async deleteExpiredPins() {
        await prisma_1.prisma.pinVerification.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }
}
exports.PinVerification = PinVerification;
//# sourceMappingURL=PinVerification.js.map