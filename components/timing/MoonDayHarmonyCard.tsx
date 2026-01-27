import { useLanguage } from '@/contexts/LanguageContext';
import type { MoonDayHarmony } from '@/services/MoonPhaseService';
import type { Planet } from '@/services/PlanetaryHoursService';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MoonDayHarmonyCardProps {
  harmony: MoonDayHarmony;
  dayRuler: Planet;
}

export default function MoonDayHarmonyCard({
  harmony,
  dayRuler,
}: MoonDayHarmonyCardProps) {
  const { t } = useLanguage();
  
  // Get harmony color and icon
  const harmonyConfig = {
    perfect: {
      icon: '✅',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      label: t('moon.ui.perfectAlignment'),
    },
    good: {
      icon: '🟢',
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)',
      label: t('moon.ui.goodAlignment'),
    },
    neutral: {
      icon: '⚖️',
      color: '#64B5F6',
      bg: 'rgba(100, 181, 246, 0.15)',
      label: t('moon.ui.neutralAlignment'),
    },
    challenging: {
      icon: '⚠️',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)',
      label: t('moon.ui.challengingAlignment'),
    },
  };
  
  const config = harmonyConfig[harmony.harmonyLevel];
  
  // Replace {{dayRuler}} placeholder in translation
  const explanation = t(harmony.explanationKey, { dayRuler });
  const recommendation = t(harmony.recommendationKey);
  
  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.color }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>{t('moon.ui.moonDayHarmony')}</Text>
      </View>
      
      {/* Harmony Level */}
      <View style={styles.harmonyBadge}>
        <Text style={styles.harmonyIcon}>{config.icon}</Text>
        <Text style={[styles.harmonyLabel, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
      
      {/* Explanation */}
      <Text style={styles.explanation}>{explanation}</Text>
      
      {/* Recommendation */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationLabel}>💡 Recommendation</Text>
        <Text style={styles.recommendation}>{recommendation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  
  header: {
    marginBottom: 16,
  },
  
  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  harmonyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  
  harmonyIcon: {
    fontSize: 24,
  },
  
  harmonyLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  explanation: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  
  recommendationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  
  recommendationLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  
  recommendation: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
  },
});
