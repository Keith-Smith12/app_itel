import api from './api';
import { authService } from './authService';

export interface EventoCalendario {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  // Adicione outros campos conforme necessário
}

class CalendarioService {
  async getEventos(): Promise<EventoCalendario[]> {
    try {
      const token = authService.getToken();
      const response = await api.get<EventoCalendario[]>('/aluno/calendario', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.status) {
      return new Error(error.message || 'Erro ao buscar calendário');
    }
    return new Error('Não foi possível conectar ao servidor');
  }
}

export const calendarioService = new CalendarioService();
export default calendarioService;