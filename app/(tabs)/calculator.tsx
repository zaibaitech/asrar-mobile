/**
 * Calculator Tab - Abjad Numerology Calculator
 * Advanced calculation tools for various numerological systems
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Calculator as CalcIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CalculatorTab() {
  const { t } = useLanguage();

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#312e81']}
      style={styles.container}
    >
      <View style={styles.content}>
        <CalcIcon size={80} color="#a78bfa" strokeWidth={1.5} />
        <Text style={styles.title}>🧮 {t('nav.calculator')}</Text>
        <Text style={styles.subtitle}>
          Advanced Abjad numerology calculator
        </Text>
        <Text style={styles.description}>
          Coming Soon{'\n\n'}
          This tab will contain powerful calculation tools for various numerological systems.
          {'\n\n'}
          For now, explore the modules on the Home tab or use Istikhara for spiritual calculations.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
});
