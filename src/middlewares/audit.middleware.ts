import { Request, Response, NextFunction } from 'express';

export interface AuditRequest extends Request {
  user?: {
    userId: number;
    role?: string;
    email?: string;
  };
}

// Interface para logs de auditoria
interface AuditLog {
  timestamp: string;
  userId?: number;
  userEmail?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string | number;
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  statusCode: number;
  duration: number;
  details?: any;
}

// Função para salvar log de auditoria
const saveAuditLog = async (log: AuditLog) => {
  try {
    // Em um sistema real, você salvaria isso no banco de dados
    // Por enquanto, vamos apenas logar no console
    console.log('📋 AUDIT LOG:', JSON.stringify(log, null, 2));
    
    // Aqui você poderia salvar no banco de dados
    // await AuditLogModel.create(log);
  } catch (error) {
    console.error('Erro ao salvar log de auditoria:', error);
  }
};

// Middleware para auditoria de ações críticas
export const auditCriticalActions = (action: string, resource: string) => {
  return (req: AuditRequest, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      const auditLog: AuditLog = {
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
      
      // Salvar log apenas para ações bem-sucedidas ou erros importantes
      if (res.statusCode >= 200 && res.statusCode < 400) {
        saveAuditLog(auditLog);
      } else if (res.statusCode >= 400) {
        // Log de erro com detalhes adicionais
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

// Middleware para auditoria de autenticação
export const auditAuthentication = (req: AuditRequest, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const auditLog: AuditLog = {
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

// Middleware para auditoria de acesso administrativo
export const auditAdminAccess = (req: AuditRequest, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const auditLog: AuditLog = {
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

// Middleware para auditoria de operações financeiras
export const auditFinancialOperations = (req: AuditRequest, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const auditLog: AuditLog = {
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

// Middleware para auditoria de modificações de dados
export const auditDataModifications = (resource: string) => {
  return (req: AuditRequest, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      const auditLog: AuditLog = {
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

// Middleware para auditoria de tentativas de acesso negado
export const auditAccessDenied = (req: AuditRequest, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    if (res.statusCode === 401 || res.statusCode === 403) {
      const duration = Date.now() - start;
      
      const auditLog: AuditLog = {
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

// Função para gerar relatório de auditoria
export const generateAuditReport = async (startDate: Date, endDate: Date, userId?: number) => {
  // Em um sistema real, você consultaria o banco de dados
  // Por enquanto, retornamos um exemplo
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