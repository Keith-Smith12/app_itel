import { boletimService } from './boletimService';
import { authService } from './authService';

interface Notas {
  p1: number;
  p2: number;
  mac: number;
}

interface DisciplinaNota {
  assunto: string;
  notas: Notas;
  data: string;
}

interface Estudante {
  nome: string;
  process_number: string;
}

interface Trimestres {
  I: DisciplinaNota[];
  II: DisciplinaNota[];
  III: DisciplinaNota[];
}

interface NotasResponse {
  mensagem: string;
  dados: {
    estudante: Estudante;
    quartos: Trimestres;
  };
}

class NotasService {
  async getNotas(): Promise<NotasResponse> {
    try {
      const user = await authService.getCurrentUser();
      if (!user?.processo) {
        throw new Error('Usuário não autenticado ou processo não encontrado');
      }

      const [trimestreI, trimestreII, trimestreIII] = await Promise.all([
        boletimService.getNotasTrimestral(user.processo, 'I'),
        boletimService.getNotasTrimestral(user.processo, 'II'),
        boletimService.getNotasTrimestral(user.processo, 'III'),
      ]);

      return {
        mensagem: 'Notas trimestrais recuperadas com sucesso',
        dados: {
          estudante: {
            nome: user.nome,
            process_number: user.processo,
          },
          quartos: {
            I: trimestreI,
            II: trimestreII,
            III: trimestreIII,
          },
        },
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    return new Error(error.message || 'Erro ao buscar notas');
  }
}

export const notasService = new NotasService();
export default notasService;

export type { DisciplinaNota, Estudante, Notas, NotasResponse, Trimestres };