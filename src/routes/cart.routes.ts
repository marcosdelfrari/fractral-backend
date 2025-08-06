import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware, checkTokenExpiration } from '../middlewares/auth.middleware';
import { cartValidations } from '../middlewares/validation.middleware';
import { cartRateLimit, sanitizeInput, validateContentType, detectAttacks, validatePayloadSize } from '../middlewares/security.middleware';
import { auditDataModifications } from '../middlewares/audit.middleware';

const router = Router();

// Middlewares de segurança para todas as rotas do carrinho
router.use(sanitizeInput);
router.use(validateContentType);
router.use(detectAttacks);
router.use(validatePayloadSize(1024 * 1024)); // 1MB max
router.use(cartRateLimit);

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);
router.use(checkTokenExpiration);

// GET /cart - Obter carrinho do usuário
router.get('/', CartController.getCart);

// POST /cart/items - Adicionar item ao carrinho
router.post('/items', 
  cartValidations.addItem,
  auditDataModifications('cart'),
  CartController.addItemToCart
);

// PUT /cart/items/:cartItemId - Atualizar quantidade de um item
router.put('/items/:cartItemId', 
  cartValidations.updateItem,
  auditDataModifications('cart'),
  CartController.updateItemQuantity
);

// DELETE /cart/items/:cartItemId - Remover item do carrinho
router.delete('/items/:cartItemId', 
  auditDataModifications('cart'),
  CartController.removeItemFromCart
);

// DELETE /cart - Limpar carrinho
router.delete('/', 
  auditDataModifications('cart'),
  CartController.clearCart
);

// GET /cart/summary - Obter resumo do carrinho
router.get('/summary', CartController.getCartSummary);

// GET /cart/total - Obter total do carrinho
router.get('/total', CartController.getCartTotal);

export default router; 