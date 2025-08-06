# E-commerce Backend

API RESTful para sistema de e-commerce com funcionalidades de carrinho, pedidos e autenticação.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de PIN por email
- **Carrinho**: Adicionar, remover e gerenciar itens
- **Pedidos**: Criar, acompanhar e gerenciar pedidos
- **Produtos**: Listagem e criação de produtos
- **Segurança**: Middlewares de validação, autenticação e auditoria

## 🔐 Middlewares de Segurança Implementados

### Autenticação (`auth.middleware.ts`)
- Verificação de tokens JWT
- Validação de usuário no banco de dados
- Suporte a roles (admin/user)
- Middleware opcional de autenticação
- Verificação de expiração de token

### Validação (`validation.middleware.ts`)
- Validação de dados de entrada
- Validação de email e PIN
- Validação de produtos e quantidades
- Validação de endereços e métodos de pagamento
- Validação de status de pedidos

### Autorização (`authorization.middleware.ts`)
- Verificação de privilégios de administrador
- Controle de propriedade de recursos
- Permissões específicas para modificação de pedidos
- Permissões para cancelamento de pedidos

### Segurança (`security.middleware.ts`)
- Rate limiting para diferentes endpoints
- Sanitização de dados de entrada
- Detecção de ataques (SQL Injection, XSS)
- Headers de segurança (Helmet)
- Validação de Content-Type e tamanho de payload

### Auditoria (`audit.middleware.ts`)
- Logs de ações críticas
- Auditoria de autenticação
- Auditoria de acesso administrativo
- Auditoria de operações financeiras
- Relatórios de auditoria

## 📋 Rate Limiting

- **Autenticação**: 5 tentativas em 15 minutos
- **Pedidos**: 3 tentativas em 1 minuto
- **Carrinho**: 10 tentativas em 1 minuto
- **Admin**: 20 tentativas em 1 minuto

## 🛡️ Proteções de Segurança

- Detecção de SQL Injection
- Detecção de XSS
- Sanitização de dados
- Headers de segurança
- Validação de origem (CORS)
- Limitação de tamanho de payload

## 📊 Logs de Auditoria

O sistema gera logs para:
- Tentativas de acesso negado
- Ações administrativas
- Operações financeiras
- Tentativas de ataque
- Modificações de dados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Prisma CLI

### Instalação
```bash
npm install
```

### Configuração do Banco
```bash
npx prisma migrate dev
```

### Executar em Desenvolvimento
```bash
npm run dev
```

### Executar em Produção
```bash
npm run build
npm start
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
PORT=5000
```

## 📚 Documentação

- [Exemplos de Uso](EXEMPLOS.md)
- [Documentação dos Middlewares](MIDDLEWARES.md)

## 🛠️ Tecnologias

- **Runtime**: Node.js
- **Framework**: Express.js
- **Banco de Dados**: SQLite (Prisma)
- **Autenticação**: JWT
- **Validação**: Express Validator
- **Segurança**: Helmet, Rate Limiting
- **Logging**: Morgan

## 📈 Estrutura do Projeto

```
src/
├── config/           # Configurações
├── controllers/      # Controladores
├── middlewares/      # Middlewares de segurança
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── authorization.middleware.ts
│   ├── security.middleware.ts
│   └── audit.middleware.ts
├── models/          # Modelos de dados
├── routes/          # Rotas da API
├── services/        # Lógica de negócio
└── utils/           # Utilitários
```

## 🔍 Endpoints Principais

### Autenticação
- `POST /api/auth/request-pin` - Solicitar PIN
- `POST /api/auth/verify-pin` - Verificar PIN

### Carrinho
- `GET /api/cart` - Obter carrinho
- `POST /api/cart/items` - Adicionar item
- `PUT /api/cart/items/:id` - Atualizar quantidade
- `DELETE /api/cart/items/:id` - Remover item

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter pedido específico
- `PUT /api/orders/:id/status` - Atualizar status

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (admin)

## 🔒 Segurança

O sistema implementa múltiplas camadas de segurança:

1. **Autenticação**: JWT tokens com verificação no banco
2. **Autorização**: Controle de acesso baseado em roles
3. **Validação**: Validação rigorosa de dados de entrada
4. **Rate Limiting**: Proteção contra ataques de força bruta
5. **Sanitização**: Limpeza de dados potencialmente perigosos
6. **Auditoria**: Logs completos de todas as ações críticas

## 📊 Monitoramento

- Logs de segurança em tempo real
- Headers de resposta com informações de rate limiting
- Indicadores de expiração de token
- Relatórios de auditoria

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. 