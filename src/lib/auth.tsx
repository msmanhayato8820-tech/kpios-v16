'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('kpios_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      sessionStorage.removeItem('kpios_user');
      return null;
    }
  });

  const login = useCallback((email: string, password: string): boolean => {
    if (password !== 'demo') return false;
    const found = MOCK_USERS.find((u) => u.email === email);
    if (found) {
      setUser(found);
      sessionStorage.setItem('kpios_user', JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('kpios_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  CEO: 'CEO統合ビュー',
  CFO: 'CFOファイナンス',
  Sales: 'Sales営業',
  CS: 'CSカスタマーサクセス',
  HR: 'HR人事',
  Ops: 'Opsオペレーション',
  Product: 'Productプロダクト',
  Marketing: 'Marketingマーケ',
  Board: 'Board取締役会',
};

export const ROLE_DASHBOARDS: Record<UserRole, string[]> = {
  CEO: ['CEO', 'CFO', 'Sales', 'CS', 'HR', 'Ops', 'Decisions', 'Simulator', 'Minutes'],
  CFO: ['CFO', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  Sales: ['Sales', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  CS: ['CS', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  HR: ['HR', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  Ops: ['Ops', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  Product: ['Product', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  Marketing: ['Marketing', 'CEO', 'Decisions', 'Simulator', 'Minutes'],
  Board: ['Board', 'CEO', 'CFO', 'Decisions', 'Simulator', 'Minutes'],
};
