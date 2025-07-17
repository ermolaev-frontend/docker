import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const Label = styled.label<{ error?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: ${({ error }) => error ? '#dc3545' : '#495057'};
`;

const InputWrapper = styled.div<{ 
  hasLeftIcon?: boolean; 
  hasRightIcon?: boolean; 
  error?: boolean;
  variant?: 'outlined' | 'filled';
}>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${({ variant = 'outlined', error }) => {
    const baseStyles = css`
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
      
      &:focus-within {
        outline: 2px solid ${error ? '#dc3545' : '#667eea'};
        outline-offset: 1px;
      }
    `;
    
    if (variant === 'outlined') {
      return css`
        ${baseStyles}
        border: 2px solid ${error ? '#dc3545' : '#dee2e6'};
        background: white;
        
        &:hover {
          border-color: ${error ? '#dc3545' : '#adb5bd'};
        }
        
        &:focus-within {
          border-color: ${error ? '#dc3545' : '#667eea'};
        }
      `;
    } else {
      return css`
        ${baseStyles}
        background: ${error ? '#f8d7da' : '#f8f9fa'};
        border: 2px solid transparent;
        
        &:hover {
          background: ${error ? '#f1aeb5' : '#e9ecef'};
        }
        
        &:focus-within {
          background: white;
          border-color: ${error ? '#dc3545' : '#667eea'};
        }
      `;
    }
  }}
`;

const StyledInput = styled.input<{
  size?: 'small' | 'medium' | 'large';
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
}>`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-family: inherit;
  color: #495057;
  
  &::placeholder {
    color: #6c757d;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${({ size = 'medium', hasLeftIcon, hasRightIcon }) => {
    const paddingLeft = hasLeftIcon ? '44px' : '16px';
    const paddingRight = hasRightIcon ? '44px' : '16px';
    
    switch (size) {
      case 'small':
        return css`
          padding: 8px ${paddingRight} 8px ${paddingLeft};
          font-size: 14px;
          line-height: 1.4;
        `;
      case 'medium':
        return css`
          padding: 12px ${paddingRight} 12px ${paddingLeft};
          font-size: 16px;
          line-height: 1.5;
        `;
      case 'large':
        return css`
          padding: 16px ${paddingRight} 16px ${paddingLeft};
          font-size: 18px;
          line-height: 1.6;
        `;
      default:
        return '';
    }
  }}
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ position }) => position}: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const HelperText = styled.div<{ error?: boolean }>`
  font-size: 12px;
  margin-top: 6px;
  color: ${({ error }) => error ? '#dc3545' : '#6c757d'};
  line-height: 1.4;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  id,
  className,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && (
        <Label htmlFor={inputId} error={hasError}>
          {label}
        </Label>
      )}
      
      <InputWrapper
        hasLeftIcon={Boolean(leftIcon)}
        hasRightIcon={Boolean(rightIcon)}
        error={hasError}
        variant={variant}
      >
        {leftIcon && (
          <IconWrapper position="left">
            {leftIcon}
          </IconWrapper>
        )}
        
        <StyledInput
          ref={ref}
          id={inputId}
          size={size}
          hasLeftIcon={Boolean(leftIcon)}
          hasRightIcon={Boolean(rightIcon)}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        />
        
        {rightIcon && (
          <IconWrapper position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </InputWrapper>
      
      {(error || helperText) && (
        <HelperText
          id={error ? `${inputId}-error` : `${inputId}-helper`}
          error={hasError}
          role={hasError ? 'alert' : undefined}
        >
          {error || helperText}
        </HelperText>
      )}
    </InputContainer>
  );
});