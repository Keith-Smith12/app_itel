import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  nome: string;
  processo: string;
  // Adicione outros campos do usuário conforme necessário
}

interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

interface LoginData {
  processo: string;
  password: string;
}

// Chaves para o AsyncStorage
const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data'
};

// Credenciais fixas para desenvolvimento
const DEV_CREDENTIALS = {
  processo: "14451",
  password: "1111"
};

// Usuário mockado para desenvolvimento
const MOCK_USER: User = {
  id: 1,
  nome: "Usuário Teste",
  processo: "14451"
};

// Token mockado
const MOCK_TOKEN = "mock_token_desenvolvimento_local";

class AuthService {
  async login(data: LoginData): Promise<LoginResponse> {
    // Simula um delay pequeno para parecer mais real
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verifica as credenciais localmente
    if (data.processo === DEV_CREDENTIALS.processo && data.password === DEV_CREDENTIALS.password) {
      const response: LoginResponse = {
        token: MOCK_TOKEN,
        user: MOCK_USER
      };

      await this.storeAuthData(response);
      return response;
    }

    throw new Error('Credenciais inválidas');
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
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
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