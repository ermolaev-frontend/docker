import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types';

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Действия
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Симуляция API запроса
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Моковые данные пользователя
          const mockUser: User = {
            id: '1',
            email,
            firstName: 'Евгений',
            lastName: 'Иванов',
            phoneNumber: '+7 (999) 123-45-67',
            avatar: 'https://ui-avatars.com/api/?name=Евгений+Иванов&background=0d8abc&color=fff',
            isVerified: true,
            createdAt: new Date('2023-01-15'),
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);