import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../services/alert/alertService';
import { useMember } from '../../services/member/memberService';
import { NoData } from '../common/NoData/NoData';
import { CardMiniSkeleton } from '../common/CardMiniSkeleton/CardMiniSkeleton';
import { formatDate } from '../../utils/dateUtils';

const Container = styled.div`
  margin-top: 20px;
`;

const Title = styled.h3`
  margin-top: 0;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const BenefitCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  height: 140px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoSection = styled.div`
  width: 50%;
  img {
    max-width: 100%;
    height: auto;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
`;

const BenefitName = styled.h3`
  margin-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BenefitDescription = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExpiryDate = styled.small`
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface Benefit {
  name: string;
  desc: string;
  expirationDate?: string;
  ext?: {
    isBenefit: boolean;
  };
}

export const EarnedBenefits: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [memberBenefits, setMemberBenefits] = useState<Benefit[]>([]);
  const { showError } = useAlert();
  const { getOffers } = useMember();
  const location = useSelector((state: any) => state.location.location);
  const memberInfo = useSelector((state: any) => state.member);

  useEffect(() => {
    if (memberInfo?._id) {
      getMemberBenefits();
    }
  }, [memberInfo, location]);

  const getMemberBenefits = async () => {
    try {
      const offers = await getOffers(memberInfo._id, location.number ?? location);
      const benefits = offers.filter((offer: Benefit) => offer.ext?.isBenefit);
      setMemberBenefits(benefits);
      setIsLoading(false);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ marginTop: '50px' }}>
        <CardMiniSkeleton />
      </div>
    );
  }

  if (!memberBenefits.length) {
    return <NoData>No Benefits available.</NoData>;
  }

  return (
    <Container>
      <Title>Available Member Benefits ({memberBenefits.length})</Title>
      <BenefitsGrid>
        {memberBenefits.map((benefit, index) => (
          <BenefitCard key={index}>
            <LogoSection>
              <img src="/assets/bclc-logo.png" alt="BCLC Logo" />
            </LogoSection>
            <ContentSection>
              <BenefitName>{benefit.name}</BenefitName>
              <BenefitDescription>{benefit.desc}</BenefitDescription>
              {benefit.expirationDate && (
                <ExpiryDate>
                  Expires {formatDate(benefit.expirationDate)}
                </ExpiryDate>
              )}
            </ContentSection>
          </BenefitCard>
        ))}
      </BenefitsGrid>
    </Container>
  );
}; 