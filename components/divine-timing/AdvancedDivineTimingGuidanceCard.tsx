/**
 * Advanced Divine Timing Guidance Card
 * =====================================
 * Enhanced AI-powered guidance display with full timing context
 */

import { DarkTheme, ElementAccents, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdvancedGuidanceResponse } from '@/services/AdvancedDivineTimingGuidanceService';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AdvancedDivineTimingGuidanceCardProps {
  response: AdvancedGuidanceResponse;
  colorScheme?: 'light' | 'dark';
  onReset: () => void;
}

export function AdvancedDivineTimingGuidanceCard({
  response,
  colorScheme = 'dark',
  onReset,
}: AdvancedDivineTimingGuidanceCardProps) {
  const [expandedSections, setExpandedSections] = useState({
    context: true,
    alignment: false,
    steps: true,
    timing: false,
    wisdom: false,
  });
  const { t } = useLanguage();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#2196F3';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  const getRecommendationColor = (rec: string) => {
    const lowerRec = rec.toLowerCase();
    if (lowerRec.includes('highly favorable') || lowerRec.includes('très favorable')) return '#4CAF50';
    if (lowerRec.includes('favorable')) return '#2196F3';
    if (lowerRec.includes('caution') || lowerRec.includes('prudence')) return '#FF9800';
    return '#F44336';
  };
  
  const getVerdictLabel = (rec: string) => {
    const lowerRec = rec.toLowerCase();
    if (lowerRec.includes('highly favorable') || lowerRec.includes('très favorable')) {
      return t('divineTiming.results.aiGuidanceCard.verdict.highlyFavorable');
    }
    if (lowerRec.includes('favorable')) {
      return t('divineTiming.results.aiGuidanceCard.verdict.favorable');
    }
    if (lowerRec.includes('caution') || lowerRec.includes('prudence') || lowerRec.includes('mixed')) {
      return t('divineTiming.results.aiGuidanceCard.verdict.mixed');
    }
    return t('divineTiming.results.aiGuidanceCard.verdict.unfavorable');
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="bulb" size={24} color="#FFD700" />
            <Text 
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t('divineTiming.results.aiGuidanceCard.header')}
            </Text>
          </View>
          <View style={[
            styles.premiumBadge,
            { backgroundColor: getScoreColor(response.spiritualAlignment.harmonyScore) + '22' }
          ]}>
            <Text style={[
              styles.premiumBadgeText,
              { color: getScoreColor(response.spiritualAlignment.harmonyScore) }
            ]}>
              {response.spiritualAlignment.harmonyScore}/100
            </Text>
          </View>
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Contextual Insight */}
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => toggleSection('context')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="telescope" size={20} color={ACCENT_COLOR} />
              <Text style={styles.sectionTitle}>{t('divineTiming.results.aiGuidanceCard.sections.contextualInsight')}</Text>
            </View>
            <Ionicons
              name={expandedSections.context ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={SECONDARY_TEXT}
            />
          </View>
          {expandedSections.context && (
            <View style={styles.sectionContent}>
              <Text style={styles.insightText}>{response.contextualInsight}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Spiritual Alignment */}
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => toggleSection('alignment')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="infinite" size={20} color={ACCENT_COLOR} />
              <Text style={styles.sectionTitle}>{t('divineTiming.results.aiGuidanceCard.sections.spiritualAlignment')}</Text>
            </View>
            <Ionicons
              name={expandedSections.alignment ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={SECONDARY_TEXT}
            />
          </View>
          {expandedSections.alignment && (
            <View style={styles.sectionContent}>
              {/* Harmony Score */}
              <View style={styles.scoreContainer}>
                <View style={styles.scoreHeader}>
                  <Text style={styles.scoreLabel}>{t('divineTiming.results.aiGuidanceCard.fields.harmonyScore')}</Text>
                  <Text style={[
                    styles.scoreValue,
                    { color: getScoreColor(response.spiritualAlignment.harmonyScore) }
                  ]}>
                    {response.spiritualAlignment.harmonyScore}/100
                  </Text>
                </View>
                <View style={styles.scoreBarContainer}>
                  <View
                    style={[
                      styles.scoreBarFill,
                      {
                        width: `${response.spiritualAlignment.harmonyScore}%`,
                        backgroundColor: getScoreColor(response.spiritualAlignment.harmonyScore),
                      }
                    ]}
                  />
                </View>
                <View style={[
                  styles.recommendationBadge,
                  { backgroundColor: getRecommendationColor(response.spiritualAlignment.recommendation) + '22' }
                ]}>
                  <Text style={[
                    styles.recommendationText,
                    { color: getRecommendationColor(response.spiritualAlignment.recommendation) }
                  ]}>
                    {getVerdictLabel(response.spiritualAlignment.recommendation)}
                  </Text>
                </View>
              </View>

              {/* Ẓāhir Alignment */}
              <View style={styles.alignmentRow}>
                <View style={styles.alignmentIcon}>
                  <Ionicons name="sunny" size={18} color="#FFD700" />
                </View>
                <View style={styles.alignmentContent}>
                  <Text style={styles.alignmentLabel}>{t('divineTiming.results.aiGuidanceCard.fields.zahir')}</Text>
                  <Text style={styles.alignmentText}>{response.spiritualAlignment.zahirAlignment}</Text>
                </View>
              </View>

              {/* Bāṭin Alignment */}
              <View style={styles.alignmentRow}>
                <View style={styles.alignmentIcon}>
                  <Ionicons name="moon" size={18} color="#9C27B0" />
                </View>
                <View style={styles.alignmentContent}>
                  <Text style={styles.alignmentLabel}>{t('divineTiming.results.aiGuidanceCard.fields.batin')}</Text>
                  <Text style={styles.alignmentText}>{response.spiritualAlignment.batinAlignment}</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Personalized Steps */}
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => toggleSection('steps')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="footsteps" size={20} color={ACCENT_COLOR} />
              <Text style={styles.sectionTitle}>{t('divineTiming.results.aiGuidanceCard.sections.personalizedSteps')}</Text>
            </View>
            <Ionicons
              name={expandedSections.steps ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={SECONDARY_TEXT}
            />
          </View>
          {expandedSections.steps && (
            <View style={styles.sectionContent}>
              {response.personalizedSteps.map((stepItem, index) => (
                <View key={index} style={styles.stepContainer}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{stepItem.step}</Text>
                  </View>
                  <View style={styles.stepMeta}>
                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={14} color={ACCENT_COLOR} />
                      <Text style={styles.metaText}>{stepItem.timing}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="information-circle-outline" size={14} color={SECONDARY_TEXT} />
                      <Text style={styles.reasoningText}>{stepItem.reasoning}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Timing Window */}
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => toggleSection('timing')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="time" size={20} color={ACCENT_COLOR} />
              <Text style={styles.sectionTitle}>{t('divineTiming.results.aiGuidanceCard.sections.optimalTiming')}</Text>
            </View>
            <Ionicons
              name={expandedSections.timing ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={SECONDARY_TEXT}
            />
          </View>
          {expandedSections.timing && (
            <View style={styles.sectionContent}>
              <View style={styles.timingRow}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <View style={styles.timingContent}>
                  <Text style={styles.timingLabel}>{t('divineTiming.results.aiGuidanceCard.fields.bestTime')}</Text>
                  <Text style={styles.timingText}>{response.timingWindow.bestTime}</Text>
                </View>
              </View>
              <View style={styles.timingRow}>
                <Ionicons name="arrow-forward-circle" size={18} color="#2196F3" />
                <View style={styles.timingContent}>
                  <Text style={styles.timingLabel}>{t('divineTiming.results.aiGuidanceCard.fields.nextOptimal')}</Text>
                  <Text style={styles.timingText}>{response.timingWindow.nextOptimal}</Text>
                </View>
              </View>
              <View style={styles.timingRow}>
                <Ionicons name="warning" size={18} color="#FF9800" />
                <View style={styles.timingContent}>
                  <Text style={styles.timingLabel}>{t('divineTiming.results.aiGuidanceCard.fields.avoid')}</Text>
                  <Text style={styles.timingText}>{response.timingWindow.avoid}</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Abjad Wisdom */}
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => toggleSection('wisdom')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="book" size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>{t('divineTiming.results.aiGuidanceCard.sections.abjadWisdom')}</Text>
            </View>
            <Ionicons
              name={expandedSections.wisdom ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={SECONDARY_TEXT}
            />
          </View>
          {expandedSections.wisdom && (
            <View style={styles.sectionContent}>
              <View style={styles.wisdomContainer}>
                <Ionicons name="sparkles" size={24} color="#FFD700" />
                <Text style={styles.wisdomText}>{response.abjadWisdom}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Ionicons name="refresh" size={20} color={ACCENT_COLOR} />
          <Text style={styles.resetButtonText}>{t('divineTiming.results.aiGuidanceCard.actions.askAnother')}</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
      </View>
    </View>
  );
}

const ACCENT_COLOR = ElementAccents.fire.primary;
const PRIMARY_TEXT = DarkTheme.textPrimary;
const SECONDARY_TEXT = DarkTheme.textSecondary;
const CARD_BACKGROUND = DarkTheme.cardBackground;
const SECTION_BACKGROUND = DarkTheme.cardBackgroundAlt;

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    paddingHorizontal: 0,
  },
  container: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 20,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    overflow: 'hidden', // Clip children within rounded corners
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    overflow: 'hidden', // Prevent badge overflow
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
    minWidth: 0, // Allow text to shrink
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_TEXT,
    flex: 1,
  },
  premiumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0, // Never shrink
    maxWidth: 80, // Constrain width
  },
  premiumBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    maxHeight: 600,
  },
  sectionCard: {
    backgroundColor: SECTION_BACKGROUND,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },
  sectionContent: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
    color: SECONDARY_TEXT,
  },
  scoreContainer: {
    gap: Spacing.sm,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: SECONDARY_TEXT,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreBarContainer: {
    height: 8,
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recommendationText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alignmentRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  alignmentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CARD_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignmentContent: {
    flex: 1,
    gap: 4,
  },
  alignmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  alignmentText: {
    fontSize: 13,
    lineHeight: 20,
    color: SECONDARY_TEXT,
  },
  stepContainer: {
    gap: Spacing.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_TEXT,
    lineHeight: 20,
  },
  stepMeta: {
    marginLeft: 32,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  metaText: {
    flex: 1,
    fontSize: 12,
    color: ACCENT_COLOR,
  },
  reasoningText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    color: SECONDARY_TEXT,
    lineHeight: 18,
  },
  timingRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  timingContent: {
    flex: 1,
    gap: 4,
  },
  timingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },
  timingText: {
    fontSize: 13,
    lineHeight: 20,
    color: SECONDARY_TEXT,
  },
  wisdomContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    padding: Spacing.md,
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  wisdomText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: PRIMARY_TEXT,
    fontStyle: 'italic',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    marginTop: Spacing.md,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
