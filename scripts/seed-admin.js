// Script para popular o banco com dados de teste para o painel admin
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.pinVerification.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Dados anteriores removidos');

    // Criar produtos
    const products = await Promise.all([
      prisma.product.create({
        data: {
          nome: 'Notebook Dell Inspiron',
          descricao: 'Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD',
          preco: 3499.99,
          estoque: 15,
          categoria: 'Eletrônicos',

        }
      }),
      prisma.product.create({
        data: {
          nome: 'Mouse Logitech MX Master',
          descricao: 'Mouse sem fio profissional com tecnologia Darkfield',
          preco: 399.99,
          estoque: 3, // Baixo estoque
          categoria: 'Periféricos',
        }
      }),
      prisma.product.create({
        data: {
          nome: 'Teclado Mecânico Redragon',
          descricao: 'Teclado mecânico gamer RGB com switches blue',
          preco: 299.99,
          estoque: 0, // Sem estoque
          categoria: 'Periféricos'
        }
      }),
      prisma.product.create({
        data: {
          nome: 'Monitor LG 27"',
          descricao: 'Monitor LED Full HD 27 polegadas, 75Hz, IPS',
          preco: 1299.99,
          estoque: 8, // Baixo estoque
          categoria: 'Monitores'
        }
      }),
      prisma.product.create({
        data: {
          nome: 'Headset HyperX Cloud',
          descricao: 'Headset gamer com microfone removível e som surround 7.1',
          preco: 349.99,
          estoque: 25,
          categoria: 'Áudio'
        }
      }),
      prisma.product.create({
        data: {
          nome: 'Webcam Logitech C920',
          descricao: 'Webcam Full HD 1080p com microfone estéreo',
          preco: 499.99,
          estoque: 12,
          categoria: 'Periféricos'
        }
      }),
      prisma.product.create({
        data: {
          nome: 'SSD Kingston 480GB',
          descricao: 'SSD SATA III 2.5" com velocidade de leitura até 500MB/s',
          preco: 299.99,
          estoque: 30,
          categoria: 'Armazenamento'
        }
      }),
      prisma.product.create({
        data: {
          nome: 'Cadeira Gamer ThunderX3',
          descricao: 'Cadeira gamer ergonômica com apoio lombar e reclinável',
          preco: 1599.99,
          estoque: 5, // Baixo estoque
          categoria: 'Móveis'
        }
      })
    ]);

    console.log(`✅ ${products.length} produtos criados`);

    // Criar usuários
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@example.com',
          nome: 'Administrador',
          role: 'admin'
        }
      }),
      prisma.user.create({
        data: {
          email: 'joao@example.com',
          nome: 'João Silva',
          role: 'user'
        }
      }),
      prisma.user.create({
        data: {
          email: 'maria@example.com',
          nome: 'Maria Santos',
          role: 'user'
        }
      }),
      prisma.user.create({
        data: {
          email: 'pedro@example.com',
          nome: 'Pedro Oliveira',
          role: 'user'
        }
      })
    ]);

    console.log(`✅ ${users.length} usuários criados`);

    // Criar pedidos com diferentes status
    const orders = await Promise.all([
      // Pedido entregue
      prisma.order.create({
        data: {
          userId: users[1].id,
          status: 'delivered',
          shippingAddress: 'Rua A, 123, São Paulo, SP',
          paymentMethod: 'credit_card',
          totalAmount: products[0].preco + (products[1].preco * 2),
          items: {
            create: [
              {
                productId: products[0].id,
                quantity: 1,
                unitPrice: products[0].preco
              },
              {
                productId: products[1].id,
                quantity: 2,
                unitPrice: products[1].preco
              }
            ]
          }
        }
      }),
      // Pedido enviado
      prisma.order.create({
        data: {
          userId: users[2].id,
          status: 'shipped',
          shippingAddress: 'Rua B, 456, Rio de Janeiro, RJ',
          paymentMethod: 'pix',
          totalAmount: products[4].preco,
          items: {
            create: [
              {
                productId: products[4].id,
                quantity: 1,
                unitPrice: products[4].preco
              }
            ]
          }
        }
      }),
      // Pedido confirmado
      prisma.order.create({
        data: {
          userId: users[3].id,
          status: 'confirmed',
          shippingAddress: 'Rua C, 789, Belo Horizonte, MG',
          paymentMethod: 'boleto',
          totalAmount: products[3].preco + (products[6].preco * 2),
          items: {
            create: [
              {
                productId: products[3].id,
                quantity: 1,
                unitPrice: products[3].preco
              },
              {
                productId: products[6].id,
                quantity: 2,
                unitPrice: products[6].preco
              }
            ]
          }
        }
      }),
      // Pedido pendente
      prisma.order.create({
        data: {
          userId: users[1].id,
          status: 'pending',
          shippingAddress: 'Rua D, 321, Porto Alegre, RS',
          paymentMethod: 'debit_card',
          totalAmount: products[5].preco + products[7].preco,
          items: {
            create: [
              {
                productId: products[5].id,
                quantity: 1,
                unitPrice: products[5].preco
              },
              {
                productId: products[7].id,
                quantity: 1,
                unitPrice: products[7].preco
              }
            ]
          }
        }
      }),
      // Pedido cancelado
      prisma.order.create({
        data: {
          userId: users[2].id,
          status: 'cancelled',
          shippingAddress: 'Rua E, 654, Salvador, BA',
          paymentMethod: 'credit_card',
          totalAmount: products[2].preco,
          items: {
            create: [
              {
                productId: products[2].id,
                quantity: 1,
                unitPrice: products[2].preco
              }
            ]
          }
        }
      }),
      // Mais pedidos pendentes para teste
      prisma.order.create({
        data: {
          userId: users[3].id,
          status: 'pending',
          shippingAddress: 'Rua F, 987, Curitiba, PR',
          paymentMethod: 'pix',
          totalAmount: products[0].preco * 2,
          items: {
            create: [
              {
                productId: products[0].id,
                quantity: 2,
                unitPrice: products[0].preco
              }
            ]
          }
        }
      })
    ]);

    console.log(`✅ ${orders.length} pedidos criados`);

    // Criar carrinhos ativos
    const carts = await Promise.all([
      prisma.cart.create({
        data: {
          userId: users[1].id,
          items: {
            create: [
              {
                productId: products[1].id,
                quantity: 1
              }
            ]
          }
        }
      }),
      prisma.cart.create({
        data: {
          userId: users[2].id,
          items: {
            create: [
              {
                productId: products[3].id,
                quantity: 1
              },
              {
                productId: products[4].id,
                quantity: 2
              }
            ]
          }
        }
      })
    ]);

    console.log(`✅ ${carts.length} carrinhos criados`);

    console.log('\n📊 Resumo do seed:');
    console.log('==================');
    console.log(`Produtos: ${products.length}`);
    console.log(`  - Sem estoque: 1`);
    console.log(`  - Baixo estoque: 3`);
    console.log(`Usuários: ${users.length}`);
    console.log(`  - Admin: 1`);
    console.log(`  - Clientes: 3`);
    console.log(`Pedidos: ${orders.length}`);
    console.log(`  - Pendentes: 2`);
    console.log(`  - Confirmados: 1`);
    console.log(`  - Enviados: 1`);
    console.log(`  - Entregues: 1`);
    console.log(`  - Cancelados: 1`);
    console.log(`Carrinhos ativos: ${carts.length}`);

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('\n🔑 Credenciais do admin:');
    console.log('   Email: admin@example.com');
    console.log('   Role: admin');
    console.log('\n📝 Use o endpoint /api/auth/request-pin para fazer login');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });