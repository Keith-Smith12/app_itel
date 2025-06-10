import { SymbolView } from 'expo-symbols';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface NoteCardProps {
  subject: string;
  p1: number;
  p2: number;
  mac: number;
  style?: StyleProp<ViewStyle>;
}

export function NoteCard({
  subject,
  p1,
  p2,
  mac,
  style,
}: NoteCardProps) {
  const average = (p1 + p2 + mac) / 3;

  const getGradeColor = (grade: number) => {
    return '#007AFF';
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
            {p1.toFixed(1)}
          </Text>
        </View>
        <View style={[styles.gradeItem, styles.gradeItemRight]}>
          <Text style={styles.label}>P2:</Text>
          <Text style={[styles.grade, { color: getGradeColor(p2) }]}>
            {p2.toFixed(1)}
          </Text>
        </View>
      </View>
      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MAC:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mac) }]}>
            {mac.toFixed(1)}
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