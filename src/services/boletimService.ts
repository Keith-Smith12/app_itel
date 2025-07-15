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
  async getNotasTrimestral(processo: string, trimestre: 'I' | 'II' | 'III'): Promise<DisciplinaNota[]> {
    try {
      let token;
      try {
        token = await authService.getToken();
        console.log('Token obtido:', token);
      } catch (tokenError) {
        console.error('Erro ao obter token:', tokenError);
        throw tokenError;
      }
      const response = await api.post<ApiNotasTrimestralResponse>(
        '/api/v2/notas-trimestral',
        { processo, trimestre },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      // Garante que response.notas existe e é um array
      const notasArray = Array.isArray(response.notas) ? response.notas : [];
      return notasArray.map(nota => ({
        assunto: nota.vc_acronimo,
        notas: {
          p1: nota.fl_nota1,
          p2: nota.fl_nota2,
          mac: nota.fl_mac,
        },
        data: '',
      }));
    } catch (error: any) {
      if (error.response) {
        console.error(`Erro ao obter notas do ${trimestre}º trimestre:`, error.response.status, error.response.data);
      } else {
        console.error(`Erro ao obter notas do ${trimestre}º trimestre:`, error.message || error);
      }
      return [];
    }
  }
}

export const boletimService = new BoletimService();
export default boletimService;