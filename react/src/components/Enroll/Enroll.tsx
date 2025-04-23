import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../../services/alert/alertService';
import { useLogin } from '../../services/login/loginService';

const Container = styled.div`
  display: flex;
  justify-content: center;
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
  gap: 10px;
`;

const NameFields = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const FormField = styled.div`
  width: 100%;
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

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
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
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export const Enroll: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError, showSuccess } = useAlert();
  const { enroll } = useLogin();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await enroll(formData);
        if (response.status === 'success') {
          showSuccess('Enrollment successful. Please proceed to log in.');
          navigate('/login', {
            state: { email: btoa(formData.email) }
          });
        }
      } catch (error: any) {
        showError(error?.error?.error || error?.message);
      }
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
            <NameFields>
              <FormField>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
              </FormField>
              <FormField>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
              </FormField>
            </NameFields>
            <FormField>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormField>
            <FormField>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormField>
            <FormField>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormField>
            <Button type="submit" primary>
              CREATE AN ACCOUNT
            </Button>
          </Form>
        </FormContainer>
        <DividerContainer>
          <Divider />
          <DividerText>Already a Member ?</DividerText>
          <Divider />
        </DividerContainer>
        <Button stroked onClick={() => navigate('/login')}>
          SIGN IN
        </Button>
      </RightColumn>
    </Container>
  );
}; 