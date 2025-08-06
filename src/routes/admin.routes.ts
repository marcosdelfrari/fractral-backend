import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, checkTokenExpiration } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/authorization.middleware';
import { productValidations, adminValidations } from '../middlewares/validation.middleware';
import { 
  adminRateLimit,
  sanitizeInput,
  validateContentType,
  detectAttacks,
  validatePayloadSize
} from '../middlewares/security.middleware';
import { 
  auditAdminAccess,
  auditDataModifications,
  auditFinancialOperations
} from '../middlewares/audit.middleware';

const router = Router();

// Middlewares de segurança para todas as rotas admin
router.use(sanitizeInput);
router.use(validateContentType);
router.use(detectAttacks);
router.use(validatePayloadSize(2 * 1024 * 1024)); // 2MB max para uploads
router.use(adminRateLimit);

// Middleware de autenticação e autorização
router.use(authMiddleware);
router.use(checkTokenExpiration);
router.use(requireAdmin);
router.use(auditAdminAccess);

// ==================== DASHBOARD ====================
// GET /admin/dashboard - Dashboard principal
router.get('/dashboard', AdminController.getDashboard);

// GET /admin/notifications - Obter notificações importantes
router.get('/notifications', AdminController.getNotifications);

// ==================== GESTÃO DE PRODUTOS ====================
// GET /admin/products - Listar produtos com filtros
router.get('/products', AdminController.getProducts);

// PUT /admin/products/:productId - Atualizar produto
router.put('/products/:productId',
  productValidations.createProduct,
  auditDataModifications('product'),
  AdminController.updateProduct
);

// DELETE /admin/products/:productId - Deletar produto
router.delete('/products/:productId',
  auditDataModifications('product'),
  AdminController.deleteProduct
);

// ==================== GESTÃO DE ESTOQUE ====================
// GET /admin/inventory/low-stock - Produtos com baixo estoque
router.get('/inventory/low-stock', AdminController.getLowStockProducts);

// PUT /admin/inventory/update - Atualizar estoque em lote
router.put('/inventory/update',
  adminValidations.updateStock,
  auditDataModifications('inventory'),
  AdminController.updateStock
);

// GET /admin/inventory/report - Relatório de estoque
router.get('/inventory/report', AdminController.getInventoryReport);

// ==================== GESTÃO DE PEDIDOS ====================
// GET /admin/orders - Listar pedidos com filtros avançados
router.get('/orders', AdminController.getOrders);

// PUT /admin/orders/batch-status - Atualizar status de múltiplos pedidos
router.put('/orders/batch-status',
  adminValidations.batchUpdateOrders,
  auditDataModifications('order'),
  auditFinancialOperations,
  AdminController.updateOrdersStatus
);

// ==================== RELATÓRIOS ====================
// GET /admin/reports/sales - Relatório de vendas
router.get('/reports/sales', AdminController.getSalesReport);

// ==================== GESTÃO DE USUÁRIOS ====================
// GET /admin/users - Listar usuários
router.get('/users', AdminController.getUsers);

// GET /admin/users/:userId - Detalhes de um usuário
router.get('/users/:userId', AdminController.getUserDetails);

export default router;