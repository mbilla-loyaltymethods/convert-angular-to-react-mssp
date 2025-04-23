import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { environment, APP_CONFIG } from '../config/environment';

interface ActivityContextType {
  getPerks: () => Promise<any>;
  getCoupons: () => Promise<any>;
  getCouponList: (id: string) => Promise<any>;
  getActivity: (payload: any, persist?: boolean) => Promise<any>;
  getStreakPolicy: () => Promise<any>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [streakCache, setStreakCache] = useState<any>(null);

  const getPerks = useCallback(async () => {
    const response = await axios.get(`${environment.REST_URL}/rewardPolicy`);
    return response.data;
  }, []);

  const getCoupons = useCallback(async () => {
    const response = await axios.get(`${environment.REST_URL}/rewardPolicies`);
    return response.data;
  }, []);

  const getCouponList = useCallback(async (id: string) => {
    const response = await axios.get(`${environment.REST_URL}/rewards`, {
      params: { query: id }
    });
    return response.data;
  }, []);

  const getActivity = useCallback(async (payload: any, persist = false) => {
    const defaultValues = {
      srcChannelType: 'Web',
      loyaltyID: localStorage.getItem('loyaltyId')
    };

    const url = `${APP_CONFIG.config.REST_URL}/api/v1/activity?filter=data,error?persist=${persist}`;

    if (Array.isArray(payload)) {
      const requests = payload.map(item =>
        axios.post(url, { ...item, ...defaultValues })
      );
      const responses = await Promise.all(requests);
      return responses.map(response => response.data);
    } else {
      const response = await axios.post(url, { ...payload, ...defaultValues });
      return response.data;
    }
  }, []);

  const getStreakPolicy = useCallback(async () => {
    if (!streakCache) {
      const url = `${APP_CONFIG.config.REST_URL}/api/v1/streakPolicies?select=name,description,goalPolicies,timeLimit,ext`;
      try {
        const response = await axios.get(url);
        setStreakCache(response.data);
        return response.data;
      } catch (error) {
        setStreakCache(null);
        throw error;
      }
    }
    return streakCache;
  }, [streakCache]);

  return (
    <ActivityContext.Provider value={{
      getPerks,
      getCoupons,
      getCouponList,
      getActivity,
      getStreakPolicy
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
} 