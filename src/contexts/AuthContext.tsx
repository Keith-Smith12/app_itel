// app_itel/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  nome: string;
  processo: string;
  dataNascimento: string;
  naturalidade: string;
  provincia: string;
  nomePai: string;
  nomeMae: string;
  estadoCivil: string;
  genero: string;
  telefone: string;
  email: string;
  residencia: string;
  bi: string;
  curso: string;
  anoLectivo: string;
  turma: string;
  turno: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (it_agent: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await authService.getCurrentUser();
      console.log('Usuário recuperado do AsyncStorage:', storedUser);
      setUser(storedUser);
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (it_agent: string, password: string) => {
    const response = await authService.login({ it_agent, password });
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}