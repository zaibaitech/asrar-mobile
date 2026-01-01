/**
 * Advanced Divine Timing Analysis Card
 * =====================================
 * Displays comprehensive timing analysis integrating all components
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { IntentionTimingAnalysis } from '@/services/AdvancedDivineTimingService';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AdvancedAnalysisCardProps {
  analysis: IntentionTimingAnalysis;
}

export function AdvancedAnalysisCard({ analysis }: AdvancedAnalysisCardProps) {
  const [expandedSections, setExpandedSections] = useState({
    current: true,
    timeline: false,
    optimal: false,
    steps: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getRecommendationColor = () => {
    switch (analysis.recommendation) {
      case 'highly_favorable': return '#10b981';
      case 'act_now': return '#3b82f6';
      case 'proceed_with_caution': return '#f59e0b';
      case 'wait_for_better_time': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRecommendationIcon = () => {
    switch (analysis.recommendation) {
      case 'highly_favorable': return 'checkmark-circle';
      case 'act_now': return 'arrow-forward-circle';
      case 'proceed_with_caution': return 'alert-circle';
      case 'wait_for_better_time': return 'pause-circle';
      default: return 'information-circle';
    }
  };

  const getRecommendationText = () => {
    switch (analysis.recommendation) {
      case 'highly_favorable': return 'Highly Favorable Time';
      case 'act_now': return 'Good Time to Act';
      case 'proceed_with_caution': return 'Proceed with Caution';
      case 'wait_for_better_time': return 'Consider Waiting';
      default: return 'Neutral';
    }
  };

  return (
    <View style={styles.container}>
      {/* Harmony Score Header */}
      <View style={styles.harmonyHeader}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{analysis.harmonyScore}</Text>
          <Text style={styles.scoreLabel}>Harmony</Text>
        </View>
        <View style={styles.recommendationBox}>
          <Ionicons 
            name={getRecommendationIcon() as any} 
            size={32} 
            color={getRecommendationColor()} 
          />
          <Text style={[styles.recommendationText, { color: getRecommendationColor() }]}>
            {getRecommendationText()}
          </Text>
        </View>
      </View>

      {/* Current Moment Section */}
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection('current')}
      >
        <Ionicons name="time" size={20} color="#8B7355" />
        <Text style={styles.sectionTitle}>Current Moment Analysis</Text>
        <Ionicons 
          name={expandedSections.current ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={DarkTheme.textSecondary} 
        />
      </TouchableOpacity>

      {expandedSections.current && (
        <View style={styles.sectionContent}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Hourly Status</Text>
              <Text style={[
                styles.infoValue,
                { color: analysis.currentMoment.hourlyAlignment.status === 'ACT' ? '#10b981' : '#8B7355' }
              ]}>
                {analysis.currentMoment.hourlyAlignment.status}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Planetary Hour</Text>
              <Text style={styles.infoValue}>
                {analysis.currentMoment.planetaryHour.planet}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Daily Quality</Text>
              <Text style={styles.infoValue}>
                {analysis.currentMoment.dailyGuidance.timingQuality}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Day Element</Text>
              <Text style={styles.infoValue}>
                {analysis.currentMoment.dailyGuidance.dayElement}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Practical Steps Section */}
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection('steps')}
      >
        <Ionicons name="list" size={20} color="#8B7355" />
        <Text style={styles.sectionTitle}>Practical Steps</Text>
        <Ionicons 
          name={expandedSections.steps ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={DarkTheme.textSecondary} 
        />
      </TouchableOpacity>

      {expandedSections.steps && (
        <View style={styles.sectionContent}>
          {analysis.practicalSteps.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{idx + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Next 24 Hours */}
      {analysis.bestTimingInNext24Hours && (
        <>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('timeline')}
          >
            <Ionicons name="calendar" size={20} color="#8B7355" />
            <Text style={styles.sectionTitle}>Best Time in Next 24 Hours</Text>
            <Ionicons 
              name={expandedSections.timeline ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={DarkTheme.textSecondary} 
            />
          </TouchableOpacity>

          {expandedSections.timeline && (
            <View style={styles.sectionContent}>
              <View style={styles.timingWindow}>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={16} color="#10b981" />
                  <Text style={styles.timeText}>
                    {analysis.bestTimingInNext24Hours.startTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <Text style={styles.planetText}>
                  {analysis.bestTimingInNext24Hours.planet} Hour ({analysis.bestTimingInNext24Hours.element})
                </Text>
                <Text style={styles.reasonText}>
                  {analysis.bestTimingInNext24Hours.reason}
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      {/* 7-Day Outlook */}
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection('optimal')}
      >
        <Ionicons name="trending-up" size={20} color="#8B7355" />
        <Text style={styles.sectionTitle}>7-Day Outlook</Text>
        <Ionicons 
          name={expandedSections.optimal ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={DarkTheme.textSecondary} 
        />
      </TouchableOpacity>

      {expandedSections.optimal && (
        <View style={styles.sectionContent}>
          {analysis.next7DaysOutlook.map((day, idx) => (
            <View key={idx} style={styles.dayRow}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayName}>{day.dayOfWeek}</Text>
                <Text style={styles.dayDate}>
                  {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View style={styles.dayScore}>
                <View style={[
                  styles.scoreBar,
                  { width: `${day.overallScore}%`, backgroundColor: getScoreColor(day.overallScore) }
                ]} />
              </View>
              <Text style={[styles.scoreText, { color: getScoreColor(day.overallScore) }]}>
                {day.overallScore}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#3b82f6';
  if (score >= 30) return '#f59e0b';
  return '#ef4444';
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  harmonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderWidth: 3,
    borderColor: '#8B7355',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  scoreLabel: {
    fontSize: 10,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  recommendationBox: {
    flex: 1,
    marginLeft: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  sectionContent: {
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  infoBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: Spacing.sm,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    textTransform: 'capitalize',
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B7355',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  timingWindow: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    gap: Spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  planetText: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  reasonText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dayInfo: {
    width: 100,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  dayDate: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  dayScore: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
});
