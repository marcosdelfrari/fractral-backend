"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuditReport = exports.auditAccessDenied = exports.auditDataModifications = exports.auditFinancialOperations = exports.auditAdminAccess = exports.auditAuthentication = exports.auditCriticalActions = void 0;
const saveAuditLog = async (log) => {
    try {
        console.log('📋 AUDIT LOG:', JSON.stringify(log, null, 2));
    }
    catch (error) {
        console.error('Erro ao salvar log de auditoria:', error);
    }
};
const auditCriticalActions = (action, resource) => {
    return (req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            const auditLog = {
                timestamp: new Date().toISOString(),
                userId: req.user?.userId,
                userEmail: req.user?.email,
                userRole: req.user?.role,
                action,
                resource,
                resourceId: req.params.id || req.params.orderId || req.params.cartItemId,
                method: req.method,
                url: req.url,
                ip: req.ip || req.connection.remoteAddress || 'unknown',
                userAgent: req.headers['user-agent'],
                statusCode: res.statusCode,
                duration,
                details: {
                    body: req.body,
                    query: req.query,
                    params: req.params
                }
            };
            if (res.statusCode >= 200 && res.statusCode < 400) {
                saveAuditLog(auditLog);
            }
            else if (res.statusCode >= 400) {
                auditLog.details = {
                    ...auditLog.details,
                    error: true,
                    errorMessage: res.locals.errorMessage || 'Erro desconhecido'
                };
                saveAuditLog(auditLog);
            }
        });
        next();
    };
};
exports.auditCriticalActions = auditCriticalActions;
const auditAuthentication = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const auditLog = {
            timestamp: new Date().toISOString(),
            userId: req.user?.userId,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            action: 'authentication',
            resource: 'auth',
            method: req.method,
            url: req.url,
            ip: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            duration,
            details: {
                endpoint: req.url,
                success: res.statusCode >= 200 && res.statusCode < 400
            }
        };
        saveAuditLog(auditLog);
    });
    next();
};
exports.auditAuthentication = auditAuthentication;
const auditAdminAccess = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const auditLog = {
            timestamp: new Date().toISOString(),
            userId: req.user?.userId,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            action: 'admin_access',
            resource: 'admin',
            method: req.method,
            url: req.url,
            ip: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            duration,
            details: {
                adminAction: req.url,
                success: res.statusCode >= 200 && res.statusCode < 400
            }
        };
        saveAuditLog(auditLog);
    });
    next();
};
exports.auditAdminAccess = auditAdminAccess;
const auditFinancialOperations = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const auditLog = {
            timestamp: new Date().toISOString(),
            userId: req.user?.userId,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            action: 'financial_operation',
            resource: 'order',
            resourceId: req.params.orderId || req.params.id,
            method: req.method,
            url: req.url,
            ip: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            duration,
            details: {
                operation: req.method,
                orderData: req.body,
                success: res.statusCode >= 200 && res.statusCode < 400
            }
        };
        saveAuditLog(auditLog);
    });
    next();
};
exports.auditFinancialOperations = auditFinancialOperations;
const auditDataModifications = (resource) => {
    return (req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            const auditLog = {
                timestamp: new Date().toISOString(),
                userId: req.user?.userId,
                userEmail: req.user?.email,
                userRole: req.user?.role,
                action: 'data_modification',
                resource,
                resourceId: req.params.id || req.params.orderId || req.params.cartItemId,
                method: req.method,
                url: req.url,
                ip: req.ip || req.connection.remoteAddress || 'unknown',
                userAgent: req.headers['user-agent'],
                statusCode: res.statusCode,
                duration,
                details: {
                    modificationType: req.method,
                    modifiedData: req.body,
                    success: res.statusCode >= 200 && res.statusCode < 400
                }
            };
            saveAuditLog(auditLog);
        });
        next();
    };
};
exports.auditDataModifications = auditDataModifications;
const auditAccessDenied = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        if (res.statusCode === 401 || res.statusCode === 403) {
            const duration = Date.now() - start;
            const auditLog = {
                timestamp: new Date().toISOString(),
                userId: req.user?.userId,
                userEmail: req.user?.email,
                userRole: req.user?.role,
                action: 'access_denied',
                resource: 'security',
                method: req.method,
                url: req.url,
                ip: req.ip || req.connection.remoteAddress || 'unknown',
                userAgent: req.headers['user-agent'],
                statusCode: res.statusCode,
                duration,
                details: {
                    reason: res.statusCode === 401 ? 'Unauthorized' : 'Forbidden',
                    attemptedAccess: req.url,
                    userAgent: req.headers['user-agent']
                }
            };
            saveAuditLog(auditLog);
        }
    });
    next();
};
exports.auditAccessDenied = auditAccessDenied;
const generateAuditReport = async (startDate, endDate, userId) => {
    return {
        period: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        },
        totalActions: 0,
        actionsByUser: {},
        actionsByType: {},
        securityEvents: [],
        financialOperations: [],
        adminActions: []
    };
};
exports.generateAuditReport = generateAuditReport;
//# sourceMappingURL=audit.middleware.js.map