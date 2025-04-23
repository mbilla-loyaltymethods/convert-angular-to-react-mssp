import { CartItem } from '../../types/cart';
import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART } from '../actions/cartActions';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

export const cartReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_ITEM:
      const existingItem = state.items.find(item => item.sku === action.payload.sku);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.sku === action.payload.sku
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.sku !== action.payload)
      };

    case CLEAR_CART:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
}; 