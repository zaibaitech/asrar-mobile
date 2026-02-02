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
      {/* Title on top - always visible */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Badge below title - with full width to avoid collision */}
      <View style={[styles.badge, { borderColor: badgeColor, backgroundColor: `${badgeColor}1F` }]}>
        <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
      </View>
      
      {/* Subtitle/description below badge */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Time remaining at bottom */}
      {!!timeRemainingLabel && (
        <View style={styles.timeRemainingRow}>
          <Text style={styles.clockIcon}>⏱️</Text>
          <Text style={styles.timeRemaining}>{timeRemainingLabel}</Text>
        </View>
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
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    letterSpacing: 0.3,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: DarkTheme.textSecondary,
    lineHeight: 22,
  },
  timeRemainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  clockIcon: {
    fontSize: 14,
  },
  timeRemaining: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    fontWeight: '500',
  },
});
