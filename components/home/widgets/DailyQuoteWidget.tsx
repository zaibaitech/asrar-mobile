/**
 * DailyQuoteWidget Component
 * Displays daily spiritual reminder combining authentic Islamic sources
 * with Ilm al-Huruf planetary wisdom
 * 
 * SOURCES:
 * - Authentic Quranic verses
 * - Sahih Hadith collections
 * - Divine Names (Asma ul-Husna)
 * - Planetary wisdom (Maghribi system)
 * - Traditional Islamic wisdom
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DarkTheme, Spacing, Typography } from '../../../constants/DarkTheme';
import { getDailyReminder, type DailyReminder } from '../../../services/DailyReminderService';

export function DailyQuoteWidget() {
  const [reminder, setReminder] = useState<DailyReminder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyReminder();
  }, []);

  const loadDailyReminder = async () => {
    try {
      const dailyReminder = await getDailyReminder();
      setReminder(dailyReminder);
    } catch (error) {
      console.error('Error loading daily reminder:', error);
      // Fallback to a default reminder
      setReminder({
        type: 'quran',
        textArabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        text: 'Verily, in the remembrance of Allah do hearts find rest.',
        source: 'Quran 13:28',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={DarkTheme.textSecondary} />
      </View>
    );
  }

  if (!reminder) {
    return null;
  }

  // Get icon based on type
  const getIcon = () => {
    switch (reminder.type) {
      case 'quran': return '📖';
      case 'hadith': return '☪️';
      case 'divine-name': return '✨';
      case 'wisdom': return '💎';
      default: return '✨';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.label}>Daily Reminder</Text>
      <Text style={styles.quoteArabic} numberOfLines={3}>
        {reminder.textArabic}
      </Text>
      <Text style={styles.source}>{reminder.source}</Text>
      {reminder.planetaryContext && (
        <Text style={styles.planetary} numberOfLines={1}>
          {reminder.planetaryContext}
        </Text>
      )}
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.md,
  },
  icon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.sm,
  },
  quoteArabic: {
    fontSize: Typography.label,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  source: {
    fontSize: 10,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
  },
  planetary: {
    fontSize: 9,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
