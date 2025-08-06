import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

export interface SecureRequest extends Request {
  user?: {
    userId: number;
    role?: string;
  };
}

// Rate limiting para diferentes endpoints
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
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

// Rate limiting específico para autenticação
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutos
  5, // 5 tentativas
  'Muitas tentativas de login. Tente novamente em 15 minutos.'
);

// Rate limiting para criação de pedidos
export const orderRateLimit = createRateLimit(
  60 * 1000, // 1 minuto
  3, // 3 tentativas
  'Muitas tentativas de criação de pedidos. Tente novamente em 1 minuto.'
);

// Rate limiting para adição de itens ao carrinho
export const cartRateLimit = createRateLimit(
  60 * 1000, // 1 minuto
  10, // 10 tentativas
  'Muitas tentativas de adição ao carrinho. Tente novamente em 1 minuto.'
);

// Rate limiting para endpoints de admin
export const adminRateLimit = createRateLimit(
  60 * 1000, // 1 minuto
  20, // 20 tentativas
  'Muitas tentativas de acesso administrativo. Tente novamente em 1 minuto.'
);

// Middleware para sanitizar dados de entrada
export const sanitizeInput = (req: SecureRequest, res: Response, next: NextFunction) => {
  // Sanitizar strings
  const sanitizeString = (str: string): string => {
    if (typeof str !== 'string') return str;
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, ''); // Remove event handlers
  };

  // Sanitizar objeto
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitizar body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Para query e params, não podemos reatribuir diretamente
  // pois são read-only em versões mais recentes do Express
  // Vamos sanitizar os valores individualmente
  if (req.query) {
    const sanitizedQuery: any = {};
    for (const key in req.query) {
      sanitizedQuery[key] = sanitizeObject(req.query[key]);
    }
    // Usar Object.defineProperty para sobrescrever query
    Object.keys(sanitizedQuery).forEach(key => {
      (req.query as any)[key] = sanitizedQuery[key];
    });
  }
  
  if (req.params) {
    const sanitizedParams: any = {};
    for (const key in req.params) {
      sanitizedParams[key] = sanitizeObject(req.params[key]);
    }
    // Usar Object.defineProperty para sobrescrever params
    Object.keys(sanitizedParams).forEach(key => {
      (req.params as any)[key] = sanitizedParams[key];
    });
  }

  next();
};

// Middleware para validar Content-Type
export const validateContentType = (req: SecureRequest, res: Response, next: NextFunction): void => {
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

// Middleware para validar tamanho do payload
export const validatePayloadSize = (maxSize: number = 1024 * 1024) => {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
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

// Middleware para logging de segurança
export const securityLogger = (req: SecureRequest, res: Response, next: NextFunction) => {
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
    
    // Log de segurança para tentativas suspeitas
    if (res.statusCode >= 400) {
      console.warn('🚨 Tentativa suspeita detectada:', logData);
    }
    
    // Log de acesso administrativo
    if (req.url.includes('/admin') && req.user) {
      console.info('👑 Acesso administrativo:', logData);
    }
  });
  
  next();
};

// Middleware para validar origem da requisição (CORS)
export const validateOrigin = (allowedOrigins: string[] = ['http://localhost:3000']) => {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
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

// Middleware para detectar ataques comuns
export const detectAttacks = (req: SecureRequest, res: Response, next: NextFunction): void => {
  const userAgent = req.headers['user-agent'] || '';
  const url = req.url.toLowerCase();
  
  // Detectar tentativas de SQL injection
  const sqlInjectionPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /or\s+1\s*=\s*1/i,
    /';\s*drop\s+table/i
  ];
  
  // Detectar tentativas de XSS
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  // Verificar padrões suspeitos na URL
  const hasSqlInjection = sqlInjectionPatterns.some(pattern => 
    pattern.test(url) || pattern.test(userAgent)
  );
  
  const hasXSS = xssPatterns.some(pattern => 
    pattern.test(url) || pattern.test(userAgent)
  );
  
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

// Configuração do Helmet para segurança
export const helmetConfig = helmet({
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

// Configuração do Morgan para logging
export const morganConfig = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message: string) => {
      console.log(message.trim());
    }
  }
}); 