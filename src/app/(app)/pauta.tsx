import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { PautaCard } from '../../components/card/PautaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { AlunoPauta, PautaFinalResponse, PautaService } from '../../services/PautaService';

export default function Pauta() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [alunos, setAlunos] = useState<AlunoPauta[]>([]);
  const [notas, setNotas] = useState<PautaFinalResponse['notas']>({});

  useEffect(() => {
    const fetchPauta = async () => {
      setLoading(true);
      setErro(null);
      try {
        if (!user?.it_agent) {
          setErro('Usuário não autenticado.');
          setLoading(false);
          return;
        }
        const data = await PautaService.getPautaFinal(user.it_agent);
        if (data.status === 0) {
          setErro('Pautas indisponíveis no momento.');
        } else {
          setAlunos(data.alunos);
          setNotas(data.notas);
        }
      } catch (e) {
        setErro('Erro ao buscar pauta.');
      } finally {
        setLoading(false);
      }
    };
    fetchPauta();
  }, [user]);

  const renderAluno = () => {
    if (alunos.length === 0) return null;
    const aluno = alunos[0];
    return (
      <View style={styles.card}>
        <ThemedText><b>Nome:</b> {aluno.vc_primeiroNome} {aluno.vc_nomedoMeio} {aluno.vc_ultimoaNome}</ThemedText>
        <ThemedText><b>Processo:</b> {aluno.id}</ThemedText>
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
    // notas: Record<string, Record<string, NotaTrimestre & { resultado?: string }>>
    // disciplina -> classe -> dados
    return Object.entries(notas).map(([disciplina, classes], idx) => {
      // Pega a primeira classe disponível
      const [classe, dados] = Object.entries(classes)[0];
      return (
        <PautaCard
          key={disciplina + classe + idx}
          disciplina={disciplina}
          {...dados}
          resultado={dados.resultado}
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
        title="Pauta"
        showBackButton={false}
        onMenuPress={handleMenuPress}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Instruções */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Instruções</ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={{ flex: 2 }}>
              <ThemedText><b>CA:</b> Classificação Anual</ThemedText>
              <ThemedText><b>10ª:</b> Média da 10ª classe</ThemedText>
              <ThemedText><b>11ª:</b> Média da 11ª classe</ThemedText>
              <ThemedText><b>MAC:</b> Média das Avaliações Continuas</ThemedText>
              <ThemedText><b>MT1:</b> Média do Primeiro Trimestre</ThemedText>
              <ThemedText><b>MT2:</b> Média do Segundo Trimestre</ThemedText>
              <ThemedText><b>MT3:</b> Média do Terceiro Trimestre</ThemedText>
              <ThemedText><b>MFD:</b> Média Final da Disciplina</ThemedText>
              <ThemedText><b>REC:</b> Nota do Recurso</ThemedText>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <ThemedText><b>TRANSITA:</b> Aprovou sem deixar cadeira</ThemedText>
              <ThemedText><b>N/TRANSITA:</b> Não aprovou</ThemedText>
              <ThemedText><b>?TRANSITA:</b> Aprovou deixando cadeiras</ThemedText>
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
          renderPautas()
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
