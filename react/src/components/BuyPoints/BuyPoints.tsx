import React, { useState } from 'react';
import styled from 'styled-components';

interface BuyPointsProps {
  onClose: (points?: number) => void;
}

interface PointsOption {
  value: number;
  displayName: string;
}

const Container = styled.div`
  width: 500px;
  height: 250px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
`;

const Title = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: auto;
`;

const Divider = styled.hr`
  margin: 0;
  border: 0;
  border-top: 1px solid #e0e0e0;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SelectContainer = styled.div`
  margin-top: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 20px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const pointsList: PointsOption[] = [
  { value: 100, displayName: '100 Points' },
  { value: 500, displayName: '500 Points' },
  { value: 1000, displayName: '1000 Points' },
  { value: 5000, displayName: '5000 Points' },
];

export const BuyPoints: React.FC<BuyPointsProps> = ({ onClose }) => {
  const [selectedPoints, setSelectedPoints] = useState<number | ''>('');

  const handlePointsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPoints(Number(event.target.value));
  };

  const handleBuy = () => {
    if (selectedPoints !== '') {
      onClose(selectedPoints);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Buy Points</Title>
        <CloseButton onClick={() => onClose()}>
          <span>×</span>
        </CloseButton>
      </Header>
      <Divider />
      <Content>
        <SelectContainer>
          <Select
            value={selectedPoints}
            onChange={handlePointsChange}
          >
            <option value="">Select Required Points</option>
            {pointsList.map(option => (
              <option key={option.value} value={option.value}>
                {option.displayName}
              </option>
            ))}
          </Select>
        </SelectContainer>
        <Actions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button 
            primary 
            onClick={handleBuy}
            disabled={selectedPoints === ''}
          >
            Buy
          </Button>
        </Actions>
      </Content>
    </Container>
  );
}; 