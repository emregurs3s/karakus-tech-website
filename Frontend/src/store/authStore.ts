import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.roles.includes('admin')
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false
        });
      },

      setUser: (user: User) => {
        set({
          user,
          isAdmin: user.roles.includes('admin')
        });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);