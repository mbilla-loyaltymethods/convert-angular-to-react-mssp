import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  animation: pulse 1.5s infinite;
`;

const SkeletonTitle = styled.div`
  height: 24px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 12px;
  width: 60%;
`;

const SkeletonDescription = styled.div`
  height: 16px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 80%;
`;

const SkeletonButton = styled.div`
  height: 36px;
  background: #e0e0e0;
  border-radius: 4px;
  width: 40%;
`;

export const CardMiniSkeleton: React.FC = () => {
  return (
    <Container>
      {[...Array(3)].map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonTitle />
          <SkeletonDescription />
          <SkeletonButton />
        </SkeletonCard>
      ))}
    </Container>
  );
}; 