/**
 * Divine Resonance Card Component
 * Displays the Divine Name Resonance calculation and results
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DivineResonanceResult, computeDivineNameAbjad } from '../services/divineResonance';

interface DivineResonanceCardProps {
  resonance: DivineResonanceResult;
}

export function DivineResonanceCard({ resonance }: DivineResonanceCardProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  // Compute dhikr count from Divine Name's own Abjad value
  const dhikrData = useMemo(() => {
    return computeDivineNameAbjad(resonance.divineName);
  }, [resonance.divineName]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.15)', 'rgba(139, 92, 246, 0.1)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={20} color="#c084fc" fill="#c084fc" />
          </View>
          <Text style={styles.title}>{t('nameDestiny.divineResonance.title')}</Text>
        </View>

        {/* Divine Name Display */}
        <View style={styles.divineNameSection}>
          <Text style={styles.divineNameArabicTashkeel}>{resonance.divineNameTashkeel}</Text>
          <Text style={styles.divineNameArabic}>{resonance.divineName}</Text>
          <Text style={styles.transliteration}>{resonance.transliteration}</Text>
          <Text style={styles.translation}>{t(resonance.translationKey)}</Text>
          <View style={styles.letterBadge}>
            <Text style={styles.letterText}>{resonance.letter}</Text>
          </View>
          
          {/* Why explanation */}
          <Text style={styles.whyText}>
            {t('nameDestiny.divineResonance.abjadNote')}
          </Text>
        </View>

        {/* Collapsible: How it was derived */}
        <Pressable 
          style={styles.derivedHeader}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.derivedTitle}>{t('nameDestiny.divineResonance.howDerived')}</Text>
          {showDetails ? (
            <ChevronUp size={18} color="#9CA3AF" />
          ) : (
            <ChevronDown size={18} color="#9CA3AF" />
          )}
        </Pressable>

        {showDetails && (
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('nameDestiny.divineResonance.abjadTotalLabel')}</Text>
              <Text style={styles.detailValue}>{resonance.total}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('nameDestiny.divineResonance.resonanceIndexLabel')}</Text>
              <Text style={styles.detailValue}>{resonance.index}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('nameDestiny.divineResonance.resonantLetterLabel')}</Text>
              <Text style={styles.detailValueArabic}>{resonance.letter}</Text>
            </View>

            {/* Letter Breakdown */}
            {resonance.breakdown.length > 0 && (
              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownTitle}>{t('nameDestiny.divineResonance.letterBreakdownTitle')}</Text>
                <View style={styles.breakdownGrid}>
                  {resonance.breakdown.map((item, index) => (
                    <View key={index} style={styles.breakdownItem}>
                      <Text style={styles.breakdownLetter}>{item.ch}</Text>
                      <Text style={styles.breakdownValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Dhikr Recommendation (Optional) */}
        <View style={styles.dhikrSection}>
          <Text style={styles.dhikrTitle}>{t('nameDestiny.divineResonance.dhikrTitle')}</Text>
          
          {dhikrData.total > 0 && (
            <View style={styles.dhikrCountRow}>
              <Text style={styles.dhikrLabel}>{t('nameDestiny.divineResonance.suggestedCount')}</Text>
              <Text style={styles.dhikrCount}>{dhikrData.total}</Text>
              <Text style={styles.dhikrNameSmall}>يا {resonance.divineName}</Text>
            </View>
          )}

          <Text style={styles.dhikrExplanation}>
            {t('nameDestiny.divineResonance.dhikrDescription')}
          </Text>
          
          <Text style={styles.dhikrArabic}>
            يُذكَر هذا الاسم في الذِّكر تقرُّبًا إلى الله وحسب النِّيَّة
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  divineNameSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168, 85, 247, 0.2)',
    marginBottom: 16,
  },
  divineNameArabicTashkeel: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#c084fc',
    marginBottom: 4,
    textAlign: 'center',
  },
  divineNameArabic: {
    fontSize: 28,
    fontWeight: '600',
    color: '#a78bfa',
    marginBottom: 8,
    textAlign: 'center',
  },
  transliteration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  translation: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 12,
    textAlign: 'center',
  },
  letterBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  letterText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  whyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  derivedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  derivedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  detailsSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailValueArabic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c084fc',
  },
  breakdownSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(168, 85, 247, 0.15)',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 10,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownItem: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  breakdownLetter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c084fc',
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  dhikrSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(168, 85, 247, 0.2)',
  },
  dhikrTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#c084fc',
    marginBottom: 12,
  },
  dhikrCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dhikrLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  dhikrCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c084fc',
  },
  dhikrNameSmall: {
    fontSize: 20,
    fontWeight: '600',
    color: '#a78bfa',
  },
  dhikrExplanation: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 8,
  },
  dhikrArabic: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    textAlign: 'right',
    fontStyle: 'italic',
  },
});
