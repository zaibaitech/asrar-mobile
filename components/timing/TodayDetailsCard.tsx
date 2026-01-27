/**
 * Today's Details Card
 * ====================
 * Clean, organized display of today's astrological details
 * Consolidates day ruler, element, and quality into one card
 * 
 * Shows:
 * - Day ruling planet
 * - Today's element
 * - Day quality
 * - Element power
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { translations } from '@/constants/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import type { ElementalTone } from '@/types/divine-timing';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TodayDetailsCardProps {
  dayRuler: Planet;
  dayRulerPower: number;
  element: ElementalTone;
  elementIcon?: string;
  dayQuality?: string;
}

function getPlanetEmoji(planet: Planet): string {
  const emojiMap: Record<Planet, string> = {
    Sun: '☀️',
    Moon: '🌙',
    Mars: '♂️',
    Mercury: '☿️',
    Jupiter: '♃',
    Venus: '♀️',
    Saturn: '♄',
  };
  return emojiMap[planet] || '⭐';
}

function getElementEmoji(element: ElementalTone): string {
  const emojiMap: Record<ElementalTone, string> = {
    fire: '🔥',
    water: '💧',
    air: '🌬️',
    earth: '🌱',
  };
  return emojiMap[element] || '⚪';
}

export default function TodayDetailsCard({
  dayRuler,
  dayRulerPower,
  element,
  elementIcon,
  dayQuality = 'Balanced',
}: TodayDetailsCardProps) {
  const { language } = useLanguage();
  const lang = language as 'en' | 'fr' | 'ar';
  const t = translations[lang];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>{t.notifications.timing.todaysDetails} 📅</Text>

      <View style={styles.detailsGrid}>
        {/* Day Ruler */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t.notifications.timing.dayRuler}</Text>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailEmoji}>{getPlanetEmoji(dayRuler)}</Text>
            <View style={styles.detailValueText}>
              <Text style={styles.detailValue}>{dayRuler}</Text>
              <Text style={styles.detailPower}>{dayRulerPower}%</Text>
            </View>
          </View>
        </View>

        {/* Element */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t.notifications.timing.element}</Text>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailEmoji}>{elementIcon || getElementEmoji(element)}</Text>
            <Text style={styles.detailValue}>{t.common.elements[element]}</Text>
          </View>
        </View>

        {/* Quality */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t.notifications.timing.quality}</Text>
          <Text style={[styles.detailValue, styles.qualityValue]}>{dayQuality}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },

  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  detailsGrid: {
    gap: 16,
  },

  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },

  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailEmoji: {
    fontSize: 20,
  },

  detailValueText: {
    alignItems: 'flex-end',
  },

  detailValue: {
    color: DarkTheme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  detailPower: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },

  qualityValue: {
    color: '#3B82F6',
  },
});
