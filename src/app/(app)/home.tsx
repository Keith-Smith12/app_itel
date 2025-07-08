import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendario } from '../../components/calendario';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { calendarioService } from '../../services/calendarioService';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Exemplo de datas marcadas (você pode personalizar conforme necessário)
  const markedDates = {
    '2024-03-15': { marked: true, dotColor: '#FF9800' },
    '2024-03-20': { marked: true, dotColor: '#4CAF50' },
    '2024-03-25': { marked: true, dotColor: '#F44336' }
  };

  // TESTE: Exibir retorno da função getHorario
  React.useEffect(() => {
    (async () => {
      try {
        // Substitua pelo processo desejado para teste
        const resultado = await calendarioService.getHorario('14732');
        console.log('Retorno getHorario:', resultado);
      } catch (e) {
        console.log('Erro getHorario:', e);
      }
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Header
        title=""
        showBackButton={false}
        onMenuPress={handleMenuPress}
      />

      <View style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendario
            onDateChange={(date: string) => setSelectedDate(date)}
            markedDates={markedDates}
            tema={{
              selectedDayBackgroundColor: '#007AFF',
              todayTextColor: '#007AFF',
              arrowColor: '#007AFF',
              monthTextColor: '#2d4150',
              textSectionTitleColor: '#b6c1cd',
              dayTextColor: '#2d4150',
              selectedDayTextColor: '#ffffff',
              textDisabledColor: '#d9e1e8',
            }}
            estiloContainer={styles.calendario}
          />
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />
            <ThemedText style={styles.legendText}>Eventos</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <ThemedText style={styles.legendText}>Reuniões</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
            <ThemedText style={styles.legendText}>Deadlines</ThemedText>
          </View>
        </View>

        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <ThemedText style={styles.selectedDateText}>
              Data selecionada: {new Date(selectedDate).toLocaleDateString('pt-BR')}
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendario: {
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});