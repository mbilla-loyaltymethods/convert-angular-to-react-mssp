import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSegment } from '../../services/segment/segmentService';
import { useAlert } from '../../services/alert/alertService';
import { CardMiniSkeleton } from '../common/CardMiniSkeleton/CardMiniSkeleton';
import { NoData } from '../common/NoData/NoData';
import { RootState } from '../../store/reducers';

interface Segment {
  _id: string;
  name: string;
  description: string;
}

interface MemberSegment {
  _id: string;
  segment: string;
}

interface CouponButtonProps {
  claimed: boolean;
}

export const ClippableCoupons: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [memberSegments, setMemberSegments] = useState<MemberSegment[]>([]);
  
  const memberInfo = useSelector((state: RootState) => state.member.member);
  const { getAllSegments, getMemberSegments, addMemberSegment, deleteMemberSegment } = useSegment();
  // const { successAlert, errorAlert } = useAlert();

  useEffect(() => {
    if (memberInfo) {
      getSegments();
    }
  }, [memberInfo]);

  const getSegments = async () => {
    try {
      setIsLoading(true);
      const segmentsData = await getAllSegments(JSON.stringify({ "ext.marketing": true }));
      setSegments(segmentsData);
      
      const memberSegmentsData = await getMemberSegments(5, getQuery());
      setMemberSegments(memberSegmentsData);
    } catch (error: any) {
      // errorAlert(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuery = () => {
    return JSON.stringify({
      member: memberInfo?._id,
      segment: { $in: segments.map((segment) => segment._id) }
    });
  };

  const isClaimed = (segmentId: string) => 
    !!memberSegments.find(x => x.segment === segmentId);

  const updateSegment = async (segmentId: string) => {
    try {
      const existingSegmentIndex = memberSegments.findIndex(x => x.segment === segmentId);
      
      if (existingSegmentIndex > -1) {
        await deleteMemberSegment(memberSegments[existingSegmentIndex]._id);
        const updatedSegments = [...memberSegments];
        updatedSegments.splice(existingSegmentIndex, 1);
        setMemberSegments(updatedSegments);
        // successAlert('Coupon has been successfully deactivated.');
      } else {
        const newSegment = await addMemberSegment(memberInfo?._id || '', segmentId);
        setMemberSegments([...memberSegments, newSegment]);
        // successAlert('Coupon has been successfully activated.');
      }
    } catch (error: any) {
      // errorAlert(error?.error?.error || error?.message);
    }
  };

  if (isLoading) {
    return <CardMiniSkeleton />;
  }

  // if (!segments.length) {
  //   return <NoData message="No coupons available" />;
  // }

  return (
    <Container>
      {segments.map((segment) => (
        <CouponCard key={segment._id}>
          <CouponContent>
            <CouponTitle>{segment.name}</CouponTitle>
            <CouponDescription>{segment.description}</CouponDescription>
            <CouponButton 
              onClick={() => updateSegment(segment._id)}
              claimed={isClaimed(segment._id)}
            >
              {isClaimed(segment._id) ? 'Deactivate' : 'Activate'}
            </CouponButton>
          </CouponContent>
        </CouponCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const CouponCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const CouponContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CouponTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
`;

const CouponDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
`;

const CouponButton = styled.button<CouponButtonProps>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${(props: CouponButtonProps) => props.claimed ? 'var(--error-color)' : 'var(--primary-color)'};
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props: CouponButtonProps) => props.claimed ? 'var(--error-hover)' : 'var(--primary-hover)'};
  }
`; 