import api from './api';
import { authService } from './authService';

interface ApiNotasTrimestralResponse {
  processo: number;
  nome: string;
  notas: {
    it_idAluno: number;
    vc_nome: string;
    vc_acronimo: string;
    fl_media: number;
    fl_nota1: number;
    fl_nota2: number;
    fl_mac: number;
  }[];
}

export interface DisciplinaNota {
  assunto: string;
  notas: {
    p1: number;
    p2: number;
    mac: number;
  };
  data: string;
}

class BoletimService {
  private readonly authToken = 'd3MuYWRtY2F6ZW5nYTptZm4zNDYwODIwMjI=';

  async getNotasTrimestral(processo: string, trimestre: 'I' | 'II' | 'III'): Promise<DisciplinaNota[]> {
    try {
      const formData = new FormData();
      formData.append('trimestre', trimestre);
      formData.append('processo', processo);

      const response = await api.post<ApiNotasTrimestralResponse>('/api/notas-trimestral', formData, {
        headers: {
          Authorization: `Basic ${this.authToken}`,
        },
      });

      // Garante que response.notas existe e é um array
      const notasArray = Array.isArray(response.notas) ? response.notas : [];
      return notasArray.map(nota => ({
        assunto: nota.vc_nome,
        notas: {
          p1: nota.fl_nota1,
          p2: nota.fl_nota2,
          mac: nota.fl_mac,
        },
        data: '',
      }));
    } catch (error) {
      console.error(`Erro ao obter notas do ${trimestre}º trimestre:`, error);
      return [];
    }
  }
}

export const boletimService = new BoletimService();
export default boletimService;