import { prisma } from '../lib/prisma';

export interface ICart {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: number;
    nome: string;
    preco: number;
    estoque: number;
  };
}

export interface ICartWithItems extends ICart {
  items: ICartItem[];
}

export interface CreateCartData {
  userId: number;
}

export interface AddItemToCartData {
  userId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  cartItemId: number;
  quantity: number;
}

export class Cart {
  static async create(data: CreateCartData): Promise<ICart> {
    return await prisma.cart.create({
      data
    });
  }

  static async findByUserId(userId: number): Promise<ICartWithItems | null> {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nome: true,
                preco: true,
                estoque: true
              }
            }
          }
        }
      }
    });
  }

  static async findOrCreateByUserId(userId: number): Promise<ICartWithItems> {
    let cart = await this.findByUserId(userId);
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nome: true,
                  preco: true,
                  estoque: true
                }
              }
            }
          }
        }
      });
    }
    
    return cart;
  }

  static async addItem(data: AddItemToCartData): Promise<ICartItem> {
    const { userId, productId, quantity } = data;
    
    // Verificar se o produto existe e tem estoque
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    
    if (product.estoque < quantity) {
      throw new Error('Quantidade insuficiente em estoque');
    }
    
    // Obter ou criar carrinho
    const cart = await this.findOrCreateByUserId(userId);
    
    // Verificar se o item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });
    
    if (existingItem) {
      // Atualizar quantidade
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            select: {
              id: true,
              nome: true,
              preco: true,
              estoque: true
            }
          }
        }
      });
    } else {
      // Adicionar novo item
      return await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: {
          product: {
            select: {
              id: true,
              nome: true,
              preco: true,
              estoque: true
            }
          }
        }
      });
    }
  }

  static async updateItemQuantity(data: UpdateCartItemData): Promise<ICartItem> {
    const { cartItemId, quantity } = data;
    
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
    
    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            nome: true,
            preco: true,
            estoque: true
          }
        }
      }
    });
  }

  static async removeItem(cartItemId: number): Promise<void> {
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });
  }

  static async clearCart(userId: number): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
  }

  static async getCartTotal(userId: number): Promise<number> {
    const cart = await this.findByUserId(userId);
    if (!cart) return 0;
    
    return cart.items.reduce((total, item) => {
      return total + (item.product?.preco || 0) * item.quantity;
    }, 0);
  }
} 