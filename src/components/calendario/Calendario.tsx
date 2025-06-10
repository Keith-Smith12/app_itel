import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração do idioma português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface CalendarioProps {
  onDateChange?: (date: string) => void;
  initialDate?: string;
  minDate?: string;
  maxDate?: string;
  estiloContainer?: ViewStyle;
  markedDates?: {
    [date: string]: {
      selected?: boolean;
      marked?: boolean;
      dotColor?: string;
    };
  };
  tema?: {
    backgroundColor?: string;
    calendarBackground?: string;
    textSectionTitleColor?: string;
    selectedDayBackgroundColor?: string;
    selectedDayTextColor?: string;
    todayTextColor?: string;
    dayTextColor?: string;
    textDisabledColor?: string;
    dotColor?: string;
    monthTextColor?: string;
    arrowColor?: string;
  };
}

export const Calendario: React.FC<CalendarioProps> = ({
  onDateChange,
  initialDate = new Date().toISOString().split('T')[0],
  minDate,
  maxDate,
  estiloContainer,
  markedDates = {},
  tema = {},
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Marca a data selecionada
  const marked = {
    ...markedDates,
    [selectedDate]: {
      selected: true,
      ...(markedDates[selectedDate] || {}),
    },
  };

  return (
    <View style={[styles.container, estiloContainer]}>
      <Calendar
        current={initialDate}
        minDate={minDate}
        maxDate={maxDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          onDateChange?.(day.dateString);
        }}
        markedDates={marked}
        enableSwipeMonths={true}
        hideExtraDays={false}
        firstDay={0}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#007AFF',
          monthTextColor: '#2d4150',
          arrowColor: '#007AFF',
          ...tema,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});