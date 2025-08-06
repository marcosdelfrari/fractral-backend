import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware, checkTokenExpiration } from '../middlewares/auth.middleware';
import { orderValidations } from '../middlewares/validation.middleware';
import { 
  requireAdmin, 
  requireOrderModificationPermission, 
  requireOrderCancellationPermission 
} from '../middlewares/authorization.middleware';
import { 
  orderRateLimit, 
  adminRateLimit, 
  sanitizeInput, 
  validateContentType, 
  detectAttacks, 
  validatePayloadSize 
} from '../middlewares/security.middleware';
import { 
  auditFinancialOperations, 
  auditDataModifications, 
  auditAdminAccess 
} from '../middlewares/audit.middleware';

const router = Router();

// Middlewares de segurança para todas as rotas de pedidos
router.use(sanitizeInput);
router.use(validateContentType);
router.use(detectAttacks);
router.use(validatePayloadSize(1024 * 1024)); // 1MB max
router.use(orderRateLimit);

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);
router.use(checkTokenExpiration);

// POST /orders - Criar novo pedido
router.post('/', 
  orderValidations.createOrder,
  auditFinancialOperations,
  OrderController.createOrder
);

// Rotas administrativas (devem vir antes das rotas com parâmetros)
// GET /orders/admin/all - Obter todos os pedidos (admin)
router.get('/admin/all', 
  requireAdmin,
  adminRateLimit,
  auditAdminAccess,
  OrderController.getAllOrders
);

// GET /orders/admin/stats - Obter estatísticas dos pedidos (admin)
router.get('/admin/stats', 
  requireAdmin,
  adminRateLimit,
  auditAdminAccess,
  OrderController.getOrderStats
);

// GET /orders/admin/recent - Obter pedidos recentes (admin)
router.get('/admin/recent', 
  requireAdmin,
  adminRateLimit,
  auditAdminAccess,
  OrderController.getRecentOrders
);

// GET /orders/admin/by-status/:status - Obter pedidos por status (admin)
router.get('/admin/by-status/:status', 
  requireAdmin,
  adminRateLimit,
  auditAdminAccess,
  OrderController.getOrdersByStatus
);

// GET /orders - Obter pedidos do usuário
router.get('/', OrderController.getUserOrders);

// GET /orders/:orderId - Obter pedido específico
router.get('/:orderId', OrderController.getOrderById);

// PUT /orders/:orderId/status - Atualizar status do pedido
router.put('/:orderId/status', 
  orderValidations.updateStatus,
  requireOrderModificationPermission,
  auditDataModifications('order'),
  OrderController.updateOrderStatus
);

// DELETE /orders/:orderId - Cancelar pedido
router.delete('/:orderId', 
  requireOrderCancellationPermission,
  auditDataModifications('order'),
  OrderController.cancelOrder
);

export default router; 