import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ElementType } from '../../utils/types';

interface NumericalEssenceProps {
  saghir: number;
  element: ElementType;
}

export const NumericalEssence: React.FC<NumericalEssenceProps> = ({ saghir, element }) => {
  const { t } = useLanguage();
  
  // Arabic numbers for display
  const arabicNumbers: Record<number, string> = {
    1: 'الواحد',
    2: 'الاثنين',
    3: 'الثلاثة',
    4: 'الأربعة',
    5: 'الخمسة',
    6: 'الستة',
    7: 'السبعة',
    8: 'الثمانية',
    9: 'التسعة',
  };
  
  // Get archetype data from translations
  const meaning = {
    title: t(`calculator.results.archetypes.${saghir}.title`),
    arabic: arabicNumbers[saghir] || arabicNumbers[9],
    description: t(`calculator.results.archetypes.${saghir}.description`),
    qualities: [
      t(`calculator.results.archetypes.${saghir}.qualities.0`),
      t(`calculator.results.archetypes.${saghir}.qualities.1`),
      t(`calculator.results.archetypes.${saghir}.qualities.2`),
      t(`calculator.results.archetypes.${saghir}.qualities.3`),
    ],
  };
  
  // Element data with colors and emojis
  const elementColors: Record<ElementType, { emoji: string; color: string }> = {
    fire: { emoji: '🔥', color: '#ef4444' },
    water: { emoji: '💧', color: '#3b82f6' },
    air: { emoji: '🌬️', color: '#06b6d4' },
    earth: { emoji: '🌳', color: '#84cc16' },
  };
  
  const elementData = {
    ...elementColors[element],
    quality: t(`calculator.results.elementQualities.${element}.quality`),
    spiritual: t(`calculator.results.elementQualities.${element}.spiritual`),
  };
  
  // Build guidance text from template with dynamic values
  const guidanceText = t('calculator.results.essenceGuidance.template', {
    archetype: meaning.title,
    element: t(`calculator.results.elements.${element}`),
    quality: meaning.qualities[0].toLowerCase(),
    elementQuality: elementData.quality.split(',')[0].toLowerCase(),
  });

  return (
    <View style={[styles.container, { borderColor: elementData.color }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>💫</Text>
        <Text style={styles.headerTitle}>{t('calculator.results.essence.yourNumericalEssence')}</Text>
      </View>
      
      {/* Core Number */}
      <View style={styles.numberSection}>
        <Text style={styles.label}>{t('calculator.results.essence.coreNumberMeaning')}</Text>
        <View style={styles.numberCard}>
          <Text style={styles.numberValue}>{saghir}</Text>
          <View style={styles.numberInfo}>
            <Text style={styles.numberTitle}>{meaning.title}</Text>
            <Text style={styles.numberArabic}>{meaning.arabic}</Text>
          </View>
        </View>
        <Text style={styles.description}>{meaning.description}</Text>
        
        {/* Qualities */}
        <View style={styles.qualitiesGrid}>
          {meaning.qualities.map((quality, index) => (
            <View key={index} style={styles.qualityBadge}>
              <Text style={styles.qualityText}>{quality}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Dominant Element */}
      <View style={[styles.elementSection, { backgroundColor: elementData.color + '15' }]}>
        <View style={styles.elementHeader}>
          <Text style={styles.elementEmoji}>{elementData.emoji}</Text>
          <Text style={styles.elementTitle}>
            {t('calculator.results.essence.dominantElement')}: {t(`calculator.results.elements.${element}`).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.elementQuality}>{elementData.quality}</Text>
        <Text style={styles.elementSpiritual}>{elementData.spiritual}</Text>
      </View>
      
      {/* Guidance */}
      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceTitle}>✨ {t('calculator.results.essence.spiritualGuidance')}</Text>
        <Text style={styles.guidanceText}>{guidanceText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    gap: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
  },
  
  // Number Section
  numberSection: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  numberValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#a5b4fc',
    width: 70,
    textAlign: 'center',
  },
  numberInfo: {
    flex: 1,
  },
  numberTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  numberArabic: {
    fontSize: 18,
    color: '#cbd5e1',
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  
  // Qualities
  qualitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  qualityBadge: {
    backgroundColor: '#312e81',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c7d2fe',
  },
  
  // Element Section
  elementSection: {
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  elementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  elementEmoji: {
    fontSize: 24,
  },
  elementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  elementQuality: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    lineHeight: 20,
  },
  elementSpiritual: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  // Guidance
  guidanceCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  guidanceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  guidanceText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 19,
  },
  highlight: {
    fontWeight: '700',
    color: '#a5b4fc',
  },
});
