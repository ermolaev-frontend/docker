import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { isValidEmail } from '@/utils/ramdaUtils';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #2c3e50;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6c757d;
  text-align: center;
  margin: 0 0 24px 0;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  
  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  user-select: none;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  text-align: center;
  padding: 12px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ForgotLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [apiError, setApiError] = useState<string>('');
  const { login, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError('');
      await login(data.email, data.password);
      onSuccess?.();
    } catch (error) {
      setApiError('Неверный email или пароль');
    }
  };

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email обязателен';
    }
    if (!isValidEmail(email)) {
      return 'Введите корректный email';
    }
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Пароль обязателен';
    }
    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    return true;
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <Title>Добро пожаловать</Title>
        <Subtitle>Войдите в свой аккаунт Банка 131</Subtitle>
      </div>

      {apiError && (
        <ErrorMessage role="alert" aria-live="polite">
          {apiError}
        </ErrorMessage>
      )}

      <Input
        {...register('email', { validate: validateEmail })}
        label="Email"
        type="email"
        placeholder="Введите ваш email"
        error={errors.email?.message}
        fullWidth
        autoComplete="email"
        leftIcon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        }
      />

      <Input
        {...register('password', { validate: validatePassword })}
        label="Пароль"
        type="password"
        placeholder="Введите ваш пароль"
        error={errors.password?.message}
        fullWidth
        autoComplete="current-password"
        leftIcon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        }
      />

      <CheckboxContainer>
        <Checkbox
          {...register('rememberMe')}
          type="checkbox"
          id="remember-me"
        />
        <CheckboxLabel htmlFor="remember-me">
          Запомнить меня
        </CheckboxLabel>
      </CheckboxContainer>

      <Button
        type="submit"
        loading={isLoading}
        fullWidth
        size="large"
        ariaLabel={isLoading ? 'Вход в систему...' : 'Войти в аккаунт'}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </Button>

      <ForgotLink href="#" role="button" tabIndex={0}>
        Забыли пароль?
      </ForgotLink>
    </FormContainer>
  );
};