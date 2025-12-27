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
import {
    getCheckInSummary,
    loadCheckIns,
    loadUserTimingProfile,
} from '@/services/CheckInStorage';
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
import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<CheckInRecord[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [segmentStats, setSegmentStats] = useState<Map<TimeSegment, SegmentAnalytics>>(new Map());
  const [intentionStats, setIntentionStats] = useState<Map<string, any>>(new Map());
  const [harmonyTrend, setHarmonyTrend] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  
  useEffect(() => {
    loadInsights();
  }, []);
  
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
      
      // Compute segment statistics
      const segments: TimeSegment[] = [
        'preDawn',
        'morning',
        'midday',
        'afternoon',
        'evening',
        'night',
      ];
      
      const segmentStatsMap = new Map<TimeSegment, SegmentAnalytics>();
      for (const segment of segments) {
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
      const segments: TimeSegment[] = [
        'preDawn',
        'morning',
        'midday',
        'afternoon',
        'evening',
        'night',
      ];
      
      for (const segment of segments) {
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
  
  /**
   * Format segment name
   */
  const formatSegmentName = (segment: TimeSegment): string => {
    const names: Record<TimeSegment, string> = {
      preDawn: 'Pre-Dawn',
      morning: 'Morning',
      midday: 'Midday',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night',
    };
    return names[segment];
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
            <Text style={styles.headerTitle}>Insights</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>Analyzing your patterns...</Text>
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
            <Text style={styles.headerTitle}>Insights</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptyText}>
            Check in daily to build your personalized insights
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/daily-checkin')}
          >
            <Text style={styles.emptyButtonText}>Start Check-In</Text>
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
          <Text style={styles.headerTitle}>Your Insights</Text>
          <Text style={styles.headerSubtitle}>
            {summary?.totalCheckins} check-ins • {summary?.currentStreak} day streak
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary?.checkinsLast7Days || 0}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary?.avgHarmonyScore || 0}</Text>
            <Text style={styles.statLabel}>Avg Harmony</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {harmonyTrend?.direction === 'improving' ? '📈' : 
               harmonyTrend?.direction === 'declining' ? '📉' : '➡️'}
            </Text>
            <Text style={styles.statLabel}>Trend</Text>
          </View>
        </View>
        
        {/* Weekly Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Weekly Pattern</Text>
          <View style={styles.sectionCard}>
            <WeeklyHeatmap
              data={heatmapData}
              metric="harmony"
              onCellPress={(cell) => {
                // Could show detail modal
                if (__DEV__) {
                  console.log('Cell pressed:', cell);
                }
              }}
            />
          </View>
        </View>
        
        {/* Segment Analytics */}
        {segmentStats.size > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Time Segments</Text>
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
                    {stats.checkinCount} check-ins
                  </Text>
                  <Text style={styles.segmentStat}>
                    {Math.round(stats.successRate)}% success
                  </Text>
                  <Text style={styles.segmentStat}>
                    {Math.round(stats.avgEnergy)}% energy
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Intention Insights */}
        {intentionStats.size > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Best Intentions</Text>
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
                    {stats.count} check-ins • Best at: {stats.bestSegments.map((s: TimeSegment) => formatSegmentName(s)).join(', ')}
                  </Text>
                </View>
              ))}
          </View>
        )}
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Recommendations</Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
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
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  sectionCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
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
});
