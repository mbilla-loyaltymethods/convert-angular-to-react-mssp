import { useState, useCallback } from 'react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/environment';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other profile properties as needed
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const getProfile = useCallback(async (): Promise<Profile> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<Profile>(
        `${APP_CONFIG.config.REST_URL}/api/v1/profile`
      );
      setProfile(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<Profile> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.put<Profile>(
        `${APP_CONFIG.config.REST_URL}/api/v1/profile`,
        data
      );
      setProfile(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    profile,
    getProfile,
    updateProfile
  };
}; 