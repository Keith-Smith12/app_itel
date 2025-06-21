// app_itel/src/components/card/NoteCard.tsx
import { SymbolView } from 'expo-symbols';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface NoteCardProps {
  subject: string;
  p1: number | string;
  p2: number | string;
  mac: number | string;
  style?: StyleProp<ViewStyle>;
}

export function NoteCard({ subject, p1, p2, mac, style }: NoteCardProps) {
  const validNumbers = [p1, p2, mac]
    .map(val => (typeof val === 'number' ? val : 0))
    .filter(val => val !== 0);
  const average = validNumbers.length > 0 ? validNumbers.reduce((sum, val) => sum + val, 0) / validNumbers.length : 0;

  const getGradeColor = (grade: number | string) => {
    if (typeof grade === 'number') {
      return grade >= 10 ? '#007AFF' : '#FF3B30';
    }
    return '#666'; // "nnl" color
  };

  const formatGrade = (grade: number | string) => {
    if (typeof grade === 'number') {
      return grade.toFixed(1);
    }
    return grade === 'nnl' ? 'Não lançada' : grade; 
  };

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <SymbolView
          name="book.fill"
          weight="regular"
          tintColor="#000"
          resizeMode="scaleAspectFit"
          style={styles.icon}
        />
        <Text style={styles.subject}>{subject}</Text>
      </View>

      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>P1:</Text>
          <Text style={[styles.grade, { color: getGradeColor(p1) }]}>
            {formatGrade(p1)}
          </Text>
        </View>
        <View style={[styles.gradeItem, styles.gradeItemRight]}>
          <Text style={styles.label}>P2:</Text>
          <Text style={[styles.grade, { color: getGradeColor(p2) }]}>
            {formatGrade(p2)}
          </Text>
        </View>
      </View>
      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MAC:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mac) }]}>
            {formatGrade(mac)}
          </Text>
        </View>
        <View style={[styles.gradeItem, styles.gradeItemRight]}>
          <Text style={styles.label}>Média:</Text>
          <Text style={[styles.grade, { color: getGradeColor(average) }]}>
            {average.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gradeItemRight: {
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginRight: 4,
  },
  grade: {
    fontSize: 16,
    fontWeight: '600',
  },
});