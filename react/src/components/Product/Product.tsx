import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem, removeItem } from '../../store/actions/cartActions';
import { useAlert } from '../../services/alert/alertService';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProductProps {
  product: {
    sku: string;
    name: string;
    cost: number;
    url: string;
    category: string;
    ext?: {
      nonReturnable?: boolean;
    };
  };
}

const Card = styled.div<{ isHemming: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: ${props => props.isHemming ? '300px' : '530px'};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProductImage = styled.img<{ isHemming: boolean }>`
  width: ${props => props.isHemming ? '100%' : 'auto'};
  max-width: 300px;
  height: auto;
  aspect-ratio: ${props => props.isHemming ? 'auto' : '5 / 6'};
  object-fit: cover;
`;

const ProductName = styled.p`
  font-weight: bold;
  margin: 20px 0;
`;

const QuantityContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

const QuantitySelect = styled.select`
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Price = styled.p`
  font-weight: bold;
`;

const NonReturnableLabel = styled.small`
  color: red;
  margin: 10px 0;
  display: block;
`;

const Button = styled.button<{ isInCart: boolean }>`
  margin-top: auto;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: ${props => props.isInCart ? '2px solid var(--primary)' : 'none'};
  background-color: ${props => props.isInCart ? 'transparent' : 'var(--primary)'};
  color: ${props => props.isInCart ? 'var(--primary)' : 'white'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export function Product() {
    const dispatch = useDispatch();
    //   const navigate = useNavigate();
    //   const { showSuccess } = useAlert();
    //   const [quantity, setQuantity] = useState(1);
    //   const cartItems = useSelector((state: any) => state.cart.items);
    //   const isInCart = cartItems.some((item: any) => item.sku === product.sku);
    //   useEffect(() => {
    //     if (isInCart) {
    //       const cartItem = cartItems.find((item: any) => item.sku === product.sku);
    //       setQuantity(cartItem.quantity);
    //     } else {
    //       setQuantity(1);
    //     }
    //   }, [isInCart, cartItems, product.sku]);
    //   const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const newQuantity = parseInt(e.target.value);
    //     setQuantity(newQuantity);
    //     dispatch(addItem({ ...product, quantity: newQuantity }));
    //   };
    //   const handleAddToCart = () => {
    //     dispatch(addItem({ ...product, quantity }));
    //     showSuccess('Item successfully added to your cart.');
    //     navigate('/checkout');
    //   };
    //   const handleRemoveFromCart = () => {
    //     setQuantity(1);
    //     dispatch(removeItem(product.sku));
    //     showSuccess('Item successfully removed from your cart.');
    //     navigate('/checkout');
    //   };
    //   return (
    //     <Card isHemming={product.category === 'Hemming'}>
    //       <ProductImage
    //         src={product.url}
    //         alt={product.name}
    //         loading="lazy"
    //         isHemming={product.category === 'Hemming'}
    //       />
    //       <ProductName>{product.name}</ProductName>
    //       <QuantityContainer>
    //         <div>
    //           <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Qty:</span>
    //           <QuantitySelect value={quantity} onChange={handleQuantityChange}>
    //             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
    //               <option key={qty} value={qty}>
    //                 {qty}
    //               </option>
    //             ))}
    //           </QuantitySelect>
    //         </div>
    //         <Price>{formatCurrency(product.cost)}</Price>
    //       </QuantityContainer>
    //       {product.ext?.nonReturnable && (
    //         <NonReturnableLabel>Non Returnable</NonReturnableLabel>
    //       )}
    //       <Button
    //         isInCart={isInCart}
    //         onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
    //       >
    //         {isInCart ? 'Remove from Bag' : 'Add to Bag'}
    //       </Button>
    //     </Card>
    //   );
} 