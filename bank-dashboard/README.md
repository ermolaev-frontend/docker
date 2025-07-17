# Bank Dashboard - Тестовый проект для Банка 131

Это тестовый проект банковского личного кабинета, демонстрирующий современный стек технологий для Frontend разработки.

## 🚀 Технологический стек

### Основные технологии
- **React 18** - библиотека для создания пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript для надежности кода
- **Emotion** - CSS-in-JS библиотека для стилизации компонентов
- **Zustand** - легковесное управление состоянием (Redux-free подход)
- **TanStack Query (React Query)** - управление серверным состоянием
- **Ramda** - функциональные утилиты для обработки данных
- **React Hook Form** - эффективная работа с формами
- **React Router** - клиентская маршрутизация

### Инструменты разработки
- **Webpack 5** - сборщик модулей с поддержкой Module Federation
- **Babel** - транспиляция JavaScript/TypeScript
- **ESLint** - линтинг кода
- **Jest** - тестирование

## 📁 Структура проекта

```
bank-dashboard/
├── public/
│   └── index.html          # HTML шаблон с accessibility
├── src/
│   ├── api/
│   │   └── hooks.ts        # React Query хуки
│   ├── components/
│   │   ├── ui/             # Переиспользуемые UI компоненты
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── auth/           # Компоненты аутентификации
│   │   │   └── LoginForm.tsx
│   │   └── dashboard/      # Компоненты дашборда
│   │       └── AccountCard.tsx
│   ├── store/
│   │   └── authStore.ts    # Zustand store для аутентификации
│   ├── types/
│   │   └── index.ts        # TypeScript типы и интерфейсы
│   ├── utils/
│   │   └── ramdaUtils.ts   # Функциональные утилиты с Ramda
│   ├── App.tsx             # Главный компонент приложения
│   └── index.tsx           # Точка входа
├── webpack.config.js       # Конфигурация Webpack
├── tsconfig.json          # Конфигурация TypeScript
└── package.json           # Зависимости и скрипты
```

## 🛠️ Установка и запуск

### Требования
- Node.js 16+
- npm или yarn

### Команды

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшна
npm run build

# Запуск тестов
npm run test

# Проверка типов TypeScript
npm run type-check

# Линтинг кода
npm run lint
```

Приложение будет доступно по адресу: http://localhost:3000

## 🎯 Демонстрируемые возможности

### 1. TypeScript интеграция
- Полная типизация всех компонентов и функций
- Использование Utility Types (Pick, Omit, Partial)
- Строгие интерфейсы для API и состояния
- Type guards и type assertions

### 2. React Query для управления данными
- Кэширование запросов с настройкой времени жизни
- Автоматическая синхронизация и обновление данных
- Оптимистичные обновления
- Error handling и loading states

### 3. Zustand для управления состоянием
- Простое и эффективное управление глобальным состоянием
- Персистентность данных в localStorage
- Типизированные действия и селекторы
- Без бойлерплейта Redux

### 4. Emotion CSS-in-JS
- Компонентно-ориентированная стилизация
- Динамические стили на основе props
- Темизация и дизайн-система
- Высокая производительность

### 5. Ramda функциональное программирование
- Композиция функций с pipe и compose
- Каррирование для переиспользования логики
- Иммутабельная работа с данными
- Функциональные утилиты для бизнес-логики

### 6. Web Accessibility (WCAG 2.1)
- Семантическая разметка HTML
- ARIA атрибуты для screen readers
- Keyboard navigation support
- Высокий контраст и focus indicators
- Skip links для быстрой навигации

### 7. Микрофронтенды (готовность)
- Webpack Module Federation конфигурация
- Shared dependencies между приложениями
- Возможность независимого развертывания модулей

## 🔐 Аутентификация

Для демонстрации используются моковые данные:
- **Email**: любой валидный email
- **Пароль**: любой пароль длиной от 6 символов

## 📱 Функциональность

### Реализованные возможности:
- ✅ Аутентификация с валидацией форм
- ✅ Просмотр банковских счетов
- ✅ Отзывчивый дизайн
- ✅ Accessibility поддержка
- ✅ TypeScript типизация
- ✅ Error handling
- ✅ Loading states

### Планируемые функции (для полной реализации):
- 🔄 История транзакций с фильтрацией
- 🔄 Переводы денег между счетами
- 🔄 Аналитика и графики (Recharts)
- 🔄 Настройки профиля
- 🔄 Уведомления
- 🔄 Экспорт данных

## 🧪 Тестирование

Проект включает настройку для тестирования:
- Jest для unit тестов
- TypeScript поддержка в тестах
- Мокирование API запросов

## 🔧 Особенности реализации

### 1. Дизайн-система
Компоненты построены с принципами design system:
- Консистентные цвета и типографика
- Переиспользуемые UI компоненты
- Responsive design
- Accessibility из коробки

### 2. Производительность
- Code splitting с React.lazy (готовность)
- Оптимизация рендеринга с React.memo
- Efficient bundle size с tree shaking
- Кэширование данных с React Query

### 3. Безопасность
- Валидация данных на клиенте
- Защищенные роуты
- Sanitization пользовательского ввода
- XSS защита

## 📈 Масштабируемость

Архитектура проекта поддерживает:
- Добавление новых модулей через Module Federation
- Расширение функциональности без refactoring
- Независимые команды разработки
- CI/CD интеграция

## 🎨 UI/UX принципы

- **Mobile First** responsive design
- **Progressive Enhancement** поддержка
- **Accessibility First** разработка
- **Performance Budget** оптимизация
- **User-Centered** дизайн решения

## 📚 Ресурсы для изучения

### Документация технологий:
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Emotion](https://emotion.sh/docs/introduction)
- [Zustand](https://github.com/pmndrs/zustand)
- [Ramda](https://ramdajs.com/)

### Accessibility:
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)

---

**Автор**: Frontend Developer  
**Версия**: 1.0.0  
**Лицензия**: MIT