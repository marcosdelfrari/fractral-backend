# Deploy no Render - Instruções

## ✅ Correções Aplicadas

### Problemas Identificados e Soluções:

1. **Problema**: Render tentava executar `node index.js` mas o projeto usa TypeScript
2. **Problema**: Faltavam scripts de build para produção
3. **Problema**: Configuração de DATABASE_URL não estava adequada para PostgreSQL

### Soluções Implementadas:

#### 1. Atualização do `package.json`:
```json
{
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "postbuild": "npx prisma generate",
    "start": "node dist/index.js",
    "render-build": "npm install && npm run build && npx prisma migrate deploy"
  }
}
```

#### 2. Criação do `render.yaml`:
```yaml
services:
  - type: web
    name: fractral-backend
    env: node
    plan: free
    buildCommand: npm run render-build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false # Set this in Render dashboard
      - key: JWT_SECRET
        sync: false # Set this in Render dashboard
```

#### 3. Configuração do Banco PostgreSQL:
- Schema atualizado para `provider = "postgresql"`
- DATABASE_URL configurada para Neon PostgreSQL

## 🚀 Como Fazer Deploy no Render

### Opção 1: Usando render.yaml (Recomendado)
1. Faça push das alterações para seu repositório GitHub
2. No Render Dashboard, crie um novo "Web Service"
3. Conecte seu repositório GitHub
4. O Render detectará automaticamente o `render.yaml`
5. Configure as variáveis de ambiente no dashboard:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_Ctsw6fSXelP9@ep-withered-meadow-acgdxx6u-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=seu-jwt-secret-aqui
   ```

### Opção 2: Configuração Manual
1. Build Command: `npm run render-build`
2. Start Command: `npm start`
3. Environment: `Node`
4. Plan: `Free`

## 🔧 Variáveis de Ambiente Necessárias

No dashboard do Render, configure:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Ctsw6fSXelP9@ep-withered-meadow-acgdxx6u-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=gere-um-secret-seguro-aqui
NODE_ENV=production
```

## 📝 Processo de Build

O comando `npm run render-build` executa:
1. `npm install` - Instala dependências
2. `npm run build` - Compila TypeScript para JavaScript
3. `npx prisma generate` - Gera o cliente Prisma
4. `npx prisma migrate deploy` - Aplica migrações no banco

## ✅ Verificações Locais

Antes do deploy, teste localmente:
```bash
npm run build
npm start
```

O servidor deve iniciar sem erros e estar disponível na porta configurada.

## 🎯 Próximos Passos

1. Faça push das alterações para GitHub
2. Configure o serviço no Render
3. Defina as variáveis de ambiente
4. Inicie o deploy

O deploy deve ser bem-sucedido com essas configurações! 🚀