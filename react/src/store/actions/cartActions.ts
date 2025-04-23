import { CartItem } from '../../types/cart';

export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const CLEAR_CART = 'CLEAR_CART';

export const addItem = (item: CartItem) => ({
  type: ADD_ITEM,
  payload: item
});

export const removeItem = (sku: string) => ({
  type: REMOVE_ITEM,
  payload: sku
});

export const clearCart = () => ({
  type: CLEAR_CART
}); 