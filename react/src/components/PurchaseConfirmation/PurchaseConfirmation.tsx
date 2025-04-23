import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/actions/cartActions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 64px;
  color: #4caf50;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1565c0;
  }
`;

export const PurchaseConfirmation: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <Container>
      <Icon>✓</Icon>
      <Title>Purchase Confirmed!</Title>
      <Message>
        Thank you for your purchase. Your order has been successfully processed.
      </Message>
      <Button onClick={handleContinueShopping}>
        Continue Shopping
      </Button>
    </Container>
  );
}; 