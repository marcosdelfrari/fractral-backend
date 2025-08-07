"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Fractral E-commerce API',
        version: '1.0.0',
        description: 'API completa para sistema de e-commerce com funcionalidades de produtos, carrinho, pedidos e administração',
        contact: {
            name: 'Marcos Delfrari',
            email: 'marcos@exemplo.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: process.env.NODE_ENV === 'production'
                ? 'https://seu-app.onrender.com'
                : 'http://localhost:3000',
            description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Digite o token JWT no formato: Bearer <token>'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
                    nome: { type: 'string', example: 'João Silva' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            Product: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    nome: { type: 'string', example: 'Smartphone XYZ' },
                    descricao: { type: 'string', example: 'Smartphone com tela de 6.5 polegadas' },
                    preco: { type: 'number', format: 'float', example: 899.99 },
                    estoque: { type: 'integer', example: 50 },
                    categoria: { type: 'string', example: 'Eletrônicos' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            Cart: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    userId: { type: 'integer', example: 1 },
                    items: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/CartItem'
                        }
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            CartItem: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    cartId: { type: 'integer', example: 1 },
                    productId: { type: 'integer', example: 1 },
                    quantity: { type: 'integer', example: 2 },
                    product: { $ref: '#/components/schemas/Product' }
                }
            },
            Order: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    userId: { type: 'integer', example: 1 },
                    status: {
                        type: 'string',
                        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
                        example: 'pending'
                    },
                    totalAmount: { type: 'number', format: 'float', example: 1299.98 },
                    shippingAddress: { type: 'string', example: 'Rua das Flores, 123 - São Paulo, SP' },
                    paymentMethod: { type: 'string', example: 'credit_card' },
                    items: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/OrderItem'
                        }
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            OrderItem: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    orderId: { type: 'integer', example: 1 },
                    productId: { type: 'integer', example: 1 },
                    quantity: { type: 'integer', example: 2 },
                    unitPrice: { type: 'number', format: 'float', example: 899.99 },
                    product: { $ref: '#/components/schemas/Product' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Erro na operação' },
                    error: { type: 'string', example: 'Detalhes do erro' }
                }
            },
            Success: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Operação realizada com sucesso' },
                    data: { type: 'object' }
                }
            }
        }
    },
    tags: [
        {
            name: 'Authentication',
            description: 'Operações de autenticação e autorização'
        },
        {
            name: 'Products',
            description: 'Gerenciamento de produtos'
        },
        {
            name: 'Cart',
            description: 'Gerenciamento do carrinho de compras'
        },
        {
            name: 'Orders',
            description: 'Gerenciamento de pedidos'
        },
        {
            name: 'Users',
            description: 'Gerenciamento de usuários'
        },
        {
            name: 'Admin',
            description: 'Funcionalidades administrativas'
        }
    ]
};
const options = {
    definition: swaggerDefinition,
    apis: [
        './src/routes/*.routes.ts',
        './src/controllers/*.controller.ts',
        './src/models/*.ts'
    ]
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.config.js.map