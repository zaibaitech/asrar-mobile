/**
 * Moment Alignment Detail Screen
 * ================================
 * Expanded explanation of current moment alignment status.
 * Shows why the alignment status was chosen and provides non-prescriptive guidance.
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { MomentAlignment, getMomentAlignment } from '@/services/MomentAlignmentService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MomentAlignmentDetailScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  
  const [alignment, setAlignment] = useState<MomentAlignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const loadAlignment = useCallback(async () => {
    setLoading(true);
    const result = await getMomentAlignment(profile);
    setAlignment(result);
    setLoading(false);
  }, [profile]);
  
  useEffect(() => {
    loadAlignment();
  }, [loadAlignment]);
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACT':
        return '#10b981';
      case 'MAINTAIN':
        return '#8B7355';
      case 'HOLD':
        return '#64748b';
      default:
        return '#64B5F6';
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
  
  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const getGuidanceLists = (status?: string, zahir?: string, hour?: string) => {
    const key = status?.toLowerCase();
    return {
      bestNow: [
        t(`momentDetail.guidance.${key}.best1`),
        t(`momentDetail.guidance.${key}.best2`),
        t(`momentDetail.guidance.${key}.best3`),
      ].filter(Boolean),
      avoidNow: [
        t(`momentDetail.guidance.${key}.avoid1`),
        t(`momentDetail.guidance.${key}.avoid2`),
      ].filter(Boolean),
    };
  };
  
  const formatTimeUntil = (targetDate: Date) => {
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return t('momentDetail.timeline.hours', { count: diffHours });
    }
    return t('momentDetail.timeline.minutes', { count: diffMinutes });
  };
  
  const formatWindowDay = (window: any) => {
    const now = new Date();
    const windowDate = new Date(window.startTime);
    const hoursAway = Math.floor((windowDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursAway === 0) {
      return t('momentDetail.timeline.today'); // Current hour
    }
    if (hoursAway === 1) {
      return t('momentDetail.timeline.in') + ' 1h';
    }
    if (hoursAway < 24) {
      return t('momentDetail.timeline.in') + ` ${hoursAway}h`;
    }
    
    const daysAway = Math.floor(hoursAway / 24);
    return t('momentDetail.timeline.daysAway', { count: daysAway });
  };
  
  const formatPlanetaryHour = (window: any) => {
    // Format as "Planet (Element)" e.g. "Sun (Fire)"
    return `${window.planet} (${window.element})`;
  };
  
  const getReasonBullets = (status?: string) => {
    const key = status?.toLowerCase();
    return [
      t(`momentDetail.reasons.${key}.bullet1`),
      t(`momentDetail.reasons.${key}.bullet2`),
      t(`momentDetail.reasons.${key}.bullet3`),
    ].filter(Boolean);
  };
  
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!alignment) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('momentDetail.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyTitle}>{t('momentDetail.noName')}</Text>
          <Text style={styles.emptyMessage}>{t('momentDetail.addNameMessage')}</Text>
          
          <TouchableOpacity
            style={styles.addNameButton}
            onPress={() => router.push('/(tabs)/name-destiny')}
            activeOpacity={0.7}
          >
            <Text style={styles.addNameButtonText}>{t('momentDetail.goToNameDestiny')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const statusColor = getStatusColor(alignment.status);
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('momentDetail.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Status Row */}
        <View style={styles.statusRow}>
          <View style={styles.statusMain}>
            <View style={[styles.statusPill, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
              <Text style={[styles.statusPillText, { color: statusColor }]}>
                {t(alignment.shortLabelKey)}
              </Text>
            </View>
            <Text style={styles.statusHintText}>{t(alignment.shortHintKey)}</Text>
          </View>
          <View style={styles.statusTimestamp}>
            <Text style={styles.timestampLabel}>{t('momentDetail.updated')}</Text>
            <Text style={styles.timestampValue}>{formatTime()}</Text>
          </View>
        </View>
        
        {/* System Equation */}
        <View style={styles.equationRow}>
          <View style={styles.equationChip}>
            <Text style={styles.equationChipText}>
              {t('momentDetail.equation.zahir')} ({getElementLabel(alignment.zahirElement)})
            </Text>
          </View>
          <Text style={styles.equationOperator}>×</Text>
          <View style={styles.equationChip}>
            <Text style={styles.equationChipText}>
              {t('momentDetail.equation.hour')} ({getElementLabel(alignment.timeElement)})
            </Text>
          </View>
          <Text style={styles.equationOperator}>→</Text>
          <View style={[styles.equationChip, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
            <Text style={[styles.equationChipText, { color: statusColor }]}>
              {t(alignment.shortLabelKey)}
            </Text>
          </View>
        </View>
        
        {/* Current Window End Time */}
        {alignment.currentWindowEnd && (
          <View style={styles.windowInfo}>
            <Ionicons name="time-outline" size={16} color={DarkTheme.textTertiary} />
            <Text style={styles.windowInfoText}>
              {t('momentDetail.timeline.windowEnds')} {t('momentDetail.timeline.in')} {formatTimeUntil(alignment.currentWindowEnd)}
            </Text>
          </View>
        )}
        
        {/* Timeline Toggle Button */}
        {alignment.nextWindows && alignment.nextWindows.length > 0 && (
          <TouchableOpacity
            style={styles.timelineButton}
            onPress={() => setShowTimeline(!showTimeline)}
          >
            <Ionicons 
              name={showTimeline ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={DarkTheme.textSecondary} 
            />
            <Text style={styles.timelineButtonText}>
              {showTimeline ? t('momentDetail.timeline.hideTimeline') : t('momentDetail.timeline.showTimeline')}
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Timeline View */}
        {showTimeline && alignment.nextWindows && alignment.nextWindows.length > 0 && (
          <View style={styles.timeline}>
            <Text style={styles.timelineTitle}>{t('momentDetail.timeline.nextOptimal')}</Text>
            {alignment.nextWindows
              .filter(window => window.status === 'ACT' || window.status === 'MAINTAIN')
              .slice(0, 8) // Show more hours since they're hourly
              .map((window, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={[
                    styles.timelineStatus,
                    { backgroundColor: window.status === 'ACT' ? '#10b981' : '#8B7355' }
                  ]}>
                    <Text style={styles.timelineStatusText}>
                      {t(window.status === 'ACT' ? 'home.moment.status.act' : 'home.moment.status.maintain')}
                    </Text>
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineDay}>{formatWindowDay(window)}</Text>
                      <Text style={styles.timelineDayName}>{window.planet}</Text>
                    </View>
                    <View style={styles.timelineElement}>
                      <Text style={styles.timelineElementIcon}>{getElementIcon(window.element)}</Text>
                      <Text style={styles.timelineElementText}>{getElementLabel(window.element)}</Text>
                    </View>
                    <Text style={styles.timelineTime}>
                      {new Date(window.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              ))}
            {alignment.nextWindows.filter(w => w.status === 'ACT' || w.status === 'MAINTAIN').length === 0 && (
              <Text style={styles.noWindows}>{t('momentDetail.timeline.noOptimalWindows')}</Text>
            )}
          </View>
        )}
        
        {/* Elements Grid */}
        {/* Element Cards Row */}
        <View style={styles.elementsGrid}>
          {/* Your Element */}
          <View style={styles.elementCard}>
            <Text style={styles.elementCardLabel}>{t('momentDetail.zahirOutward')}</Text>
            <View style={styles.elementDisplay}>
              <Text style={styles.elementIcon}>{getElementIcon(alignment.zahirElement)}</Text>
              <Text style={styles.elementName}>{getElementLabel(alignment.zahirElement)}</Text>
            </View>
            <Text style={styles.elementDescription}>
              {t(`momentDetail.zahirShort.${alignment.zahirElement}`)}
            </Text>
          </View>
          
          {/* Time Element */}
          <View style={styles.elementCard}>
            <Text style={styles.elementCardLabel}>{t('momentDetail.hourQuality')}</Text>
            <View style={styles.elementDisplay}>
              <Text style={styles.elementIcon}>{getElementIcon(alignment.timeElement)}</Text>
              <Text style={styles.elementName}>{getElementLabel(alignment.timeElement)}</Text>
            </View>
            <Text style={styles.elementDescription}>
              {t(`momentDetail.timeShort.${alignment.timeElement}`)}
            </Text>
          </View>
        </View>
        
        {/* Why This Status - Bullet Points */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#8B7355" />
            <Text style={styles.sectionTitle}>{t('momentDetail.whyThisStatus')}</Text>
          </View>
          {getReasonBullets(alignment.status).map((bullet, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
        
        {/* Guidance Lists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={20} color="#8B7355" />
            <Text style={styles.sectionTitle}>{t('momentDetail.guidanceTitle')}</Text>
          </View>
          
          {/* Best Now */}
          <View style={styles.guidanceBlock}>
            <Text style={styles.guidanceListTitle}>{t('momentDetail.bestNow')}</Text>
            {getGuidanceLists(alignment.status, alignment.zahirElement, alignment.timeElement).bestNow.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: '#10b981' }]}>✓</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          
          {/* Avoid Now */}
          <View style={styles.guidanceBlock}>
            <Text style={styles.guidanceListTitle}>{t('momentDetail.avoidNow')}</Text>
            {getGuidanceLists(alignment.status, alignment.zahirElement, alignment.timeElement).avoidNow.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: '#94a3b8' }]}>○</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={16} color={DarkTheme.textTertiary} />
          <Text style={styles.disclaimerText}>{t('momentDetail.disclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  addNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#8B7355',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  addNameButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  
  // Compact Status Row
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  statusMain: {
    flex: 1,
    gap: Spacing.xs,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statusHintText: {
    fontSize: 13,
    lineHeight: 18,
    color: DarkTheme.textSecondary,
  },
  statusTimestamp: {
    alignItems: 'flex-end',
    gap: 2,
  },
  timestampLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestampValue: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  
  // System Equation
  equationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: Spacing.sm,
  },
  equationChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  equationChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  equationOperator: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
  },
  
  // Elements Grid
  elementsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  elementCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: Spacing.sm,
  },
  elementCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  elementDisplay: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  elementIcon: {
    fontSize: 32,
  },
  elementName: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  elementDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  
  // Section
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  
  // Bullets
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  bulletDot: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B7355',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  
  // Guidance Lists
  guidanceBlock: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  guidanceListTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  
  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
  },
  
  // Window Info
  windowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  windowInfoText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  
  // Timeline
  timelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  timeline: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  timelineStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  timelineContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineDay: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  timelineDayName: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  timelineElement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timelineElementIcon: {
    fontSize: 16,
  },
  timelineElementText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  timelineTime: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: '500',
  },
  noWindows: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
    fontStyle: 'italic',
  },
});
