import { useState, useCallback } from 'react';
import axios from 'axios';
import { environment } from '../../config/environment';
import { APP_CONFIG } from '../../config/environment';

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  // Add other product properties as needed
  sku: string;
  cost: number;
  ext?: {
    hideInMSSP?: boolean;
    nonReturnable?: boolean;
  };
}

interface ProductCache {
  [key: string]: Product[] | null;
}

export const useProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<ProductCache>({});

  const getProducts = useCallback(async (): Promise<Product[]> => {
    try {
      if (cache['allProducts']) {
        return cache['allProducts'];
      }

      setIsLoading(true);
      setError(null);

      const response = await axios.get<Product[]>(`${environment.REST_URL}/products`);
      const products = response.data;
      
      setCache(prev => ({
        ...prev,
        'allProducts': products
      }));
      
      return products;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      setCache(prev => ({
        ...prev,
        'allProducts': null
      }));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  const getOtherProducts = useCallback(async (category: string, type: string): Promise<Product[]> => {
    try {
      const response = await axios.get<Product[]>(
        `${APP_CONFIG.config.REST_URL}/api/v1/products`,
        {
          params: {
            category,
            type
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return {
    isLoading,
    error,
    getProducts,
    getOtherProducts,
    clearCache
  };
}; 