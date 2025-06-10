import api from './api';
import { authService } from './authService';

export interface DisciplinaBoletim {
  id: number;
  nome: string;
  media_final: number;
  faltas: number;
  situacao: string;
  semestre: number;
  ano_letivo: string;
  // Adicione outros campos conforme necessário
}

export interface Boletim {
  disciplinas: DisciplinaBoletim[];
  media_geral: number;
  situacao_geral: string;
  // Adicione outros campos conforme necessário
}

class BoletimService {
  async getBoletim(): Promise<Boletim> {
    try {
      const token = authService.getToken();
      const response = await api.get<Boletim>('/aluno/boletim', {
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
      return new Error(error.message || 'Erro ao buscar boletim');
    }
    return new Error('Não foi possível conectar ao servidor');
  }
}

export const boletimService = new BoletimService();
export default boletimService;