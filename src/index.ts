import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';

// Middlewares de segurança globais
import { 
  helmetConfig, 
  morganConfig, 
  securityLogger
} from './middlewares/security.middleware';
import { auditAccessDenied } from './middlewares/audit.middleware';

dotenv.config();

const app = express();

// Middlewares de segurança globais
app.use(helmetConfig);
app.use(morganConfig);
app.use(securityLogger);
app.use(auditAccessDenied);

// Configuração do CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Rota de health check
app.get('/', (_, res) => res.send('API do E-commerce está rodando 🚀'));

// Middleware de tratamento de erros global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔒 Middlewares de segurança ativos`);
  console.log(`📊 Logging de auditoria ativo`);
  console.log(`🛡️ Rate limiting configurado`);
});
