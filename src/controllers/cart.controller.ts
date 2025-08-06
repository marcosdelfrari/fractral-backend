import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';

export class CartController {
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const cart = await CartService.getCart(userId);
      
      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar carrinho'
      });
    }
  }

  static async addItemToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        res.status(400).json({
          success: false,
          message: 'productId e quantity são obrigatórios'
        });
        return;
      }

      if (quantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Quantidade deve ser maior que zero'
        });
        return;
      }

      const cartItem = await CartService.addItemToCart({
        userId,
        productId,
        quantity
      });

      res.status(201).json({
        success: true,
        data: cartItem,
        message: 'Item adicionado ao carrinho com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao adicionar item ao carrinho'
      });
    }
  }

  static async updateItemQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Quantidade deve ser maior que zero'
        });
        return;
      }

      const cartItem = await CartService.updateItemQuantity({
        cartItemId: parseInt(cartItemId),
        quantity
      });

      res.json({
        success: true,
        data: cartItem,
        message: 'Quantidade atualizada com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar quantidade'
      });
    }
  }

  static async removeItemFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { cartItemId } = req.params;

      await CartService.removeItemFromCart(parseInt(cartItemId));

      res.json({
        success: true,
        message: 'Item removido do carrinho com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao remover item do carrinho'
      });
    }
  }

  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;

      await CartService.clearCart(userId);

      res.json({
        success: true,
        message: 'Carrinho limpo com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao limpar carrinho'
      });
    }
  }

  static async getCartSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const summary = await CartService.getCartSummary(userId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao obter resumo do carrinho'
      });
    }
  }

  static async getCartTotal(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const total = await CartService.getCartTotal(userId);

      res.json({
        success: true,
        data: { total }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao calcular total do carrinho'
      });
    }
  }
} 