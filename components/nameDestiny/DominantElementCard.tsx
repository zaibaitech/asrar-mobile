/**
 * Dominant Element Card Component
 * Explains the dominant element's influence on expression
 */

import { getElementColor, getElementExpression, getElementLabel } from '@/utils/elementMeaning';
import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DominantElementCardProps {
  element: 'fire' | 'air' | 'water' | 'earth';
  percentage: number;
  language: 'en' | 'ar' | 'fr';
}

export function DominantElementCard({ element, percentage, language }: DominantElementCardProps) {
  const color = getElementColor(element);
  const label = getElementLabel(element);
  const expression = getElementExpression(element);

  const titleText = language === 'ar' 
    ? `عنصر الحرف المهيمن: ${label.ar} (${percentage}%)`
    : language === 'fr'
    ? `Élément Dominant des Lettres: ${label.fr} (${percentage}%)`
    : `Dominant Letter Element: ${label.en} (${percentage}%)`;

  const keywordsTitle = language === 'ar' ? 'السمات الرئيسية' : language === 'fr' ? 'Traits Clés' : 'Key Traits';

  return (
    <View style={[styles.container, { borderTopColor: color }]}>
      <View style={styles.header}>
        <Sparkles size={20} color={color} strokeWidth={2.5} />
        <Text style={styles.title}>{titleText}</Text>
      </View>

      <Text style={[styles.description, language === 'ar' && styles.arabicText]}>
        {expression.dominantMeaning[language]}
      </Text>

      <View style={styles.keywordsContainer}>
        <Text style={styles.keywordsTitle}>{keywordsTitle}</Text>
        <View style={styles.keywordsList}>
          {expression.expressionKeywords[language].map((keyword, index) => (
            <View key={index} style={[styles.keywordPill, { borderColor: color }]}>
              <Text style={[styles.keywordText, { color }]}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    padding: 18,
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#cbd5e1',
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
  },
  keywordsContainer: {
    gap: 10,
  },
  keywordsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  keywordText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
