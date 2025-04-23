import axios from 'axios';
import { APP_CONFIG } from './environment';

const axiosInstance = axios.create({
  baseURL: APP_CONFIG.config.REST_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('loyaltyId');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 