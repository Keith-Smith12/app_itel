const BASE_URL = 'https://sge.mucua.ao';
//const BASE_URL = 'http://192.168.20.206:8000';

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
  return response.json();
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
  post: async <T>(endpoint: string, data?: Record<string, any> | FormData, config?: RequestConfig): Promise<T> => {
    const headers = { ...(config?.headers || {}) };
    let body: string | FormData;
    if (data instanceof FormData) {
      body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      body = data ? JSON.stringify(data) : '';
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body,
    });
    return handleResponse<T>(response);
  },
};

export default api;