import api from './api';
import { authService } from './authService';

export interface EventoCalendario {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;

}

class CalendarioService {
  async getEventos(): Promise<EventoCalendario[]> {
    try {
      const token = await authService.getToken();
      const response = await api.get<EventoCalendario[]>('dados/pegarDadosCalendario/{processo}', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getHorario(processo: string | number): Promise<EventoCalendario[]> {
    try {
      const token = await authService.getToken();
          console.log(token)

      const response = await api.get<EventoCalendario[]>(`dados/pegarDadosHorario/${processo}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCalendario(processo: string | number): Promise<EventoCalendario[]> {
    try {
      const token = await authService.getToken();
      const response = await api.get<EventoCalendario[]>(`dados/pegarDadosCalendario/${processo}`, {
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