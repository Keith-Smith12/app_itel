import authService from '@/services/authService';
import calendarioService, { HorarioResponse } from '@/services/calendarioService';
import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';

const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

const HorarioComponent = () => {
  const [horario, setHorario] = useState<HorarioResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user || !user.processo) {
          throw new Error('Usuário não encontrado ou processo não disponível.');
        }
        const resultado = await calendarioService.getHorario(user.processo);
        console.log('Retorno getHorario:', resultado);
        setHorario(resultado);
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

  // Group horarios by day for display
  const horariosPorDia = diasDaSemana.map((dia) => ({
    dia,
    tempos: horario.tempos.filter((item) => item.semana === dia),
  }));

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.header}>
        Horário {horario.calendario.vc_nomedaTurma} - {horario.calendario.vc_anoLectivo}
      </ThemedText>
      <ThemedText style={styles.subHeader}>
        Curso: {horario.calendario.vc_cursoTurma}, Turno: {horario.calendario.vc_turnoTurma}
      </ThemedText>
      {horariosPorDia.map((dia) => (
        <View key={dia.dia} style={styles.dayContainer}>
          <ThemedText style={styles.dayHeader}>{dia.dia}</ThemedText>
          {dia.tempos.length > 0 ? (
            dia.tempos.map((item) => (
              <View key={`${item.id}-${item.t_inicio}`} style={styles.itemContainer}>
                <ThemedText style={styles.itemText}>
                  {item.t_inicio} - {item.t_fim}: {item.disciplina || 'Livre'} (Sala {item.sala})
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={styles.noScheduleText}>Sem aulas programadas</ThemedText>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemContainer: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
  },
  noScheduleText: {
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HorarioComponent;