/**
 * BlessedDayWidget Component
 * Shows today's blessed day information based on Islamic calendar
 * 
 * Each day of the week has spiritual significance and recommended practices
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, ElementAccents, Spacing, Typography } from '../../../constants/DarkTheme';
import { ElementType } from '../../../contexts/ThemeContext';

interface DayInfo {
  dayName: string;
  dayNameArabic: string;
  element: ElementType;
  blessing: string;
}

const DAYS_INFO: DayInfo[] = [
  { dayName: 'Sunday', dayNameArabic: 'الأحد', element: 'fire', blessing: '☀️ Solar' },
  { dayName: 'Monday', dayNameArabic: 'الإثنين', element: 'water', blessing: '🌙 Lunar' },
  { dayName: 'Tuesday', dayNameArabic: 'الثلاثاء', element: 'fire', blessing: '♂️ Mars' },
  { dayName: 'Wednesday', dayNameArabic: 'الأربعاء', element: 'air', blessing: '☿️ Mercury' },
  { dayName: 'Thursday', dayNameArabic: 'الخميس', element: 'air', blessing: '♃ Jupiter' },
  { dayName: 'Friday', dayNameArabic: 'الجمعة', element: 'earth', blessing: '♀️ Venus' },
  { dayName: 'Saturday', dayNameArabic: 'السبت', element: 'earth', blessing: '♄ Saturn' },
];

export function BlessedDayWidget() {
  const [dayInfo, setDayInfo] = useState<DayInfo>(DAYS_INFO[0]);

  useEffect(() => {
    const today = new Date().getDay();
    setDayInfo(DAYS_INFO[today]);
  }, []);

  const accent = ElementAccents[dayInfo.element];

  return (
    <View style={[styles.container, { borderColor: `${accent.primary}40` }]}>
      <Text style={styles.label}>Today's Blessing</Text>
      <Text style={styles.dayArabic}>{dayInfo.dayNameArabic}</Text>
      <Text style={[styles.blessing, { color: accent.primary }]}>
        {dayInfo.blessing}
      </Text>
      <View style={[styles.elementBadge, { backgroundColor: accent.glow }]}>
        <Text style={[styles.elementText, { color: accent.primary }]}>
          {dayInfo.element.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 21, 21, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.md,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.xs,
  },
  dayArabic: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  blessing: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    marginBottom: Spacing.sm,
  },
  elementBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  elementText: {
    fontSize: 10,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.5,
  },
});
