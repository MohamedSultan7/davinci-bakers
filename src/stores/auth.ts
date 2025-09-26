import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens } from '@/types';
import { api } from '@/lib/apiClient';
import { MockApiService } from '@/mocks/service';
import { useMocks } from '@/lib/runtime';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isEmailVerified: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await api.auth.login({ email, password });
          
          const { user, tokens } = response;
          
          // Store tokens in localStorage for API client
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          
          // Update mock service current user if using mocks
          if (useMocks) {
            MockApiService.setCurrentUser(user);
          }
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isEmailVerified: user.isEmailVerified,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true });
          const response = await api.auth.register(data);
          
          const { user, tokens } = response;
          
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          
          if (useMocks) {
            MockApiService.setCurrentUser(user);
          }
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isEmailVerified: user.isEmailVerified,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      sendOtp: async (email: string) => {
        try {
          set({ isLoading: true });
          await api.auth.sendOtp(email);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOtp: async (email: string, otp: string) => {
        try {
          set({ isLoading: true });
          const response = await api.auth.verifyOtp({ email, otp });
          
          const { user, tokens } = response;
          
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          
          if (useMocks) {
            MockApiService.setCurrentUser(user);
          }
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isEmailVerified: user.isEmailVerified,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.auth.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          if (useMocks) {
            MockApiService.setCurrentUser(null);
          }
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isEmailVerified: false,
          });
        }
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        if (useMocks) {
          MockApiService.setCurrentUser(null);
        }
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isEmailVerified: false,
        });
      },

      initialize: () => {
        const state = get();
        if (state.user && useMocks) {
          MockApiService.setCurrentUser(state.user);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        isEmailVerified: state.isEmailVerified,
      }),
    }
  )
);

// Initialize auth state on app load
export const initializeAuth = () => {
  useAuthStore.getState().initialize();
};