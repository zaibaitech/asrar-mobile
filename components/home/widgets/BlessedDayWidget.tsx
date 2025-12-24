/**
 * BlessedDayWidget Component
 * Shows today's blessed day information based on authentic Maghribi Ilm al-Nujum
 * 
 * Uses traditional Islamic planetary hour calculations (Sā'āt al-Kawākib)
 * following the Maghribi methodology from classical sources
 * 
 * SOURCES:
 * - Shams al-Ma'ārif by al-Būnī
 * - Ghāyat al-Ḥakīm (Picatrix) - Andalusian-Maghribi tradition
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, ElementAccents, Spacing, Typography } from '../../../constants/DarkTheme';
import { getTodayBlessing, type DayBlessing } from '../../../services/DayBlessingService';

export function BlessedDayWidget() {
  const [blessing, setBlessing] = useState<DayBlessing | null>(null);

  useEffect(() => {
    // Get today's blessing using authentic Maghribi system
    const todayBlessing = getTodayBlessing();
    setBlessing(todayBlessing);
  }, []);

  if (!blessing) {
    return null;
  }

  const accent = ElementAccents[blessing.element];

  return (
    <View style={[styles.container, { borderColor: `${accent.primary}40` }]}>
      <Text style={styles.label}>Today's Blessing</Text>
      <Text style={styles.dayArabic}>{blessing.dayNameArabic}</Text>
      <Text style={[styles.blessing, { color: accent.primary }]}>
        {blessing.emoji} {blessing.planetArabic}
      </Text>
      <View style={[styles.elementBadge, { backgroundColor: accent.glow }]}>
        <Text style={[styles.elementText, { color: accent.primary }]}>
          {blessing.element.toUpperCase()}
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
