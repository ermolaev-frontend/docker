import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  Account, 
  Transaction, 
  Analytics, 
  TransferForm, 
  User,
  TransactionFilters,
  PaginatedResponse 
} from '@/types';
import { useAuthStore } from '@/store/authStore';

// Базовый URL API (в реальном проекте из переменных окружения)
const API_BASE_URL = 'https://api.bank131.com/v1';

// Функция для выполнения запросов
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const token = useAuthStore.getState().token;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Mock данные для демонстрации
const generateMockAccounts = (): Account[] => [
  {
    id: '1',
    accountNumber: '4081 7810 0000 1234',
    type: 'checking',
    currency: 'RUB',
    balance: 150000,
    availableBalance: 150000,
    isActive: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    accountNumber: '4081 7810 0000 5678',
    type: 'savings',
    currency: 'USD',
    balance: 2500,
    availableBalance: 2500,
    isActive: true,
    createdAt: new Date('2023-03-10'),
  },
];

const generateMockTransactions = (): Transaction[] => [
  {
    id: '1',
    accountId: '1',
    type: 'expense',
    amount: -1200,
    currency: 'RUB',
    description: 'Продуктовый магазин',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 86400000),
    category: 'food',
  },
  {
    id: '2',
    accountId: '1',
    type: 'income',
    amount: 75000,
    currency: 'RUB',
    description: 'Зарплата',
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000),
    completedAt: new Date(Date.now() - 172800000),
    category: 'salary',
  },
  {
    id: '3',
    accountId: '1',
    type: 'expense',
    amount: -800,
    currency: 'RUB',
    description: 'Заправка автомобиля',
    status: 'completed',
    createdAt: new Date(Date.now() - 259200000),
    completedAt: new Date(Date.now() - 259200000),
    category: 'transport',
  },
];

// Хуки для счетов
export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<Account[]> => {
      // В реальном приложении был бы запрос к API
      // return apiRequest<Account[]>('/accounts');
      
      // Для демонстрации возвращаем mock данные
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockAccounts();
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useAccount = (accountId: string) => {
  return useQuery({
    queryKey: ['account', accountId],
    queryFn: async (): Promise<Account> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const accounts = generateMockAccounts();
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) throw new Error('Account not found');
      return account;
    },
    enabled: !!accountId,
  });
};

// Хуки для транзакций
export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async (): Promise<PaginatedResponse<Transaction>> => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const transactions = generateMockTransactions();
      
      return {
        data: transactions,
        pagination: {
          page: 1,
          limit: 10,
          total: transactions.length,
          hasNext: false,
          hasPrev: false,
        },
      };
    },
    staleTime: 30 * 1000, // 30 секунд
  });
};

export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async (): Promise<Transaction> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const transactions = generateMockTransactions();
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) throw new Error('Transaction not found');
      return transaction;
    },
    enabled: !!transactionId,
  });
};

// Хук для аналитики
export const useAnalytics = (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: async (): Promise<Analytics> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        period,
        totalIncome: 150000,
        totalExpense: 45000,
        categorySummary: {
          food: 12000,
          transport: 8000,
          entertainment: 5000,
          shopping: 15000,
          utilities: 3000,
          healthcare: 2000,
          education: 0,
          transfer: 0,
          salary: 150000,
          other: 0,
        },
        monthlyData: [
          { month: 'Jan 2024', income: 75000, expense: 25000 },
          { month: 'Feb 2024', income: 75000, expense: 20000 },
          { month: 'Mar 2024', income: 0, expense: 0 },
        ],
      };
    },
    staleTime: 10 * 60 * 1000, // 10 минут
  });
};

// Мутация для создания перевода
export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData: TransferForm): Promise<Transaction> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Симуляция создания транзакции
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        accountId: '1',
        type: 'transfer',
        amount: -transferData.amount,
        currency: transferData.currency,
        description: transferData.description,
        recipient: transferData.recipientAccount,
        status: 'pending',
        createdAt: new Date(),
        category: 'transfer',
      };

      return newTransaction;
    },
    onSuccess: () => {
      // Инвалидируем кэш транзакций и счетов
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

// Мутация для обновления профиля
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: Partial<User>): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error('User not authenticated');
      
      const updatedUser = { ...currentUser, ...userData };
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Хук для получения курсов валют
export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        USD: 90.25,
        EUR: 97.80,
        CNY: 12.45,
        GBP: 114.30,
      };
    },
    staleTime: 60 * 1000, // 1 минута
    refetchInterval: 30 * 1000, // Обновляем каждые 30 секунд
  });
};

// Хук для поиска транзакций
export const useSearchTransactions = (searchTerm: string) => {
  return useQuery({
    queryKey: ['search-transactions', searchTerm],
    queryFn: async (): Promise<Transaction[]> => {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allTransactions = generateMockTransactions();
      return allTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    enabled: searchTerm.length >= 2,
    staleTime: 30 * 1000,
  });
};