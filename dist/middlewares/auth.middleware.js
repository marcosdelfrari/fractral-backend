"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTokenExpiration = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const User_1 = require("../models/User");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
            return;
        }
        const decoded = auth_service_1.AuthService.verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
            return;
        }
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }
        req.user = {
            userId: decoded.userId,
            role: user.email.includes('admin') || user.role === 'admin' ? 'admin' : 'user',
            email: user.email
        };
        next();
    }
    catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return next();
        }
        const decoded = auth_service_1.AuthService.verifyToken(token);
        if (!decoded) {
            return next();
        }
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return next();
        }
        req.user = {
            userId: decoded.userId,
            role: user.email.includes('admin') || user.role === 'admin' ? 'admin' : 'user',
            email: user.email
        };
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const checkTokenExpiration = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return next();
        }
        const decoded = auth_service_1.AuthService.verifyToken(token);
        if (!decoded) {
            return next();
        }
        const tokenExp = decoded.exp * 1000;
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        if (tokenExp - now < oneHour) {
            res.setHeader('X-Token-Expires-Soon', 'true');
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.checkTokenExpiration = checkTokenExpiration;
//# sourceMappingURL=auth.middleware.js.map