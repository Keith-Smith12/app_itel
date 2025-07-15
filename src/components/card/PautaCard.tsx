import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface PautaCardProps {
  disciplina: string;
  mt1?: number | string;
  mt2?: number | string;
  mt3?: number | string;
  ca?: number | string;
  mft?: number | string;
  mfd?: number | string;
  cfd?: number | string;
  rec?: number | string;
  ex?: number | string;
  outrosAnos?: Record<string, number | string>;
  resultado?: string;
  style?: StyleProp<ViewStyle>;
}

export function PautaCard({
  disciplina,
  mt1,
  mt2,
  mt3,
  ca,
  mft,
  mfd,
  cfd,
  rec,
  ex,
  outrosAnos,
  resultado,
  style,
}: PautaCardProps) {
  const getGradeColor = (grade: number | string | undefined) => {
    if (typeof grade === 'number') {
      return grade >= 10 ? '#007AFF' : '#FF3B30';
    }
    return '#666';
  };

  const formatGrade = (grade: number | string | undefined) => {
    if (grade === undefined) return '-';
    if (typeof grade === 'number') return Math.round(grade).toString();
    return grade === 'nnl' ? 'Não lançada' : grade;
  };

  const getResultadoColor = (res?: string) => {
    switch (res) {
      case 'TRANSITA':
        return '#28a745';
      case 'N/TRANSITA':
        return '#FF3B30';
      case '?TRANSITA':
      case 'RECURSO':
        return '#ffc107';
      default:
        return '#666';
    }
  };

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.subject}>{disciplina}</Text>
      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MT1:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mt1) }]}>{formatGrade(mt1)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MT2:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mt2) }]}>{formatGrade(mt2)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MT3:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mt3) }]}>{formatGrade(mt3)}</Text>
        </View>
      </View>
      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>CA:</Text>
          <Text style={[styles.grade, { color: getGradeColor(ca) }]}>{formatGrade(ca)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MFT:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mft) }]}>{formatGrade(mft)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>MFD:</Text>
          <Text style={[styles.grade, { color: getGradeColor(mfd) }]}>{formatGrade(mfd)}</Text>
        </View>
      </View>
      <View style={styles.gradeRow}>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>CFD:</Text>
          <Text style={[styles.grade, { color: getGradeColor(cfd) }]}>{formatGrade(cfd)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>REC:</Text>
          <Text style={[styles.grade, { color: getGradeColor(rec) }]}>{formatGrade(rec)}</Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.label}>EX:</Text>
          <Text style={[styles.grade, { color: getGradeColor(ex) }]}>{formatGrade(ex)}</Text>
        </View>
      </View>
      {outrosAnos && (
        <View style={styles.gradeRow}>
          {Object.entries(outrosAnos).map(([ano, valor]) => (
            <View style={styles.gradeItem} key={ano}>
              <Text style={styles.label}>{ano}:</Text>
              <Text style={[styles.grade, { color: getGradeColor(valor) }]}>{formatGrade(valor)}</Text>
            </View>
          ))}
        </View>
      )}
      {resultado && (
        <View style={styles.resultadoContainer}>
          <Text style={[styles.resultado, { color: getResultadoColor(resultado) }]}>
            {resultado}
          </Text>
        </View>
      )}
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
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  gradeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginRight: 4,
  },
  grade: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultadoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  resultado: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});