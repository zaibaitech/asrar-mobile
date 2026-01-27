/**
 * Collapsible Educational Section
 * ================================
 * Consolidated educational content that expands on demand
 * Combines "Why This Timing?" information in one organized section
 * 
 * Shows:
 * - Element harmony explanation
 * - Moment alignment
 * - Planetary resonance
 * - Overall guidance
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { translations } from '@/constants/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EducationalContent {
  elementHarmony: string;
  momentAlignment: string;
  planetaryResonance: string;
  guidance: string;
}

interface CollapsibleEducationalSectionProps {
  whyThisTiming: EducationalContent;
}

export default function CollapsibleEducationalSection({
  whyThisTiming,
}: CollapsibleEducationalSectionProps) {
  const { language } = useLanguage();
  const lang = language as 'en' | 'fr' | 'ar';
  const t = translations[lang];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>
          {isExpanded ? '▼' : '▶'} {t.notifications.timing.whyThisTiming}
        </Text>
        <Text style={styles.tapToExpand}>
          {isExpanded ? t.common.buttons.collapse : t.common.buttons.tapToLearn}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Element Harmony */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌍 {t.notifications.timing.elementHarmony}</Text>
            <Text style={styles.sectionText}>{whyThisTiming.elementHarmony}</Text>
          </View>

          {/* Moment Alignment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧭 {t.notifications.timing.momentAlignment}</Text>
            <Text style={styles.sectionText}>{whyThisTiming.momentAlignment}</Text>
          </View>

          {/* Planetary Resonance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ {t.notifications.timing.planetaryResonance}</Text>
            <Text style={styles.sectionText}>{whyThisTiming.planetaryResonance}</Text>
          </View>

          {/* Overall Guidance */}
          <View style={[styles.section, styles.guidanceSection]}>
            <Text style={styles.sectionTitle}>💡 {t.notifications.timing.whatThisMeans}</Text>
            <Text style={styles.sectionText}>{whyThisTiming.guidance}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginVertical: 12,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  headerText: {
    color: DarkTheme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  tapToExpand: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },

  content: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },

  section: {
    gap: 8,
  },

  sectionTitle: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },

  sectionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },

  guidanceSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
});
