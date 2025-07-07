import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface LoginData {
  it_agent: string;
  password: string;
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
  private readonly AUTH_TOKEN = 'Basic ghp_T9YetzgqsrJAwqIVJjeAiMWjfTMJ0z055Ywk';

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.get<any>(
        `/api/v1/aluno/dados_actuais/${data.it_agent}/${data.password}`,
        {
          headers: {
            Authorization: this.AUTH_TOKEN,
          },
        }
      );
console.log('Login response:', response);
      const alunoData = response[0].aluno;
      const user: User = {
        id: alunoData.id,
        nome: `${alunoData.vc_primeiroNome} ${alunoData.vc_ultimoaNome}`,
        processo: data.it_agent,
        dataNascimento: alunoData.dt_dataNascimento,
        naturalidade: alunoData.vc_naturalidade,
        provincia: alunoData.vc_provincia,
        nomePai: alunoData.vc_namePai,
        nomeMae: alunoData.vc_nameMae,
        estadoCivil: alunoData.vc_estadoCivil,
        genero: alunoData.vc_genero,
        telefone: alunoData.it_telefone,
        email: alunoData.vc_email,
        residencia: alunoData.vc_residencia,
        bi: alunoData.vc_bi,
        curso: response[0].turma.vc_nomeCurso,
        anoLectivo: response[0].turma.vc_anoLectivo,
        turma: response[0].turma.vc_nomedaTurma,
        turno: response[0].turma.vc_turnoTurma,
      };

      const loginResponse: LoginResponse = {
        user,
        token: 'mock-token',
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
    //  await AsyncStorage.setItem('token', loginResponse.token);

      return loginResponse;
    } catch (error) {
      throw new Error('Falha no login. Verifique suas credenciais.');
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