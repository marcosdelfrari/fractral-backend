"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganConfig = exports.helmetConfig = exports.detectAttacks = exports.validateOrigin = exports.securityLogger = exports.validatePayloadSize = exports.validateContentType = exports.sanitizeInput = exports.adminRateLimit = exports.cartRateLimit = exports.orderRateLimit = exports.authRateLimit = exports.createRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const createRateLimit = (windowMs, max, message) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: {
            success: false,
            message: message || `Muitas tentativas. Tente novamente em ${Math.ceil(windowMs / 1000 / 60)} minutos.`
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimit = createRateLimit;
exports.authRateLimit = (0, exports.createRateLimit)(15 * 60 * 1000, 5, 'Muitas tentativas de login. Tente novamente em 15 minutos.');
exports.orderRateLimit = (0, exports.createRateLimit)(60 * 1000, 3, 'Muitas tentativas de criação de pedidos. Tente novamente em 1 minuto.');
exports.cartRateLimit = (0, exports.createRateLimit)(60 * 1000, 10, 'Muitas tentativas de adição ao carrinho. Tente novamente em 1 minuto.');
exports.adminRateLimit = (0, exports.createRateLimit)(60 * 1000, 20, 'Muitas tentativas de acesso administrativo. Tente novamente em 1 minuto.');
const sanitizeInput = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string')
            return str;
        return str
            .trim()
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '');
    };
    const sanitizeObject = (obj) => {
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = sanitizeObject(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    };
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        const sanitizedQuery = {};
        for (const key in req.query) {
            sanitizedQuery[key] = sanitizeObject(req.query[key]);
        }
        Object.keys(sanitizedQuery).forEach(key => {
            req.query[key] = sanitizedQuery[key];
        });
    }
    if (req.params) {
        const sanitizedParams = {};
        for (const key in req.params) {
            sanitizedParams[key] = sanitizeObject(req.params[key]);
        }
        Object.keys(sanitizedParams).forEach(key => {
            req.params[key] = sanitizedParams[key];
        });
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
const validateContentType = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!contentType || !contentType.includes('application/json')) {
            res.status(400).json({
                success: false,
                message: 'Content-Type deve ser application/json'
            });
            return;
        }
    }
    next();
};
exports.validateContentType = validateContentType;
const validatePayloadSize = (maxSize = 1024 * 1024) => {
    return (req, res, next) => {
        const contentLength = parseInt(req.headers['content-length'] || '0');
        if (contentLength > maxSize) {
            res.status(413).json({
                success: false,
                message: 'Payload muito grande'
            });
            return;
        }
        next();
    };
};
exports.validatePayloadSize = validatePayloadSize;
const securityLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            userId: req.user?.userId || 'anonymous'
        };
        if (res.statusCode >= 400) {
            console.warn('🚨 Tentativa suspeita detectada:', logData);
        }
        if (req.url.includes('/admin') && req.user) {
            console.info('👑 Acesso administrativo:', logData);
        }
    });
    next();
};
exports.securityLogger = securityLogger;
const validateOrigin = (allowedOrigins = ['http://localhost:3000']) => {
    return (req, res, next) => {
        const origin = req.headers.origin;
        if (origin && !allowedOrigins.includes(origin)) {
            res.status(403).json({
                success: false,
                message: 'Origem não permitida'
            });
            return;
        }
        next();
    };
};
exports.validateOrigin = validateOrigin;
const detectAttacks = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const url = req.url.toLowerCase();
    const sqlInjectionPatterns = [
        /union\s+select/i,
        /drop\s+table/i,
        /insert\s+into/i,
        /delete\s+from/i,
        /update\s+set/i,
        /or\s+1\s*=\s*1/i,
        /';\s*drop\s+table/i
    ];
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
    ];
    const hasSqlInjection = sqlInjectionPatterns.some(pattern => pattern.test(url) || pattern.test(userAgent));
    const hasXSS = xssPatterns.some(pattern => pattern.test(url) || pattern.test(userAgent));
    if (hasSqlInjection || hasXSS) {
        console.warn('🚨 Tentativa de ataque detectada:', {
            url,
            userAgent,
            ip: req.ip,
            timestamp: new Date().toISOString()
        });
        res.status(403).json({
            success: false,
            message: 'Acesso negado'
        });
        return;
    }
    next();
};
exports.detectAttacks = detectAttacks;
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});
exports.morganConfig = (0, morgan_1.default)('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: {
        write: (message) => {
            console.log(message.trim());
        }
    }
});
//# sourceMappingURL=security.middleware.js.map