const BASE_URL = 'http://192.168.20.31:8031/api';

interface ApiError extends Error {
  status?: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data.data || data; // Retorna data.data se existir, senão retorna data diretamente
}

const api = {
  get: async <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    const headers = {
      'Content-Type': 'application/json',
      ...(config?.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> => {
    const headers = {
      'Content-Type': 'application/json',
      ...(config?.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },
};

export default api;