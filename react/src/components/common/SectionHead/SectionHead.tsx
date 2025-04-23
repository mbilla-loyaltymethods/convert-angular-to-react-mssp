import React from 'react';
import styled from 'styled-components';

interface SectionHeadProps {
  title: string;
}

const Container = styled.div`
  margin: 24px 0 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
`;

export const SectionHead: React.FC<SectionHeadProps> = ({ title }) => {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
}; 