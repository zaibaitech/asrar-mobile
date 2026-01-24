/**
 * Moment Alignment Detail Screen
 * ================================
 * Expanded explanation of current moment alignment status.
 * Shows why the alignment status was chosen and provides non-prescriptive guidance.
 * 
 * FREE: User element, Moment element, Alignment state, Short neutral explanation
 * PREMIUM: What actions are favored now, What to avoid, Suggested dhikr, Deeper guidance
 */

import { PremiumSection } from '@/components/subscription/PremiumSection';
import { TimingAnalysisSection } from '@/components/timing';
import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
  BADGE_CONFIG,
  getBadgeFromScore,
  type AsrariyaTimingResult,
  type UnifiedBadge,
} from '@/services/AsrariyaTimingEngine';
import { getAlignmentStatusForElements, getMomentAlignment, MomentAlignment } from '@/services/MomentAlignmentService';
import { calculatePlanetaryHours, getPlanetaryDayBoundariesForNow, type PlanetaryDayBoundaries, PlanetaryHourData } from '@/services/PlanetaryHoursService';
import { fetchPrayerTimes } from '@/services/api/prayerTimes';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [planetaryData, setPlanetaryData] = useState<PlanetaryHourData | null>(null);
  const [prayerTimesData, setPrayerTimesData] = useState<any>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [planetaryBoundaries, setPlanetaryBoundaries] = useState<PlanetaryDayBoundaries | null>(null);
  const [now, setNow] = useState(new Date());
  const [minuteNow, setMinuteNow] = useState(new Date());
  const alignmentInFlightRef = useRef(false);
  
  // Unified timing state - this is the single source of truth for badges
  const [timingResult, setTimingResult] = useState<AsrariyaTimingResult | null>(null);
  
  // Get unified badge from timing analysis (single source of truth)
  const unifiedBadge: UnifiedBadge = timingResult 
    ? getBadgeFromScore(timingResult.overallScore) 
    : 'MAINTAIN';
  const badgeConfig = BADGE_CONFIG[unifiedBadge];

  const loadAlignment = useCallback(async (options?: { silent?: boolean }) => {
    if (alignmentInFlightRef.current) return;
    alignmentInFlightRef.current = true;
    const shouldShowLoading = !options?.silent && !alignment;
    if (shouldShowLoading) {
      setLoading(true);
    }
    try {
      const result = await getMomentAlignment(
        profile,
        new Date(),
        coords ? { location: coords } : undefined
      );
      setAlignment(result);
    } finally {
      alignmentInFlightRef.current = false;
      if (shouldShowLoading) {
        setLoading(false);
      }
    }
  }, [profile, coords, alignment]);

  const loadPrayerTimes = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });
        const data = await fetchPrayerTimes(latitude, longitude);
        setPrayerTimesData(data);
      }
    } catch (error) {
      console.error('Error loading prayer times:', error);
    }
  }, []);

  useEffect(() => {
    loadAlignment();
    loadPrayerTimes();
  }, [loadAlignment, loadPrayerTimes]);

  useEffect(() => {
    void loadAlignment({ silent: true });
  }, [minuteNow, loadAlignment]);

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    (async () => {
      const boundaries = await getPlanetaryDayBoundariesForNow(coords, { now: minuteNow });
      if (!cancelled) setPlanetaryBoundaries(boundaries);
    })();
    return () => {
      cancelled = true;
    };
  }, [coords, minuteNow]);

  useEffect(() => {
    if (!planetaryBoundaries) return;
    try {
      const planetary = calculatePlanetaryHours(
        planetaryBoundaries.sunrise,
        planetaryBoundaries.sunset,
        planetaryBoundaries.nextSunrise,
        now
      );
      setPlanetaryData(planetary);
    } catch (error) {
      console.error('Error calculating planetary hours:', error);
    }
  }, [planetaryBoundaries, now]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinuteNow(new Date());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Use unified badge color when timing result available, otherwise fallback to old logic
  const getStatusColor = (status?: string) => {
    // Prefer unified badge color from timing analysis
    if (timingResult) {
      return badgeConfig.color;
    }
    // Fallback for old system (only used before timing loads)
    switch (status) {
      case 'ACT':
        return '#10b981';
      case 'MAINTAIN':
        return '#f59e0b'; // Changed from brown to amber
      case 'HOLD':
        return '#7C3AED'; // Changed from gray to purple
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
    const current = new Date();
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getGuidanceLists = (status?: string) => {
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
    const diffMs = targetDate.getTime() - new Date().getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return t('momentDetail.timeline.hours', { count: diffHours });
    }
    return t('momentDetail.timeline.minutes', { count: diffMinutes });
  };

  const formatWindowDay = (window: any) => {
    const windowDate = new Date(window.startTime);
    const hoursAway = Math.floor((windowDate.getTime() - new Date().getTime()) / (1000 * 60 * 60));

    if (hoursAway === 0) return t('momentDetail.timeline.today');
    if (hoursAway === 1) return `${t('momentDetail.timeline.in')} 1h`;
    if (hoursAway < 24) return `${t('momentDetail.timeline.in')} ${hoursAway}h`;

    const daysAway = Math.floor(hoursAway / 24);
    return t('momentDetail.timeline.daysAway', { count: daysAway });
  };

  const getReasonBullets = (status?: string) => {
    const key = status?.toLowerCase();
    return [
      t(`momentDetail.reasons.${key}.bullet1`),
      t(`momentDetail.reasons.${key}.bullet2`),
      t(`momentDetail.reasons.${key}.bullet3`),
    ].filter(Boolean);
  };

  const currentHourProgress = useMemo(() => {
    if (!planetaryData) return null;
    const start = planetaryData.currentHour.startTime.getTime();
    const end = planetaryData.currentHour.endTime.getTime();
    const total = Math.max(1, end - start);
    const remaining = Math.max(0, end - now.getTime());
    const percent = Math.min(100, Math.max(0, 100 - (remaining / total) * 100));
    return {
      percent,
      remainingLabel: formatTimeUntil(planetaryData.currentHour.endTime),
    };
  }, [planetaryData, now]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}
        >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!alignment) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}
        >
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}
      >
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
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryIcon, { backgroundColor: `${statusColor}20` }]}
              >
              <Ionicons name="sparkles" size={18} color={statusColor} />
            </View>
            <View style={styles.summaryHeaderText}>
              <Text style={styles.summaryTitle}>{t('momentDetail.title')}</Text>
              {/* Show unified description based on timing analysis when available */}
              <Text style={styles.summarySubtitle}>
                {timingResult 
                  ? t(`timing.badges.${unifiedBadge.toLowerCase()}.hint`) || timingResult.shortSummary
                  : t(alignment.shortHintKey)}
              </Text>
            </View>
            {/* Unified badge - single source of truth */}
            <View style={[styles.statusPill, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}
              >
              <Text style={[styles.statusPillText, { color: statusColor }]}
                >
                {timingResult 
                  ? `${badgeConfig.icon} ${unifiedBadge}`
                  : t(alignment.shortLabelKey)}
              </Text>
            </View>
          </View>

          {/* Show score when timing analysis is available */}
          {timingResult && (
            <View style={styles.scoreDisplay}>
              <Text style={[styles.scoreText, { color: statusColor }]}>
                {timingResult.overallScore}%
              </Text>
              <Text style={styles.scoreLabel}>
                {t('timing.compatible') || 'Compatible'}
              </Text>
            </View>
          )}

          <View style={styles.summaryMetaRow}>
            <Text style={styles.timestampLabel}>{t('momentDetail.updated')}</Text>
            <Text style={styles.timestampValue}>{formatTime()}</Text>
          </View>

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
            <View style={[styles.equationChip, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}
              >
              <Text style={[styles.equationChipText, { color: statusColor }]}
                >
                {/* Use unified badge when timing available */}
                {timingResult ? unifiedBadge : t(alignment.shortLabelKey)}
              </Text>
            </View>
          </View>

          {alignment.currentWindowEnd && (
            <View style={styles.windowInfo}>
              <Ionicons name="time-outline" size={16} color={DarkTheme.textTertiary} />
              <Text style={styles.windowInfoText}>
                {t('momentDetail.timeline.windowEnds')} {t('momentDetail.timeline.in')} {formatTimeUntil(alignment.currentWindowEnd)}
              </Text>
            </View>
          )}

          {planetaryData && planetaryData.countdownSeconds > 0 && planetaryData.countdownSeconds <= 10 * 60 && (
            <View style={[styles.windowInfo, { marginTop: 6 }]}
              >
              <Ionicons name="alert-circle-outline" size={16} color={DarkTheme.textTertiary} />
              <Text style={styles.windowInfoText}>
                {t('home.nextPlanetHour')}: {t(`planets.${planetaryData.nextHour.planet.toLowerCase()}`)} ({getElementLabel(planetaryData.nextHour.planetInfo.element)}) {t('momentDetail.timeline.in')} {formatTimeUntil(planetaryData.currentHour.endTime)} • {t(
                  (() => {
                    const status = getAlignmentStatusForElements(alignment.zahirElement, planetaryData.nextHour.planetInfo.element);
                    if (status === 'ACT') return 'home.moment.status.act';
                    if (status === 'MAINTAIN') return 'home.moment.status.maintain';
                    return 'home.moment.status.hold';
                  })()
                )}
              </Text>
            </View>
          )}
        </View>

        {alignment.nextWindows && alignment.nextWindows.length > 0 && (
          <TouchableOpacity
            style={styles.timelineButton}
            onPress={() => setShowTimeline(!showTimeline)}
          >
            <Ionicons
              name={showTimeline ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={DarkTheme.textSecondary}
            />
            <Text style={styles.timelineButtonText}>
              {showTimeline ? t('momentDetail.timeline.hideTimeline') : t('momentDetail.timeline.showTimeline')}
            </Text>
          </TouchableOpacity>
        )}

        {showTimeline && alignment.nextWindows && alignment.nextWindows.length > 0 && (
          <View style={styles.timeline}>
            <Text style={styles.timelineTitle}>{t('momentDetail.timeline.nextOptimal')}</Text>
            {alignment.nextWindows
              .filter((window) => window.status === 'ACT' || window.status === 'MAINTAIN')
              .slice(0, 8)
              .map((window, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineStatus,
                      { backgroundColor: window.status === 'ACT' ? '#10b981' : '#8B7355' },
                    ]}
                  >
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
            {alignment.nextWindows.filter((w) => w.status === 'ACT' || w.status === 'MAINTAIN').length === 0 && (
              <Text style={styles.noWindows}>{t('momentDetail.timeline.noOptimalWindows')}</Text>
            )}
          </View>
        )}

        <View style={styles.elementsGrid}>
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

        {/* Asrariya Timing Analysis - Personalized */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="analytics-outline" size={20} color="#8B7355" />
            <Text style={styles.sectionTitle}>{t('asrariya.timingAnalysis') || 'Timing Analysis For You'}</Text>
          </View>
          <TimingAnalysisSection
            context="moment"
            location={coords ?? undefined}
            compact
            onAnalysisComplete={setTimingResult}
          />
        </View>

        {planetaryData && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="planet-outline" size={20} color="#8B7355" />
              <Text style={styles.sectionTitle}>{t('planetaryHours.title')}</Text>
            </View>

            <View style={styles.planetaryHourCard}>
              <View style={styles.planetaryHourHeader}>
                <Text style={styles.planetaryHourLabel}>{t('planetaryHours.currentHour')}</Text>
                <View style={[styles.hourBadge, { backgroundColor: 'rgba(139, 115, 85, 0.15)' }]}>
                  <Text style={[styles.hourBadgeText, { color: '#8B7355' }]}>
                    Hour #{planetaryData.currentHour.hourNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.planetaryHourContent}>
                <Text style={styles.planetSymbol}>{planetaryData.currentHour.planetInfo.symbol}</Text>
                <View style={styles.planetInfo}>
                  <Text style={styles.planetName}>{planetaryData.currentHour.planet}</Text>
                  <Text style={styles.planetArabic}>{planetaryData.currentHour.planetInfo.arabicName}</Text>
                  <View style={[styles.elementBadge, { backgroundColor: 'rgba(139, 115, 85, 0.1)' }]}
                    >
                    <Text style={[styles.elementBadgeText, { color: '#8B7355' }]}
                      >
                      {getElementIcon(planetaryData.currentHour.planetInfo.element)} {getElementLabel(planetaryData.currentHour.planetInfo.element)}
                    </Text>
                  </View>
                </View>
              </View>
              {currentHourProgress && (
                <View style={styles.progressBlock}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{t('momentDetail.timeline.windowEnds')}</Text>
                    <Text style={styles.progressValue}>
                      {t('momentDetail.timeline.in')} {currentHourProgress.remainingLabel}
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${currentHourProgress.percent}%` }]} />
                  </View>
                </View>
              )}
              <View style={styles.timeRange}>
                <Ionicons name="time-outline" size={14} color={DarkTheme.textTertiary} />
                <Text style={styles.timeRangeText}>
                  {planetaryData.currentHour.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {planetaryData.currentHour.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>

            <View style={[styles.planetaryHourCard, { backgroundColor: 'rgba(255, 255, 255, 0.02)' }]}
              >
              <View style={styles.planetaryHourHeader}>
                <Text style={styles.planetaryHourLabel}>{t('home.nextPlanetHour')}</Text>
                <View style={[styles.hourBadge, { backgroundColor: 'rgba(100, 181, 246, 0.15)' }]}
                  >
                  <Text style={[styles.hourBadgeText, { color: '#64B5F6' }]}
                    >
                    Hour #{planetaryData.nextHour.hourNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.planetaryHourContent}>
                <Text style={styles.planetSymbol}>{planetaryData.nextHour.planetInfo.symbol}</Text>
                <View style={styles.planetInfo}>
                  <Text style={styles.planetName}>{planetaryData.nextHour.planet}</Text>
                  <Text style={styles.planetArabic}>{planetaryData.nextHour.planetInfo.arabicName}</Text>
                  <View style={[styles.elementBadge, { backgroundColor: 'rgba(100, 181, 246, 0.1)' }]}
                    >
                    <Text style={[styles.elementBadgeText, { color: '#64B5F6' }]}
                      >
                      {getElementIcon(planetaryData.nextHour.planetInfo.element)} {getElementLabel(planetaryData.nextHour.planetInfo.element)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.timeRange}>
                <Ionicons name="time-outline" size={14} color={DarkTheme.textTertiary} />
                <Text style={styles.timeRangeText}>
                  {t('home.startsAt')} {planetaryData.nextHour.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>

            {planetaryData.afterNextHour && (
              <View style={[styles.planetaryHourCard, { backgroundColor: 'rgba(255, 255, 255, 0.015)' }]}
                >
                <View style={styles.planetaryHourHeader}>
                  <Text style={styles.planetaryHourLabel}>Hour After Next</Text>
                  <View style={[styles.hourBadge, { backgroundColor: 'rgba(148, 163, 184, 0.15)' }]}
                    >
                    <Text style={[styles.hourBadgeText, { color: '#94a3b8' }]}
                      >
                      Hour #{planetaryData.afterNextHour.hourNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.planetaryHourContent}>
                  <Text style={styles.planetSymbol}>{planetaryData.afterNextHour.planetInfo.symbol}</Text>
                  <View style={styles.planetInfo}>
                    <Text style={styles.planetName}>{planetaryData.afterNextHour.planet}</Text>
                    <Text style={styles.planetArabic}>{planetaryData.afterNextHour.planetInfo.arabicName}</Text>
                    <View style={[styles.elementBadge, { backgroundColor: 'rgba(148, 163, 184, 0.1)' }]}
                      >
                      <Text style={[styles.elementBadgeText, { color: '#94a3b8' }]}
                        >
                        {getElementIcon(planetaryData.afterNextHour.planetInfo.element)} {getElementLabel(planetaryData.afterNextHour.planetInfo.element)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.timeRange}>
                  <Ionicons name="time-outline" size={14} color={DarkTheme.textTertiary} />
                  <Text style={styles.timeRangeText}>
                    {t('home.startsAt')} {planetaryData.afterNextHour.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#8B7355" />
            <Text style={styles.sectionTitle}>{t('momentDetail.whyThisStatus')}</Text>
          </View>
          <View style={styles.sectionCard}>
            {getReasonBullets(alignment.status).map((bullet, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PREMIUM: Personal Guidance Section */}
        <PremiumSection
          featureId="personalGuidance"
          title={t('premiumSections.personalGuidance.title')}
          description={t('premiumSections.personalGuidance.description')}
          icon="💡"
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={20} color="#8B7355" />
              <Text style={styles.sectionTitle}>{t('momentDetail.guidanceTitle')}</Text>
            </View>

            <View style={[styles.guidanceBlock, styles.guidanceBest]}>
              <Text style={styles.guidanceListTitle}>{t('momentDetail.bestNow')}</Text>
              {getGuidanceLists(alignment.status).bestNow.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: '#10b981' }]}>✓</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.guidanceBlock, styles.guidanceAvoid]}>
              <Text style={styles.guidanceListTitle}>{t('momentDetail.avoidNow')}</Text>
              {getGuidanceLists(alignment.status).avoidNow.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: '#94a3b8' }]}>○</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </PremiumSection>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  summarySubtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  summaryMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  timestampLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestampValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
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
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  equationOperator: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
  },
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
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
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
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  timelineDayName: {
    fontSize: 12,
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
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  timelineTime: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: '500',
  },
  noWindows: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
    fontStyle: 'italic',
  },
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
    fontSize: 12,
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
    fontSize: 13,
    lineHeight: 18,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
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
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  sectionCard: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  bulletDot: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B7355',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  guidanceBlock: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  guidanceBest: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  guidanceAvoid: {
    borderColor: 'rgba(148, 163, 184, 0.3)',
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },
  guidanceListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
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
    fontSize: 12,
    color: DarkTheme.textTertiary,
    lineHeight: 18,
  },
  planetaryHourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  planetaryHourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planetaryHourLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hourBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  hourBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planetaryHourContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  planetSymbol: {
    fontSize: 48,
  },
  planetInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  planetName: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  planetArabic: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  elementBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
  },
  timeRangeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  progressBlock: {
    marginTop: Spacing.sm,
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8B7355',
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
    fontSize: 13,
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
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  timelineDayName: {
    fontSize: 12,
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
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  timelineTime: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: '500',
  },
  noWindows: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
    fontStyle: 'italic',
  },
  
  // Planetary Hours
  planetaryHourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressBlock: {
    marginTop: Spacing.sm,
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8B7355',
  },
  planetaryHourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planetaryHourLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hourBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  hourBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planetaryHourContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  planetSymbol: {
    fontSize: 48,
  },
  planetInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  planetName: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  planetArabic: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  elementBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
  },
  timeRangeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  countdown: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
});
