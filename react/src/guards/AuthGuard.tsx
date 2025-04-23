import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from '../services/login/loginService';
import { useAlert } from '../services/alert/alertService';
import { useAuth } from '../services/auth/authService';

export const AuthGuard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { login } = useLogin();
  const { showError } = useAlert();
  const loginAttempted = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (loginAttempted.current || isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        loginAttempted.current = true;
        await login('demo/vgunasekaran', 'Password1');
      } catch (error) {
        showError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    handleLogin();
  }, [isAuthenticated, login, showError]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}; 