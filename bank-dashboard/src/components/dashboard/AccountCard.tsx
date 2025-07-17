import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { Account } from '@/types';
import { formatCurrency, formatAccountNumber, maskCardNumber } from '@/utils/ramdaUtils';

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
  isSelected?: boolean;
}

const CardContainer = styled.div<{ isSelected?: boolean }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  
  ${({ isSelected }) =>
    isSelected &&
    css`
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  }
  
  &:focus {
    outline: 3px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    transform: translate(-20px, 20px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const AccountType = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AccountStatus = styled.div<{ isActive: boolean }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${({ isActive }) => 
    isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${({ isActive }) => isActive ? '#4CAF50' : '#F44336'};
  font-weight: 600;
`;

const Balance = styled.div`
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const BalanceLabel = styled.div`
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 4px;
`;

const BalanceAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
`;

const AvailableBalance = styled.div`
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
`;

const AccountNumber = styled.div`
  font-size: 16px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
`;

const CardBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChipIcon = styled.div`
  width: 24px;
  height: 18px;
  background: linear-gradient(45deg, #ffd700 0%, #ffed4a 100%);
  border-radius: 4px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: #333;
    border-radius: 2px;
  }
`;

const getAccountTypeLabel = (type: Account['type']): string => {
  switch (type) {
    case 'checking':
      return 'Текущий счёт';
    case 'savings':
      return 'Сберегательный';
    case 'credit':
      return 'Кредитный';
    default:
      return 'Счёт';
  }
};

const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'RUB':
      return '₽';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return currency;
  }
};

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onClick,
  isSelected = false,
}) => {
  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <CardContainer
      isSelected={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Счёт ${formatAccountNumber(account.accountNumber)}, баланс ${formatCurrency(account.currency, account.balance)}`}
    >
      <CardHeader>
        <AccountType>
          {getAccountTypeLabel(account.type)}
        </AccountType>
        <AccountStatus isActive={account.isActive}>
          {account.isActive ? 'Активен' : 'Заблокирован'}
        </AccountStatus>
      </CardHeader>

      <Balance>
        <BalanceLabel>Доступно</BalanceLabel>
        <BalanceAmount>
          {formatCurrency(account.currency, account.balance)}
        </BalanceAmount>
        {account.balance !== account.availableBalance && (
          <AvailableBalance>
            К снятию: {formatCurrency(account.currency, account.availableBalance)}
          </AvailableBalance>
        )}
      </Balance>

      <CardFooter>
        <AccountNumber>
          {maskCardNumber(account.accountNumber)}
        </AccountNumber>
        <CardBrand>
          <ChipIcon />
          <span>{getCurrencySymbol(account.currency)}</span>
        </CardBrand>
      </CardFooter>
    </CardContainer>
  );
};