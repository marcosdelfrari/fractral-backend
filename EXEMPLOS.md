# Exemplos de Uso - Carrinho e Pedidos

Este arquivo contém exemplos práticos de como usar as funcionalidades de carrinho e pedidos da API.

## 🔐 Autenticação

Primeiro, você precisa se autenticar para usar as funcionalidades:

### 1. Solicitar PIN
```bash
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com"}'
```

### 2. Verificar PIN e obter token
```bash
curl -X POST http://localhost:5000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com","pin":"123456"}'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "nome": "usuario"
  }
}
```

## 🛒 Carrinho de Compras

### 1. Adicionar produto ao carrinho
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### 2. Ver carrinho
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "cartId": 1,
        "productId": 1,
        "quantity": 2,
        "product": {
          "id": 1,
          "nome": "Smartphone",
          "preco": 999.99,
          "estoque": 10
        }
      }
    ]
  }
}
```

### 3. Atualizar quantidade
```bash
curl -X PUT http://localhost:5000/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"quantity": 3}'
```

### 4. Remover item do carrinho
```bash
curl -X DELETE http://localhost:5000/api/cart/items/1 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 5. Ver total do carrinho
```bash
curl -X GET http://localhost:5000/api/cart/total \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 1999.98
  }
}
```

### 6. Ver resumo do carrinho
```bash
curl -X GET http://localhost:5000/api/cart/summary \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 1999.98,
    "itemCount": 1
  }
}
```

### 7. Limpar carrinho
```bash
curl -X DELETE http://localhost:5000/api/cart \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 📦 Pedidos

### 1. Criar pedido a partir do carrinho
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "shippingAddress": "Rua das Flores, 123 - São Paulo, SP",
    "paymentMethod": "credit_card"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "status": "pending",
    "totalAmount": 1999.98,
    "shippingAddress": "Rua das Flores, 123 - São Paulo, SP",
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "unitPrice": 999.99,
        "product": {
          "id": 1,
          "nome": "Smartphone",
          "preco": 999.99
        }
      }
    ]
  },
  "message": "Pedido criado com sucesso"
}
```

### 2. Ver pedidos do usuário
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 3. Ver pedido específico
```bash
curl -X GET http://localhost:5000/api/orders/1 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 4. Atualizar status do pedido (Admin)
```bash
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"status": "confirmed"}'
```

### 5. Cancelar pedido
```bash
curl -X DELETE http://localhost:5000/api/orders/1 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 📊 Estatísticas (Admin)

### 1. Ver todas as estatísticas
```bash
curl -X GET http://localhost:5000/api/orders/admin/stats \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 3,
    "confirmed": 2,
    "shipped": 2,
    "delivered": 2,
    "cancelled": 1
  }
}
```

### 2. Ver todos os pedidos (Admin)
```bash
curl -X GET http://localhost:5000/api/orders/admin/all \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 3. Ver pedidos por status (Admin)
```bash
curl -X GET http://localhost:5000/api/orders/admin/status/pending \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 4. Ver pedidos recentes (Admin)
```bash
curl -X GET http://localhost:5000/api/orders/admin/recent?limit=5 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 🔄 Fluxo Completo de Compra

### 1. Criar produtos (se necessário)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Smartphone",
    "descricao": "Smartphone de última geração",
    "preco": 999.99,
    "estoque": 10,
    "categoria": "Eletrônicos"
  }'
```

### 2. Adicionar produtos ao carrinho
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"productId": 1, "quantity": 2}'
```

### 3. Verificar carrinho
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 4. Finalizar compra
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "shippingAddress": "Rua das Flores, 123 - São Paulo, SP",
    "paymentMethod": "credit_card"
  }'
```

### 5. Acompanhar pedido
```bash
curl -X GET http://localhost:5000/api/orders/1 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## ⚠️ Tratamento de Erros

### Erro: Produto sem estoque
```json
{
  "success": false,
  "message": "Quantidade insuficiente em estoque"
}
```

### Erro: Carrinho vazio
```json
{
  "success": false,
  "message": "Carrinho vazio"
}
```

### Erro: Pedido não encontrado
```json
{
  "success": false,
  "message": "Pedido não encontrado"
}
```

### Erro: Não é possível cancelar pedido entregue
```json
{
  "success": false,
  "message": "Não é possível cancelar um pedido entregue"
}
```

## 📝 Status dos Pedidos

- `pending` - Pendente (aguardando confirmação)
- `confirmed` - Confirmado (pagamento aprovado)
- `shipped` - Enviado (em transporte)
- `delivered` - Entregue (finalizado)
- `cancelled` - Cancelado

## 🔧 Dicas de Uso

1. **Sempre verifique o estoque** antes de adicionar produtos ao carrinho
2. **Use o resumo do carrinho** para mostrar informações ao usuário
3. **Implemente validação** no frontend para quantidades válidas
4. **Mantenha o token JWT** em localStorage ou sessionStorage
5. **Trate os erros** adequadamente no frontend
6. **Use os endpoints de admin** para painel administrativo
7. **Implemente notificações** para mudanças de status dos pedidos 