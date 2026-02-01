import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type StatusOverviewCardProps = {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor: string;
  timeRemainingLabel?: string;
};

export function StatusOverviewCard({
  title,
  subtitle,
  badgeText,
  badgeColor,
  timeRemainingLabel,
}: StatusOverviewCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.badge, { borderColor: badgeColor, backgroundColor: `${badgeColor}1F` }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
        </View>
      </View>

      {!!timeRemainingLabel && (
        <Text style={styles.timeRemaining}>{timeRemainingLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  titleCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  timeRemaining: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
  },
});
