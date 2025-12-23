/**
 * WidgetBar Component
 * 2x2 grid of quick access widgets
 * 
 * Design principles:
 * - All options visible instantly (no scrolling)
 * - Balanced 2x2 grid layout
 * - Quick access without hunting or swiping
 * - Glassmorphism for visual consistency
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, Shadows, Spacing, Typography } from '../../constants/DarkTheme';
import { QuickDhikrWidget } from './QuickDhikrWidget';
import { BlessedDayWidget } from './widgets/BlessedDayWidget';
import { DailyQuoteWidget } from './widgets/DailyQuoteWidget';
import { PrayerTimesWidget } from './widgets/PrayerTimesWidget';

export function WidgetBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      
      {/* 2x2 Grid - All visible, no scrolling */}
      <View style={styles.gridContainer}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          <View style={styles.widgetWrapper}>
            <PrayerTimesWidget />
          </View>
          
          <View style={styles.widgetWrapper}>
            <DailyQuoteWidget />
          </View>
        </View>
        
        {/* Row 2 */}
        <View style={styles.gridRow}>
          <View style={styles.widgetWrapper}>
            <QuickDhikrWidget />
          </View>
          
          <View style={styles.widgetWrapper}>
            <BlessedDayWidget />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm, // Reduced from Spacing.lg (16 → 8) - tighter to Welcome
    marginBottom: Spacing.sm, // Reduced from Spacing.md (12 → 8)
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm, // Reduced from Spacing.md (12 → 8) - closer to tiles
  },
  
  // 2x2 Grid Layout
  gridContainer: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm, // Reduced from Spacing.md (12 → 8) - more compact
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm, // Reduced from Spacing.md (12 → 8)
    marginBottom: 0, // Removed extra margin (gap handles spacing)
  },
  widgetWrapper: {
    flex: 1, // Equal width for both tiles in row
    height: 120, // Kept compact size
    ...Shadows.subtle,
  },
});
