import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  activeScenario: 'balanced' | 'demanding';
  currentPage: string;
  setCurrentPage: (page: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleScenario: (scenario: 'balanced' | 'demanding') => Promise<void>;
  isLoading: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeScenario, setActiveScenario] = useState<'balanced' | 'demanding'>('demanding');
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('mindpulse_user');
      const token = localStorage.getItem('mindpulse_token');
      if (stored && token) {
        try {
          const parsed = JSON.parse(stored);
          setUser({
            id: parsed.user_id,
            email: parsed.email,
            full_name: parsed.full_name,
            role: parsed.role,
            cohort: 'Engineering - Year 2'
          });
          setRole(parsed.role);
          setCurrentPage(parsed.role === 'institution_admin' ? 'institution' : 'dashboard');
        } catch (e) {
          localStorage.removeItem('mindpulse_token');
          localStorage.removeItem('mindpulse_user');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser({
        id: res.user_id,
        email: res.email,
        full_name: res.full_name,
        role: res.role,
        cohort: 'Engineering - Year 2'
      });
      setRole(res.role);
      showToast(`Welcome back, ${res.full_name}`);
      if (res.role === 'institution_admin') {
        setCurrentPage('institution');
      } else {
        setCurrentPage('dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setRole(null);
    setCurrentPage('landing');
    showToast('Signed out securely');
  };

  const toggleScenario = async (newScenario: 'balanced' | 'demanding') => {
    setActiveScenario(newScenario);
    try {
      await api.switchScenario(newScenario);
      showToast(newScenario === 'demanding' ? 'Demanding week loaded: Aarav’s pressure pattern active' : 'Balanced week loaded: Stable routine active');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      activeScenario,
      currentPage,
      setCurrentPage,
      login,
      logout,
      toggleScenario,
      isLoading,
      toastMessage,
      showToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
