import axios from 'axios';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../login/loginService';

// Create axios instance
const apiClient = axios.create();

export const useApiClient = () => {
  const navigate = useNavigate();
  const { getToken } = useLogin();

  const setupInterceptors = useCallback(() => {
    // Request interceptor
    apiClient.interceptors.request.use(
      async (config) => {
        // Get the token from localStorage
        let token = localStorage.getItem('token');

        // If no token, try to get one
        if (!token) {
          token = await getToken();
        }

        // Add token to request headers
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token might be expired, clear it and redirect to login
          localStorage.removeItem('token');
          navigate('/login');
        }

        // Create a custom error with formatted message
        let errorMessage = 'An error occurred';

        if (error.response?.data?.errors?.length) {
          errorMessage = error.response.data.errors[0].message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Return a new error with the formatted message
        return Promise.reject(new Error(errorMessage));
      }
    );
  }, [getToken, navigate]);

  return {
    apiClient,
    setupInterceptors
  };
}; 