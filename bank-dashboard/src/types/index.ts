// Пользователь
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
}

// Банковский счет
export interface Account {
  id: string;
  accountNumber: string;
  type: 'checking' | 'savings' | 'credit';
  currency: 'RUB' | 'USD' | 'EUR';
  balance: number;
  availableBalance: number;
  isActive: boolean;
  createdAt: Date;
}

// Транзакция
export interface Transaction {
  id: string;
  accountId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  sender?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  category: TransactionCategory;
}

// Категории транзакций
export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'healthcare'
  | 'education'
  | 'transfer'
  | 'salary'
  | 'other';

// Форма перевода
export interface TransferForm {
  recipientAccount: string;
  amount: number;
  currency: string;
  description: string;
  scheduleDate?: Date;
}

// Аналитика
export interface Analytics {
  period: 'week' | 'month' | 'quarter' | 'year';
  totalIncome: number;
  totalExpense: number;
  categorySummary: Record<TransactionCategory, number>;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

// API ответы
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Состояние аутентификации
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Фильтры для транзакций
export interface TransactionFilters {
  accountId?: string;
  type?: Transaction['type'];
  category?: TransactionCategory;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  status?: Transaction['status'];
}

// Настройки уведомлений
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

// Настройки безопасности
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  sessionTimeout: number;
  lastPasswordChange: Date;
  trustedDevices: TrustedDevice[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: Date;
  platform: string;
  browser: string;
}