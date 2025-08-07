"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOrderCancellationPermission = exports.requireOrderModificationPermission = exports.requireOwnership = exports.requireAdmin = void 0;
const User_1 = require("../models/User");
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Acesso negado - usuário não autenticado'
            });
            return;
        }
        const user = await User_1.User.findById(req.user.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }
        const isAdmin = user.email.includes('admin') || user.role === 'admin';
        if (!isAdmin) {
            res.status(403).json({
                success: false,
                message: 'Acesso negado - requer privilégios de administrador'
            });
            return;
        }
        req.user.role = isAdmin ? 'admin' : 'user';
        next();
    }
    catch (error) {
        console.error('Erro na verificação de admin:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.requireAdmin = requireAdmin;
const requireOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Acesso negado - usuário não autenticado'
                });
            }
            const resourceId = req.params.id || req.params.orderId || req.params.cartItemId;
            if (!resourceId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do recurso não fornecido'
                });
            }
            const user = await User_1.User.findById(req.user.userId);
            const isAdmin = user?.email.includes('admin') || user?.role === 'admin';
            if (isAdmin) {
                req.user.role = 'admin';
                return next();
            }
            let isOwner = false;
            switch (resourceType) {
                case 'cart':
                    isOwner = true;
                    break;
                case 'order':
                    const { Order } = require('../models/Order');
                    const order = await Order.findById(Number(resourceId));
                    isOwner = order && order.userId === req.user.userId;
                    break;
                case 'user':
                    isOwner = Number(resourceId) === req.user.userId;
                    break;
            }
            if (!isOwner) {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso negado - você não tem permissão para acessar este recurso'
                });
            }
            next();
        }
        catch (error) {
            console.error('Erro na verificação de propriedade:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    };
};
exports.requireOwnership = requireOwnership;
const requireOrderModificationPermission = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Acesso negado - usuário não autenticado'
            });
        }
        const orderId = req.params.orderId || req.params.id;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'ID do pedido não fornecido'
            });
        }
        const user = await User_1.User.findById(req.user.userId);
        const isAdmin = user?.email.includes('admin') || user?.role === 'admin';
        if (isAdmin) {
            req.user.role = 'admin';
            return next();
        }
        const { Order } = require('../models/Order');
        const order = await Order.findById(Number(orderId));
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }
        if (order.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado - você não tem permissão para modificar este pedido'
            });
        }
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Não é possível modificar um pedido entregue ou cancelado'
            });
        }
        next();
    }
    catch (error) {
        console.error('Erro na verificação de permissão de modificação:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.requireOrderModificationPermission = requireOrderModificationPermission;
const requireOrderCancellationPermission = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Acesso negado - usuário não autenticado'
            });
        }
        const orderId = req.params.orderId || req.params.id;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'ID do pedido não fornecido'
            });
        }
        const user = await User_1.User.findById(req.user.userId);
        const isAdmin = user?.email.includes('admin') || user?.role === 'admin';
        if (isAdmin) {
            req.user.role = 'admin';
            return next();
        }
        const { Order } = require('../models/Order');
        const order = await Order.findById(Number(orderId));
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }
        if (order.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado - você não tem permissão para cancelar este pedido'
            });
        }
        if (order.status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'Não é possível cancelar um pedido entregue'
            });
        }
        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Pedido já foi cancelado'
            });
        }
        next();
    }
    catch (error) {
        console.error('Erro na verificação de permissão de cancelamento:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.requireOrderCancellationPermission = requireOrderCancellationPermission;
//# sourceMappingURL=authorization.middleware.js.map