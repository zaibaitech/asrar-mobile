/**
 * Prayer Selector Component
 * 
 * Simple selector for choosing which prayer to get guidance for.
 * Phase 3: Functional UI only (no fancy styling)
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Prayer } from '@/data/divine-names-planetary';
import { getAllPrayerContexts, getArabicPrayerName, getPrayerIcon, type PrayerTimeContext } from '@/utils/prayer-times';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PrayerSelectorProps {
  onSelect: (prayer: Prayer) => void;
  selectedPrayer?: Prayer | null;
}

export const PrayerSelector = React.memo(function PrayerSelector({ onSelect, selectedPrayer }: PrayerSelectorProps) {
  const { t, tSafe } = useLanguage();
  const prayers: Prayer[] = useMemo(() => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], []);
  const [prayerContexts, setPrayerContexts] = useState<PrayerTimeContext[]>([]);
  
  useEffect(() => {
    // Load prayer contexts
    const loadContexts = async () => {
      try {
        const contexts = await getAllPrayerContexts();
        setPrayerContexts(contexts);
      } catch (error) {
        console.error('Error loading prayer contexts:', error);
      }
    };
    
    loadContexts();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('prayerGuidance.ui.selectPrayer')}</Text>
      
      <View style={styles.prayerGrid}>
        {prayers.map(prayer => {
          const context = prayerContexts.find(p => p.prayer === prayer);
          const isSelected = selectedPrayer === prayer;
          const isCurrent = context?.isCurrentPrayer;
          const isNext = context?.isNextPrayer;
          
          return (
            <TouchableOpacity
              key={prayer}
              style={[
                styles.prayerButton,
                isSelected && styles.prayerButtonSelected,
                isCurrent && styles.prayerButtonCurrent
              ]}
              onPress={() => onSelect(prayer)}
            >
              <Text style={styles.prayerIcon}>{getPrayerIcon(prayer)}</Text>
              <Text style={styles.prayerName}>
                {tSafe(`prayerAdhkar.prayers.${prayer}`, prayer)}
              </Text>
              <Text style={styles.prayerArabic}>{getArabicPrayerName(prayer)}</Text>
              
              {isNext && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t('prayerGuidance.ui.next')}</Text>
                </View>
              )}
              
              {isCurrent && (
                <View style={[styles.badge, styles.badgeCurrent]}>
                  <Text style={styles.badgeText}>{t('prayerGuidance.ui.current')}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    marginBottom: Spacing.md,
    color: DarkTheme.textPrimary,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  prayerButton: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center'
  },
  prayerButtonSelected: {
    borderColor: '#64B5F6',
    backgroundColor: DarkTheme.cardBackgroundLight,
  },
  prayerButtonCurrent: {
    borderColor: '#34C759',
    backgroundColor: DarkTheme.cardBackgroundLight,
  },
  prayerIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 4
  },
  prayerArabic: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    fontFamily: 'System' // Will use Arabic font if available
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#64B5F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeCurrent: {
    backgroundColor: '#34C759'
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  }
});

export default PrayerSelector;
