import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  nome: string;
  processo: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (it_agent: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tenta restaurar sessão ao iniciar
    const loadAuthData = async () => {
      setLoading(true);
      try {
        const storedUser = await authService.getCurrentUser();
        const storedToken = await authService.getToken();
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } finally {
        setLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const login = async (it_agent: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ it_agent, password });
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}