/**
 * Divine Timing Guidance Card
 * ============================
 * Phase 3: Display structured guidance response
 * Phase 6: Optional AI-enhanced wording
 */

import Colors from '@/constants/Colors';
import { loadAISettings, rewriteGuidanceWithAI } from '@/services/AIReflectionService';
import { GUIDANCE_DISCLAIMER } from '@/services/DivineTimingGuidanceService';
import { AIRewriteResponse } from '@/types/ai-settings';
import { GuidanceResponse } from '@/types/divine-timing-guidance';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AIBadge } from './AIBadge';

interface DivineTimingGuidanceCardProps {
  response: GuidanceResponse;
  colorScheme?: 'light' | 'dark';
  onReset?: () => void;
  /** Optional Qur'an context for AI */
  quranContext?: {
    verseReference: string;
    translationEn: string;
  };
}

export function DivineTimingGuidanceCard({
  response,
  colorScheme = 'light',
  onReset,
  quranContext,
}: DivineTimingGuidanceCardProps) {
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];
  
  const [displayResponse, setDisplayResponse] = useState(response);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiAssisted, setAiAssisted] = useState(false);
  
  // Try to enhance with AI on mount
  useEffect(() => {
    enhanceWithAI();
  }, [response]);
  
  const enhanceWithAI = async () => {
    try {
      const settings = await loadAISettings();
      
      // Only enhance if AI is enabled
      if (!settings.enabled) {
        setDisplayResponse(response);
        setAiAssisted(false);
        return;
      }
      
      setAiEnhancing(true);
      
      const enhanced: AIRewriteResponse = await rewriteGuidanceWithAI({
        originalGuidance: {
          summaryTitle: response.summaryTitle,
          timingSignal: response.timingSignal,
          recommendedApproach: response.recommendedApproach,
          watchOuts: response.watchOuts,
          nextStep: response.nextStep,
          disclaimer: GUIDANCE_DISCLAIMER,
        },
        quranContext,
        tone: settings.tone,
        language: 'en',
      });
      
      // Convert AI response back to GuidanceResponse format
      const enhancedResponse: GuidanceResponse = {
        ...response,
        summaryTitle: enhanced.summaryTitle,
        timingSignal: enhanced.timingSignal,
        recommendedApproach: enhanced.recommendedApproach,
        watchOuts: enhanced.watchOuts,
        nextStep: enhanced.nextStep,
        reflection: enhanced.reflection && response.reflection
          ? {
              surahNameEn: response.reflection.surahNameEn,
              surahNumber: response.reflection.surahNumber,
              ayahNumber: response.reflection.ayahNumber,
              prompt: enhanced.reflection.reflectionPrompt,
            }
          : undefined,
      };
      
      setDisplayResponse(enhancedResponse);
      setAiAssisted(enhanced.aiAssisted);
    } catch (error) {
      if (__DEV__) {
        console.warn('[AI] Failed to enhance guidance:', error);
      }
      // Fallback to original
      setDisplayResponse(response);
      setAiAssisted(false);
    } finally {
      setAiEnhancing(false);
    }
  };
  
  const handleOpenVerse = () => {
    if (displayResponse.reflection) {
      const { surahNumber, ayahNumber } = displayResponse.reflection;
      Linking.openURL(`https://quran.com/${surahNumber}/${ayahNumber}`);
    }
  };
  
  // Color for summary title based on type
  const getSummaryColor = () => {
    if (displayResponse.summaryTitle.includes('Supportive')) return '#10b981';
    if (displayResponse.summaryTitle.includes('Steady')) return '#f59e0b';
    if (displayResponse.summaryTitle.includes('Pause')) return '#ef4444';
    return colors.primary;
  };
  
  if (aiEnhancing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Enhancing guidance...
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* AI Badge */}
      <AIBadge show={aiAssisted} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="compass-outline" size={24} color={getSummaryColor()} />
          <Text style={[styles.title, { color: getSummaryColor() }]}>
            {displayResponse.summaryTitle}
          </Text>
        </View>
      </View>
      
      {/* Timing Signal */}
      <View style={[styles.section, { backgroundColor: isDark ? '#0f1419' : '#fafafa' }]}>
        <Text style={[styles.timingSignal, { color: colors.text }]}>
          {displayResponse.timingSignal}
        </Text>
      </View>
      
      {/* Recommended Approach */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#10b981" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended Approach
          </Text>
        </View>
        <View style={styles.bulletList}>
          {displayResponse.recommendedApproach.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={[styles.bullet, { color: '#10b981' }]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.text }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Watch-Outs */}
      {displayResponse.watchOuts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle-outline" size={18} color="#f59e0b" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Watch-Outs
            </Text>
          </View>
          <View style={styles.bulletList}>
            {displayResponse.watchOuts.map((item, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={[styles.bullet, { color: '#f59e0b' }]}>•</Text>
                <Text style={[styles.bulletText, { color: colors.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Next Step */}
      <View style={[styles.nextStepCard, { backgroundColor: isDark ? '#1a2b1a' : '#f0f9f0' }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="arrow-forward-circle-outline" size={18} color="#10b981" />
          <Text style={[styles.sectionTitle, { color: '#10b981' }]}>
            Best Next Step
          </Text>
        </View>
        <Text style={[styles.nextStepText, { color: colors.text }]}>
          {displayResponse.nextStep}
        </Text>
      </View>
      
      {/* Reflection Anchor */}
      {displayResponse.reflection && (
        <View style={[styles.reflectionCard, { backgroundColor: isDark ? '#1a1a2b' : '#f0f0f9' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={18} color="#6366f1" />
            <Text style={[styles.sectionTitle, { color: '#6366f1' }]}>
              Reflection Anchor
            </Text>
          </View>
          <TouchableOpacity onPress={handleOpenVerse}>
            <Text style={[styles.verseTitle, { color: colors.text }]}>
              {displayResponse.reflection.surahNameEn} ({displayResponse.reflection.surahNumber}:
              {displayResponse.reflection.ayahNumber})
            </Text>
          </TouchableOpacity>
          <Text style={[styles.reflectionPrompt, { color: colors.textSecondary }]}>
            {displayResponse.reflection.prompt}
          </Text>
          <TouchableOpacity
            style={[styles.verseButton, { borderColor: '#6366f1' }]}
            onPress={handleOpenVerse}
          >
            <Ionicons name="globe-outline" size={16} color="#6366f1" />
            <Text style={[styles.verseButtonText, { color: '#6366f1' }]}>
              Read on Quran.com
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
          {GUIDANCE_DISCLAIMER}
        </Text>
      </View>
      
      {/* Reset Button */}
      {onReset && (
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: colors.textSecondary }]}
          onPress={onReset}
        >
          <Ionicons name="refresh" size={18} color={colors.text} />
          <Text style={[styles.resetButtonText, { color: colors.text }]}>
            Ask Another Question
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  timingSignal: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  nextStepCard: {
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  nextStepText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  reflectionCard: {
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  verseTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  reflectionPrompt: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  verseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 4,
  },
  verseButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 4,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
