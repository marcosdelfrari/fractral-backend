// Script para testar os endpoints do painel admin
const jwt = require('jsonwebtoken');

// Gerar um token de teste para o admin (em produção, use o fluxo de autenticação real)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const adminToken = jwt.sign({ userId: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

console.log('🔑 Token de teste para admin gerado:');
console.log(adminToken);
console.log('\n📝 Use este token no header Authorization: Bearer ' + adminToken);

console.log('\n🧪 Exemplos de comandos para testar o painel admin:\n');

console.log('1. Dashboard:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/dashboard`);

console.log('\n2. Notificações:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/notifications`);

console.log('\n3. Produtos:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/products`);

console.log('\n4. Produtos com baixo estoque:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/inventory/low-stock`);

console.log('\n5. Relatório de estoque:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/inventory/report`);

console.log('\n6. Pedidos:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/orders`);

console.log('\n7. Relatório de vendas:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/reports/sales`);

console.log('\n8. Usuários:');
console.log(`curl -H "Authorization: Bearer ${adminToken}" http://localhost:5000/api/admin/users`);

console.log('\n9. Atualizar estoque (exemplo):');
console.log(`curl -X PUT -H "Authorization: Bearer ${adminToken}" -H "Content-Type: application/json" \\
  -d '{"updates":[{"productId":1,"quantity":10,"operation":"add"}]}' \\
  http://localhost:5000/api/admin/inventory/update`);

console.log('\n10. Atualizar status de pedidos (exemplo):');
console.log(`curl -X PUT -H "Authorization: Bearer ${adminToken}" -H "Content-Type: application/json" \\
  -d '{"orderIds":[1,2],"status":"confirmed"}' \\
  http://localhost:5000/api/admin/orders/batch-status`);