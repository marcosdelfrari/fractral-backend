# 🎛️ Painel Administrativo - E-commerce Backend

## 📋 Visão Geral

O painel administrativo fornece ferramentas completas para gerenciar produtos, pedidos, estoque e usuários do e-commerce.

## 🔐 Autenticação

Para acessar o painel admin, você precisa:
1. Ter uma conta com role `admin`
2. Obter um token JWT através do fluxo de autenticação

### Fluxo de Autenticação Admin

```bash
# 1. Solicitar PIN
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'

# 2. Verificar PIN (o PIN é mostrado no console do servidor em desenvolvimento)
curl -X POST http://localhost:5000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","pin":"123456"}'

# Resposta incluirá o token JWT
```

## 📊 Endpoints do Painel Admin

### 1. Dashboard Principal

Obtém estatísticas gerais do sistema.

```bash
GET /api/admin/dashboard
```

**Resposta:**
```json
{
  "success": true,
  "dashboard": {
    "products": {
      "total": 8,
      "lowStock": 3,
      "outOfStock": 1
    },
    "orders": {
      "total": 6,
      "pending": 2,
      "confirmed": 1,
      "shipped": 1,
      "delivered": 1,
      "cancelled": 1
    },
    "users": {
      "total": 4,
      "active": 2
    },
    "revenue": {
      "total": 15299.89,
      "monthly": 8999.94
    }
  }
}
```

### 2. Sistema de Notificações

Obtém alertas importantes para o administrador.

```bash
GET /api/admin/notifications
```

**Resposta:**
```json
{
  "success": true,
  "notifications": [
    {
      "type": "error",
      "message": "1 produtos sem estoque",
      "priority": "high"
    },
    {
      "type": "warning",
      "message": "3 produtos com estoque baixo",
      "priority": "medium"
    },
    {
      "type": "info",
      "message": "2 pedidos aguardando confirmação",
      "priority": "medium"
    }
  ],
  "total": 3
}
```

## 📦 Gestão de Produtos

### Listar Produtos com Filtros

```bash
GET /api/admin/products?search=notebook&categoria=Eletrônicos&inStock=true&page=1&limit=10
```

**Parâmetros de Query:**
- `search`: Busca por nome ou descrição
- `categoria`: Filtrar por categoria
- `minPrice` / `maxPrice`: Faixa de preço
- `inStock`: true/false para filtrar por disponibilidade
- `orderBy`: Campo para ordenação (nome, preco, estoque, createdAt)
- `order`: asc/desc
- `page` / `limit`: Paginação

### Atualizar Produto

```bash
PUT /api/admin/products/:productId
```

**Body:**
```json
{
  "nome": "Notebook Dell Inspiron Pro",
  "preco": 3999.99,
  "estoque": 20,
  "categoria": "Eletrônicos"
}
```

### Deletar Produto

```bash
DELETE /api/admin/products/:productId
```

## 📈 Gestão de Estoque

### Produtos com Baixo Estoque

```bash
GET /api/admin/inventory/low-stock?threshold=10
```

### Atualizar Estoque em Lote

```bash
PUT /api/admin/inventory/update
```

**Body:**
```json
{
  "updates": [
    {
      "productId": 1,
      "quantity": 10,
      "operation": "add"  // ou "set"
    },
    {
      "productId": 2,
      "quantity": 5,
      "operation": "set"
    }
  ]
}
```

### Relatório de Estoque

```bash
GET /api/admin/inventory/report
```

**Resposta:**
```json
{
  "success": true,
  "report": {
    "totalProducts": 8,
    "totalValue": 45899.50,
    "totalItems": 123,
    "stockStatus": {
      "outOfStock": 1,
      "lowStock": 3,
      "normalStock": 4
    },
    "outOfStockProducts": [...],
    "lowStockProducts": [...],
    "byCategory": {
      "Eletrônicos": {
        "count": 1,
        "value": 52499.85,
        "items": 15
      }
    }
  }
}
```

## 📋 Gestão de Pedidos

### Listar Pedidos com Filtros

```bash
GET /api/admin/orders?status=pending&startDate=2025-01-01&page=1&limit=10
```

**Parâmetros de Query:**
- `status`: pending/confirmed/shipped/delivered/cancelled
- `userId`: Filtrar por usuário
- `startDate` / `endDate`: Período
- `minTotal` / `maxTotal`: Faixa de valor total
- `orderBy` / `order`: Ordenação
- `page` / `limit`: Paginação

### Atualizar Status de Múltiplos Pedidos

```bash
PUT /api/admin/orders/batch-status
```

**Body:**
```json
{
  "orderIds": [1, 2, 3],
  "status": "confirmed"
}
```

## 📊 Relatórios

### Relatório de Vendas

```bash
GET /api/admin/reports/sales?period=month
```

**Parâmetros:**
- `period`: day/week/month/year

