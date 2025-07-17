import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  className?: string;
}

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  text-decoration: none;
  font-family: inherit;
  
  &:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const StyledButton = styled.button<ButtonProps>`
  ${buttonStyles}
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
        `;
      case 'secondary':
        return css`
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
          
          &:hover:not(:disabled) {
            background: #e9ecef;
            border-color: #adb5bd;
          }
        `;
      case 'danger':
        return css`
          background: #dc3545;
          color: white;
          
          &:hover:not(:disabled) {
            background: #c82333;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: #667eea;
          
          &:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.1);
          }
        `;
      default:
        return '';
    }
  }}
  
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 8px 16px;
          font-size: 14px;
          line-height: 1.4;
        `;
      case 'medium':
        return css`
          padding: 12px 24px;
          font-size: 16px;
          line-height: 1.5;
        `;
      case 'large':
        return css`
          padding: 16px 32px;
          font-size: 18px;
          line-height: 1.6;
        `;
      default:
        return '';
    }
  }}
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  className,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};