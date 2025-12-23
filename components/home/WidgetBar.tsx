/**
 * WidgetBar Component
 * Compact horizontal bar containing secondary features
 * 
 * Design principles:
 * - Quick access without cluttering main navigation
 * - Glassmorphism for visual consistency
 * - Scrollable for extensibility
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DarkTheme, Shadows, Spacing, Typography } from '../../constants/DarkTheme';
import { QuickDhikrWidget } from './QuickDhikrWidget';
import { BlessedDayWidget } from './widgets/BlessedDayWidget';
import { DailyQuoteWidget } from './widgets/DailyQuoteWidget';
import { PrayerTimesWidget } from './widgets/PrayerTimesWidget';

export function WidgetBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {/* Prayer Times Widget */}
        <View style={styles.widgetWrapper}>
          <PrayerTimesWidget />
        </View>
        
        {/* Daily Quote Widget */}
        <View style={styles.widgetWrapper}>
          <DailyQuoteWidget />
        </View>
        
        {/* Quick Dhikr Counter */}
        <View style={styles.widgetWrapper}>
          <QuickDhikrWidget />
        </View>
        
        {/* Blessed Day Widget */}
        <View style={styles.widgetWrapper}>
          <BlessedDayWidget />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.md,
  },
  widgetWrapper: {
    width: 160,
    height: 140,
    ...Shadows.subtle,
  },
});
