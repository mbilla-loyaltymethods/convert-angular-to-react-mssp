import { useState } from 'react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/environment';

interface Location {
  name: string;
  number: string;
  ext: {
    hideInMSSP?: boolean;
    operator?: string;
  };
}

export const useLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocations = async (): Promise<Location[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Location[]>(
        `${APP_CONFIG.config.REST_URL}/api/v1/locations`
      );
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getLocations
  };
}; 