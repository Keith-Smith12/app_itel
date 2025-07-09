import authService from '@/services/authService';
import calendarioService, { HorarioResponse } from '@/services/calendarioService';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

interface Props {
  diaSemana?: string;
  dataSelecionada?: string;
}

const HorarioComponent: React.FC<Props> = ({ diaSemana, dataSelecionada }) => {
  const [horario, setHorario] = useState<HorarioResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fallback para o dia atual
  const hoje = new Date();
  const diaAtual = diasSemana[hoje.getDay()];
  const dataAtual = hoje.toISOString().split('T')[0];

  const dia = diaSemana || diaAtual;
  const data = dataSelecionada || dataAtual;
  const isHoje = data === dataAtual;

  useEffect(() => {
    (async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user?.processo) {
          throw new Error('Usuário não encontrado ou processo não disponível.');
        }

        const resultado = await calendarioService.getHorario(user.processo);
        const temposValidos = resultado.tempos.filter(
          (t) => t && t.semana && t.t_inicio && t.t_fim
        );

        setHorario({
          ...resultado,
          tempos: temposValidos,
        });
      } catch (e: any) {
        console.error('Erro ao buscar horário:', e);
        setError('Falha ao carregar o horário. Tente novamente.');
      }
    })();
  }, []);


  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  if (!horario) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.loadingText}>Carregando horário...</ThemedText>
      </View>
    );
  }

  const temposDoDia = horario.tempos
    .filter((item) => item.semana === dia)
    .sort((a, b) => a.t_inicio.localeCompare(b.t_inicio));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.header}>
          Horário - Turma {horario.calendario.vc_nomedaTurma} ({horario.calendario.vc_anoLectivo})
        </ThemedText>
        <ThemedText style={styles.subHeader}>Curso: {horario.calendario.vc_cursoTurma}</ThemedText>
        <ThemedText style={styles.subHeader}>Turno: {horario.calendario.vc_turnoTurma}</ThemedText>
        <ThemedText style={styles.subHeader}>Classe: {horario.calendario.vc_classeTurma}º</ThemedText>
      </View>

      <View style={styles.dayBlock}>
        <ThemedText style={styles.dayHeader}>
          {isHoje
            ? 'Horário de hoje'
            : `Horário de ${dia} - ${new Date(data).toLocaleDateString('pt-BR')}`}
        </ThemedText>

        {temposDoDia.length > 0 ? (
          temposDoDia.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.classItem}>
              <ThemedText style={styles.timeText}>
                {item.t_inicio} - {item.t_fim}
              </ThemedText>
              <ThemedText style={styles.classText}>
                {item.disciplina || 'Livre'} {item.sala ? `(Sala ${item.sala})` : ''}
              </ThemedText>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noScheduleText}>Sem aulas programadas</ThemedText>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
  },
  headerContainer: {
    marginTop: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayBlock: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  classItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  classText: {
    fontSize: 14,
    color: '#333',
  },
  noScheduleText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default HorarioComponent;
