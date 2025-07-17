import React from 'react';
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

  const hasValidGrade = (grade: number | string | undefined) => {
    return grade !== undefined && grade !== null && grade !== '';
  };

  const GradeItem = ({ label, value }: { label: string; value: number | string }) => (
  <View style={styles.gradeItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={[styles.grade, { color: getGradeColor(value) }]}>{formatGrade(value)}</Text>
  </View>
);


return (
  <View style={[styles.card, style]}>
    <Text style={styles.subject}>{disciplina}</Text>

    {/* Linha 1: MT1, MT2, MT3, MFT */}
    <View style={styles.gradeRow}>
      {hasValidGrade(mt1) && <GradeItem label="MT1" value={mt1 ||'-'} />}
      {hasValidGrade(mt2) && <GradeItem label="MT2" value={mt2 ||'-'} />}
      {hasValidGrade(mt3) && <GradeItem label="MT3" value={mt3 ||'-'} />}
      {hasValidGrade(mft) && <GradeItem label="MFT" value={mft ||'-'} />}
    </View>

    {/* Linha 2: MFD, CA, CFD, 10ª */}
    <View style={styles.gradeRow}>
      {hasValidGrade(mfd) && <GradeItem label="MFD" value={mfd ||'-'} />}
      {hasValidGrade(ca) && <GradeItem label="CA" value={ca ||'-'} />}
      {hasValidGrade(cfd) && <GradeItem label="CFD" value={cfd ||'-'} />}
      {outrosAnos?.['10'] && <GradeItem label="10ª" value={outrosAnos['10'] ||'-'} />}
    </View>

    {/* Linha 3: 11ª, REC, EX */}
    <View style={styles.gradeRow}>
      {outrosAnos?.['11'] && <GradeItem label="11ª" value={outrosAnos['11'] ||'-'} />}
      {hasValidGrade(rec) && <GradeItem label="REC" value={rec ||'-'} />}
      {hasValidGrade(ex) && <GradeItem label="EX" value={ex ||'-'} />}
    </View>

    {/* Resultado final */}
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