/**
 * DailyQuoteWidget Component
 * Displays daily spiritual reminder or wisdom
 * 
 * Rotates quotes daily based on date
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, Spacing, Typography } from '../../../constants/DarkTheme';

const DAILY_QUOTES = [
  {
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    textArabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    source: "Qur'an 13:28",
  },
  {
    text: "The best of people are those who are most beneficial to others.",
    textArabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    source: "Hadith",
  },
  {
    text: "Patience is the key to relief.",
    textArabic: "الصَّبْرُ مِفْتَاحُ الْفَرَجِ",
    source: "Islamic Wisdom",
  },
];

export function DailyQuoteWidget() {
  const [quote, setQuote] = useState(DAILY_QUOTES[0]);

  useEffect(() => {
    // Get quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % DAILY_QUOTES.length;
    setQuote(DAILY_QUOTES[quoteIndex]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.label}>Daily Reminder</Text>
      <Text style={styles.quoteArabic} numberOfLines={2}>
        {quote.textArabic}
      </Text>
      <Text style={styles.source}>{quote.source}</Text>
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
});
