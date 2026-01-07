import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdvancedMethodsProps {
  kabir: number;
  saghir: number;
}

type OperationResult = {
  label: string;
  formula: string;
  value: number;
};

export const AdvancedMethods: React.FC<AdvancedMethodsProps> = ({ kabir, saghir }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  // Traditional calculations from classical ʿIlm al-Ḥurūf
  const wusta = Math.floor((kabir + saghir) / 2); // Wusṭā (Mean) - Balance between large and small
  const kamal = kabir + saghir; // Kamāl (Perfection) - Complete union
  const bast = kabir * saghir; // Basṭ (Expansion) - Multiplicative potential
  const sirr = Math.abs(kabir - saghir); // Sirr (Hidden) - The secret difference
  
  // Interactive operations showing combinations
  const operations: OperationResult[] = [
    { label: 'Kabīr + Ṣaghīr', formula: `${kabir} + ${saghir}`, value: kamal },
    { label: 'Kabīr − Ṣaghīr', formula: `${kabir} − ${saghir}`, value: sirr },
    { label: 'Kabīr × Ṣaghīr', formula: `${kabir} × ${saghir}`, value: bast },
    { label: 'Kabīr mod 9', formula: `${kabir} mod 9`, value: kabir % 9 || 9 },
  ];
  
  const methods = [
    {
      name: t('calculator.results.advancedMethods.wusta.name'),
      arabic: 'الوُسْطَى',
      formula: 'Kabīr + Ṣaghīr ÷ 2',
      value: wusta,
      description: t('calculator.results.advancedMethods.wusta.description'),
      color: '#f59e0b', // amber
    },
    {
      name: t('calculator.results.advancedMethods.kamal.name'),
      arabic: 'الكَمَال',
      formula: 'Kabīr + Ṣaghīr',
      value: kamal,
      description: t('calculator.results.advancedMethods.kamal.description'),
      color: '#10b981', // emerald
    },
    {
      name: t('calculator.results.advancedMethods.bast.name'),
      arabic: 'البَسْط',
      formula: 'Kabīr × Ṣaghīr',
      value: bast,
      description: t('calculator.results.advancedMethods.bast.description'),
      color: '#06b6d4', // cyan
    },
    {
      name: t('calculator.results.advancedMethods.sirr.name'),
      arabic: 'السِّر',
      formula: 'Kabīr − Ṣaghīr',
      value: sirr,
      description: t('calculator.results.advancedMethods.sirr.description'),
      color: '#8b5cf6', // purple
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>⚗️</Text>
          <Text style={styles.title}>{t('calculator.results.advancedMethods.title')}</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
      </Pressable>
      
      <Text style={styles.subtitle}>
        {t('calculator.results.advancedMethods.subtitle')}
      </Text>

      {/* Method Cards */}
      <View style={styles.methodsGrid}>
        {methods.map((method, index) => (
          <View 
            key={index} 
            style={[styles.methodCard, { borderColor: method.color }]}
          >
            <View style={styles.methodHeader}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodArabic}>{method.arabic}</Text>
            </View>
            
            <Text style={[styles.methodValue, { color: method.color }]}>
              {method.value}
            </Text>
            
            <Text style={styles.methodFormula}>{method.formula}</Text>
            <Text style={styles.methodDescription}>{method.description}</Text>
          </View>
        ))}
      </View>

      {/* Interactive Operations */}
      {expanded && (
        <View style={styles.operationsSection}>
          <Text style={styles.sectionTitle}>⚡ Interactive Operations</Text>
          
          <View style={styles.operationsGrid}>
            {operations.map((op, index) => (
              <View key={index} style={styles.operationCard}>
                <Text style={styles.operationLabel}>{op.label}</Text>
                <Text style={styles.operationFormula}>{op.formula}</Text>
                <Text style={styles.operationValue}>{op.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  chevron: {
    fontSize: 14,
    color: '#64748b',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  // Methods Grid
  methodsGrid: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  methodArabic: {
    fontSize: 16,
    color: '#94a3b8',
  },
  methodValue: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  methodFormula: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
  },
  methodDescription: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Operations Section
  operationsSection: {
    marginTop: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  operationCard: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    width: '48%',
  },
  operationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
  },
  operationFormula: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  operationValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
  },
});
