/**
 * Enhanced Zodiac Header Component
 * Rich zodiac header with personality traits, strengths, and warnings
 */

import { type ZodiacData } from '@/constants/zodiacStones';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

interface EnhancedZodiacHeaderProps {
  zodiacData: ZodiacData;
  gradient: readonly [string, string];
  elementEmoji: string;
  planetEmoji: string;
}

export function EnhancedZodiacHeader({
  zodiacData,
  elementEmoji,
  planetEmoji,
}: EnhancedZodiacHeaderProps) {
  const { language } = useLanguage();
  
  return (
    <View style={styles.headerCard}>
      <View style={styles.headerContent}>
        {/* Compact horizontal layout */}
        <View style={styles.compactRow}>
          <Text style={styles.zodiacSymbol}>{zodiacData.symbol}</Text>
          <View style={styles.zodiacInfo}>
            <Text style={styles.zodiacName}>
              {language === 'fr' ? zodiacData.zodiacSignFr :
               language === 'ar' ? zodiacData.zodiacSignAr :
               zodiacData.zodiacSign}
            </Text>
            <View style={styles.quickDetails}>
              <Text style={styles.quickDetailText}>{elementEmoji} {language === 'fr' ? zodiacData.elementFr : language === 'ar' ? zodiacData.elementAr : zodiacData.element}</Text>
              <Text style={styles.quickDetailSeparator}>•</Text>
              <Text style={styles.quickDetailText}>{planetEmoji} {language === 'fr' ? zodiacData.planetFr : language === 'ar' ? zodiacData.planetAr : zodiacData.planet}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    padding: 16,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  zodiacSymbol: {
    fontSize: 48,
  },
  zodiacInfo: {
    flex: 1,
  },
  zodiacName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  quickDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickDetailText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  quickDetailSeparator: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
});
