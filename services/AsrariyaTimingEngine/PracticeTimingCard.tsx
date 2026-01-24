/**
 * Practice Timing Card Component
 * ===============================
 * Beautiful, informative UI for displaying Asrariya Timing results
 * 
 * Features:
 * - Score visualization with animated ring
 * - Recommendation level with color coding
 * - Expandable reasoning section
 * - Enhancement suggestions
 * - Alternative timing finder
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getStoredLanguage, type AppLanguage } from '@/services/StaticI18n';
import {
  AsrariyaTimingResult,
  RecommendationLevel,
  TimingEnhancement,
} from './types';

interface PracticeTimingCardProps {
  result: AsrariyaTimingResult;
  practiceName?: string;
  onStartPractice?: () => void;
  onFindBetterTime?: () => void;
  showEnhancements?: boolean;
  showCautions?: boolean;
  compact?: boolean;
}

const LEVEL_COLORS: Record<RecommendationLevel, { bg: string; text: string; icon: string }> = {
  'highly-favorable': { bg: '#10B981', text: '#ECFDF5', icon: 'star-circle' },
  'favorable': { bg: '#3B82F6', text: '#EFF6FF', icon: 'check-circle' },
  'moderate': { bg: '#F59E0B', text: '#FFFBEB', icon: 'alert-circle' },
  'cautious': { bg: '#EF4444', text: '#FEF2F2', icon: 'clock-alert' },
  'challenging': { bg: '#6B7280', text: '#F3F4F6', icon: 'close-circle' },
};

const LEVEL_LABELS: Record<RecommendationLevel, { en: string; ar: string; fr: string }> = {
  'highly-favorable': { en: 'Excellent Time', ar: 'وقت ممتاز', fr: 'Moment Excellent' },
  'favorable': { en: 'Good Time', ar: 'وقت جيد', fr: 'Bon Moment' },
  'moderate': { en: 'Proceed Mindfully', ar: 'تابع بوعي', fr: 'Procédez avec Attention' },
  'cautious': { en: 'Consider Waiting', ar: 'فكر في الانتظار', fr: 'Envisagez d\'Attendre' },
  'challenging': { en: 'Not Ideal', ar: 'غير مثالي', fr: 'Pas Idéal' },
};

export function PracticeTimingCard({
  result,
  practiceName,
  onStartPractice,
  onFindBetterTime,
  showEnhancements = true,
  showCautions = true,
  compact = false,
}: PracticeTimingCardProps) {
  const { theme, accent } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [animatedScore] = useState(new Animated.Value(0));
  const [lang, setLang] = useState<AppLanguage>('en');
  
  // Get stored language
  useEffect(() => {
    getStoredLanguage().then(l => setLang(l));
  }, []);
  
  const levelConfig = LEVEL_COLORS[result.level];
  const levelLabel = LEVEL_LABELS[result.level];
  
  // Map theme to colors format for backward compatibility
  const colors = {
    cardBackground: theme.cardBackground,
    text: theme.textPrimary,
    textSecondary: theme.textSecondary,
    primary: accent.primary,
    border: theme.borderSubtle,
  };
  
  // Animate score on mount
  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: result.overallScore,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [result.overallScore]);
  
  const scoreColor = animatedScore.interpolate({
    inputRange: [0, 40, 60, 80, 100],
    outputRange: ['#6B7280', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
  });
  
  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          { backgroundColor: levelConfig.bg + '20', borderColor: levelConfig.bg },
        ]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.compactHeader}>
          <MaterialCommunityIcons
            name={levelConfig.icon as any}
            size={24}
            color={levelConfig.bg}
          />
          <Text style={[styles.compactScore, { color: levelConfig.bg }]}>
            {result.overallScore}%
          </Text>
          <Text style={[styles.compactLabel, { color: colors.text }]}>
            {levelLabel[lang]}
          </Text>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </View>
        
        {expanded && (
          <View style={styles.compactExpanded}>
            <Text style={[styles.reasoning, { color: colors.textSecondary }]}>
              {result.reasoning}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      {/* Header with Score Ring */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreRing, { borderColor: levelConfig.bg }]}>
            <Text style={[styles.scoreText, { color: levelConfig.bg }]}>
              {result.overallScore}
            </Text>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
              /100
            </Text>
          </View>
        </View>
        
        <View style={styles.headerText}>
          {practiceName && (
            <Text style={[styles.practiceName, { color: colors.textSecondary }]}>
              {practiceName}
            </Text>
          )}
          <View style={[styles.levelBadge, { backgroundColor: levelConfig.bg }]}>
            <MaterialCommunityIcons
              name={levelConfig.icon as any}
              size={16}
              color={levelConfig.text}
            />
            <Text style={[styles.levelText, { color: levelConfig.text }]}>
              {levelLabel[lang]}
            </Text>
          </View>
          <Text style={[styles.confidence, { color: colors.textSecondary }]}>
            {result.confidence === 'high' ? '✓ High Confidence' :
             result.confidence === 'medium' ? '○ Medium Confidence' :
             '△ Mixed Signals'}
          </Text>
        </View>
      </View>
      
      {/* Reasoning Section */}
      <TouchableOpacity
        style={styles.reasoningContainer}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.reasoning, { color: colors.text }]}
          numberOfLines={expanded ? undefined : 3}
        >
          {result.reasoning}
        </Text>
        {!expanded && result.reasoning.length > 150 && (
          <Text style={[styles.readMore, { color: colors.primary }]}>
            Read more...
          </Text>
        )}
      </TouchableOpacity>
      
      {/* Optimal Window */}
      {result.optimalWindowEnd && (
        <View style={[styles.windowBanner, { backgroundColor: levelConfig.bg + '15' }]}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={levelConfig.bg} />
          <Text style={[styles.windowText, { color: levelConfig.bg }]}>
            Optimal window ends at{' '}
            {result.optimalWindowEnd.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
      
      {/* Enhancements */}
      {showEnhancements && result.enhancements.length > 0 && (
        <View style={styles.enhancementsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ✨ Enhance Your Practice
          </Text>
          {result.enhancements.map((enhancement, index) => (
            <EnhancementItem
              key={index}
              enhancement={enhancement}
              colors={colors}
            />
          ))}
        </View>
      )}
      
      {/* Cautions */}
      {showCautions && result.cautions.length > 0 && (
        <View style={styles.cautionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ⚠️ Be Aware
          </Text>
          {result.cautions.map((caution, index) => (
            <View key={index} style={styles.cautionItem}>
              <Text style={[styles.cautionText, { color: colors.textSecondary }]}>
                • {caution}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        {result.action !== 'wait' && onStartPractice && (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: levelConfig.bg }]}
            onPress={onStartPractice}
          >
            <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              {result.action === 'proceed' ? 'Start Practice' :
               result.action === 'proceed-with-care' ? 'Begin Mindfully' :
               'Start with Modifications'}
            </Text>
          </TouchableOpacity>
        )}
        
        {(result.action === 'wait' || result.overallScore < 60) && onFindBetterTime && (
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={onFindBetterTime}
          >
            <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.text} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Find Better Time
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Layer Details (collapsible) */}
      {expanded && (
        <View style={[styles.layerDetails, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Analysis Breakdown
          </Text>
          <LayerScoreBar
            label="Element Harmony"
            score={result.layers.elementCompatibility.score}
            colors={colors}
          />
          <LayerScoreBar
            label="Planetary Resonance"
            score={result.layers.planetaryResonance.score}
            colors={colors}
          />
          <LayerScoreBar
            label="Lunar Mansion"
            score={result.layers.manazilAlignment.score}
            colors={colors}
          />
          <LayerScoreBar
            label="Practice Fit"
            score={result.layers.practiceMapping.score}
            colors={colors}
          />
        </View>
      )}
    </View>
  );
}

// Enhancement Item Component
function EnhancementItem({
  enhancement,
  colors,
}: {
  enhancement: TimingEnhancement;
  colors: any;
}) {
  return (
    <View style={styles.enhancementItem}>
      <Text style={styles.enhancementIcon}>{enhancement.icon || '💡'}</Text>
      <Text style={[styles.enhancementText, { color: colors.text }]}>
        {enhancement.text}
      </Text>
    </View>
  );
}

// Layer Score Bar Component
function LayerScoreBar({
  label,
  score,
  colors,
}: {
  label: string;
  score: number;
  colors: any;
}) {
  const barColor = score >= 70 ? '#10B981' :
                   score >= 50 ? '#3B82F6' :
                   score >= 30 ? '#F59E0B' : '#EF4444';
  
  return (
    <View style={styles.layerBar}>
      <View style={styles.layerBarHeader}>
        <Text style={[styles.layerBarLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.layerBarScore, { color: barColor }]}>
          {score}%
        </Text>
      </View>
      <View style={[styles.layerBarTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.layerBarFill,
            { width: `${score}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

// Compact Badge Component (for home screen)
export function TimingBadge({
  score,
  level,
  label,
  onPress,
}: {
  score: number;
  level: RecommendationLevel;
  label?: string;
  onPress?: () => void;
}) {
  const { theme, accent } = useTheme();
  const levelConfig = LEVEL_COLORS[level];
  
  // Map theme to colors format
  const colors = {
    textSecondary: theme.textSecondary,
  };
  
  return (
    <TouchableOpacity
      style={[styles.badge, { backgroundColor: levelConfig.bg + '20' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={levelConfig.icon as any}
        size={16}
        color={levelConfig.bg}
      />
      <Text style={[styles.badgeScore, { color: levelConfig.bg }]}>
        {score}%
      </Text>
      {label && (
        <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    marginRight: 16,
  },
  scoreRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
  },
  headerText: {
    flex: 1,
  },
  practiceName: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  confidence: {
    fontSize: 12,
  },
  reasoningContainer: {
    marginBottom: 16,
  },
  reasoning: {
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    marginTop: 4,
  },
  windowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  windowText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  enhancementsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  enhancementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  enhancementIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 24,
  },
  enhancementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  cautionsSection: {
    marginBottom: 16,
  },
  cautionItem: {
    paddingVertical: 4,
  },
  cautionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  layerDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  layerBar: {
    marginBottom: 12,
  },
  layerBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  layerBarLabel: {
    fontSize: 13,
  },
  layerBarScore: {
    fontSize: 13,
    fontWeight: '600',
  },
  layerBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  layerBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Compact styles
  compactContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginVertical: 4,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  compactLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  compactExpanded: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  // Badge styles
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
});
