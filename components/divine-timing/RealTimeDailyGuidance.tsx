/**
 * Real-Time Daily Guidance Card
 * ==============================
 * Shows current day's spiritual timing guidance
 * Always displays real-time data (not dependent on check-ins)
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { DailyGuidance } from '@/services/DailyGuidanceService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RealTimeDailyGuidanceProps {
  guidance: DailyGuidance | null;
  loading?: boolean;
  compact?: boolean;
  showDayLabel?: boolean;
  dayLabel?: string;
  showDetailsHint?: boolean;
}

export function RealTimeDailyGuidance({ 
  guidance, 
  loading, 
  compact = false,
  showDayLabel = false,
  dayLabel = '',
  showDetailsHint = false,
}: RealTimeDailyGuidanceProps) {
  const router = useRouter();
  const { t } = useLanguage();
  
  const getStatusColor = (quality?: string) => {
    switch (quality) {
      case 'favorable':
        return '#10b981'; // Green
      case 'transformative':
        return '#f59e0b'; // Amber
      case 'delicate':
        return '#ef4444'; // Red
      default:
        return '#64B5F6'; // Blue
    }
  };
  
  const getStatusLabel = (quality?: string) => {
    switch (quality) {
      case 'favorable':
        return 'Favorable Window';
      case 'transformative':
        return 'Transformative Window';
      case 'delicate':
        return 'Delicate Window';
      default:
        return 'Neutral Window';
    }
  };
  
  const getElementIcon = (element?: string) => {
    switch (element) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'air':
        return '🌬️';
      case 'earth':
        return '🌱';
      default:
        return '✨';
    }
  };
  
  const getElementLabel = (element?: string) => {
    if (!element) return '';
    return element.charAt(0).toUpperCase() + element.slice(1);
  };
  
  if (loading || !guidance) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push('/daily-checkin')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(139, 115, 85, 0.15)', 'rgba(139, 115, 85, 0.05)']}
          style={styles.gradient}
        >
          <Text style={styles.loadingText}>Loading guidance...</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  const statusColor = getStatusColor(guidance.timingQuality);
  const statusLabel = getStatusLabel(guidance.timingQuality);
  const summaryText = t('home.daily.summary');
  const bestForText = t('home.daily.bestFor');
  const hasBestFor = Array.isArray(guidance.bestFor) && guidance.bestFor.length > 0;
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/daily-guidance')}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[`${statusColor}15`, `${statusColor}05`]}
        style={compact ? styles.gradientCompact : styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="compass-outline" size={compact ? 22 : 28} color={statusColor} />
            <View style={styles.titleContainer}>
              {showDayLabel && dayLabel && (
                <Text style={[styles.dayBadge, compact && styles.dayBadgeCompact]}>{dayLabel}</Text>
              )}
              <Text style={[styles.title, compact && styles.titleCompact]}>Daily Guidance</Text>
              <Text style={[styles.subtitle, { color: statusColor }, compact && styles.subtitleCompact]}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Elements Display */}
        <View style={[styles.elementsRow, compact && styles.elementsRowCompact]}>
          <View style={[styles.elementBadge, compact && styles.elementBadgeCompact]}>
            <Text style={styles.elementIcon}>{getElementIcon(guidance.dayElement)}</Text>
            <Text style={[styles.elementLabel, compact && styles.elementLabelCompact]}>
              {getElementLabel(guidance.dayElement)} Energy Today
            </Text>
          </View>
          
          {guidance.userElement && (
            <View style={[styles.elementBadge, styles.userElementBadge, compact && styles.elementBadgeCompact]}>
              <Text style={styles.elementIcon}>{getElementIcon(guidance.userElement)}</Text>
              <Text style={[styles.elementLabel, compact && styles.elementLabelCompact]}>
                Your {getElementLabel(guidance.userElement)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Message */}
        <Text
          style={compact ? styles.messageCompact : styles.message}
          numberOfLines={1}
        >
          {summaryText}
        </Text>
        
        {/* Best For / Avoid */}
        {hasBestFor && (
          <View style={[styles.activityRow, compact && styles.activityRowCompact]}>
            <View style={styles.activitySection}>
              <Text style={[styles.activityLabel, compact && styles.activityLabelCompact]}>✅ Best for:</Text>
              <Text style={[styles.activityText, compact && styles.activityTextCompact]} numberOfLines={1}>
                {bestForText}
              </Text>
            </View>
          </View>
        )}
        
        {/* Peak Hours (if available) */}
        {guidance.peakHours && (
          <View style={[styles.peakHoursBadge, { backgroundColor: `${statusColor}20` }, compact && styles.peakHoursBadgeCompact]}>
            <Ionicons name="time-outline" size={compact ? 12 : 14} color={statusColor} />
            <Text style={[styles.peakHoursText, { color: statusColor }, compact && styles.peakHoursTextCompact]}>
              Peak: {guidance.peakHours}
            </Text>
          </View>
        )}
        
        {showDetailsHint && (
          <View style={styles.detailsRow}>
            <Ionicons name="arrow-forward" size={12} color={DarkTheme.textTertiary} />
            <Text style={styles.detailsText}>{t('common.tapForDetails')}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={[styles.footer, compact && styles.footerCompact]}>
          <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
          <Text style={compact ? styles.footerTextCompact : styles.footerText}>
            For reflection only • Not a ruling
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  gradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  gradientCompact: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  
  // Header
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  dayBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayBadgeCompact: {
    fontSize: Typography.caption,
    opacity: 0.7,
    marginBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  titleCompact: {
    fontSize: Typography.h3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  subtitleCompact: {
    fontSize: Typography.label,
    marginTop: 1,
  },
  
  // Elements
  elementsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  elementsRowCompact: {
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  elementBadgeCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.md,
  },
  userElementBadge: {
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  elementIcon: {
    fontSize: 14,
  },
  elementLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  elementLabelCompact: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
  },
  
  // Message
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: DarkTheme.textPrimary,
    marginTop: Spacing.xs,
  },
  messageCompact: {
    fontSize: Typography.label,
    lineHeight: Typography.label * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
    marginTop: Spacing.xs,
  },
  
  // Activity
  activityRow: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  activityRowCompact: {
    gap: Spacing.xs,
  },
  activitySection: {
    gap: Spacing.xs,
  },
  activityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityLabelCompact: {
    fontSize: Typography.caption,
  },
  activityText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  activityTextCompact: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  
  // Peak Hours
  peakHoursBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  peakHoursBadgeCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.md,
  },
  peakHoursText: {
    fontSize: 11,
    fontWeight: '600',
  },
  peakHoursTextCompact: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailsText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
  },
  
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  footerCompact: {
    marginTop: Spacing.xs,
  },
  footerText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  footerTextCompact: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    opacity: 0.8,
  },
  
  // Loading
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
