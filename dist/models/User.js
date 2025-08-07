"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const prisma_1 = require("../lib/prisma");
class User {
    static async create(data) {
        return await prisma_1.prisma.user.create({
            data
        });
    }
    static async findByEmail(email) {
        return await prisma_1.prisma.user.findUnique({
            where: { email }
        });
    }
    static async findById(id) {
        return await prisma_1.prisma.user.findUnique({
            where: { id }
        });
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map