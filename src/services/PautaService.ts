import api from './api';

// Interfaces para tipagem dos dados
export interface NotaTrimestre {
  mt1?: number;
  mt2?: number;
  mt3?: number;
  ca?: number;
  mft?: number;
  mfd?: number;
  cfd?: number;
  rec?: number;
  ex?: number;
  outrosAnos?: Record<string, number>;
}

export interface DisciplinaPauta {
  disciplina: string;
  notas: NotaTrimestre;
  resultado?: string;
}

export interface AlunoPauta {
  vc_primeiroNome: string;
  vc_nomedoMeio: string;
  vc_ultimoaNome: string;
  id: string;
}

export interface PautaFinalResponse {
  status: number;
  alunos: AlunoPauta[];
  notas: Record<string, Record<string, NotaTrimestre & { resultado?: string }>>;
}

export class PautaService {
  // Buscar pauta final do estudante
  static async getPautaFinal(processo: string): Promise<PautaFinalResponse> {
    try {
      const response = await api.post<PautaFinalResponse>(
        '/api/aluno/pauta-final',
        { processo },
        {
          headers: {
            'Authorization': 'Basic d3MuYWRtY2F6ZW5nYTptZm4zNDYwODIwMjI=',
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Erro ao buscar pauta final:', error);
      throw error;
    }
  }
}