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

// Dados mockados para desenvolvimento local
const MOCK_NOTAS: NotasResponse = {
  mensagem: "Notas trimestrais recuperadas com sucesso",
  dados: {
    estudante: {
      nome: "Keith Smith",
      process_number: "14451"
    },
    quartos: {
      I: [
        {
          assunto: "Matemática",
          notas: { p1: 85, p2: 87, mac: 90 },
          data: "2025-03-15"
        },
        {
          assunto: "Física",
          notas: { p1: 78, p2: 80, mac: 82 },
          data: "2025-03-15"
        },
        {
          assunto: "Química",
          notas: { p1: 80, p2: 83, mac: 85 },
          data: "2025-03-15"
        },
        {
          assunto: "Seac",
          notas: { p1: 88, p2: 86, mac: 89 },
          data: "2025-03-15"
        },
        {
          assunto: "TLP",
          notas: { p1: 90, p2: 92, mac: 91 },
          data: "2025-03-15"
        },
        {
          assunto: "TIC",
          notas: { p1: 84, p2: 85, mac: 87 },
          data: "2025-03-15"
        }
      ],
      II: [
        {
          assunto: "Matemática",
          notas: { p1: 88, p2: 89, mac: 92 },
          data: "2025-06-10"
        },
        {
          assunto: "Física",
          notas: { p1: 82, p2: 84, mac: 85 },
          data: "2025-06-10"
        },
        {
          assunto: "Química",
          notas: { p1: 83, p2: 85, mac: 87 },
          data: "2025-06-10"
        },
        {
          assunto: "Seac",
          notas: { p1: 87, p2: 88, mac: 90 },
          data: "2025-06-10"
        },
        {
          assunto: "TLP",
          notas: { p1: 91, p2: 93, mac: 92 },
          data: "2025-06-10"
        },
        {
          assunto: "TIC",
          notas: { p1: 86, p2: 87, mac: 88 },
          data: "2025-06-10"
        }
      ],
      III: [
        {
          assunto: "Matemática",
          notas: { p1: 80, p2: 82, mac: 85 },
          data: "2025-09-20"
        },
        {
          assunto: "Física",
          notas: { p1: 85, p2: 87, mac: 88 },
          data: "2025-09-20"
        },
        {
          assunto: "Química",
          notas: { p1: 84, p2: 86, mac: 89 },
          data: "2025-09-20"
        },
        {
          assunto: "Seac",
          notas: { p1: 86, p2: 88, mac: 90 },
          data: "2025-09-20"
        },
        {
          assunto: "TLP",
          notas: { p1: 89, p2: 90, mac: 91 },
          data: "2025-09-20"
        },
        {
          assunto: "TIC",
          notas: { p1: 87, p2: 88, mac: 89 },
          data: "2025-09-20"
        }
      ]
    }
  }
};

class NotasService {
  async getNotas(): Promise<NotasResponse> {
    try {
      // Para desenvolvimento local, retorna os dados mockados
      // Em produção, descomentar a linha abaixo para usar a API real
      // const response = await api.get<NotasResponse>('/aluno/notas');
      // return response;

      // Simula um delay para parecer mais real
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_NOTAS;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Método auxiliar para calcular a média de uma disciplina
  calcularMedia(notas: Notas): number {
    return Number(((notas.p1 + notas.p2 + notas.mac) / 3).toFixed(1));
  }

  // Método para obter todas as disciplinas únicas
  getDisciplinasUnicas(dados: NotasResponse): string[] {
    const disciplinas = new Set<string>();
    Object.values(dados.dados.quartos).forEach(trimestre => {
      trimestre.forEach((disciplina: DisciplinaNota) => {
        disciplinas.add(disciplina.assunto);
      });
    });
    return Array.from(disciplinas).sort();
  }

  private handleError(error: any): Error {
      return new Error(error.message || 'Erro ao buscar notas');
  }
}

export const notasService = new NotasService();
export default notasService;

// Exporta as interfaces para uso em outros componentes
export type {
    DisciplinaNota,
    Estudante, Notas, NotasResponse, Trimestres
};
