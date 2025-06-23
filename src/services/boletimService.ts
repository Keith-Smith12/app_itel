import api from './api';
import { authService } from './authService';

export interface NotaTrimestral {
  [key: string]: any;
}

export interface DadosTrimestrais {
  dados_trimestrais1: NotaTrimestral[];
  dados_trimestrais2: NotaTrimestral[];
  dados_trimestrais3: NotaTrimestral[];
  h5: string;
}

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
  private readonly authToken = 'd3MuYWRtY2F6ZW5nYTptZm4zNDYwODIwMjI=';

  /**
   * Obtém o boletim completo com dados dos três trimestres
   * @param processo - Número do processo do aluno
   * @returns Promise<DadosTrimestrais> - Dados dos três trimestres
   */
  async getBoletimTrimestral(processo: string): Promise<DadosTrimestrais> {
    try {
      // Faz as três requisições em paralelo para melhor performance
      const [trimestre1, trimestre2, trimestre3] = await Promise.all([
        this.getNotasTrimestral(processo, 'I'),
        this.getNotasTrimestral(processo, 'II'),
        this.getNotasTrimestral(processo, 'III')
      ]);

      return {
        dados_trimestrais1: trimestre1,
        dados_trimestrais2: trimestre2,
        dados_trimestrais3: trimestre3,
        h5: 'Meu boletim de Notas Trimestral'
      };
    } catch (error) {
      console.error('Erro ao obter boletim trimestral:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtém as notas de um trimestre específico
   * @param processo - Número do processo do aluno
   * @param trimestre - Trimestre (I, II, III)
   * @returns Promise<NotaTrimestral[]> - Notas do trimestre
   */
  async getNotasTrimestral(processo: string, trimestre: 'I' | 'II' | 'III'): Promise<NotaTrimestral[]> {
    try {
      const data = await api.post<NotaTrimestral[]>('/notas-trimestral', {
        trimestre: trimestre,
        processo: processo
      }, {
        headers: {
          'Authorization': `Basic ${this.authToken}`
        }
      });

      return data || [];
    } catch (error) {
      console.error(`Erro ao obter notas do ${trimestre}º trimestre:`, error);
      return [];
    }
  }

  /**
   * Obtém o boletim geral (método original mantido para compatibilidade)
   * @returns Promise<Boletim> - Boletim geral
   */
  async getBoletim(): Promise<Boletim> {
    try {
      const token = await authService.getToken();
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

  /**
   * Obtém o boletim do usuário logado
   * @returns Promise<DadosTrimestrais> - Boletim do usuário atual
   */
  async getMeuBoletim(): Promise<DadosTrimestrais> {
    try {
      const user = await authService.getCurrentUser();
      if (!user?.processo) {
        throw new Error('Usuário não autenticado ou processo não encontrado');
      }

      return await this.getBoletimTrimestral(user.processo);
    } catch (error) {
      console.error('Erro ao obter meu boletim:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtém apenas um trimestre específico
   * @param trimestre - Trimestre desejado (I, II, III)
   * @returns Promise<NotaTrimestral[]> - Notas do trimestre
   */
  async getTrimestreEspecifico(trimestre: 'I' | 'II' | 'III'): Promise<NotaTrimestral[]> {
    try {
      const user = await authService.getCurrentUser();
      if (!user?.processo) {
        throw new Error('Usuário não autenticado ou processo não encontrado');
      }

      return await this.getNotasTrimestral(user.processo, trimestre);
    } catch (error) {
      console.error(`Erro ao obter ${trimestre}º trimestre:`, error);
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