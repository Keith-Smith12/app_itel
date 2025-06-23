import { api } from './api';

// Interfaces para tipagem dos dados
interface NotaTrimestre {
  fl_media: number;
  fl_nota1: number;
  fl_nota2: number;
  fl_mac: number;
  vc_tipodaNota: 'I' | 'II' | 'III';
}

interface NotasDisciplina {
  [classe: string]: {
    [trimestre: string]: NotaTrimestre[];
    media_anual: number;
  };
  ca?: number; // Média da classe
  cf?: number; // Média final
  dt?: number; // Disciplina tipo
}

interface PautaResponse {
  estado: boolean;
  data: {
    notas: {
      [disciplina: string]: NotasDisciplina;
    };
    medias_por_classe: {
      [classe: string]: number;
    };
    pc: number; // Média geral
    resultado: string;
  };
}

export class PautaService {
  // Buscar pauta do estudante
  static async getPauta(): Promise<PautaResponse> {
    try {
      const response = await api.get('/pauta');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pauta:', error);
      throw error;
    }
  }

  // Obter notas de uma disciplina específica
  static getNotasDisciplina(notas: NotasDisciplina, classe: string) {
    return notas[classe] || null;
  }

  // Calcular média de uma disciplina
  static calcularMediaDisciplina(notas: NotaTrimestre[]): number {
    if (!notas || notas.length === 0) return 0;

    const soma = notas.reduce((acc, nota) => acc + nota.fl_media, 0);
    return Number((soma / notas.length).toFixed(1));
  }

  // Obter todas as disciplinas disponíveis
  static getDisciplinas(notas: { [key: string]: NotasDisciplina }): string[] {
    return Object.keys(notas);
  }

  // Obter classes disponíveis para uma disciplina
  static getClassesDisponiveis(notas: NotasDisciplina): string[] {
    return Object.keys(notas).filter(key => key !== 'ca' && key !== 'cf' && key !== 'dt');
  }

  // Verificar se estudante transita
  static verificarTransicao(resultado: string): boolean {
    return resultado === 'TRANSITA';
  }

  // Obter média geral
  static getMediaGeral(pc: number): number {
    return pc;
  }

  // Obter médias por classe
  static getMediasPorClasse(medias: { [classe: string]: number }): { classe: string; media: number }[] {
    return Object.entries(medias).map(([classe, media]) => ({
      classe,
      media
    }));
  }

  // Formatar nota para exibição
  static formatarNota(nota: number): string {
    return nota.toFixed(1);
  }

  // Verificar se nota é suficiente para aprovação
  static isNotaAprovada(nota: number): boolean {
    return nota >= 10;
  }
}