import api from './api';

interface LoginResponse {
  // Add your response type here based on the API response
  token?: string;
  user?: any;
  // Add other response fields as needed
}

class AuthService {
  async login(processo: string, password: string): Promise<LoginResponse> {
    try {
      return await api.get<LoginResponse>(`/aluno/dados_actuais/${processo}/${password}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.status) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return new Error(error.message || 'Erro no servidor');
    }
    // The request was made but no response was received
    return new Error('Não foi possível conectar ao servidor');
  }

  isAuthenticated(): boolean {
    // Add your authentication check logic here
    // For example, check if there's a valid token in localStorage
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  logout(): void {
    // Clear authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Helper method to store authentication data
  private storeAuthData(response: LoginResponse): void {
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.user) {
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
  }
}

export const authService = new AuthService();
export default authService; 