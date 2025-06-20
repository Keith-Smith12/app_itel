import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./api";

interface User {
  id: number;
  nome: string;
  processo: string;
}

interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

interface LoginData {
  it_agent: string;
  password: string;
}

// Chaves para o AsyncStorage
const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data'
};

class AuthService {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      console.log('[AuthService] Iniciando login para it_agent:', data.it_agent);

      const response = await api.post('/auth/login', {
        it_agent: data.it_agent,
        password: data.password
      });
      console.log('[AuthService] Resposta da API:', response);
      const dataResponse = response as { data: { user: User; token: string } };
      const user: User = dataResponse.data.user;
      const token: string = dataResponse.data.token;
      const loginResponse: LoginResponse = { token, user };
      await this.storeAuthData(loginResponse);
      console.log('[AuthService] Login bem-sucedido, dados armazenados.');
      return loginResponse;
    } catch (error: any) {
      console.error('[AuthService] Erro no login:', error, error?.response, JSON.stringify(error));
      if (error && error.response) {
        try {
          const errorBody = await error.response.text?.();
          console.error('[AuthService] Corpo da resposta de erro:', errorBody);
        } catch (e) {
          console.error('[AuthService] Falha ao ler corpo da resposta de erro:', e);
        }
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    return new Error(error.message || 'Erro no login');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      console.log('[AuthService] Logout realizado com sucesso.');
    } catch (error: any) {
      console.error('[AuthService] Erro no logout:', error, error?.response, JSON.stringify(error));
      throw this.handleError(error);
    }
  }

  private async storeAuthData(response: LoginResponse): Promise<void> {
    const storagePromises = [];
    if (response.token) {
      storagePromises.push(AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token));
    }
    if (response.user) {
      storagePromises.push(AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user)));
    }
    await Promise.all(storagePromises);
  }
}

export const authService = new AuthService();
export default authService;