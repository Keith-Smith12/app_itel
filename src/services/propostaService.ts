import api from './api';

// Interfaces para tipagem
interface Turma {
  vc_classeTurma: string;
}

interface AlunoMatricula {
  turma: Turma;
}

interface EstadoCandidatura {
  // Adicione os campos específicos conforme a resposta da API
  [key: string]: any;
}

interface CandidaturaResponse {
  // Adicione os campos específicos conforme a resposta da API
  [key: string]: any;
}

interface Projeto {
  // Adicione os campos específicos conforme a resposta da API
  [key: string]: any;
}

interface PropostaProjecto {
  // Adicione os campos específicos conforme a resposta da API
  [key: string]: any;
}

interface CandidaturaRequest {
  it_idAluno: string;
  it_idParceiro: string;
  it_idPropostaProjecto: string;
}

interface PropostaRequest {
  it_idAluno: string;
  it_idParceiro: string;
  vc_tema: string;
  vc_descricao: string;
  vc_objectivos: string;
}

class PropostaService {
  // Token agora é lido da variável de ambiente
  private readonly AUTH_TOKEN = 'Basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

  // Centraliza os headers de autenticação
  private getAuthHeaders() {
    return {
      'Authorization': this.AUTH_TOKEN,
    };
  }

  /**
   * Lista todos os projetos
   * @returns Promise<Projeto[]> - Lista de projetos
   */
  async listarProjectos(): Promise<Projeto[]> {
    try {
      const response = await api.get<{ projectos: Projeto[] }>('/api/v1/projecto/listar', {
        headers: this.getAuthHeaders()
      });
      console.log('listarProjectos response:', response.projectos);
      return response.projectos || [];
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      return [];
    }
  }

  /**
   * Lista todas as propostas de projetos
   * @returns Promise<PropostaProjecto[]> - Lista de propostas
   */
  async listarPropostasProjectos(): Promise<PropostaProjecto[]> {
    try {
      const response = await api.get<{ proposta_projectos: PropostaProjecto[] }>('/api/v1/proposta_projecto/listar', {
        headers: this.getAuthHeaders()
      });
      // Log detalhado do que vem do banco de dados
      console.log('Resposta bruta do listarPropostasProjectos:', response);
      if (Array.isArray(response.proposta_projectos)) {
        console.log('Array de propostas:', response.proposta_projectos);
      } else {
        console.warn('proposta_projectos não é um array:', response.proposta_projectos);
      }
      // Garante que sempre retorna um array
      return Array.isArray(response.proposta_projectos) ? response.proposta_projectos : [];
    } catch (error) {
      console.error('Erro ao listar propostas de projetos:', error);
      return [];
    }
  }

  /**
   * Lista propostas aprovadas
   * @returns Promise<PropostaProjecto[]> - Lista de propostas aprovadas
   */
  async listarPropostasAprovadas(): Promise<PropostaProjecto[]> {
    try {
      const response = await api.get<{ proposta_projectos: PropostaProjecto[] }>('/api/v1/proposta_projecto/listar/aprovados', {
        headers: this.getAuthHeaders()
      });
      console.log('listarPropostasAprovadas response (raw):', response);
      return Array.isArray(response) ? response : response.proposta_projectos || [];
    } catch (error) {
      console.error('Erro ao listar propostas aprovadas:', error);
      return [];
    }
  }

  /**
   * Obtém uma proposta específica por ID
   * @param id_proposta - ID da proposta
   * @returns Promise<PropostaProjecto | null> - Proposta encontrada
   */
  async getPropostaProjecto(id_proposta: string): Promise<PropostaProjecto | null> {
    try {
      const response = await api.get<{ proposta_projecto: PropostaProjecto }>(`/api/v1/proposta_projecto/get/${id_proposta}`, {
        headers: this.getAuthHeaders()
      });
      console.log('getPropostaProjecto response:', response.proposta_projecto);
      return response.proposta_projecto || null;
    } catch (error) {
      console.error('Erro ao obter proposta:', error);
      return null;
    }
  }

  /**
   * Candidata um aluno a uma proposta
   * @param candidatura - Dados da candidatura
   * @returns Promise<any> - Resposta da candidatura
   */
  async candidatar(candidatura: CandidaturaRequest): Promise<any> {
    try {
      const response = await api.post<any>('/api/v1/proposta_projecto/candidatar', candidatura, {
        headers: this.getAuthHeaders()
      });
      console.log('candidatar response:', response);
      return response;
    } catch (error) {
      console.error('Erro ao candidatar:', error);
      throw error;
    }
  }

  /**
   * Envia uma nova proposta de projeto
   * @param proposta - Dados da proposta
   * @returns Promise<any> - Resposta da proposta
   */
  async enviarProposta(proposta: PropostaRequest): Promise<any> {
    try {
      const response = await api.post<any>('/api/v1/proposta_projecto/propor', proposta, {
        headers: this.getAuthHeaders()
      });
      console.log('enviarProposta response:', response);
      return response;
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      throw error;
    }
  }

