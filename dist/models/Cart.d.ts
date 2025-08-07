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
export declare class Cart {
    static create(data: CreateCartData): Promise<ICart>;
    static findByUserId(userId: number): Promise<ICartWithItems | null>;
    static findOrCreateByUserId(userId: number): Promise<ICartWithItems>;
    static addItem(data: AddItemToCartData): Promise<ICartItem>;
    static updateItemQuantity(data: UpdateCartItemData): Promise<ICartItem>;
    static removeItem(cartItemId: number): Promise<void>;
    static clearCart(userId: number): Promise<void>;
    static getCartTotal(userId: number): Promise<number>;
}
