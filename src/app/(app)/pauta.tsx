import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { PautaCard } from '../../components/card/PautaCard';
import { AlunoPauta, PautaFinalResponse, PautaService } from '../../services/PautaService';
import { authService, User } from '../../services/authService';

export default function Pauta() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [alunos, setAlunos] = useState<AlunoPauta[]>([]);
  const [notas, setNotas] = useState<PautaFinalResponse['notas']>({});

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
        const data = await PautaService.getPautaFinal(currentUser.processo);
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
    }
    fetchUserAndPauta();
  }, []);

  const renderAluno = () => {
    if (alunos.length === 0) return null;
    const aluno = alunos[0];
    return (
      <View style={styles.card}>
        <ThemedText>Nome: {aluno.vc_primeiroNome} {aluno.vc_nomedoMeio} {aluno.vc_ultimoaNome}</ThemedText>
        <ThemedText>Processo: {aluno.id}</ThemedText>
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
              <ThemedText>CA: Classificação Anual</ThemedText>
              <ThemedText>10ª: Média da 10ª classe</ThemedText>
              <ThemedText>11ª: Média da 11ª classe</ThemedText>
              <ThemedText>MAC: Média das Avaliações Continuas</ThemedText>
              <ThemedText>MT1: Média do Primeiro Trimestre</ThemedText>
              <ThemedText>MT2: Média do Segundo Trimestre</ThemedText>
              <ThemedText>MT3: Média do Terceiro Trimestre</ThemedText>
              <ThemedText>MFD: Média Final da Disciplina</ThemedText>
              <ThemedText>REC: Nota do Recurso</ThemedText>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <ThemedText>TRANSITA: Aprovou sem deixar cadeira</ThemedText>
              <ThemedText>N/TRANSITA: Não aprovou</ThemedText>
              <ThemedText>?TRANSITA: Aprovou deixando cadeiras</ThemedText>
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
