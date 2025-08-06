import { Cart, ICartWithItems, ICartItem, AddItemToCartData, UpdateCartItemData } from '../models/Cart';

export class CartService {
  static async getCart(userId: number): Promise<ICartWithItems | null> {
    try {
      return await Cart.findByUserId(userId);
    } catch (error) {
      throw new Error(`Erro ao buscar carrinho: ${error}`);
    }
  }

  static async addItemToCart(data: AddItemToCartData): Promise<ICartItem> {
    try {
      return await Cart.addItem(data);
    } catch (error) {
      throw new Error(`Erro ao adicionar item ao carrinho: ${error}`);
    }
  }

  static async updateItemQuantity(data: UpdateCartItemData): Promise<ICartItem> {
    try {
      return await Cart.updateItemQuantity(data);
    } catch (error) {
      throw new Error(`Erro ao atualizar quantidade: ${error}`);
    }
  }

  static async removeItemFromCart(cartItemId: number): Promise<void> {
    try {
      await Cart.removeItem(cartItemId);
    } catch (error) {
      throw new Error(`Erro ao remover item do carrinho: ${error}`);
    }
  }

  static async clearCart(userId: number): Promise<void> {
    try {
      await Cart.clearCart(userId);
    } catch (error) {
      throw new Error(`Erro ao limpar carrinho: ${error}`);
    }
  }

  static async getCartTotal(userId: number): Promise<number> {
    try {
      return await Cart.getCartTotal(userId);
    } catch (error) {
      throw new Error(`Erro ao calcular total do carrinho: ${error}`);
    }
  }

  static async getCartSummary(userId: number): Promise<{
    items: ICartItem[];
    total: number;
    itemCount: number;
  }> {
    try {
      const cart = await Cart.findByUserId(userId);
      const total = await Cart.getCartTotal(userId);
      
      return {
        items: cart?.items || [],
        total,
        itemCount: cart?.items.length || 0
      };
    } catch (error) {
      throw new Error(`Erro ao obter resumo do carrinho: ${error}`);
    }
  }
} 