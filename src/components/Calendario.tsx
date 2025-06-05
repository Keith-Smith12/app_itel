import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from './ThemedText';

interface CalendarioProps {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
}

export const Calendario: React.FC<CalendarioProps> = ({
  onDateChange,
  initialDate = new Date(),
}) => {
  const [date, setDate] = useState(initialDate);
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    onDateChange?.(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatepicker} style={styles.button}>
        <ThemedText style={styles.dateText}>
          {formatDate(date)}
        </ThemedText>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
});