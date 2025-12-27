/**
 * Daily Check-In Card Component
 * ==============================
 * Phase 4: Home card for daily divine timing reflection
 */

import Colors from '@/constants/Colors';
import { DailyCheckInSummary } from '@/types/daily-checkin';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface DailyCheckInCardProps {
  summary: DailyCheckInSummary;
  colorScheme?: 'light' | 'dark';
}

export function DailyCheckInCard({
  summary,
  colorScheme = 'light',
}: DailyCheckInCardProps) {
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const handlePress = () => {
    router.push('/daily-checkin');
  };
  
  const getTimingColor = () => {
    if (!summary.timingQuality) return colors.primary;
    if (summary.timingQuality === 'favorable') return '#10b981';
    if (summary.timingQuality === 'neutral') return '#f59e0b';
    if (summary.timingQuality === 'delicate') return '#ef4444';
    return colors.primary;
  };
  
  const getStreakMessage = () => {
    if (summary.streak === 0) return 'Start your journey';
    if (summary.streak === 1) return '1 day of reflection';
    return `${summary.streak} days of reflection`;
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="compass-outline" size={26} color={getTimingColor()} />
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Daily Guidance
            </Text>
            {summary.hasCheckedInToday && summary.timingQuality && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {summary.timingQuality.charAt(0).toUpperCase() + summary.timingQuality.slice(1)} window
              </Text>
            )}
          </View>
        </View>
        
        {/* Streak Badge */}
        {summary.streak > 0 && (
          <View style={[styles.streakBadge, { backgroundColor: getTimingColor() }]}>
            <Ionicons name="flame" size={14} color="#fff" />
            <Text style={styles.streakText}>{summary.streak}</Text>
          </View>
        )}
      </View>
      
      {/* Content */}
      {summary.hasCheckedInToday ? (
        <View style={styles.content}>
          <Text style={[styles.summary, { color: colors.text }]}>
            {summary.summary}
          </Text>
          
          <View style={styles.tagsRow}>
            {summary.timingQuality && (
              <View style={[styles.tag, { backgroundColor: getTimingColor() + '20' }]}>
                <Text style={[styles.tagText, { color: getTimingColor() }]}>
                  {summary.timingQuality}
                </Text>
              </View>
            )}
            {summary.elementalTone && (
              <View style={[styles.tag, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>
                  {summary.elementalTone}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.streakMessage, { color: colors.textSecondary }]}>
            ✨ {getStreakMessage()}
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={[styles.promptText, { color: colors.textSecondary }]}>
            Reflect on your intention and today's timing
          </Text>
          
          {summary.streak > 0 && (
            <Text style={[styles.streakMessage, { color: colors.textSecondary }]}>
              {getStreakMessage()} • Keep the consistency
            </Text>
          )}
          
          <View style={[styles.ctaButton, { backgroundColor: getTimingColor() }]}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.ctaText}>Check In</Text>
          </View>
        </View>
      )}
      
      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          For reflection only • Not a ruling
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    gap: 10,
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  streakMessage: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 4,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
