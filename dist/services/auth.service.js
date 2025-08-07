"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = require("../models/User");
const PinVerification_1 = require("../models/PinVerification");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
let transporter = null;
if (EMAIL_USER !== 'your-email@gmail.com' && EMAIL_PASS !== 'your-app-password') {
    transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
}
class AuthService {
    static generatePin() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    static generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    }
    static async sendPinEmail(email, pin) {
        if (transporter) {
            const mailOptions = {
                from: EMAIL_USER,
                to: email,
                subject: 'Seu PIN de acesso',
                html: `
          <h2>PIN de Acesso</h2>
          <p>Seu PIN de acesso é: <strong>${pin}</strong></p>
          <p>Este PIN expira em 5 minutos.</p>
          <p>Se você não solicitou este PIN, ignore este email.</p>
        `
            };
            await transporter.sendMail(mailOptions);
        }
        else {
            console.log(`\n📧 PIN enviado para ${email}: ${pin}\n`);
        }
    }
    static async requestPin(email) {
        try {
            await PinVerification_1.PinVerification.deleteExpiredPins();
            const pin = this.generatePin();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            await PinVerification_1.PinVerification.create({
                email,
                pin,
                expiresAt
            });
            await this.sendPinEmail(email, pin);
            return {
                success: true,
                message: 'PIN enviado com sucesso para seu email'
            };
        }
        catch (error) {
            console.error('Erro ao solicitar PIN:', error);
            return {
                success: false,
                message: 'Erro ao enviar PIN'
            };
        }
    }
    static async verifyPin(email, pin) {
        try {
            const pinVerification = await PinVerification_1.PinVerification.findByEmailAndPin(email, pin);
            if (!pinVerification) {
                return {
                    success: false,
                    message: 'PIN inválido ou expirado'
                };
            }
            await PinVerification_1.PinVerification.markAsUsed(pinVerification.id);
            let user = await User_1.User.findByEmail(email);
            if (!user) {
                user = await User_1.User.create({
                    email,
                    nome: email.split('@')[0]
                });
            }
            const token = this.generateToken(user.id);
            return {
                success: true,
                message: 'Login realizado com sucesso',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    nome: user.nome
                }
            };
        }
        catch (error) {
            console.error('Erro ao verificar PIN:', error);
            return {
                success: false,
                message: 'Erro ao verificar PIN'
            };
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map