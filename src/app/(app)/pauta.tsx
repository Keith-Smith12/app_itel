import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { PautaCard } from '../../components/card/PautaCard';
import { AlunoPauta, PautaFinalResponse, PautaService } from '../../services/PautaService';
import { authService, User } from '../../services/authService';

// Função para transformar o array de notas em objeto por disciplina
function transformarNotas(notasArray: any[]): { notas: Record<string, any>, resultado?: string, media?: number } {
  const notasObj: Record<string, any> = {};
  let resultado: string | undefined;
  let media: number | undefined;

  notasArray.forEach((item) => {
    const [key, valores] = Object.entries(item)[0];
    if (key === 'resultado') {
      resultado = valores as string;
    } else if (key === 'media') {
      media = valores as number;
    } else {
      notasObj[key] = { "default": (valores as any[])[0] };
    }
  });

  return { notas: notasObj, resultado, media };
}

export default function Pauta() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [alunos, setAlunos] = useState<AlunoPauta[]>([]);
  const [notas, setNotas] = useState<PautaFinalResponse['notas']>({});
  const [resultadoGlobal, setResultadoGlobal] = useState<string | undefined>(undefined);
  const [mediaGlobal, setMediaGlobal] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchUserAndPauta() {
      setLoading(true);
      setErro(null);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (!currentUser?.processo) {
          setErro('Usuário não autenticado.');
          setLoading(false);
          return;
        }
        // Supondo que data seja a resposta do novo formato
        const data = await PautaService.getPautaFinal(currentUser.processo);
        if (data.status === 0) {
          setErro('Pautas indisponíveis no momento.');
        } else {
          // Adaptação para novo formato:
          if (data.alunos && typeof data.alunos === 'object') {
            setAlunos([(data.alunos as any)[Object.keys(data.alunos)[0]]]);
          } else {
            setAlunos([]);
          }
          if (Array.isArray(data.notas)) {
            const { notas, resultado, media } = transformarNotas(data.notas);
            setNotas(notas);
            setResultadoGlobal(resultado);
            setMediaGlobal(media);
          } else {
            setNotas({});
            setResultadoGlobal(undefined);
            setMediaGlobal(undefined);
          }
        }
      } catch (e) {
        setErro('Erro ao buscar pauta.');
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndPauta();
  }, []);

  const renderAluno = () => {
    if (alunos.length === 0) return null;
    const aluno = alunos[0];
    return (
      <View style={styles.card}>
        <ThemedText><Text style={{fontWeight: 'bold'}}>Nome:</Text> {aluno.vc_primeiroNome} {aluno.vc_nomedoMeio} {aluno.vc_ultimoaNome}</ThemedText>
        <ThemedText><Text style={{fontWeight: 'bold'}}>Processo:</Text> {aluno.id}</ThemedText>
      </View>
    );
  };

  const renderPautas = () => {
    if (!notas || Object.keys(notas).length === 0) {
      return (
        <View style={styles.card}>
          <ThemedText style={{ textAlign: 'center' }}>Pautas não disponíveis</ThemedText>
        </View>
      );
    }
    return Object.entries(notas).map(([disciplina, classes], idx) => {
      // Aqui, "classes" é um objeto com chave "default"
      const dados = classes["default"];
      return (
        <PautaCard
          key={disciplina + idx}
          disciplina={disciplina}
          {...dados}
          resultado={dados?.resultado}
        />
      );
    });
  };

  const handleMenuPress = () => {
    // lógica para abrir o Drawer, se necessário
  };

  return (
    <ThemedView style={styles.container}>
      <Header
        title=""
        showBackButton={false}
        onMenuPress={handleMenuPress}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Instruções */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Instruções</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={{ flex: 2 }}>
              <ThemedText><Text style={{fontWeight: 'bold'}}>CA:</Text> Classificação Anual</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>10ª:</Text> Média da 10ª classe</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>11ª:</Text> Média da 11ª classe</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>MAC:</Text> Média das Avaliações Continuas</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>MT1:</Text> Média do Primeiro Trimestre</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>MT2:</Text> Média do Segundo Trimestre</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>MT3:</Text> Média do Terceiro Trimestre</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>MFD:</Text> Média Final da Disciplina</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>REC:</Text> Nota do Recurso</ThemedText>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <ThemedText><Text style={{fontWeight: 'bold'}}>TRANSITA:</Text> Aprovou sem deixar cadeira</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>N/TRANSITA:</Text> Não aprovou</ThemedText>
              <ThemedText><Text style={{fontWeight: 'bold'}}>?TRANSITA:</Text> Aprovou deixando cadeiras</ThemedText>
            </View>
          </View>
        </View>

        {/* Dados do aluno */}
        {renderAluno()}

        {/* Loading, erro ou lista de pautas */}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 32 }} />
        ) : erro ? (
          <View style={styles.card}>
            <ThemedText style={{ color: 'red', textAlign: 'center' }}>{erro}</ThemedText>
          </View>
        ) : (
          <>
            {renderPautas()}
            {/* Exibir resultado e média globais, se existirem */}
            {(resultadoGlobal || mediaGlobal !== undefined) && (
              <View style={styles.card}>
                {resultadoGlobal && (
                  <ThemedText style={{ fontWeight: 'bold', textAlign: 'left', fontSize: 16, color: '#000' }}>
                    Resultado final: <ThemedText
                      style={{
                        fontWeight: 'bold',
                        color:
                          resultadoGlobal === 'TRANSITA'
                            ? '#007AFF'
                            : resultadoGlobal === 'N/TRANSITA' || resultadoGlobal === '?TRANSITA'
                            ? '#FF3B30'
                            : '#000',
                      }}
                    >
                      {resultadoGlobal}
                    </ThemedText>
                  </ThemedText>
                )}
               {mediaGlobal !== undefined && (
                  <ThemedText style={{ textAlign: 'left', fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                    Média final: <ThemedText
                      style={{
                        fontWeight: 'bold',
                        color: mediaGlobal < 10 ? '#FF3B30' : '#000',
                      }}
                    >
                      {mediaGlobal}
                    </ThemedText>
                  </ThemedText>
                )}
              </View>
            )}
             
          </>  
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});
