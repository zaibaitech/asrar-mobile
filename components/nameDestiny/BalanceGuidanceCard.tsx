/**
 * Balance Guidance Card Component
 * Provides balancing advice and recommended dhikr for dominant element
 */

import { getElementColor, getElementExpression } from '@/utils/elementMeaning';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BalanceGuidanceCardProps {
  element: 'fire' | 'air' | 'water' | 'earth';
  language: 'en' | 'ar' | 'fr';
}

export function BalanceGuidanceCard({ element, language }: BalanceGuidanceCardProps) {
  const color = getElementColor(element);
  const expression = getElementExpression(element);
  const dhikr = expression.recommendedDhikr;

  const titleText = language === 'ar' 
    ? 'موازنة طاقة اسمك'
    : language === 'fr'
    ? 'Équilibrer l\'Énergie de Votre Nom'
    : 'Balancing Your Name\'s Energy';

  const dhikrTitle = language === 'ar' 
    ? 'ذكر موصى به'
    : language === 'fr'
    ? 'Dhikr Recommandé'
    : 'Recommended Dhikr';

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Heart size={18} color={color} strokeWidth={2.5} fill={color} fillOpacity={0.2} />
        <Text style={styles.title}>{titleText}</Text>
      </View>

      <Text style={[styles.adviceText, language === 'ar' && styles.arabicText]}>
        {expression.balanceAdvice[language]}
      </Text>

      <View style={styles.dhikrContainer}>
        <Text style={styles.dhikrTitle}>{dhikrTitle}</Text>
        
        <View style={[styles.dhikrCard, { borderLeftColor: color }]}>
          <Text style={styles.dhikrArabic}>{dhikr.arabic}</Text>
          <Text style={styles.dhikrTransliteration}>{dhikr.transliteration}</Text>
          <Text style={styles.dhikrMeaning}>"{dhikr.meaning}"</Text>
          
          <View style={styles.reasonContainer}>
            <Text style={[styles.reasonText, language === 'ar' && styles.arabicText]}>
              {dhikr.reason[language]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  adviceText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#cbd5e1',
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
  },
  dhikrContainer: {
    gap: 10,
  },
  dhikrTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dhikrCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    gap: 6,
  },
  dhikrArabic: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 4,
  },
  dhikrTransliteration: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dhikrMeaning: {
    fontSize: 13,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 8,
  },
  reasonContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  reasonText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 19,
    textAlign: 'center',
  },
});
