# Middlewares de Validação e Autenticação

Este documento descreve os middlewares de validação e autenticação implementados no sistema de e-commerce.

## 🔐 Autenticação

### `auth.middleware.ts`

**Funcionalidades:**
- Verificação de tokens JWT
- Validação de usuário no banco de dados
- Suporte a roles (admin/user)
- Middleware opcional de autenticação
- Verificação de expiração de token

**Endpoints protegidos:**
- `/api/cart/*` - Todas as rotas do carrinho
- `/api/orders/*` - Todas as rotas de pedidos
- `/api/user/*` - Rotas de usuário
- `/api/products` (POST) - Criação de produtos (admin)

## ✅ Validação

### `validation.middleware.ts`

**Validações implementadas:**

#### Autenticação
- **requestPin**: Validação de email
- **verifyPin**: Validação de email e PIN (6 dígitos)

#### Carrinho
- **addItem**: Validação de productId e quantity
- **updateItem**: Validação de quantity e cartItemId

#### Pedidos
- **createOrder**: Validação de endereço e método de pagamento
- **updateStatus**: Validação de status e orderId

#### Produtos
- **createProduct**: Validação completa de todos os campos

## 🛡️ Autorização

### `authorization.middleware.ts`

**Funcionalidades:**
- Verificação de privilégios de administrador
- Controle de propriedade de recursos
- Permissões específicas para modificação de pedidos
- Permissões para cancelamento de pedidos

**Regras implementadas:**
- Admins podem acessar qualquer recurso
- Usuários só podem acessar seus próprios recursos
- Pedidos entregues não podem ser modificados
- Pedidos entregues não podem ser cancelados

## 🔒 Segurança

### `security.middleware.ts`

**Proteções implementadas:**

#### Rate Limiting
- **Autenticação**: 5 tentativas em 15 minutos
- **Pedidos**: 3 tentativas em 1 minuto
- **Carrinho**: 10 tentativas em 1 minuto
- **Admin**: 20 tentativas em 1 minuto

#### Sanitização
- Remoção de caracteres perigosos
- Sanitização de XSS
- Limpeza de event handlers

#### Detecção de Ataques
- Detecção de SQL Injection
- Detecção de XSS
- Validação de Content-Type
- Limitação de tamanho de payload

#### Headers de Segurança
- Helmet para headers de segurança
- HSTS habilitado
- CSP configurado
- Referrer Policy

## 📊 Auditoria

### `audit.middleware.ts`

**Logs implementados:**

#### Ações Críticas
- Criação de pedidos
- Modificações de dados
- Acessos administrativos
- Operações financeiras

#### Segurança
- Tentativas de acesso negado
- Autenticações (sucesso/falha)
- Ações suspeitas

#### Relatórios
- Geração de relatórios de auditoria
- Filtros por período e usuário
- Estatísticas de segurança

## 🚀 Como Usar

### 1. Middleware de Autenticação

```typescript
import { authMiddleware } from '../middlewares/auth.middleware';

// Aplicar em rotas que requerem autenticação
router.use(authMiddleware);
```

### 2. Middleware de Validação

```typescript
import { cartValidations } from '../middlewares/validation.middleware';

// Aplicar validação específica
router.post('/items', cartValidations.addItem, controller);
```

### 3. Middleware de Autorização

```typescript
import { requireAdmin } from '../middlewares/authorization.middleware';

// Aplicar para rotas administrativas
router.get('/admin/stats', requireAdmin, controller);
```

### 4. Middleware de Segurança

```typescript
import { sanitizeInput, detectAttacks } from '../middlewares/security.middleware';

// Aplicar globalmente
app.use(sanitizeInput);
app.use(detectAttacks);
```

### 5. Middleware de Auditoria

```typescript
import { auditFinancialOperations } from '../middlewares/audit.middleware';

// Aplicar em operações críticas
router.post('/orders', auditFinancialOperations, controller);
```

## 📋 Exemplos de Uso

### Rota com Validação Completa

```typescript
router.post('/cart/items', 
  cartValidations.addItem,        // Validação
  auditDataModifications('cart'), // Auditoria
  CartController.addItemToCart     // Controller
);
```

### Rota Administrativa

```typescript
router.get('/orders/admin/stats', 
  requireAdmin,                    // Autorização
  adminRateLimit,                  // Rate limiting
  auditAdminAccess,                // Auditoria
  OrderController.getOrderStats    // Controller
);
```

### Rota com Permissões Específicas

```typescript
router.put('/orders/:orderId/status', 
  orderValidations.updateStatus,           // Validação
  requireOrderModificationPermission,      // Autorização
  auditDataModifications('order'),         // Auditoria
  OrderController.updateOrderStatus        // Controller
);
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Segurança
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Email (para PIN)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Ambiente
NODE_ENV=development
```

### Configuração de Rate Limiting

```typescript
// Personalizar rate limiting
const customRateLimit = createRateLimit(
  60 * 1000, // 1 minuto
  10,         // 10 tentativas
  'Mensagem personalizada'
);
```

## 📈 Monitoramento

### Logs de Segurança

O sistema gera logs para:
- Tentativas de acesso negado
- Ações administrativas
- Operações financeiras
- Tentativas de ataque

### Headers de Resposta

- `X-Token-Expires-Soon`: Indica quando o token está próximo do vencimento
- Headers de rate limiting: Informações sobre limites de requisições

## 🛠️ Manutenção

### Adicionando Novas Validações

1. Adicione a validação em `validation.middleware.ts`
2. Importe e use nas rotas apropriadas
3. Teste com dados válidos e inválidos

### Adicionando Novas Autorizações

1. Crie a função de autorização em `authorization.middleware.ts`
2. Aplique nas rotas que precisam da autorização
3. Teste com usuários com e sem permissão

### Adicionando Novos Logs de Auditoria

1. Crie a função de auditoria em `audit.middleware.ts`
2. Aplique nas rotas que precisam ser auditadas
3. Configure o armazenamento dos logs

## 🔍 Troubleshooting

### Problemas Comuns

1. **Token inválido**: Verificar JWT_SECRET
2. **Rate limiting**: Aumentar limites se necessário
3. **CORS**: Configurar ALLOWED_ORIGINS
4. **Logs não aparecem**: Verificar console ou configurar banco de dados

### Debug

```typescript
// Habilitar logs detalhados
console.log('🔍 Debug:', {
  user: req.user,
  headers: req.headers,
  body: req.body
});
```

## 📚 Referências

- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Helmet](https://helmetjs.github.io/)
- [Express Validator](https://express-validator.github.io/)
- [JWT](https://jwt.io/) 