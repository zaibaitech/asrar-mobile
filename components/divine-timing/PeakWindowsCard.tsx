/**
 * Peak Windows Card Component
 * ============================
 * Phase 7: Display personalized peak timing windows on home screen
 * 
 * Shows:
 * - Top 3 recommended windows for today
 * - Harmony score for each window
 * - Quick guidance for each window
 * - Data quality indicator
 */

import { DarkTheme, ElementAccents } from '@/constants/DarkTheme';
import { loadCheckIns, loadUserTimingProfile } from '@/services/CheckInStorage';
import { getPlanetPositions } from '@/services/EphemerisService';
import {
    computeHarmonyScore,
    getQuickGuidance,
    getSegmentTimeRange
} from '@/services/IlmNujumMapping';
import { getRecentOutcomesForSegment } from '@/services/PeakWindowLearner';
import {
    HarmonyComputationInput,
    PeakWindow,
    TimeSegment,
} from '@/types/divine-timing-personal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Peak Windows Card Props
 */
interface PeakWindowsCardProps {
  userElement?: 'fire' | 'water' | 'air' | 'earth';
  userBurjRuler?: string;
}

/**
 * Peak Windows Card Component
 */
export function PeakWindowsCard({
  userElement = 'fire',
  userBurjRuler,
}: PeakWindowsCardProps) {
  const router = useRouter();
  const [windows, setWindows] = useState<PeakWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataQuality, setDataQuality] = useState<'full' | 'partial' | 'minimal'>('minimal');
  
  useEffect(() => {
    loadPeakWindows();
  }, []);
  
  /**
   * Load and compute today's peak windows
   */
  const loadPeakWindows = async () => {
    try {
      setLoading(true);
      
      const profile = await loadUserTimingProfile();
      const checkins = await loadCheckIns();
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Get planetary positions
      const positions = await getPlanetPositions(now, profile.timezone);
      
      // Compute harmony scores for all upcoming segments today
      const allSegments: TimeSegment[] = [
        'preDawn',
        'morning',
        'midday',
        'afternoon',
        'evening',
        'night',
      ];
      
      const currentHour = now.getHours();
      const windowScores: Array<{
        segment: TimeSegment;
        score: number;
        guidance: string;
      }> = [];
      
      for (const segment of allSegments) {
        const range = getSegmentTimeRange(segment);
        const startHour = parseInt(range.start.split(':')[0]);
        
        // Only include future or current segments
        if (startHour >= currentHour || (segment === 'night' && currentHour >= 21)) {
          const recentOutcomes = getRecentOutcomesForSegment(checkins, segment, 30);
          
          const input: HarmonyComputationInput = {
            datetime: now,
            timezone: profile.timezone,
            userElement,
            userBurjRuler: userBurjRuler as any,
            intentionCategory: 'custom', // Generic for now
            timeSegment: segment,
            planetPositions: positions || undefined,
            peakWindowScore: profile.peakWindowModel.segmentScores[segment],
            recentOutcomes,
          };
          
          const result = computeHarmonyScore(input);
          
          windowScores.push({
            segment,
            score: result.score,
            guidance: getQuickGuidance(result.score),
          });
          
          // Track data quality
          if (result.dataQuality === 'full' && dataQuality !== 'full') {
            setDataQuality('full');
          } else if (result.dataQuality === 'partial' && dataQuality === 'minimal') {
            setDataQuality('partial');
          }
        }
      }
      
      // Sort by harmony score (highest first)
      windowScores.sort((a, b) => b.score - a.score);
      
      // Take top 3
      const topWindows = windowScores.slice(0, 3);
      
      // Format as PeakWindow objects
      const peakWindows: PeakWindow[] = topWindows.map((w, index) => {
        const range = getSegmentTimeRange(w.segment);
        return {
          segment: w.segment,
          startTime: range.start,
          endTime: range.end,
          harmonyScore: w.score,
          guidance: w.guidance,
          rank: index + 1,
        };
      });
      
      setWindows(peakWindows);
      
    } catch (error) {
      if (__DEV__) {
        console.error('[PeakWindowsCard] Error loading windows:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Format segment name for display
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
   * Get icon for segment
   */
  const getSegmentIcon = (segment: TimeSegment): string => {
    const icons: Record<TimeSegment, string> = {
      preDawn: '🌅',
      morning: '☀️',
      midday: '🌞',
      afternoon: '🌤️',
      evening: '🌇',
      night: '🌙',
    };
    return icons[segment];
  };
  
  /**
   * Get color for harmony score
   */
  const getScoreColor = (score: number): string => {
    if (score >= 75) return '#10b981'; // Green - success
    if (score >= 60) return ElementAccents.fire.primary; // Accent
    if (score >= 45) return DarkTheme.textSecondary;
    return '#f59e0b'; // Orange - warning
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="sparkles-outline" size={24} color="#8B7355" />
            <Text style={styles.title}>Your Peak Windows</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>Computing harmony scores...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles-outline" size={24} color={ElementAccents.fire.primary} />
          <Text style={styles.title}>Your Peak Windows</Text>
        </View>
        
        {/* Data Quality Badge */}
        {dataQuality === 'full' && (
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityBadgeText}>✨ Live Ephemeris</Text>
          </View>
        )}
        {dataQuality === 'partial' && (
          <View style={[styles.qualityBadge, styles.qualityBadgeApprox]}>
            <Text style={styles.qualityBadgeText}>~ Approx Mode</Text>
          </View>
        )}
      </View>
      
      {/* Windows List */}
      {windows.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌙</Text>
          <Text style={styles.emptyText}>
            Check in daily to discover your peak windows
          </Text>
        </View>
      ) : (
        <View style={styles.windowsList}>
          {windows.map((window, index) => (
            <View key={window.segment} style={styles.windowCard}>
              {/* Rank Badge */}
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{window.rank}</Text>
              </View>
              
              {/* Window Info */}
              <View style={styles.windowInfo}>
                <View style={styles.windowHeader}>
                  <Text style={styles.segmentIcon}>
                    {getSegmentIcon(window.segment)}
                  </Text>
                  <Text style={styles.segmentName}>
                    {formatSegmentName(window.segment)}
                  </Text>
                </View>
                
                <Text style={styles.timeRange}>
                  {window.startTime} - {window.endTime}
                </Text>
                
                <Text style={styles.guidance} numberOfLines={2}>
                  {window.guidance}
                </Text>
              </View>
              
              {/* Harmony Score */}
              <View style={styles.scoreContainer}>
                <Text style={[styles.score, { color: getScoreColor(window.harmonyScore) }]}>
                  {window.harmonyScore}
                </Text>
                <Text style={styles.scoreLabel}>harmony</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/daily-checkin')}
        >
          <Ionicons name="add-circle-outline" size={20} color="#8B7355" />
          <Text style={styles.actionButtonText}>Check In Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/divine-timing-insights')}
        >
          <Ionicons name="stats-chart-outline" size={20} color="#8B7355" />
          <Text style={styles.actionButtonText}>View Insights</Text>
        </TouchableOpacity>
      </View>
      
      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        🌙 Reflective guidance only • Not predictions
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  qualityBadge: {
    backgroundColor: '#8B735520',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualityBadgeApprox: {
    backgroundColor: '#f59e0b20',
  },
  qualityBadgeText: {
    fontSize: 11,
    color: '#8B7355',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  windowsList: {
    gap: 12,
  },
  windowCard: {
    flexDirection: 'row',
    backgroundColor: DarkTheme.screenBackground,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B735520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B7355',
  },
  windowInfo: {
    flex: 1,
    gap: 4,
  },
  windowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentIcon: {
    fontSize: 18,
  },
  segmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  timeRange: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  guidance: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    minWidth: 50,
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 10,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: DarkTheme.screenBackground,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7355',
  },
  disclaimer: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    marginTop: 12,
  },
});
