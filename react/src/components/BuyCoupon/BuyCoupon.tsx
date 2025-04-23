import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useActivity } from '../../services/activity/activityService';
import { useAlert } from '../../services/alert/alertService';
import { Coupon } from '../../models/coupon';
import { Member } from '../../models/member';
import { ActivityRequest } from '../../models/activity';

interface BuyCouponProps {
  memberInfo: Member;
  refresh: boolean;
  onClose: (refresh: boolean) => void;
}

interface CouponWithCount extends Coupon {
  count: number;
  ext: {
    rewardCost: number;
    isSelected: boolean;
  };
}

const Container = styled.div`
  padding: 20px;
`;

const CouponCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: white;
`;

const CouponHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CouponName = styled.h3`
  margin: 0;
  color: var(--primary-color);
`;

const CouponCost = styled.span`
  color: var(--secondary-color);
  font-weight: bold;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CounterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const BuyButton = styled.button`
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

export const BuyCoupon: React.FC<BuyCouponProps> = ({ memberInfo, refresh, onClose }) => {
  const [couponList, setCouponList] = useState<CouponWithCount[]>([]);
  const { getCoupons, getActivity } = useActivity();
  const { showError } = useAlert();

  useEffect(() => {
    if (memberInfo) {
      fetchCoupons();
    }
  }, [memberInfo]);

  useEffect(() => {
    if (refresh) {
      clearCoupons();
    }
  }, [refresh]);

  const fetchCoupons = async () => {
    try {
      const coupons = await getCoupons();
      setCouponList(coupons.map(coupon => ({
        ...coupon,
        count: 0,
        ext: {
          ...coupon?.ext,
          isSelected: false
        }
      }) as CouponWithCount));
    } catch (error: any) {
      showError(error?.error?.error || error?.message || 'Failed to fetch coupons');
    }
  };

  const clearCoupons = () => {
    setCouponList(coupons => 
      coupons.map(coupon => ({ ...coupon, count: 0 }) as CouponWithCount)
    );
  };

  const hasCoupons = () => couponList.some(coupon => coupon.count);
  
  const totalPoints = () => 
    couponList.reduce((acc, coupon) => 
      (coupon.count ?? 0) * coupon.ext.rewardCost + acc, 0
    );

  const updateCouponCount = (index: number, increment: boolean) => {
    setCouponList(coupons => 
      coupons.map((coupon, i) => 
        i === index 
          ? { ...coupon, count: Math.max(0, (coupon.count ?? 0) + (increment ? 1 : -1)) }
          : coupon
      )
    );
  };

  const createPayload = (couponCode: string): ActivityRequest => ({
    type: 'Redemption',
    date: new Date().toISOString(),
    srcChannelType: 'Web',
    srcChannelID: 'Web',
    loyaltyID: memberInfo.loyaltyId,
    couponCode,
  });

  const buyCoupon = async () => {
    if (totalPoints() > memberInfo.purses[0].availBalance) {
      showError('Not enough points to buy the selected coupons');
      return;
    }

    try {
      const requests = couponList
        .filter(coupon => coupon.count)
        .flatMap(coupon => 
          Array(coupon.count).fill(null).map(() => 
            getActivity(createPayload(coupon.name))
          )
        );

      await Promise.all(requests);
      onClose(true);
    } catch (error: any) {
      showError(error?.error?.error || error?.message || 'Failed to buy coupons');
    }
  };

  return (
    <Container>
      {couponList.map((coupon, index) => (
        <CouponCard key={coupon.name}>
          <CouponHeader>
            <CouponName>{coupon.name}</CouponName>
            <CouponCost>{coupon.ext.rewardCost} points</CouponCost>
          </CouponHeader>
          <CounterContainer>
            <CounterButton onClick={() => updateCouponCount(index, false)}>
              -
            </CounterButton>
            <span>{coupon.count ?? 0}</span>
            <CounterButton onClick={() => updateCouponCount(index, true)}>
              +
            </CounterButton>
          </CounterContainer>
        </CouponCard>
      ))}
      {hasCoupons() && (
        <BuyButton onClick={buyCoupon}>
          Buy Coupons ({totalPoints()} points)
        </BuyButton>
      )}
    </Container>
  );
}; 