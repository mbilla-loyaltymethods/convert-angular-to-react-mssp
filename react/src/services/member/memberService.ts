import { useState, useCallback } from 'react';
import axiosInstance from '../../config/axios';
import { Member } from '../../models/member';
import { useAlert } from '../alert/alertService';

interface Streak {
  name: string;
  status: string;
  desc: string;
  goals: Array<{
    name: string;
    value: number;
    target: number;
    instantBonus?: string;
  }>;
  goalCompleted: string;
  streakGoalMessage?: string;
  startedAt?: string;
  timeLimit?: number;
}

interface MemberProfileResponse {
  member: Member;
}

export const useMember = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useAlert();

  const fetchMember = useCallback(async (loyaltyId: string): Promise<Member> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<Member>(`/api/v1/members/${loyaltyId}`);
      setMember(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message;
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const getPromo = useCallback(async (id: string, locationNum?: string) => {
    try {
      const url = `/api/v1/members/${id}/rules`;
      const params = new URLSearchParams();
      params.append('filter', 'promo');
      if (locationNum) {
        params.append('stores', locationNum);
      }
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const getOffers = useCallback(async (id: string, locationNum?: string) => {
    try {
      const url = `/api/v1/members/${id}/offers`;
      const params = new URLSearchParams();
      params.append('filter', 'offers,global');
      if (locationNum) {
        params.append('stores', locationNum);
      }
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const getVouchers = useCallback(async (member: Member) => {
    if (!member) {
      throw new Error('Member data is required');
    }

    const currentTier = member.tiers?.find((tier: { primary: any; }) => tier.primary);
    if (!currentTier) {
      throw new Error('No primary tier found for the member');
    }

    const query = {
      intendedUse: "Reward",
      $or: [
        { tierPolicyLevels: { $exists: false } },
        { tierPolicyLevels: { $size: 0 } },
        {
          tierPolicyLevels: {
            $elemMatch: {
              policyId: currentTier.policyId,
              level: currentTier.level.name
            }
          }
        }
      ]
    };

    try {
      const url = `/api/v1/rewardpolicies`;
      const response = await axiosInstance.get(url, {
        params: { query: JSON.stringify(query) }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const buyVoucher = useCallback(async (payload: any) => {
    try {
      const response = await axiosInstance.post('/buy', payload);
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const getMemberVouchers = useCallback(async (memberId: string): Promise<any[]> => {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/v1/members/${memberId}/vouchers`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const getStreaks = useCallback(async (loyaltyId: string): Promise<Streak[]> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/v1/member/${loyaltyId}/streaks`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch streaks');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAggregate = useCallback(async ({ week, year, metricName }: { week: string; year: string; metricName: string }) => {
    try {
      const response = await axiosInstance.get('/aggregate', {
        params: { week, year, metricName }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const getMember = useCallback(async (loyaltyId: string = '1001'): Promise<Member> => {
    try {
      const queryParams = new URLSearchParams({
        linked: 'true',
        divide: 'true'
      });
      
      const url = `/api/v1/members/${loyaltyId}/profile?${queryParams.toString()}`;
      const response = await axiosInstance.get<MemberProfileResponse[]>(url);
      const memberData = {
        ...response.data[0].member,
        loyaltyId: loyaltyId
      };
      
      setMember(memberData);
      return memberData;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error.message;
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    }
  }, [showError]);

  const updateMember = useCallback(async (memberId: string, data: Partial<Member>): Promise<Member> => {
    try {
      const response = await axiosInstance.put<Member>(
        `/api/v1/members/${memberId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const getMemberOffers = useCallback(async (memberId: string): Promise<any[]> => {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/v1/members/${memberId}/offers`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const getMemberActivityHistory = useCallback(async (memberId: string, limit: number = 10): Promise<any[]> => {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/v1/members/${memberId}/activity`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const getMemberStreaks = useCallback(async (memberId: string): Promise<any[]> => {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/v1/members/${memberId}/streaks`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    member,
    isLoading,
    error,
    fetchMember,
    getPromo,
    getOffers,
    getVouchers,
    buyVoucher,
    getMemberVouchers,
    getStreaks,
    getAggregate,
    getMember,
    updateMember,
    getMemberOffers,
    getMemberActivityHistory,
    getMemberStreaks
  };
}; 