  /**
   * Verifica se o aluno pode ver projetos baseado na sua turma
   * @param processo - Número do processo do aluno
   * @returns Promise<boolean> - true se pode ver projetos, false caso contrário
   */
  async permitidoVerProjectos(processo: string): Promise<boolean> {
    try {
      const data: AlunoMatricula[] = await api.get<AlunoMatricula[]>(`/api/v1/aluno/matricula/${processo}`, {
        headers: this.getAuthHeaders()
      });
      if (data && data[0]?.turma?.vc_classeTurma) {
        const classeTurma = data[0].turma.vc_classeTurma;
        return ['10', '11', '12', '13'].includes(classeTurma);
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar permissão para ver projetos:', error);
      return false;
    }
  }

  /**
   * Verifica se o aluno pode ver propostas (apenas turma 13)
   * @param processo - Número do processo do aluno
   * @returns Promise<boolean> - true se pode ver propostas, false caso contrário
   */
  async permitidoVerPropostas(processo: string): Promise<boolean> {
    try {
      const data: AlunoMatricula[] = await api.get<AlunoMatricula[]>(`/api/v1/aluno/matricula/${processo}`, {
        headers: this.getAuthHeaders()
      });
      if (data && data[0]?.turma?.vc_classeTurma) {
        return data[0].turma.vc_classeTurma === '13';
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar permissão para ver propostas:', error);
      return false;
    }
  }

  /**
   * Obtém o estado da candidatura de um aluno para uma proposta específica
   * @param id_proposta - ID da proposta
   * @param processo - Número do processo do aluno
   * @returns Promise<EstadoCandidatura> - Estado da candidatura
   */
  async estadoCandidatura(id_proposta: string, processo: string): Promise<EstadoCandidatura> {
    try {
      const data: EstadoCandidatura = await api.get<EstadoCandidatura>(`/api/v1/proposta_projecto/estadoCandidatura/${id_proposta}/${processo}`, {
        headers: this.getAuthHeaders()
      });
      return data;
    } catch (error) {
      console.error('Erro ao obter estado da candidatura:', error);
      throw error;
    }
  }

  /**
   * Verifica se o aluno já se candidatou a alguma proposta
   * @param processo - Número do processo do aluno
   * @returns Promise<CandidaturaResponse> - Informações sobre candidaturas existentes
   */
  async jaSeCandidatou(processo: string): Promise<CandidaturaResponse> {
    try {
      const data: CandidaturaResponse = await api.get<CandidaturaResponse>(`/api/v1/proposta_projecto/ja_se_candidatou/${processo}`, {
        headers: this.getAuthHeaders()
      });
      return data;
    } catch (error) {
      console.error('Erro ao verificar candidaturas existentes:', error);
      throw error;
    }
  }

  /**
   * Verifica se há permissão para propor projetos
   * @returns Promise<boolean> - true se pode propor, false caso contrário
   */
  async permissaoPropor(): Promise<boolean> {
    try {
      const data: number = await api.get<number>(`/ativador_proposta/estado/Proposta`, {
        headers: this.getAuthHeaders()
      });
      return data === 1;
    } catch (error) {
      console.error('Erro ao verificar permissão para propor:', error);
      console.log('erro ao obter lista de projectos')
      return false;
    }
  }

  /**
   * Verifica se há permissão para se candidatar a propostas
   * @returns Promise<boolean> - true se pode se candidatar, false caso contrário
   */
  async permissaoCandidatar(): Promise<boolean> {
    try {
      const data: number = await api.get<number>(`/ativador_proposta/estado/Candidatura`, {
        headers: this.getAuthHeaders()
      });
      return data === 1;
    } catch (error) {
      console.error('Erro ao verificar permissão para candidatar:', error);
      return false;
    }
  }

  /**
   * Método auxiliar para verificar múltiplas permissões de uma vez
   * @param processo - Número do processo do aluno
   * @returns Promise<object> - Objeto com todas as permissões
   */
  async verificarTodasPermissoes(processo: string): Promise<{
    podeVerProjectos: boolean;
    podeVerPropostas: boolean;
    podePropor: boolean;
    podeCandidatar: boolean;
    jaSeCandidatou: CandidaturaResponse;
  }> {
    try {
      const [
        podeVerProjectos,
        podeVerPropostas,
        podePropor,
        podeCandidatar,
        jaSeCandidatou
      ] = await Promise.all([
        this.permitidoVerProjectos(processo),
        this.permitidoVerPropostas(processo),
        this.permissaoPropor(),
        this.permissaoCandidatar(),
        this.jaSeCandidatou(processo)
      ]);
      return {
        podeVerProjectos,
        podeVerPropostas,
        podePropor,
        podeCandidatar,
        jaSeCandidatou
      };
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      throw error;
    }
  }
}

export const propostaService = new PropostaService();
export default propostaService;
