import { Router } from 'express';
import { getAllProducts, createProduct } from '../controllers/product.controller';
import { productValidations } from '../middlewares/validation.middleware';
import { requireAdmin } from '../middlewares/authorization.middleware';
import { 
  sanitizeInput, 
  validateContentType, 
  detectAttacks, 
  validatePayloadSize 
} from '../middlewares/security.middleware';
import { auditDataModifications } from '../middlewares/audit.middleware';

const router = Router();

// Middlewares de segurança para todas as rotas de produtos
router.use(sanitizeInput);
router.use(validateContentType);
router.use(detectAttacks);
router.use(validatePayloadSize(1024 * 1024)); // 1MB max

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista de todos os produtos disponíveis no sistema
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número máximo de produtos a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de produtos a pular (paginação)
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     description: Cria um novo produto no sistema (apenas administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - estoque
 *               - categoria
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Smartphone XYZ
 *                 description: Nome do produto
 *               descricao:
 *                 type: string
 *                 example: Smartphone com tela de 6.5 polegadas e 128GB de armazenamento
 *                 description: Descrição detalhada do produto
 *               preco:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 899.99
 *                 description: Preço do produto
 *               estoque:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *                 description: Quantidade em estoque
 *               categoria:
 *                 type: string
 *                 example: Eletrônicos
 *                 description: Categoria do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
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
 *                   example: Produto criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de acesso requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', 
  requireAdmin,
  productValidations.createProduct,
  auditDataModifications('product'),
  createProduct
);

export default router;
