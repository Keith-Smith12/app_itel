import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface LoginData {
  it_idAluno: string;
  passe: string;
}

interface User {
  id: number;
  nome: string;
  processo: string;
  dataNascimento: string;
  naturalidade: string;
  provincia: string;
  nomePai: string;
  nomeMae: string;
  estadoCivil: string;
  genero: string;
  telefone: string;
  email: string;
  residencia: string;
  bi: string;
  curso: string;
  anoLectivo: string;
  turma: string;
  turno: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      // Faz a chamada ao endpoint de login
      const loginResponse = await api.post<{
        tokenAluno: string;
        status: string;
        dados_do_aluno: {
          id: number;
          vc_primeiroNome: string;
          vc_nomedoMeio: string;
          vc_ultimoaNome: string;
          dt_dataNascimento: string;
          vc_naturalidade: string;
          vc_provincia: string;
          vc_namePai: string;
          vc_nameMae: string;
          vc_estadoCivil: string;
          vc_genero: string;
          it_telefone: number;
          vc_email: string;
          vc_residencia: string;
          vc_bi: string;
          vc_nomeCurso: string;
          vc_anoLectivo: string;
        };
        turma: {
          vc_nomedaTurma: string;
          vc_cursoTurma?: string;
          vc_anoLectivo?: string;
          vc_turnoTurma?: string;
        };
      }>('/api/loginAluno', data);
      console.log('Login response:', loginResponse);

      // Verifica se a resposta tem status de sucesso
      if (loginResponse.status !== 'success') {
        throw new Error('Falha no login. Verifique suas credenciais.');
      }

      const alunoData = loginResponse.dados_do_aluno;
      const turmaData = loginResponse.turma;

      const user: User = {
        id: alunoData.id,
        nome: `${alunoData.vc_primeiroNome} ${alunoData.vc_nomedoMeio || ''} ${alunoData.vc_ultimoaNome}`.trim(),
        processo: data.it_idAluno,
        dataNascimento: alunoData.dt_dataNascimento,
        naturalidade: alunoData.vc_naturalidade || '',
        provincia: alunoData.vc_provincia || '',
        nomePai: alunoData.vc_namePai || '',
        nomeMae: alunoData.vc_nameMae || '',
        estadoCivil: alunoData.vc_estadoCivil || '',
        genero: alunoData.vc_genero || '',
        telefone: alunoData.it_telefone ? String(alunoData.it_telefone) : '',
        email: alunoData.vc_email || '',
        residencia: alunoData.vc_residencia || '',
        bi: alunoData.vc_bi || '',
        curso: turmaData.vc_cursoTurma || alunoData.vc_nomeCurso || '',
        anoLectivo: turmaData.vc_anoLectivo || alunoData.vc_anoLectivo || '',
        turma: turmaData.vc_nomedaTurma || '',
        turno: turmaData.vc_turnoTurma || '',
      };

      const loginResponseData: LoginResponse = {
        user,
        token: loginResponse.tokenAluno,
      };

      // Salva os dados no AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', loginResponseData.token);

      return loginResponseData;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Falha no login. Verifique suas credenciais ou tente novamente.');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  }
}

export const authService = new AuthService();
export default authService;