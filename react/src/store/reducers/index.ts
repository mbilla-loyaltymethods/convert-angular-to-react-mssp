import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { memberReducer } from './memberReducer';
import { formReducer } from './formReducer';

export const rootReducer = combineReducers({
  cart: cartReducer,
  member: memberReducer,
  form: formReducer
});

export type RootState = ReturnType<typeof rootReducer>; 