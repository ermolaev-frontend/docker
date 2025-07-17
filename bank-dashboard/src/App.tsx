import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/auth/LoginForm';
import { AccountCard } from './components/dashboard/AccountCard';
import { useAccounts } from './api/hooks';

// Создаем QueryClient для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Глобальные стили
const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Accessibility: высокий контраст для фокуса */
  *:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  /* Скрыть элементы только визуально (для screen readers) */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 24px 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #6c757d;
`;

// Компонент Dashboard
const Dashboard: React.FC = () => {
  const { data: accounts, isLoading, error } = useAccounts();

  if (isLoading) {
    return <LoadingSpinner>Загрузка счетов...</LoadingSpinner>;
  }

  if (error) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div id="main-content">
      <SectionTitle>Мои счета</SectionTitle>
      <DashboardGrid>
        {accounts?.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onClick={() => console.log('Открыть счёт:', account.id)}
          />
        ))}
      </DashboardGrid>
    </div>
  );
};

// Защищенный роут
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Компонент с аутентификацией
const AuthenticatedApp: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <AppContainer>
      <Header>
        <Logo>Банк 131</Logo>
        <UserInfo>
          <UserName>
            {user?.firstName} {user?.lastName}
          </UserName>
          <LogoutButton onClick={logout} aria-label="Выйти из аккаунта">
            Выйти
          </LogoutButton>
        </UserInfo>
      </Header>
      
      <Main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Main>
    </AppContainer>
  );
};

// Главный компонент App
const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginContainer>
                  <LoginForm />
                </LoginContainer>
              )
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;