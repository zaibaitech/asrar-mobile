/**
 * Real-Time Daily Guidance Card
 * ==============================
 * Shows current day's spiritual timing guidance
 * Always displays real-time data (not dependent on check-ins)
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { DailyGuidance } from '@/services/DailyGuidanceService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RealTimeDailyGuidanceProps {
  guidance: DailyGuidance | null;
  loading?: boolean;
}

export function RealTimeDailyGuidance({ guidance, loading }: RealTimeDailyGuidanceProps) {
  const router = useRouter();
  
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
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/daily-checkin')}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[`${statusColor}15`, `${statusColor}05`]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="compass-outline" size={28} color={statusColor} />
            <View>
              <Text style={styles.title}>Daily Guidance</Text>
              <Text style={[styles.subtitle, { color: statusColor }]}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Elements Display */}
        <View style={styles.elementsRow}>
          <View style={styles.elementBadge}>
            <Text style={styles.elementIcon}>{getElementIcon(guidance.dayElement)}</Text>
            <Text style={styles.elementLabel}>
              {getElementLabel(guidance.dayElement)} Energy Today
            </Text>
          </View>
          
          {guidance.userElement && (
            <View style={[styles.elementBadge, styles.userElementBadge]}>
              <Text style={styles.elementIcon}>{getElementIcon(guidance.userElement)}</Text>
              <Text style={styles.elementLabel}>
                Your {getElementLabel(guidance.userElement)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Message */}
        <Text style={styles.message} numberOfLines={3}>
          {guidance.message}
        </Text>
        
        {/* Best For / Avoid */}
        {guidance.bestFor.length > 0 && (
          <View style={styles.activityRow}>
            <View style={styles.activitySection}>
              <Text style={styles.activityLabel}>✅ Best for:</Text>
              <Text style={styles.activityText} numberOfLines={1}>
                {guidance.bestFor.slice(0, 2).join(', ')}
              </Text>
            </View>
          </View>
        )}
        
        {/* Peak Hours (if available) */}
        {guidance.peakHours && (
          <View style={[styles.peakHoursBadge, { backgroundColor: `${statusColor}20` }]}>
            <Ionicons name="time-outline" size={14} color={statusColor} />
            <Text style={[styles.peakHoursText, { color: statusColor }]}>
              Peak: {guidance.peakHours}
            </Text>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={14} color={DarkTheme.textTertiary} />
          <Text style={styles.footerText}>
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
    padding: 20,
    gap: 14,
  },
  
  // Header
  header: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Elements
  elementsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
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
  
  // Message
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: DarkTheme.textPrimary,
  },
  
  // Activity
  activityRow: {
    gap: 8,
  },
  activitySection: {
    gap: 4,
  },
  activityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
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
  peakHoursText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  footerText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  
  // Loading
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
