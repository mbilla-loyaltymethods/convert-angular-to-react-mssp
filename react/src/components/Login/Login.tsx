import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../../services/alert/alertService';
import { useLogin } from '../../services/login/loginService';

const Container = styled.div`
  display: flex;
  background-color: white;
  width: 100%;
`;

const LeftColumn = styled.div`
  flex: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const RightColumn = styled.div`
  flex: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 100px 0 50px;
`;

const Logo = styled.img`
  width: 250px;
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const Button = styled.button<{ primary?: boolean; stroked?: boolean }>`
  padding: 25px;
  margin: 10px 0;
  border: ${props => props.stroked ? '1px solid #1976d2' : 'none'};
  background-color: ${props => props.primary ? '#1976d2' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#1976d2'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1976d2;
    animation: progress 2s infinite;
  }

  @keyframes progress {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const DividerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const Divider = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
`;

const DividerText = styled.p`
  color: #666;
  margin: 0;
`;

interface FormData {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useAlert();
  const { login } = useLogin();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [showLoginProgress, setShowLoginProgress] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    if (email) {
      setFormData(prev => ({
        ...prev,
        username: atob(email)
      }));
    }
  }, [location]);

  useEffect(() => {
    const isValid = formData.username && formData.password;
    setIsFormValid(!!isValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginProgress(true);

    try {
      const response = await login(formData.username, formData.password);
      if (response.token) {
        localStorage.setItem('accessToken', response.token);
        navigate('/dashboard');
      }
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
      setShowLoginProgress(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <LeftColumn />
      <RightColumn>
        <LogoContainer>
          <Logo src="/assets/logo-login.svg" alt="Logo" />
        </LogoContainer>
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" primary disabled={!isFormValid || showLoginProgress}>
              SIGN IN
            </Button>
            {showLoginProgress && <ProgressBar />}
          </Form>
        </FormContainer>
        <DividerContainer>
          <Divider />
          <DividerText>Not a Member ?</DividerText>
          <Divider />
        </DividerContainer>
        <Button stroked onClick={() => navigate('/enroll')}>
          CREATE AN ACCOUNT
        </Button>
      </RightColumn>
    </Container>
  );
}; 