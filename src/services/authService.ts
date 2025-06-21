import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface User {
  id: number;
  nome: string;
  processo: string;
}

interface LoginResponse {
  user: User;
  message?: string;
}

interface LoginData {
  it_agent: string;
  password: string;
}

const STORAGE_KEYS = {
  USER: '@user_data',
};

class AuthService {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      console.log('[AuthService] Iniciando login para it_agent:', data.it_agent);

      const endpoint = `/aluno/dados_actuais/${data.it_agent}/${data.password}`;
      const response = await api.get(endpoint);

      console.log('[AuthService] Resposta da API:', response);

      if (response.message === 'Credencial inválida') {
        throw new Error('Credenciais inválidas');
      }

      // Extract user data from response
      const alunoData = response[0]?.aluno;
      if (!alunoData || response.status !== 200) {
        throw new Error('Falha na autenticação');
      }

      const user: User = {
        id: alunoData.id,
        nome: `${alunoData.vc_primeiroNome} ${alunoData.vc_ultimoaNome}`,
        processo: data.it_agent,
      };

      const loginResponse: LoginResponse = { user };
      await this.storeAuthData(loginResponse);
      console.log('[AuthService] Login bem-sucedido, dados armazenados.');
      return loginResponse;
    } catch (error: any) {
      console.error('[AuthService] Erro no login:', error, error?.response);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    return new Error(error.message || 'Erro no login');
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      console.log('[AuthService] Logout realizado com sucesso.');
    } catch (error: any) {
      console.error('[AuthService] Erro no logout:', error);
      throw this.handleError(error);
    }
  }

  private async storeAuthData(response: LoginResponse): Promise<void> {
    if (response.user) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    }
  }
}

export const authService = new AuthService();
export default authService;