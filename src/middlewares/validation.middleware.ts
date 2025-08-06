import { Request, Response, NextFunction } from 'express';

export interface ValidatedRequest extends Request {
  user?: {
    userId: number;
    role?: string;
  };
}

// Validações específicas para diferentes endpoints
export const authValidations = {
  requestPin: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
        return;
      }
      
      next();
    }
  ],
  
  verifyPin: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { email, pin } = req.body;
      
      if (!email || !pin) {
        res.status(400).json({
          success: false,
          message: 'Email e PIN são obrigatórios'
        });
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
        return;
      }
      
      if (!/^\d{6}$/.test(pin)) {
        res.status(400).json({
          success: false,
          message: 'PIN deve ter 6 dígitos'
        });
        return;
      }
      
      next();
    }
  ]
};

export const cartValidations = {
  addItem: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity) {
        res.status(400).json({
          success: false,
          message: 'ProductId e quantity são obrigatórios'
        });
        return;
      }
      
      if (!Number.isInteger(Number(productId)) || Number(productId) <= 0) {
        res.status(400).json({
          success: false,
          message: 'ProductId deve ser um número inteiro positivo'
        });
        return;
      }
      
      if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        res.status(400).json({
          success: false,
          message: 'Quantity deve ser um número inteiro positivo'
        });
        return;
      }
      
      if (Number(quantity) > 100) {
        res.status(400).json({
          success: false,
          message: 'Quantity máxima permitida é 100'
        });
        return;
      }
      
      next();
    }
  ],
  
  updateItem: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { quantity } = req.body;
      const { cartItemId } = req.params;
      
      if (!quantity) {
        res.status(400).json({
          success: false,
          message: 'Quantity é obrigatório'
        });
        return;
      }
      
      if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        res.status(400).json({
          success: false,
          message: 'Quantity deve ser um número inteiro positivo'
        });
        return;
      }
      
      if (Number(quantity) > 100) {
        res.status(400).json({
          success: false,
          message: 'Quantity máxima permitida é 100'
        });
        return;
      }
      
      if (!Number.isInteger(Number(cartItemId)) || Number(cartItemId) <= 0) {
        res.status(400).json({
          success: false,
          message: 'CartItemId deve ser um número inteiro positivo'
        });
        return;
      }
      
      next();
    }
  ]
};

export const orderValidations = {
  createOrder: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { shippingAddress, paymentMethod } = req.body;
      
      if (!shippingAddress) {
        res.status(400).json({
          success: false,
          message: 'Endereço de entrega é obrigatório'
        });
        return;
      }
      
      if (shippingAddress.length < 10) {
        res.status(400).json({
          success: false,
          message: 'Endereço de entrega deve ter pelo menos 10 caracteres'
        });
        return;
      }
      
      if (shippingAddress.length > 500) {
        res.status(400).json({
          success: false,
          message: 'Endereço de entrega deve ter no máximo 500 caracteres'
        });
        return;
      }
      
      if (!paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Método de pagamento é obrigatório'
        });
        return;
      }
      
      const validPaymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        res.status(400).json({
          success: false,
          message: 'Método de pagamento inválido'
        });
        return;
      }
      
      next();
    }
  ],
  
  updateStatus: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { status } = req.body;
      const { orderId } = req.params;
      
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
        return;
      }
      
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
        return;
      }
      
      if (!Number.isInteger(Number(orderId)) || Number(orderId) <= 0) {
        res.status(400).json({
          success: false,
          message: 'OrderId deve ser um número inteiro positivo'
        });
        return;
      }
      
      next();
    }
  ]
};

export const productValidations = {
  createProduct: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { nome, descricao, preco, estoque, categoria } = req.body;
      
      // Para updates, campos são opcionais
      const isUpdate = req.method === 'PUT';
      
      if (!isUpdate && (!nome || !descricao || !preco || estoque === undefined || !categoria)) {
        res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
        return;
      }
      
      if (nome !== undefined && (nome.length < 3 || nome.length > 100)) {
        res.status(400).json({
          success: false,
          message: 'Nome deve ter entre 3 e 100 caracteres'
        });
        return;
      }
      
      if (descricao !== undefined && (descricao.length < 10 || descricao.length > 1000)) {
        res.status(400).json({
          success: false,
          message: 'Descrição deve ter entre 10 e 1000 caracteres'
        });
        return;
      }
      
      if (preco !== undefined && (typeof preco !== 'number' || preco <= 0)) {
        res.status(400).json({
          success: false,
          message: 'Preço deve ser um número positivo'
        });
        return;
      }
      
      if (estoque !== undefined && (!Number.isInteger(Number(estoque)) || Number(estoque) < 0)) {
        res.status(400).json({
          success: false,
          message: 'Estoque deve ser um número inteiro não negativo'
        });
        return;
      }
      
      if (categoria !== undefined && (categoria.length < 2 || categoria.length > 50)) {
        res.status(400).json({
          success: false,
          message: 'Categoria deve ter entre 2 e 50 caracteres'
        });
        return;
      }
      
      next();
    }
  ]
};

export const adminValidations = {
  updateStock: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { updates } = req.body;
      
      if (!updates || !Array.isArray(updates)) {
        res.status(400).json({
          success: false,
          message: 'Updates deve ser um array'
        });
        return;
      }
      
      if (updates.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Updates não pode estar vazio'
        });
        return;
      }
      
      for (const update of updates) {
        if (!update.productId || !update.quantity === undefined || !update.operation) {
          res.status(400).json({
            success: false,
            message: 'Cada update deve ter productId, quantity e operation'
          });
          return;
        }
        
        if (!['add', 'set'].includes(update.operation)) {
          res.status(400).json({
            success: false,
            message: 'Operation deve ser "add" ou "set"'
          });
          return;
        }
        
        if (!Number.isInteger(update.quantity) || update.quantity < 0) {
          res.status(400).json({
            success: false,
            message: 'Quantity deve ser um número inteiro não negativo'
          });
          return;
        }
      }
      
      next();
    }
  ],
  
  batchUpdateOrders: [
    (req: ValidatedRequest, res: Response, next: NextFunction): void => {
      const { orderIds, status } = req.body;
      
      if (!orderIds || !Array.isArray(orderIds)) {
        res.status(400).json({
          success: false,
          message: 'OrderIds deve ser um array'
        });
        return;
      }
      
      if (orderIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'OrderIds não pode estar vazio'
        });
        return;
      }
      
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
        return;
      }
      
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
        return;
      }
      
      next();
    }
  ]
}; 