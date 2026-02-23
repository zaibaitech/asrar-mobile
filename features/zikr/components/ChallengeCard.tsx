/**
 * ChallengeCard Component
 * =======================
 * Individual challenge tracker with progress, quick-add buttons, and session logging.
 * Based on web app's ChallengeCard.tsx
 */

import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Share,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Challenge, SessionTag } from '../types';
import { 
  CHALLENGE_TYPE_STYLES, 
  SESSION_TAGS, 
  computePercent, 
  formatNumber 
} from '../constants';

// ─── Props ───────────────────────────────────────────────────────────────────────

interface ChallengeCardProps {
  challenge: Challenge;
  onLogCount: (amount: number, session: SessionTag) => void;
  onRemove: () => void;
  onToggleFavorite: () => void;
  defaultExpanded?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────────

function ChallengeCard({
  challenge,
  onLogCount,
  onRemove,
  onToggleFavorite,
  defaultExpanded = false,
}: ChallengeCardProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedSession, setSelectedSession] = useState<SessionTag>('Other');
  const [showSessionPicker, setShowSessionPicker] = useState(false);

  const style = CHALLENGE_TYPE_STYLES[challenge.type];
  const dailyPercent = computePercent(challenge.todayProgress, challenge.dailyTarget);
  const totalPercent = computePercent(challenge.totalProgress, challenge.totalTarget);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleQuickAdd = useCallback((amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLogCount(amount, selectedSession);
  }, [onLogCount, selectedSession]);

  const handleShare = useCallback(async () => {
    try {
      const message = language === 'fr'
        ? `J'ai fait ${formatNumber(challenge.totalProgress)} ${challenge.title} avec Asrariya! 🤲`
        : `I've completed ${formatNumber(challenge.totalProgress)} ${challenge.title} with Asrariya! 🤲`;
      
      await Share.share({
        message,
        title: challenge.title,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [challenge, language]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.card, { borderColor: style.accent }]}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{style.icon}</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={[styles.typeLabel, { color: style.text }]}>
              {language === 'fr' ? style.labelFr : style.labelEn}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {/* Streak Badge */}
          {challenge.streakDays > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakText}>{challenge.streakDays}</Text>
            </View>
          )}
          
          {/* Favorite */}
          <TouchableOpacity 
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.favoriteIcon}>
              {challenge.isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
          
          {/* Expand Arrow */}
          <Text style={[styles.expandArrow, expanded && styles.expandArrowUp]}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${dailyPercent}%`, backgroundColor: style.accent }
            ]} 
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>
            {formatNumber(challenge.todayProgress)} / {formatNumber(challenge.dailyTarget)}
          </Text>
          <Text style={styles.progressPercent}>{dailyPercent}%</Text>
        </View>
      </View>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Arabic Text */}
          <View style={styles.arabicSection}>
            <Text style={styles.arabicText}>{challenge.arabicText}</Text>
            <Text style={styles.transliteration}>{challenge.transliteration}</Text>
            {challenge.meaning && (
              <Text style={styles.meaning}>
                {language === 'fr' && challenge.meaningFr 
                  ? challenge.meaningFr 
                  : challenge.meaning}
              </Text>
            )}
          </View>

          {/* Quick Add Buttons */}
          <View style={styles.quickAddSection}>
            <Text style={styles.sectionLabel}>
              {t('zikr.quickAdd') || 'Quick Add'}
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAddButtons}
            >
              {challenge.quickAddPresets.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.quickAddBtn, { borderColor: style.accent }]}
                  onPress={() => handleQuickAdd(amount)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickAddText, { color: style.text }]}>
                    +{formatNumber(amount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Session Picker */}
          <View style={styles.sessionSection}>
            <Text style={styles.sectionLabel}>
              {t('zikr.session') || 'Session'}
            </Text>
            <TouchableOpacity
              style={styles.sessionSelector}
              onPress={() => setShowSessionPicker(!showSessionPicker)}
            >
              <Text style={styles.sessionText}>{selectedSession}</Text>
              <Text style={styles.sessionArrow}>▼</Text>
            </TouchableOpacity>
            
            {showSessionPicker && (
              <View style={styles.sessionDropdown}>
                {SESSION_TAGS.map((session) => (
                  <TouchableOpacity
                    key={session}
                    style={[
                      styles.sessionOption,
                      selectedSession === session && styles.sessionOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedSession(session);
                      setShowSessionPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.sessionOptionText,
                      selectedSession === session && styles.sessionOptionTextActive,
                    ]}>
                      {session}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Total Progress */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {t('zikr.totalProgress') || 'Total Progress'}
              </Text>
              <Text style={styles.totalValue}>
                {formatNumber(challenge.totalProgress)} / {formatNumber(challenge.totalTarget)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${totalPercent}%`, backgroundColor: style.accent }
                ]} 
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={handleShare}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>
                {t('zikr.share') || 'Share'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.removeBtn]}
              onPress={onRemove}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
              <Text style={[styles.actionText, styles.removeText]}>
                {t('zikr.remove') || 'Remove'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: DarkTheme.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  typeLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakIcon: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 2,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  expandArrow: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    transform: [{ rotate: '0deg' }],
  },
  expandArrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: DarkTheme.surfaceTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.border,
  },
  arabicSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  arabicText: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
  },
  transliteration: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  quickAddSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickAddButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAddBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  quickAddText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sessionSection: {
    marginTop: 16,
  },
  sessionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DarkTheme.surfaceTertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  sessionText: {
    fontSize: 15,
    color: DarkTheme.textPrimary,
  },
  sessionArrow: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  sessionDropdown: {
    backgroundColor: DarkTheme.surfaceTertiary,
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  sessionOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.border,
  },
  sessionOptionActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  sessionOptionText: {
    fontSize: 15,
    color: DarkTheme.textPrimary,
  },
  sessionOptionTextActive: {
    color: '#D4AF37',
    fontWeight: '600',
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: DarkTheme.surfaceTertiary,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
  },
  removeBtn: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
  },
  removeText: {
    color: '#F44336',
  },
});

export default memo(ChallengeCard);
