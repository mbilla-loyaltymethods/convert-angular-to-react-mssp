import { useCallback } from 'react';
import axiosInstance from '../../config/axios';

interface ActivityRequest {
  type: string;
  date: string;
  srcChannelType?: string;
  couponCode?: string;
  srcChannelID?: string;
  loyaltyID?: string;
}

interface Widget {
  currentTier: string;
  nextTier: string;
  totalSpends: number;
  nextMilestone: number;
  tierBenefits?: Array<{
    thumbnail: string;
    title: string;
    desc: string[];
  }>;
}

interface Coupon {
  ext: { rewardCost: number; isSelected: boolean; };
  id: string;
  name: string;
  description: string;
  // Add other coupon properties as needed
}

export const useActivity = () => {
  const getActivity = useCallback(async (payload: ActivityRequest | ActivityRequest[], persist = false): Promise<any> => {
    try {
      const defaultValues = {
        srcChannelType: 'Web',
        loyaltyID: localStorage.getItem('loyaltyId')
      };

      const url = `/api/v1/activity?filter=data,error?persist=${persist}`;

      if (Array.isArray(payload)) {
        // Handling multiple activities
        const requests = payload.map(item => 
          axiosInstance.post(url, { ...item, ...defaultValues })
        );
        const responses = await Promise.all(requests);
        return responses.map(response => response.data);
      } else {
        // Single activity request
        const response = await axiosInstance.post(url, { ...payload, ...defaultValues });
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const getStreakPolicy = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/v1/streakPolicies?select=name,description,goalPolicies,timeLimit,ext');
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const getCoupons = useCallback(async (): Promise<Coupon[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/rewardPolicies');
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    getActivity,
    getStreakPolicy,
    getCoupons
  };
}; 