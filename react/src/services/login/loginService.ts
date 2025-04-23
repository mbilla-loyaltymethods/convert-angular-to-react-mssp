import { useState, useCallback } from 'react';
import axiosInstance from '../../config/axios';
import { useAuth } from '../auth/authService';
import { useMember } from '../member/memberService';
import { useAlert } from '../alert/alertService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/reducers';
import { addMember } from 'store/actions/memberActions';

interface LoginResponse {
  status: string;
  token: string;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}

interface EnrollData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingLoginRequest, setPendingLoginRequest] = useState<Promise<string> | null>(null);
  
  const dispatch = useDispatch();
  const { login: authLogin } = useAuth();
  const { getMember } = useMember();
  const { showError } = useAlert();

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<LoginResponse>(
        '/api/v1/login',
        { username, password }
      );
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        authLogin(response.data.token);
      }
      try {
        const member = await getMember('1001');
        console.log('member', member);
        if (member) {
          localStorage.setItem('loyaltyId', member.loyaltyId);
          dispatch(addMember(member));
        }
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to fetch member data');
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message;
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const enroll = async (data: EnrollData): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<LoginResponse>(
        '/api/v1/enroll',
        data
      );
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async (): Promise<string> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return token;
  };

  const getTokenInternal = useCallback(async (): Promise<string> => {
    if (pendingLoginRequest) {
      return pendingLoginRequest;
    }

    const request = (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.post<{ token: string }>('/api/v1/login', {
          username: 'demo/mbilla',
          password: 'Password1!',
        });

        if (!response?.data?.token) {
          throw new Error('Login failed');
        }

        // Store the token and update auth context
        authLogin(response.data.token);

        // Fetch and store member data
        try {
          const member = await getMember('1001');
          console.log('member', member);
          if (member) {
            localStorage.setItem('loyaltyId', member.loyaltyId);
            dispatch(addMember(member));
          }
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to fetch member data');
        }

        return response.data.token;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setError(errorMessage);
        showError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        setPendingLoginRequest(null);
      }
    })();

    setPendingLoginRequest(request);
    return request;
  }, [authLogin, getMember, showError, pendingLoginRequest, dispatch]);

  const ensureAuthenticated = async (): Promise<string> => {
    try {
      return await getToken();
    } catch {
      throw new Error('Not authenticated');
    }
  };

  const member = useSelector((state: RootState) => state.member.member);

  return {
    isLoading,
    error,
    login,
    enroll,
    getToken,
    getTokenInternal,
    ensureAuthenticated,
    member
  };
}; 