import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { calendarioService, EventoCalendario } from '../services/calendarioService';

interface HorarioAlunoProps {
  processo: string | number;
}

const HorarioAluno: React.FC<HorarioAlunoProps> = ({ processo }) => {
  const [horario, setHorario] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const data = await calendarioService.getHorario(processo);
        setHorario(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar horário');
      } finally {
        setLoading(false);
      }
    };
    fetchHorario();
  }, [processo]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!horario.length) {
    return <Text style={styles.empty}>Nenhum horário encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horário do Aluno</Text>
      <FlatList
        data={horario}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.data}>{item.data_inicio} - {item.data_fim}</Text>
            <Text style={styles.tipo}>{item.tipo}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  descricao: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  data: {
    fontSize: 13,
    color: '#888',
  },
  tipo: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 2,
  },
  error: {
    color: 'red',
    margin: 16,
    textAlign: 'center',
  },
  empty: {
    color: '#888',
    margin: 16,
    textAlign: 'center',
  },
});

export default HorarioAluno;
