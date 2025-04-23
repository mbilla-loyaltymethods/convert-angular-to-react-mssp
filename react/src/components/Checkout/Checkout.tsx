import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store/reducers';
import { clearCart, removeItem } from '../../store/actions/cartActions';
import { useActivity } from '../../services/activity/activityService';
import { useAlert } from '../../services/alert/alertService';
import { useProduct } from '../../services/product/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { LineItem } from '../common/LineItem/LineItem';
import { NoData } from '../common/NoData/NoData';
import { SectionHead } from '../common/SectionHead/SectionHead';
import { QuizModal } from 'components/modals/QuizModal/QuizModal';
// import { QuizModal } from '../common/QuizModal/QuizModal';

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
`;

const Slider = styled.input`
  width: 100%;
`;

const Summary = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 18px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
`;

export const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { getActivity } = useActivity();
  const { showError } = useAlert();
  const { getOtherProducts } = useProduct();

  const [isLoading, setIsLoading] = useState(true);
  const [paymentType, setPaymentType] = useState('CREDIT_CARD');
  const [shippingType, setShippingType] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [maxAllowedValue, setMaxAllowedValue] = useState(0);
  const [tax, setTax] = useState(0);
  const [shippingProducts, setShippingProducts] = useState<any[]>([]);
  const [discountLineItems, setDiscountLineItems] = useState<any[]>([]);
  const [bestOffers, setBestOffers] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isReturn = new URLSearchParams(location.search).get('isReturn') === 'true';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [shippingProducts, taxProducts] = await Promise.all([
          getOtherProducts('Shipping', 'Discount'),
          getOtherProducts('Tax', '')
        ]);

        setShippingProducts(shippingProducts);
        setTax(taxProducts.find((product: any) => product.sku === 'Tax')?.cost ?? 0);
        setShippingType(shippingProducts[0]?.name ?? '');
      } catch (error) {
        // showError(error?.error?.error || error?.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (cartItems.length) {
      calculateAmount();
    }
  }, [cartItems, shippingType, sliderValue]);

  const calculateAmount = () => {
    const shippingAmount = shippingProducts.find(
      (shipping) => shipping.name === shippingType
    )?.cost ?? 0;

    const discountAmount = discountLineItems.reduce(
      (total, item) => total + item.cost,
      0
    );

    const subtotal = cartItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );

    const taxAmount = (subtotal - discountAmount + shippingAmount) * tax;
    const total = subtotal - discountAmount + shippingAmount + taxAmount - sliderValue;

    setSubTotal(subtotal);
    setTaxAmount(taxAmount);
    setTotalAmount(total);
  };

  const handlePaymentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(event.target.value);
  };

  const handleShippingTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShippingType(event.target.value);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  const handleRemoveItem = (sku: string) => {
    dispatch(removeItem(sku));
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      // Implement purchase logic here
      dispatch(clearCart());
      navigate('/purchase-confirmation');
    } catch (error) {
      // showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = (answers: Record<string, string>) => {
    // Handle the submitted answers
    console.log(answers);
  };

  if (isLoading) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Container>
      <Form>
        <FormGroup>
          <Label>Payment Type</Label>
          <Select value={paymentType} onChange={handlePaymentTypeChange}>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="POINTS">Points</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Shipping Type</Label>
          <Select value={shippingType} onChange={handleShippingTypeChange}>
            {shippingProducts.map((product) => (
              <option key={product.sku} value={product.name}>
                {product.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        {maxAllowedValue > 0 && (
          <FormGroup>
            <Label>Hemming Discount</Label>
            <Slider
              type="range"
              min="0"
              max={maxAllowedValue}
              value={sliderValue}
              onChange={handleSliderChange}
            />
            <span>{formatCurrency(sliderValue)}</span>
          </FormGroup>
        )}

        <SectionHead title="Order Summary" />
        {cartItems.map((item) => (
          <LineItem
            key={item.sku}
            item={item}
            onRemove={() => handleRemoveItem(item.sku)}
          />
        ))}

        <Summary>
          <SummaryRow>
            <span>Subtotal:</span>
            <span>{formatCurrency(subTotal)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping:</span>
            <span>
              {formatCurrency(
                shippingProducts.find((shipping) => shipping.name === shippingType)
                  ?.cost ?? 0
              )}
            </span>
          </SummaryRow>
          <SummaryRow>
            <span>Tax:</span>
            <span>{formatCurrency(taxAmount)}</span>
          </SummaryRow>
          {sliderValue > 0 && (
            <SummaryRow>
              <span>Hemming Discount:</span>
              <span>-{formatCurrency(sliderValue)}</span>
            </SummaryRow>
          )}
          <TotalRow>
            <span>Total:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </TotalRow>
        </Summary>

        <Button onClick={handlePurchase}>Complete Purchase</Button>
      </Form>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmit={handleQuizSubmit}
        questions={[
          {
            id: 'q1',
            question: 'What is your favorite color?',
            options: ['Red', 'Blue', 'Green']
          },
          // ... more questions
        ]}
      />
    </Container>
  );
}; 