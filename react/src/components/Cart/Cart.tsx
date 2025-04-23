import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '../../store/actions/cartActions';
import { RootState } from '../../store/reducers';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartItem {
  sku: string;
  name: string;
  cost: number;
  quantity: number;
  ext?: {
    hideInMSSP?: boolean;
  };
}

const CartContainer = styled.div`
  position: relative;
`;

const CartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
`;

const CartIcon = styled.span`
  font-size: 24px;
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const CartMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  min-width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: bold;
`;

const ItemPrice = styled.div`
  color: var(--text-secondary);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 4px;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-weight: bold;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

export const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => {
    const items = state.cart.items;
    if (items.length === 1 && items[0]?.lineItems) {
      return items[0].lineItems
        .map((item: any) => ({
          ...item.product,
          quantity: item.quantity
        }))
        .filter((item: any) => !item?.ext?.hideInMSSP);
    }
    return items.filter(item => !item?.type);
  });

  const totalItems = cartItems.reduce((total: any, item: { quantity: any; }) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total: number, item: { cost: number; quantity: number; }) => total + (item.cost * item.quantity), 0);

  const handleRemoveItem = (sku: string) => {
    dispatch(removeItem(sku));
  };

  return (
    <CartContainer>
      <CartButton>
        <CartIcon>🛒</CartIcon>
        {totalItems > 0 && <Badge>{totalItems}</Badge>}
      </CartButton>
      <CartMenu>
        {cartItems.map((item: any) => (
          <CartItem key={item.sku}>
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>
                {formatCurrency(item.cost)} × {item.quantity}
              </ItemPrice>
            </ItemDetails>
            <RemoveButton onClick={() => handleRemoveItem(item.sku)}>
              ×
            </RemoveButton>
          </CartItem>
        ))}
        <Total>
          <span>Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Total>
        <CheckoutButton>Checkout</CheckoutButton>
      </CartMenu>
    </CartContainer>
  );
}; 