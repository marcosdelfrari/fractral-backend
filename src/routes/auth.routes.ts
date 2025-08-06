import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidations } from '../middlewares/validation.middleware';
import { authRateLimit, sanitizeInput, validateContentType, detectAttacks } from '../middlewares/security.middleware';
import { auditAuthentication } from '../middlewares/audit.middleware';

const router = Router();

// Middlewares de segurança para todas as rotas de auth
router.use(sanitizeInput);
router.use(validateContentType);
router.use(detectAttacks);
router.use(authRateLimit);
router.use(auditAuthentication);

// POST /auth/request-pin
router.post('/request-pin', 
  authValidations.requestPin,
  AuthController.requestPin
);

// POST /auth/verify-pin
router.post('/verify-pin', 
  authValidations.verifyPin,
  AuthController.verifyPin
);

export default router; 