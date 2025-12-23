import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../../constants/abjad-maps';
import { CalculatorColors } from '../../constants/CalculatorColors';
import { normalizeArabicText } from '../../utils/text-normalize';

interface LetterBreakdownProps {
  input: string;
  system: 'maghribi' | 'mashriqi';
}

export const LetterBreakdown: React.FC<LetterBreakdownProps> = ({ input, system }) => {
  const colors = CalculatorColors;
  
  const normalized = normalizeArabicText(input);
  const map = system === 'maghribi' ? ABJAD_MAGHRIBI : ABJAD_MASHRIQI;
  
  const breakdown = Array.from(normalized).map((char, index) => {
    const value = map[char] || 0;
    return { char, value, index };
  }).filter(item => item.value > 0);
  
  const runningTotals = breakdown.map((item, idx) => {
    const sum = breakdown.slice(0, idx + 1).reduce((acc, curr) => acc + curr.value, 0);
    return sum;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={['#1e293b', '#334155']}
        style={styles.titleCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>📊 Letter-by-Letter Breakdown</Text>
        <Text style={styles.subtitle}>{system.toUpperCase()} System</Text>
      </LinearGradient>
      
      <View style={styles.table}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.headerRow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerCell}>#</Text>
          <Text style={styles.headerCell}>Letter</Text>
          <Text style={styles.headerCell}>Value</Text>
          <Text style={styles.headerCell}>Running Total</Text>
        </LinearGradient>
        
        {breakdown.map((item, idx) => (
          <View 
            key={idx} 
            style={[styles.row, idx % 2 === 0 && styles.rowEven]}
          >
            <Text style={styles.cellNumber}>{idx + 1}</Text>
            <Text style={styles.cellLetter}>{item.char}</Text>
            <Text style={styles.cellValue}>{item.value}</Text>
            <Text style={styles.cellTotal}>{runningTotals[idx]}</Text>
          </View>
        ))}
        
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.totalRow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.totalLabel}>✨ Final Total:</Text>
          <Text style={styles.totalValue}>
            {runningTotals[runningTotals.length - 1] || 0}
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: { 
    padding: 20,
    paddingBottom: 40,
  },
  titleCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: { 
    fontSize: 20, 
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  table: { 
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerRow: { 
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  headerCell: { 
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { 
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  rowEven: {
    backgroundColor: '#0f172a',
  },
  cellNumber: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#94a3b8',
    fontWeight: '600',
  },
  cellLetter: { 
    flex: 1,
    fontSize: 22,
    textAlign: 'center',
    color: '#f1f5f9',
    fontWeight: '700',
  },
  cellValue: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#60a5fa',
    fontWeight: '700',
  },
  cellTotal: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#f1f5f9',
    fontWeight: '800',
  },
  totalRow: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  totalLabel: { 
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  totalValue: { 
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
});
