"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async requestPin(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email é obrigatório'
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email inválido'
                });
            }
            const result = await auth_service_1.AuthService.requestPin(email);
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Erro no requestPin:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
    static async verifyPin(req, res) {
        try {
            const { email, pin } = req.body;
            if (!email || !pin) {
                return res.status(400).json({
                    success: false,
                    message: 'Email e PIN são obrigatórios'
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email inválido'
                });
            }
            if (!/^\d{6}$/.test(pin)) {
                return res.status(400).json({
                    success: false,
                    message: 'PIN deve ser um número de 6 dígitos'
                });
            }
            const result = await auth_service_1.AuthService.verifyPin(email, pin);
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    token: result.token,
                    user: result.user
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Erro no verifyPin:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map