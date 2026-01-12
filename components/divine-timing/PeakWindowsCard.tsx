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
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { enhancePeakWindowsWithAI, isAIAvailable, loadAISettings } from '@/services/AIReflectionService';
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
import { formatZodiacWithArabic, resolveUserZodiacKey } from '@/utils/translationHelpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AIBadge } from './AIBadge';

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
  const { profile: userProfile } = useProfile();
  const { language } = useLanguage();
  const userZodiacKey = useMemo(
    () =>
      resolveUserZodiacKey({
        burjIndex: userProfile?.derived?.burjIndex,
        burj: userProfile?.derived?.burj,
      }),
    [userProfile?.derived?.burjIndex, userProfile?.derived?.burj]
  );
  const [windows, setWindows] = useState<PeakWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataQuality, setDataQuality] = useState<'full' | 'partial' | 'minimal'>('minimal');
  
  // AI enhancement state
  const [aiAvailable, setAiAvailable] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState<PeakWindow | null>(null);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [enhancedSegment, setEnhancedSegment] = useState('');
  const [enhancedActivities, setEnhancedActivities] = useState('');
  const [enhancedWisdom, setEnhancedWisdom] = useState('');
  const [personalizedInsight, setPersonalizedInsight] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    loadPeakWindows();
    checkAIAvailability();
  }, []);
  
  const checkAIAvailability = async () => {
    const available = await isAIAvailable();
    setAiAvailable(available);
  };
  
  const handleEnhanceWindow = async (window: PeakWindow) => {
    if (!aiAvailable || aiLoading) return;
    
    setSelectedWindow(window);
    setShowModal(true);
    setAiLoading(true);
    setAiEnhanced(false);
    
    try {
      const settings = await loadAISettings();
      const response = await enhancePeakWindowsWithAI({
        segment: window.segment,
        harmonyScore: window.harmonyScore,
        guidance: window.guidance,
        timeRange: {
          start: window.startTime,
          end: window.endTime,
        },
        userElement: userProfile?.derived?.element,
        userBurj: userProfile?.derived?.burj,
        userLocationCity: userProfile?.location?.label,
        tone: settings.tone,
        language: language, // Use app's current language
      });
      
      if (response.aiAssisted) {
        setEnhancedSegment(response.enhancedSegmentExplanation);
        setEnhancedActivities(response.enhancedActivityRecommendations);
        setEnhancedWisdom(response.enhancedTimingWisdom);
        setPersonalizedInsight(response.personalizedInsight || '');
        setAiEnhanced(true);
      }
    } catch (error) {
      // Silent fallback
    } finally {
      setAiLoading(false);
    }
  };
  
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
        explanationBullets: string[];
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
            explanationBullets: result.explanationBullets,
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
          explanationBullets: w.explanationBullets,
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
      
      {/* Personalization Info */}
      {(userProfile?.derived?.element || userProfile?.derived?.burj) && (
        <View style={styles.personalizationInfo}>
          <Text style={styles.personalizationLabel}>
            <Ionicons name="person" size={12} color="#8B7355" /> Personalized for you:
          </Text>
          <View style={styles.personalizationTags}>
            {userProfile?.derived?.element && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {userElement.charAt(0).toUpperCase() + userElement.slice(1)} Element
                </Text>
              </View>
            )}
            {userProfile?.derived?.burj && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {userZodiacKey
                    ? formatZodiacWithArabic(userZodiacKey, language as any, {
                        forceBilingual: language !== 'ar',
                        arabicFirst: true,
                        includeGlyph: true,
                      })
                    : userProfile.derived.burj}{' '}
                  {userBurjRuler ? `(${userBurjRuler})` : ''}
                </Text>
              </View>
            )}
            {windows.length > 0 && windows[0].harmonyScore > 60 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Your Patterns</Text>
              </View>
            )}
          </View>
        </View>
      )}
      
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
                
                {/* Explanation Bullets */}
                {window.explanationBullets && window.explanationBullets.length > 0 && (
                  <View style={styles.explanationContainer}>
                    {window.explanationBullets.slice(0, 2).map((bullet, idx) => (
                      <View key={idx} style={styles.explanationBullet}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText} numberOfLines={1}>
                          {bullet}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              
              {/* Harmony Score */}
              <View style={styles.scoreContainer}>
                <Text style={[styles.score, { color: getScoreColor(window.harmonyScore) }]}>
                  {window.harmonyScore}
                </Text>
                <Text style={styles.scoreLabel}>harmony</Text>
              </View>
              
              {/* AI Enhancement Button */}
              {aiAvailable && (
                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={() => handleEnhanceWindow(window)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="sparkles" size={16} color="#6366f1" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
      
      {/* AI Enhancement Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedWindow && (
                  <>
                    {getSegmentIcon(selectedWindow.segment)} {formatSegmentName(selectedWindow.segment)}
                  </>
                )}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={DarkTheme.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {/* Modal Content */}
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {aiLoading ? (
                <View style={styles.aiLoadingContainer}>
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text style={styles.aiLoadingText}>Personalizing guidance...</Text>
                </View>
              ) : aiEnhanced ? (
                <>
                  {/* Enhanced Segment Explanation */}
                  {enhancedSegment && (
                    <View style={styles.enhancedSection}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name="time" size={20} color="#6366f1" />
                        <Text style={styles.sectionTitle}>Time Window Insight</Text>
                      </View>
                      <Text style={styles.sectionText}>{enhancedSegment}</Text>
                      <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                        <AIBadge show={true} />
                      </View>
                    </View>
                  )}
                  
                  {/* Enhanced Activities */}
                  {enhancedActivities && (
                    <View style={styles.enhancedSection}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name="list" size={20} color="#6366f1" />
                        <Text style={styles.sectionTitle}>Activity Suggestions</Text>
                      </View>
                      <Text style={styles.sectionText}>{enhancedActivities}</Text>
                      <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                        <AIBadge show={true} />
                      </View>
                    </View>
                  )}
                  
                  {/* Enhanced Wisdom */}
                  {enhancedWisdom && (
                    <View style={styles.enhancedSection}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name="book" size={20} color="#6366f1" />
                        <Text style={styles.sectionTitle}>Timing Wisdom</Text>
                      </View>
                      <Text style={styles.sectionText}>{enhancedWisdom}</Text>
                      <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                        <AIBadge show={true} />
                      </View>
                    </View>
                  )}
                  
                  {/* Personalized Insight */}
                  {personalizedInsight && (
                    <View style={styles.personalizedSection}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name="person" size={20} color="#8b5cf6" />
                        <Text style={styles.sectionTitle}>💫 Your Personal Context</Text>
                      </View>
                      <Text style={styles.sectionText}>{personalizedInsight}</Text>
                      <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                        <AIBadge show={true} />
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>✨</Text>
                  <Text style={styles.emptyText}>AI enhancement unavailable</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
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
  
  // Personalization Info Styles
  personalizationInfo: {
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  personalizationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
    marginBottom: 8,
  },
  personalizationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B7355',
  },
  explanationContainer: {
    marginTop: 8,
    gap: 4,
  },
  explanationBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletDot: {
    fontSize: 10,
    color: '#8B7355',
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
  },
  
  // AI Enhancement Styles
  aiButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: DarkTheme.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  aiLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  aiLoadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  enhancedSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  personalizedSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  sectionText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
});
