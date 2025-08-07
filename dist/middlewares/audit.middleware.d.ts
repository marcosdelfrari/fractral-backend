import { Request, Response, NextFunction } from 'express';
export interface AuditRequest extends Request {
    user?: {
        userId: number;
        role?: string;
        email?: string;
    };
}
export declare const auditCriticalActions: (action: string, resource: string) => (req: AuditRequest, res: Response, next: NextFunction) => void;
export declare const auditAuthentication: (req: AuditRequest, res: Response, next: NextFunction) => void;
export declare const auditAdminAccess: (req: AuditRequest, res: Response, next: NextFunction) => void;
export declare const auditFinancialOperations: (req: AuditRequest, res: Response, next: NextFunction) => void;
export declare const auditDataModifications: (resource: string) => (req: AuditRequest, res: Response, next: NextFunction) => void;
export declare const auditAccessDenied: (req: AuditRequest, res: Response, next: NextFunction) => void;
export declare const generateAuditReport: (startDate: Date, endDate: Date, userId?: number) => Promise<{
    period: {
        start: string;
        end: string;
    };
    totalActions: number;
    actionsByUser: {};
    actionsByType: {};
    securityEvents: never[];
    financialOperations: never[];
    adminActions: never[];
}>;