**Resposta:**
```json
{
  "success": true,
  "report": {
    "period": "month",
    "startDate": "2025-07-06T18:00:00.000Z",
    "endDate": "2025-08-06T18:00:00.000Z",
    "totalOrders": 5,
    "totalRevenue": 15299.89,
    "averageOrderValue": 3059.97,
    "topProducts": [
      {
        "product": {...},
        "quantity": 3,
        "revenue": 6999.98
      }
    ],
    "categorySales": {
      "Eletrônicos": 6999.98,
      "Periféricos": 799.98
    },
    "ordersByStatus": {
      "pending": 2,
      "confirmed": 1,
      "shipped": 1,
      "delivered": 1
    }
  }
}
```

## 👥 Gestão de Usuários

### Listar Usuários

```bash
GET /api/admin/users?search=joao&hasOrders=true&page=1&limit=10
```

**Parâmetros:**
- `search`: Busca por email ou nome
- `hasOrders`: true/false para filtrar por usuários com/sem pedidos
- `orderBy` / `order`: Ordenação
- `page` / `limit`: Paginação

### Detalhes de Usuário

```bash
GET /api/admin/users/:userId
```

**Resposta:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "joao@example.com",
    "nome": "João Silva",
    "role": "user",
    "createdAt": "2025-08-06T18:00:00.000Z",
    "orders": [...],
    "stats": {
      "totalOrders": 2,
      "completedOrders": 1,
      "cancelledOrders": 0,
      "totalSpent": 7899.96,
      "averageOrderValue": 3949.98
    }
  }
}
```

## 🔒 Segurança

### Middlewares Aplicados

1. **Autenticação JWT**: Todos os endpoints requerem token válido
2. **Autorização Admin**: Verifica se o usuário tem role `admin`
3. **Rate Limiting**: Limite de requisições para prevenir abuso
4. **Sanitização**: Limpeza automática de inputs
5. **Validação**: Validação de tipos e formatos
6. **Auditoria**: Log de todas as ações administrativas

### Headers Necessários

```bash
Authorization: Bearer <jwt-token>
Content-Type: application/json  # Para POST/PUT
```

## 🎯 Casos de Uso Comuns

### 1. Processar Pedidos Pendentes

```bash
# 1. Listar pedidos pendentes
GET /api/admin/orders?status=pending

# 2. Confirmar múltiplos pedidos
PUT /api/admin/orders/batch-status
{
  "orderIds": [1, 2, 3],
  "status": "confirmed"
}
```

### 2. Reabastecer Produtos com Baixo Estoque

```bash
# 1. Identificar produtos com baixo estoque
GET /api/admin/inventory/low-stock?threshold=5

# 2. Atualizar estoque
PUT /api/admin/inventory/update
{
  "updates": [
    {"productId": 1, "quantity": 50, "operation": "add"}
  ]
}
```

### 3. Análise de Vendas Mensal

```bash
# 1. Obter relatório de vendas
GET /api/admin/reports/sales?period=month

# 2. Identificar produtos mais vendidos
# 3. Ajustar estoque baseado na demanda
```

## 🚨 Tratamento de Erros

Todos os endpoints retornam erros no formato:

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

### Códigos de Status HTTP

- `200`: Sucesso
- `400`: Requisição inválida
- `401`: Não autenticado
- `403`: Não autorizado (sem permissão admin)
- `404`: Recurso não encontrado
- `429`: Muitas requisições (rate limit)
- `500`: Erro interno do servidor

## 📝 Notas de Desenvolvimento

1. **Ambiente de Teste**: Use o script `scripts/seed-admin.js` para popular o banco
2. **Token de Teste**: Use `scripts/test-admin.js` para gerar tokens de teste
3. **Logs**: Todas as ações admin são registradas para auditoria
4. **Performance**: Use paginação para grandes conjuntos de dados

## 🔄 Fluxo de Trabalho Típico do Admin

1. **Login** → Obter token JWT
2. **Dashboard** → Verificar visão geral
3. **Notificações** → Identificar ações urgentes
4. **Pedidos** → Processar pedidos pendentes
5. **Estoque** → Verificar e reabastecer produtos
6. **Relatórios** → Analisar performance
7. **Usuários** → Gerenciar clientes

## 🛠️ Ferramentas Úteis

### Script de Teste Completo

```bash
# Executar todos os testes do admin
node scripts/test-admin.js

# Popular banco com dados de teste
node scripts/seed-admin.js
```

### Exemplo de Integração Frontend

```javascript
// Configuração do cliente API
const adminAPI = {
  baseURL: 'http://localhost:5000/api/admin',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

// Exemplo: Obter dashboard
async function getDashboard() {
  const response = await fetch(`${adminAPI.baseURL}/dashboard`, {
    headers: adminAPI.headers
  });
  return response.json();
}
```

## 📚 Recursos Adicionais

- [Documentação da API Principal](./README.md)
- [Exemplos de Requisições](./EXEMPLOS.md)
- [Configuração de Middlewares](./MIDDLEWARES.md)

---

💡 **Dica**: Para desenvolvimento, o PIN de autenticação é exibido no console do servidor. Em produção, será enviado por email.