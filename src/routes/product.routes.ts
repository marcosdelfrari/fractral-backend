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

// GET /products - Obter todos os produtos (público)
router.get('/', getAllProducts);

// POST /products - Criar produto (admin apenas)
router.post('/', 
  requireAdmin,
  productValidations.createProduct,
  auditDataModifications('product'),
  createProduct
);

export default router;
