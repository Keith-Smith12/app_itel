import api from './api';
import authService from './authService';

export interface EventoCalendario {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
}

export interface HorarioItem {
  id: number;
  t_inicio: string;
  t_fim: string;
  it_id_turno: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  semana: string;
  disciplina: string | null;
  sala: number;
  calendario: number;
}

export interface HorarioResponse {
  calendario: {
    id: number;
    vc_anoLectivo: string;
    vc_nomedaTurma: string;
    vc_classeTurma: string;
    vc_turnoTurma: string;
    vc_cursoTurma: string;
  };
  tempos: HorarioItem[];
}

class CalendarioService {
  async getEventos(processo: string): Promise<EventoCalendario[]> {
    try {
      const token = await authService.getToken();
      const response = await api.get<EventoCalendario[]>(`/api/v1/dados/pegarDadosCalendario/${processo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getHorario(processo: string): Promise<HorarioResponse> {
    try {
      const token = await authService.getToken();
      const response = await api.get<HorarioResponse>(`/api/v1/dados/pegarDadosHorario/${processo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCalendario(processo: string): Promise<EventoCalendario[]> {
    try {
      const token = await authService.getToken();
      const response = await api.get<EventoCalendario[]>(`/api/v1/dados/pegarDadosCalendario/${processo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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