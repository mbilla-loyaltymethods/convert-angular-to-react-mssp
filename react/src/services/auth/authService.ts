import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('loyaltyId');
    setIsAuthenticated(false);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    getToken
  };
}; 