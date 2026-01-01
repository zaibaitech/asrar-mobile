/**
 * Divine Timing Insights Screen
 * ==============================
 * Phase 7: Analytics and insights from check-in history
 * 
 * Features:
 * - Weekly heatmap visualization
 * - Segment analytics
 * - Intention insights
 * - Harmony trend
 * - Recommendations
 */

import { WeeklyHeatmap } from '@/components/divine-timing/WeeklyHeatmap';
import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
    getCheckInSummary,
    loadCheckIns,
    loadUserTimingProfile,
} from '@/services/CheckInStorage';
import { AsrarTimingSnapshot, buildAsrarTimingSnapshot } from '@/services/DivineTimingAsrarService';
import {
    calculateHarmonyTrend,
    getIntentionStatistics,
    getRecommendations,
    getSegmentStatistics,
} from '@/services/PeakWindowLearner';
import {
    CheckInRecord,
    SegmentAnalytics,
    TimeSegment,
} from '@/types/divine-timing-personal';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Divine Timing Insights Screen
 */
export default function DivineTimingInsightsScreen() {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<CheckInRecord[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [segmentStats, setSegmentStats] = useState<Map<TimeSegment, SegmentAnalytics>>(new Map());
  const [intentionStats, setIntentionStats] = useState<Map<string, any>>(new Map());
  const [harmonyTrend, setHarmonyTrend] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<AsrarTimingSnapshot>(() =>
    buildAsrarTimingSnapshot({
      userProfile: profile,
    })
  );
  const [selectedCell, setSelectedCell] = useState<any | null>(null);
  const segmentOrder: TimeSegment[] = useMemo(
    () => ['preDawn', 'morning', 'midday', 'afternoon', 'evening', 'night'],
    []
  );
  const trendDirection = harmonyTrend?.direction ?? 'stable';
  const trendIcon = trendDirection === 'improving' ? '📈' : trendDirection === 'declining' ? '📉' : '➡️';
  const hasTrendData = Boolean(harmonyTrend);
  const trendChangeValue = Math.abs(harmonyTrend?.changePercent ?? 0);
  const trendValueDisplay = hasTrendData ? `${trendChangeValue}%` : '—';
  
  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    setSnapshot(
      buildAsrarTimingSnapshot({
        userProfile: profile,
      })
    );
  }, [profile]);
  
  /**
   * Load all insights data
   */
  const loadInsights = async () => {
    try {
      setLoading(true);
      
      const profile = await loadUserTimingProfile();
      const allCheckins = await loadCheckIns();
      const summaryData = await getCheckInSummary();
      
      setCheckins(allCheckins);
      setSummary(summaryData);
      
      // Compute heatmap data
      const heatmap = computeHeatmapData(allCheckins);
      setHeatmapData(heatmap);
      const bestCell = heatmap.reduce<any | null>((best, cell) => {
        if (cell.count === 0) {
          return best;
        }
        if (!best) {
          return cell;
        }
        return cell.value > best.value ? cell : best;
      }, null);
      setSelectedCell(bestCell ?? heatmap.find(cell => cell.count > 0) ?? heatmap[0] ?? null);
      
      // Compute segment statistics
      const segmentStatsMap = new Map<TimeSegment, SegmentAnalytics>();
      for (const segment of segmentOrder) {
        const stats = getSegmentStatistics(allCheckins, segment);
        if (stats.count > 0) {
          segmentStatsMap.set(segment, stats as any);
        }
      }
      setSegmentStats(segmentStatsMap);
      
      // Compute intention statistics
      const intentStats = getIntentionStatistics(allCheckins);
      setIntentionStats(intentStats);
      
      // Compute harmony trend
      const trend = calculateHarmonyTrend(allCheckins, 30);
      setHarmonyTrend(trend);
      
      // Get recommendations
      const recs = getRecommendations(allCheckins, profile);
      setRecommendations(recs);
      
    } catch (error) {
      if (__DEV__) {
        console.error('[Insights] Error loading insights:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Compute heatmap data from check-ins
   */
  const computeHeatmapData = (checkins: CheckInRecord[]) => {
    const data: any[] = [];
    
    for (let day = 0; day < 7; day++) {
      for (const segment of segmentOrder) {
        // Filter check-ins for this day and segment
        const filteredCheckins = checkins.filter(c => {
          const date = new Date(c.createdAt);
          return date.getDay() === day && c.timeSegment === segment;
        });
        
        if (filteredCheckins.length > 0) {
          // Calculate average harmony score
          const totalHarmony = filteredCheckins.reduce(
            (sum, c) => sum + (c.harmonyScore || 50),
            0
          );
          const avgHarmony = totalHarmony / filteredCheckins.length;
          
          data.push({
            dayOfWeek: day,
            segment,
            value: avgHarmony,
            count: filteredCheckins.length,
          });
        } else {
          data.push({
            dayOfWeek: day,
            segment,
            value: 0,
            count: 0,
          });
        }
      }
    }
    
    return data;
  };
  
  const getDayNameKey = (dayOfWeek: number): string => {
    const mapping: Record<number, string> = {
      0: 'dailyCheckIn.days.sun.title',
      1: 'dailyCheckIn.days.moon.title',
      2: 'dailyCheckIn.days.mars.title',
      3: 'dailyCheckIn.days.mercury.title',
      4: 'dailyCheckIn.days.jupiter.title',
      5: 'dailyCheckIn.days.venus.title',
      6: 'dailyCheckIn.days.saturn.title',
    };
    return mapping[dayOfWeek] ?? mapping[0];
  };
  
  /**
   * Format segment name
   */
  const formatSegmentName = (segment: TimeSegment): string => {
    return t(`divineTimingInsights.segments.${segment}`);
  };
  
  /**
   * Format intention name
   */
  const formatIntentionName = (intention: string): string => {
    return intention.charAt(0).toUpperCase() + intention.slice(1);
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('divineTimingInsights.header.title')}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>{t('divineTimingInsights.loading.message')}</Text>
        </View>
      </View>
    );
  }
  
  if (checkins.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('divineTimingInsights.header.title')}</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>{t('divineTimingInsights.empty.title')}</Text>
          <Text style={styles.emptyText}>
            {t('divineTimingInsights.empty.subtitle')}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/daily-checkin')}
          >
            <Text style={styles.emptyButtonText}>{t('divineTimingInsights.empty.cta')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('divineTimingInsights.header.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {summary
              ? `${summary?.totalCheckins ?? 0} ${t('divineTimingInsights.metrics.checkIns')} • ${summary?.currentStreak ?? 0} ${t('divineTimingInsights.metrics.dayStreak')}`
              : t('divineTimingInsights.header.loading')}
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.disclaimerPill, { borderColor: DarkTheme.textSecondary }]}> 
          <Text style={[styles.disclaimerText, { color: DarkTheme.textSecondary }]}> 
            {t('divineTimingInsights.disclaimer')}
          </Text>
        </View>
        
        {/* Current Alignment Snapshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('divineTimingInsights.sections.currentAlignment')}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.currentAlignmentRow}>
              <View style={styles.currentAlignmentColumn}>
                <Text style={styles.currentAlignmentLabel}>{t('dailyCheckIn.labels.planetaryDay')}</Text>
                <Text style={styles.currentAlignmentValue}>{t(snapshot.day.translationKey)}</Text>
                <Text style={styles.currentAlignmentHint}>
                  {`${snapshot.day.planetArabic} • ${snapshot.day.planet}`}
                </Text>
              </View>
              <View style={styles.currentAlignmentColumn}>
                <Text style={styles.currentAlignmentLabel}>{t('dailyCheckIn.labels.cycleTone')}</Text>
                <Text style={styles.currentAlignmentValue}>{t(snapshot.cycle.stateKey)}</Text>
                <Text style={styles.currentAlignmentHint}>{t(snapshot.cycle.timingKey)}</Text>
              </View>
              <View style={styles.currentAlignmentColumn}>
                <Text style={styles.currentAlignmentLabel}>{t('dailyCheckIn.labels.harmony')}</Text>
                <Text style={styles.currentAlignmentScore}>{Math.round(snapshot.elements.alignment.alignment.harmonyScore)}</Text>
                <Text style={styles.currentAlignmentHint}>{t(snapshot.elements.alignment.qualityKey)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary?.checkinsLast7Days ?? '—'}</Text>
            <Text style={styles.statLabel}>{t('divineTimingInsights.summary.thisWeek')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {summary?.avgHarmonyScore !== undefined && summary?.avgHarmonyScore !== null
                ? Math.round(summary.avgHarmonyScore)
                : '—'}
            </Text>
            <Text style={styles.statLabel}>{t('divineTimingInsights.summary.avgHarmony')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{`${trendIcon} ${trendValueDisplay}`}</Text>
            <Text style={styles.statLabel}>{t(`divineTimingInsights.trendStates.${trendDirection}`)}</Text>
            {hasTrendData && (
              <Text style={styles.statSubLabel}>
                {t('divineTimingInsights.trendStates.change', {
                  value: trendChangeValue,
                })}
              </Text>
            )}
          </View>
        </View>
        
        {/* Weekly Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('divineTimingInsights.sections.patternMap')}</Text>
          <Text style={styles.sectionHint}>{t('divineTimingInsights.sections.patternHint')}</Text>
          <View style={styles.sectionCard}>
            <WeeklyHeatmap
              data={heatmapData}
              metric="harmony"
              onCellPress={(cell) => {
                setSelectedCell(cell);
              }}
            />
          </View>
          <View style={styles.heatmapLegendRow}>
            <Text style={styles.legendTitle}>{t('divineTimingInsights.heatmapLegend.title')}</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#3E3A36' }]} />
                <Text style={styles.legendLabel}>{t('divineTimingInsights.heatmapLegend.low')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#8B7355' }]} />
                <Text style={styles.legendLabel}>{t('divineTimingInsights.heatmapLegend.medium')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#C9A66B' }]} />
                <Text style={styles.legendLabel}>{t('divineTimingInsights.heatmapLegend.high')}</Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionCard}>
            {selectedCell ? (
              <View style={styles.patternDetail}>
                <Text style={styles.patternDetailTitle}>
                  {t('divineTimingInsights.patternDetail.title', {
                    day: t(getDayNameKey(selectedCell.dayOfWeek)),
                    segment: formatSegmentName(selectedCell.segment),
                  })}
                </Text>
                <Text style={styles.patternDetailMetric}>
                  {Math.round(selectedCell.value)} {t('divineTimingInsights.metrics.harmony')}
                </Text>
                <Text style={styles.patternDetailHint}>
                  {selectedCell.count > 0
                    ? t('divineTimingInsights.patternDetail.count', { count: selectedCell.count })
                    : t('divineTimingInsights.patternDetail.empty')}
                </Text>
              </View>
            ) : (
              <Text style={styles.patternDetailHint}>
                {t('divineTimingInsights.patternDetail.placeholder')}
              </Text>
            )}
          </View>
        </View>
        
        {/* Segment Analytics */}
        {segmentStats.size > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('divineTimingInsights.sections.segments')}</Text>
            {Array.from(segmentStats.entries()).map(([segment, stats]) => (
              <View key={segment} style={styles.segmentCard}>
                <View style={styles.segmentHeader}>
                  <Text style={styles.segmentName}>
                    {formatSegmentName(segment)}
                  </Text>
                  <Text style={styles.segmentHarmony}>
                    {Math.round(stats.avgHarmony)}
                  </Text>
                </View>
                <View style={styles.segmentStats}>
                  <Text style={styles.segmentStat}>
                    {t('divineTimingInsights.segmentStats.checkins', { count: stats.checkinCount })}
                  </Text>
                  <Text style={styles.segmentStat}>
                    {t('divineTimingInsights.segmentStats.success', { value: Math.round(stats.successRate) })}
                  </Text>
                  <Text style={styles.segmentStat}>
                    {t('divineTimingInsights.segmentStats.energy', { value: Math.round(stats.avgEnergy) })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Intention Insights */}
        {intentionStats.size > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('divineTimingInsights.sections.intentions')}</Text>
            {Array.from(intentionStats.entries())
              .sort(([, a], [, b]) => b.successRate - a.successRate)
              .slice(0, 3)
              .map(([intention, stats]) => (
                <View key={intention} style={styles.intentionCard}>
                  <View style={styles.intentionHeader}>
                    <Text style={styles.intentionName}>
                      {formatIntentionName(intention)}
                    </Text>
                    <Text style={styles.intentionSuccess}>
                      {Math.round(stats.successRate)}%
                    </Text>
                  </View>
                  <Text style={styles.intentionDetail}>
                    {t('divineTimingInsights.intentions.summary', {
                      count: stats.count,
                      segments: stats.bestSegments
                        .map((s: TimeSegment) => formatSegmentName(s))
                        .join(', '),
                    })}
                  </Text>
                </View>
              ))}
          </View>
        )}
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('divineTimingInsights.sections.recommendations')}</Text>
            <View style={styles.sectionCard}>
              {recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationRow}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: DarkTheme.cardBackground,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#8B7355",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  disclaimerPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  disclaimerText: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: "#8B7355",
  },
  statLabel: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  sectionHint: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  sectionCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  heatmapLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  legendTitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  legendItems: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  currentAlignmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  currentAlignmentColumn: {
    minWidth: '28%',
    flexGrow: 1,
    gap: 4,
  },
  currentAlignmentLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: DarkTheme.textSecondary,
  },
  currentAlignmentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  currentAlignmentHint: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  currentAlignmentScore: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B7355',
  },
  segmentCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 8,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  segmentHarmony: {
    fontSize: 20,
    fontWeight: '700',
    color: "#8B7355",
  },
  segmentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  segmentStat: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  intentionCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 6,
    marginBottom: 8,
  },
  intentionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intentionName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  intentionSuccess: {
    fontSize: 18,
    fontWeight: '700',
    color: "#10b981",
  },
  intentionDetail: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: "#8B7355",
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: DarkTheme.textPrimary,
    lineHeight: 20,
  },
  patternDetail: {
    gap: 6,
  },
  patternDetailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  patternDetailMetric: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B7355',
  },
  patternDetailHint: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
});
