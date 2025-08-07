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

/**
 * @swagger
 * /api/auth/request-pin:
 *   post:
 *     summary: Solicita um PIN de verificação
 *     description: Gera e envia um PIN de 6 dígitos para o email do usuário para autenticação
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nome
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *                 description: Email do usuário
 *               nome:
 *                 type: string
 *                 example: João Silva
 *                 description: Nome completo do usuário
 *     responses:
 *       200:
 *         description: PIN enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Muitas tentativas - Rate limit atingido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/request-pin', 
  authValidations.requestPin,
  AuthController.requestPin
);

/**
 * @swagger
 * /api/auth/verify-pin:
 *   post:
 *     summary: Verifica o PIN e realiza login
 *     description: Valida o PIN de 6 dígitos e retorna um token JWT para autenticação
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pin
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *                 description: Email do usuário
 *               pin:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 example: "123456"
 *                 description: PIN de 6 dígitos recebido por email
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                       description: Token JWT para autenticação
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: PIN inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Muitas tentativas - Rate limit atingido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/verify-pin', 
  authValidations.verifyPin,
  AuthController.verifyPin
);

export default router; 