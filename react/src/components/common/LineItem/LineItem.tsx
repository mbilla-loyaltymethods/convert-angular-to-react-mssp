import React from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../../utils/formatCurrency';

interface LineItemProps {
  item: {
    sku: string;
    name: string;
    cost: number;
    quantity: number;
    ext?: {
      hideInMSSP?: boolean;
    };
  };
  onRemove: () => void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: bold;
`;

const ItemDetails = styled.div`
  color: var(--text-secondary);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 4px;
`;

export const LineItem: React.FC<LineItemProps> = ({ item, onRemove }) => {
  return (
    <Container>
      <ItemInfo>
        <ItemName>{item.name}</ItemName>
        <ItemDetails>
          {formatCurrency(item.cost)} × {item.quantity}
        </ItemDetails>
      </ItemInfo>
      <RemoveButton onClick={onRemove}>×</RemoveButton>
    </Container>
  );
}; 