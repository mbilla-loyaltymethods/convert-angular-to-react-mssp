import React from 'react';
import styled from 'styled-components';

interface NoDataProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--text-secondary);
`;

const Message = styled.div`
  font-size: 16px;
  color: var(--text-secondary);
`;

export const NoData: React.FC<NoDataProps> = ({ children }) => {
  return (
    <Container>
      <Icon>📭</Icon>
      <Message>{children}</Message>
    </Container>
  );
}; 