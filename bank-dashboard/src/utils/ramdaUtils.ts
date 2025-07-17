import * as R from 'ramda';
import type { Transaction, Account, TransactionCategory, Analytics, MonthlyData } from '@/types';
import { format, startOfMonth, isSameMonth } from 'date-fns';

// Форматирование валюты
export const formatCurrency = R.curry((currency: string, amount: number): string => {
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
});

// Форматирование номера счета
export const formatAccountNumber = R.pipe(
  R.replace(/\s/g, ''),
  R.splitEvery(4),
  R.join(' ')
);

// Проверка валидности номера карты (Luhn algorithm)
export const isValidCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = R.replace(/\D/g, '', cardNumber);
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  const digits = R.map(Number, R.reverse(R.split('', cleanNumber)));
  
  const checksum = R.pipe(
    R.mapIndexed((digit: number, index: number) => 
      index % 2 === 1 ? (digit * 2 > 9 ? digit * 2 - 9 : digit * 2) : digit
    ),
    R.sum
  )(digits);

  return checksum % 10 === 0;
};

// Группировка транзакций по категориям
export const groupTransactionsByCategory = R.groupBy(
  R.prop('category') as (transaction: Transaction) => TransactionCategory
);

// Подсчет суммы по категориям
export const calculateCategorySummary = R.pipe(
  groupTransactionsByCategory,
  R.map(R.pipe(
    R.map(R.prop('amount') as (transaction: Transaction) => number),
    R.sum
  ))
);

// Фильтрация транзакций по периоду
export const filterTransactionsByPeriod = R.curry(
  (startDate: Date, endDate: Date, transactions: Transaction[]): Transaction[] =>
    R.filter(
      R.pipe(
        R.prop('createdAt'),
        (date: Date) => date >= startDate && date <= endDate
      ),
      transactions
    )
);

// Сортировка транзакций по дате (новые первыми)
export const sortTransactionsByDate = R.sort(
  R.descend(R.prop('createdAt') as (transaction: Transaction) => Date)
);

// Получение последних N транзакций
export const getRecentTransactions = R.curry(
  (count: number, transactions: Transaction[]): Transaction[] =>
    R.pipe(
      sortTransactionsByDate,
      R.take(count)
    )(transactions)
);

// Расчет баланса по всем счетам
export const calculateTotalBalance = R.pipe(
  R.map(R.prop('balance') as (account: Account) => number),
  R.sum
);

// Фильтрация активных счетов
export const getActiveAccounts = R.filter(
  R.prop('isActive') as (account: Account) => boolean
);

// Группировка транзакций по месяцам для аналитики
export const groupTransactionsByMonth = (transactions: Transaction[]): MonthlyData[] => {
  const monthGroups = R.groupBy(
    R.pipe(
      R.prop('createdAt'),
      (date: Date) => format(startOfMonth(date), 'yyyy-MM')
    ),
    transactions
  );

  return R.pipe(
    R.toPairs,
    R.map(([month, monthTransactions]: [string, Transaction[]]) => {
      const income = R.pipe(
        R.filter(R.propEq('type', 'income')),
        R.map(R.prop('amount')),
        R.sum
      )(monthTransactions);

      const expense = R.pipe(
        R.filter(R.propEq('type', 'expense')),
        R.map(R.prop('amount')),
        R.sum
      )(monthTransactions);

      return {
        month: format(new Date(month), 'MMM yyyy'),
        income,
        expense,
      };
    }),
    R.sortBy(R.prop('month'))
  )(monthGroups);
};

// Поиск транзакций по описанию
export const searchTransactions = R.curry(
  (searchTerm: string, transactions: Transaction[]): Transaction[] =>
    R.filter(
      R.pipe(
        R.prop('description'),
        R.toLower,
        R.includes(R.toLower(searchTerm))
      ),
      transactions
    )
);

// Валидация email
export const isValidEmail = R.test(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);

// Валидация телефона
export const isValidPhone = R.test(
  /^\+?[1-9]\d{1,14}$/
);

// Маскирование номера карты
export const maskCardNumber = R.pipe(
  R.replace(/\D/g, ''),
  R.splitAt(-4),
  ([start, end]: [string, string]) => 
    `**** **** **** ${end}`
);

// Генерация цвета для категории
export const getCategoryColor = (category: TransactionCategory): string => {
  const colors: Record<TransactionCategory, string> = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#45B7D1',
    shopping: '#96CEB4',
    utilities: '#FFEAA7',
    healthcare: '#DDA0DD',
    education: '#98D8C8',
    transfer: '#F7DC6F',
    salary: '#82E0AA',
    other: '#AED6F1',
  };
  
  return colors[category] || colors.other;
};

// Конвертация валют (mock функция)
export const convertCurrency = R.curry(
  (fromCurrency: string, toCurrency: string, amount: number): number => {
    // Моковые курсы валют
    const rates: Record<string, Record<string, number>> = {
      RUB: { USD: 0.011, EUR: 0.010, RUB: 1 },
      USD: { RUB: 90, EUR: 0.85, USD: 1 },
      EUR: { RUB: 100, USD: 1.18, EUR: 1 },
    };
    
    const rate = rates[fromCurrency]?.[toCurrency] || 1;
    return Math.round(amount * rate * 100) / 100;
  }
);

// Обработка ошибок с логированием
export const handleError = R.curry(
  (context: string, error: Error): void => {
    console.error(`[${context}]`, error.message);
    // Здесь можно добавить отправку в сервис мониторинга
  }
);