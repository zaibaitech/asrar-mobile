/**
 * Divine Timing Display Component
 * ================================
 * Displays Divine Timing reflection results
 */

import Colors from '@/constants/Colors';
import {
    DIVINE_TIMING_DISCLAIMER,
    getElementColor,
    getElementIcon,
    getTimingQualityColor,
    getTimingQualityIcon,
} from '@/services/DivineTimingService';
import { DivineTimingResult } from '@/types/divine-timing';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DivineTimingCardProps {
  result: DivineTimingResult;
  colorScheme?: 'light' | 'dark';
}

export function DivineTimingCard({ result, colorScheme = 'light' }: DivineTimingCardProps) {
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];
  
  const qualityIcon = getTimingQualityIcon(result.timingQuality);
  const qualityColor = getTimingQualityColor(result.timingQuality);
  const elementIcon = getElementIcon(result.elementalTone);
  const elementColor = getElementColor(result.elementalTone);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Divine Timing
          </Text>
        </View>
      </View>
      
      {/* Main Quality */}
      <View style={[styles.qualityCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
        <View style={styles.qualityHeader}>
          <Text style={styles.qualityIcon}>{qualityIcon}</Text>
          <View style={styles.qualityTextContainer}>
            <Text style={[styles.qualityLabel, { color: colors.textSecondary }]}>
              Timing Quality
            </Text>
            <Text style={[styles.qualityValue, { color: qualityColor }]}>
              {result.timingQuality.charAt(0).toUpperCase() + result.timingQuality.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Cycle & Element Row */}
      <View style={styles.infoRow}>
        {/* Cycle State */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Cycle State
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {result.cycleState}
          </Text>
        </View>
        
        {/* Elemental Tone */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Elemental Tone
          </Text>
          <View style={styles.elementRow}>
            <Text style={styles.elementIcon}>{elementIcon}</Text>
            <Text style={[styles.infoValue, { color: elementColor }]}>
              {result.elementalTone.charAt(0).toUpperCase() + result.elementalTone.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Guidance Message */}
      <View style={[styles.messageCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
        <View style={styles.messageHeader}>
          <Ionicons name="bulb-outline" size={20} color={colors.primary} />
          <Text style={[styles.messageLabel, { color: colors.textSecondary }]}>
            Reflective Guidance
          </Text>
        </View>
        <Text style={[styles.messageText, { color: colors.text }]}>
          {result.shortMessage}
        </Text>
        
        {/* Guidance Level Badge */}
        <View style={styles.guidanceBadge}>
          <Text style={[styles.guidanceBadgeText, { color: colors.primary }]}>
            {result.guidanceLevel === 'act' && '→ Engage mindfully'}
            {result.guidanceLevel === 'slow' && '⊙ Proceed deliberately'}
            {result.guidanceLevel === 'observe' && '◐ Reflect before acting'}
          </Text>
        </View>
      </View>
      
      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
          {DIVINE_TIMING_DISCLAIMER}
        </Text>
      </View>
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
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  qualityCard: {
    borderRadius: 12,
    padding: 16,
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qualityIcon: {
    fontSize: 32,
  },
  qualityTextContainer: {
    flex: 1,
    gap: 4,
  },
  qualityLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qualityValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  infoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  elementIcon: {
    fontSize: 16,
  },
  messageCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  guidanceBadge: {
    marginTop: 4,
  },
  guidanceBadgeText: {
    fontSize: 13,
    fontWeight: '500',
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
});
