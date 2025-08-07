# 📚 Guia do Swagger - Fractral E-commerce API

## ✅ Swagger Configurado com Sucesso!

Sua API agora tem uma **interface Swagger interativa** na rota principal (`/`), transformando a página inicial em uma **documentação completa e testável** da API.

## 🚀 Como Acessar

### Desenvolvimento Local:
```
http://localhost:3000/
```

### Produção (Render):
```
https://seu-app.onrender.com/
```

## 🎯 O que você verá na rota principal (`/`):

### 1. **Interface Swagger UI Personalizada**
- ✅ Design customizado com cores da marca
- ✅ Título: "Fractral E-commerce API"
- ✅ Logo removido para visual limpo
- ✅ Documentação completa e interativa

### 2. **Seções Organizadas por Tags**
- 🔐 **Authentication** - Login via PIN
- 🛍️ **Products** - Gerenciamento de produtos
- 🛒 **Cart** - Carrinho de compras
- 📦 **Orders** - Pedidos
- 👤 **Users** - Gerenciamento de usuários
- ⚙️ **Admin** - Funcionalidades administrativas

### 3. **Funcionalidades Interativas**
- ✅ **Testar endpoints** diretamente na interface
- ✅ **Autenticação JWT** integrada
- ✅ **Exemplos** pré-configurados
- ✅ **Validação** de parâmetros
- ✅ **Códigos de resposta** detalhados

## 🔧 Recursos Disponíveis

### 📍 **Rotas Especiais:**
- `/` - Interface Swagger UI (sua nova tela inicial)
- `/health` - Health check da API
- `/api-docs.json` - Documentação em formato JSON

### 🔐 **Autenticação no Swagger:**
1. Use `/api/auth/request-pin` para solicitar PIN
2. Use `/api/auth/verify-pin` para obter token JWT
3. Clique em "Authorize" no topo da página
4. Cole o token JWT no formato: `Bearer <seu-token>`
5. Agora você pode testar rotas protegidas!

### 📝 **Exemplos de Uso:**

#### 1. **Fazer Login:**
```json
POST /api/auth/request-pin
{
  "email": "admin@exemplo.com",
  "nome": "Administrador"
}
```

#### 2. **Verificar PIN:**
```json
POST /api/auth/verify-pin
{
  "email": "admin@exemplo.com",
  "pin": "123456"
}
```

#### 3. **Criar Produto (Admin):**
```json
POST /api/products
{
  "nome": "iPhone 15",
  "descricao": "Smartphone Apple com 128GB",
  "preco": 4999.99,
  "estoque": 10,
  "categoria": "Eletrônicos"
}
```

## 🎨 **Personalização Aplicada:**

### CSS Customizado:
- Barra superior com cor `#2c3e50`
- Logo removido para visual limpo
- Título personalizado para "Fractral E-commerce API"

### Schemas Definidos:
- ✅ User, Product, Cart, Order
- ✅ CartItem, OrderItem
- ✅ Success/Error responses
- ✅ Validações e exemplos

## 📊 **Vantagens da Nova Interface:**

### Para Desenvolvimento:
- ✅ Teste de API sem Postman
- ✅ Documentação sempre atualizada
- ✅ Validação automática de parâmetros
- ✅ Exemplos prontos para usar

### Para Deploy/Produção:
- ✅ Demonstração profissional da API
- ✅ Documentação acessível publicamente
- ✅ Interface amigável para desenvolvedores
- ✅ Reduz necessidade de documentação externa

## 🚀 **Próximos Passos:**

1. **Faça o build e deploy:**
   ```bash
   npm run build
   npm start
   ```

2. **Acesse** `http://localhost:3000/` e veja sua nova interface!

3. **No Render**, após deploy, sua API terá uma **página inicial profissional** em vez de uma mensagem simples.

## 💡 **Dica Profissional:**
Agora quando alguém acessar a URL da sua API, verá uma **interface completa e interativa** em vez de apenas "API está rodando". Isso torna sua API muito mais profissional e fácil de usar!

---

**🎉 Sua API agora tem uma interface Swagger completa como página inicial!** 

Acesse `http://localhost:3000/` e explore todas as funcionalidades.