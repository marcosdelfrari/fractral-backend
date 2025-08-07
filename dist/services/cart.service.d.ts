import { ICartWithItems, ICartItem, AddItemToCartData, UpdateCartItemData } from '../models/Cart';
export declare class CartService {
    static getCart(userId: number): Promise<ICartWithItems | null>;
    static addItemToCart(data: AddItemToCartData): Promise<ICartItem>;
    static updateItemQuantity(data: UpdateCartItemData): Promise<ICartItem>;
    static removeItemFromCart(cartItemId: number): Promise<void>;
    static clearCart(userId: number): Promise<void>;
    static getCartTotal(userId: number): Promise<number>;
    static getCartSummary(userId: number): Promise<{
        items: ICartItem[];
        total: number;
        itemCount: number;
    }>;
}
