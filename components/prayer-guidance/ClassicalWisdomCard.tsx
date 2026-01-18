/**
 * Classical Wisdom Card Component
 * 
 * Displays classical hour practices from manuscript sources
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/data/classical-hour-practices';
import { getClassicalWisdomGuidance } from '@/data/classical-wisdom-guidance';
import type { PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClassicalWisdomCardProps {
  wisdom: PrayerGuidanceRecommendation['classicalWisdom'];
  planet?: Planet;
}

function fallbackFromKey(key: string): string {
  const lastSegment = key.split('.').pop() || key;
  return lastSegment
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function ClassicalWisdomCard({ wisdom, planet }: ClassicalWisdomCardProps) {
  const [showArabic, setShowArabic] = useState(false);
  const [showModernContext, setShowModernContext] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const { t, tSafe, language } = useLanguage();

  const getWorkName = (workKey: string) => {
    const direct = tSafe(workKey, '');
    if (direct) return direct;
    return tSafe(`${workKey}.name`, fallbackFromKey(workKey));
  };

  const getWorkDescription = (workKey: string) => {
    return tSafe(`${workKey}.description`, '');
  };
  
  const hasRecommended = wisdom.recommendedWorks.length > 0;
  const hasAvoid = wisdom.worksToAvoid.length > 0;
  const modernContextText = t('prayerGuidance.ui.modernContextExplanation');
  const modernContextPoints = modernContextText
    .split(/\s*[.!?]+\s*/g)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const guidance = useMemo(() => getClassicalWisdomGuidance(planet ?? null, language), [planet, language]);

  const renderWorkCard = (work: string, variant: 'recommended' | 'avoid') => {
    const description = getWorkDescription(work);
    const isRecommended = variant === 'recommended';
    const tagLabel = isRecommended
      ? t('prayerGuidance.hours.recommendedWorks')
      : t('prayerGuidance.hours.avoidWorks');

    return (
      <View
        key={`${variant}-${work}`}
        style={[styles.workCard, isRecommended ? styles.workCardRecommended : styles.workCardAvoid]}
      >
        <View style={styles.workCardHeader}>
          <View style={styles.workIconWrap}>
            <Text style={styles.workIcon}>{isRecommended ? '✨' : '⚠️'}</Text>
          </View>
          <View style={styles.workTextContainer}>
            <Text style={styles.workText}>{getWorkName(work)}</Text>
            {!!description && (
              <Text style={styles.workDescription}>{description}</Text>
            )}
          </View>
          <View style={[styles.workTag, isRecommended ? styles.workTagRecommended : styles.workTagAvoid]}>
            <Text
              style={[
                styles.workTagText,
                isRecommended ? styles.workTagTextRecommended : styles.workTagTextAvoid,
              ]}
            >
              {tagLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📜 {t('prayerGuidance.ui.classicalWisdom')}</Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowArabic(!showArabic)}
        >
          <Text style={styles.toggleText}>
            {showArabic ? 'EN' : 'ع'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.source}>{wisdom.source}</Text>

      <View style={styles.spiritualCard}>
        <View style={styles.spiritualHeader}>
          <Text style={styles.spiritualIcon}>{guidance.spiritualGuidance.icon}</Text>
          <View style={styles.spiritualHeaderText}>
            <Text style={styles.spiritualTitle}>{guidance.spiritualGuidance.title}</Text>
            <Text style={styles.spiritualSubtitle}>
              {tSafe('prayerGuidance.ui.forEveryone', 'For Everyone')}
            </Text>
          </View>
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>
              {tSafe('prayerGuidance.ui.primaryFocus', 'Primary')}
            </Text>
          </View>
        </View>

        <Text style={styles.spiritualNote}>
          {tSafe(
            'prayerGuidance.ui.spiritualPrimary',
            'Spiritual practice is primary; worldly alignment is secondary.'
          )}
        </Text>

        <View style={styles.practiceGroup}>
          <Text style={styles.practiceTitle}>🧿 {tSafe('prayerGuidance.ui.dhikrTitle', 'Recommended Dhikr')}</Text>
          {guidance.spiritualGuidance.forEveryone.dhikrRecommendations.map((dhikr, index) => (
            <View key={`${dhikr.arabicText}-${index}`} style={styles.practiceItem}>
              <View style={styles.practiceHeader}>
                <Text style={styles.practiceArabic}>{dhikr.arabicText}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{dhikr.count}×</Text>
                </View>
              </View>
              <Text style={styles.practiceTransliteration}>{dhikr.transliteration}</Text>
              <Text style={styles.practiceTranslation}>{dhikr.translation}</Text>
              <Text style={styles.practiceMeta}>{dhikr.timing}</Text>
              <Text style={styles.practiceBenefit}>{dhikr.benefits}</Text>
            </View>
          ))}
        </View>

        <View style={styles.practiceGroup}>
          <Text style={styles.practiceTitle}>📖 {tSafe('prayerGuidance.ui.quranTitle', 'Quranic Recitation')}</Text>
          {guidance.spiritualGuidance.forEveryone.quranGuidance.map((entry, index) => (
            <View key={`${entry.surahName}-${index}`} style={styles.practiceItemAlt}>
              <Text style={styles.practiceLabel}>{entry.surahName}</Text>
              <Text style={styles.practiceMeta}>{entry.ayatReference}</Text>
              <Text style={styles.practiceTranslation}>{entry.purpose}</Text>
              <Text style={styles.practiceMeta}>{entry.repetitions}× • {entry.timing}</Text>
            </View>
          ))}
        </View>

        <View style={styles.practiceGroup}>
          <Text style={styles.practiceTitle}>🤲 {tSafe('prayerGuidance.ui.duaTitle', 'Recommended Duas')}</Text>
          {guidance.spiritualGuidance.forEveryone.duaRecommendations.map((dua, index) => (
            <View key={`${dua.source}-${index}`} style={styles.practiceItemAlt}>
              <Text style={styles.practiceArabic}>{dua.duaText}</Text>
              <Text style={styles.practiceTransliteration}>{dua.transliteration}</Text>
              <Text style={styles.practiceTranslation}>{dua.translation}</Text>
              <Text style={styles.practiceMeta}>{dua.source} • {dua.context}</Text>
            </View>
          ))}
        </View>

        <View style={styles.practiceGroup}>
          <Text style={styles.practiceTitle}>🕊️ {tSafe('prayerGuidance.ui.intentionsTitle', 'Spiritual Intentions (Niyyah)')}</Text>
          {guidance.spiritualGuidance.forEveryone.spiritualIntentions.map((intent, index) => (
            <View key={`${intent}-${index}`} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{intent}</Text>
            </View>
          ))}
        </View>

        <View style={styles.practiceGroup}>
          <Text style={styles.practiceTitle}>🌿 {tSafe('prayerGuidance.ui.sunnahTitle', 'Sunnah Practices')}</Text>
          {guidance.spiritualGuidance.forEveryone.sunnahPractices.map((practice, index) => (
            <View key={`${practice}-${index}`} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{practice}</Text>
            </View>
          ))}
        </View>

        <View style={styles.practiceGroup}>
          <Text style={styles.practiceTitle}>🧼 {tSafe('prayerGuidance.ui.adabTitle', 'Proper Manners (Adab)')}</Text>
          {guidance.spiritualGuidance.forEveryone.adab.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Original Arabic Text */}
      {showArabic && wisdom.originalText && (
        <View style={styles.arabicContainer}>
          <Text style={styles.arabicText}>{wisdom.originalText}</Text>
        </View>
      )}
      
      {/* Recommended Works */}
      {hasRecommended && showAdvanced && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ {t('prayerGuidance.hours.recommendedWorks')}</Text>
          <View style={styles.worksGrid}>
            {wisdom.recommendedWorks.map((work) => renderWorkCard(work, 'recommended'))}
          </View>
        </View>
      )}
      
      {/* Works to Avoid */}
      {hasAvoid && showAdvanced && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.avoidTitle]}>
            ⚠️ {t('prayerGuidance.hours.avoidWorks')}
          </Text>
          <View style={styles.worksGrid}>
            {wisdom.worksToAvoid.map((work) => renderWorkCard(work, 'avoid'))}
          </View>
        </View>
      )}

      <View style={styles.advancedSection}>
        <View style={styles.advancedHeader}>
          <Text style={styles.advancedTitle}>🧭 {tSafe('prayerGuidance.ui.forPractitioners', 'For Practitioners')}</Text>
          <TouchableOpacity
            style={styles.modernToggleButton}
            onPress={() => setShowAdvanced((prev) => !prev)}
          >
            <Text style={styles.modernToggleText}>
              {showAdvanced
                ? tSafe('prayerGuidance.ui.collapseAdvanced', 'Hide Advanced Guidance')
                : tSafe('prayerGuidance.ui.expandAdvanced', 'View Advanced Guidance')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.advancedWarning}>
          {guidance.spiritualGuidance.forPractitioners.warningNote}
        </Text>
        {showAdvanced && (
          <>
            <View style={styles.advancedList}>
              {guidance.spiritualGuidance.forPractitioners.advancedApplications.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.bulletRow}>
                  <Text style={[styles.bullet, styles.warningBullet]}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.advancedReferences}>
              <Text style={styles.practiceLabel}>{tSafe('prayerGuidance.ui.classicalReferences', 'Traditional References')}</Text>
              {guidance.spiritualGuidance.forPractitioners.classicalReferences.map((ref, index) => (
                <Text key={`${ref}-${index}`} style={styles.practiceMeta}>• {ref}</Text>
              ))}
            </View>
          </>
        )}
      </View>
      
      {/* Modern Context Section */}
      {(hasRecommended || hasAvoid) && (
        <View style={styles.modernContextSection}>
          <View style={styles.modernContextHeader}>
            <Text style={styles.modernContextTitle}>
              🌍 {t('prayerGuidance.ui.modernContext')}
            </Text>
            <TouchableOpacity
              style={styles.modernToggleButton}
              onPress={() => setShowModernContext(!showModernContext)}
            >
              <Text style={styles.modernToggleText}>
                {showModernContext ? t('prayerGuidance.ui.hide') : t('prayerGuidance.ui.show')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showModernContext && (
            <View style={styles.modernContextContent}>
              {modernContextPoints.map((point, index) => (
                <View key={index} style={styles.modernContextBulletRow}>
                  <Text style={styles.modernContextBullet}>•</Text>
                  <Text style={styles.modernContextExplanation}>{point}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.contextSection}>
        <View style={styles.contextHeader}>
          <Text style={styles.contextTitle}>📘 {tSafe('prayerGuidance.ui.traditionalContext', 'Traditional Context')}</Text>
          <TouchableOpacity
            style={styles.modernToggleButton}
            onPress={() => setShowContext((prev) => !prev)}
          >
            <Text style={styles.modernToggleText}>
              {showContext ? tSafe('common.buttons.collapse', 'Show Less') : tSafe('common.buttons.learnMore', 'Learn More')}
            </Text>
          </TouchableOpacity>
        </View>
        {showContext && (
          <View style={styles.contextBody}>
            <Text style={styles.contextText}>{guidance.traditionalContext.historicalBackground}</Text>
            <Text style={styles.contextText}>• {guidance.traditionalContext.geographicalOrigin}</Text>
            <Text style={styles.contextText}>{guidance.traditionalContext.purposeExplanation}</Text>
          </View>
        )}
      </View>

      <View style={styles.naturalAlignment}> 
        <Text style={styles.naturalAlignmentTitle}>🌾 {tSafe('prayerGuidance.ui.naturalAlignment', 'Natural Alignment')}</Text>
        <Text style={styles.naturalAlignmentText}>{guidance.naturalAlignment.description}</Text>
        <Text style={styles.naturalAlignmentNote}>{guidance.naturalAlignment.note}</Text>
      </View>
      
      {!hasRecommended && !hasAvoid && (
        <Text style={styles.emptyText}>
          {t('prayerGuidance.ui.noClassicalGuidance')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  toggleButton: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textTertiary,
  },
  source: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  arabicContainer: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderRightWidth: 3,
    borderRightColor: DarkTheme.textMuted,
  },
  arabicText: {
    fontSize: 16,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    lineHeight: 24,
    fontFamily: 'System'
  },
  section: {
    marginTop: Spacing.md,
  },
  spiritualCard: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 14,
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.25)',
  },
  spiritualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 8,
  },
  spiritualIcon: {
    fontSize: 20,
  },
  spiritualHeaderText: {
    flex: 1,
  },
  spiritualTitle: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  spiritualSubtitle: {
    fontSize: 12,
    color: DarkTheme.textMuted,
  },
  primaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  primaryBadgeText: {
    fontSize: 10,
    color: '#34C759',
    fontWeight: Typography.weightSemibold,
  },
  spiritualNote: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.sm,
  },
  practiceGroup: {
    marginTop: Spacing.md,
  },
  practiceTitle: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 6,
  },
  practiceItem: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  practiceItemAlt: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  practiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  practiceArabic: {
    fontSize: 16,
    color: DarkTheme.textPrimary,
  },
  practiceTransliteration: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  practiceTranslation: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    marginTop: 2,
  },
  practiceMeta: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    marginTop: 2,
  },
  practiceBenefit: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    marginTop: 4,
  },
  practiceLabel: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
  },
  countBadgeText: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: Typography.weightSemibold,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    marginRight: 8,
    color: DarkTheme.textMuted,
    fontSize: 14,
    lineHeight: 18,
  },
  warningBullet: {
    color: '#FFB020',
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  advancedSection: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 32, 0.35)',
    backgroundColor: 'rgba(255, 176, 32, 0.08)',
  },
  advancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  advancedTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  advancedWarning: {
    fontSize: 12,
    color: '#FFB020',
    marginTop: 4,
  },
  advancedList: {
    marginTop: Spacing.sm,
  },
  advancedReferences: {
    marginTop: Spacing.sm,
  },
  contextSection: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.25)',
    backgroundColor: 'rgba(100, 181, 246, 0.08)',
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  contextBody: {
    marginTop: Spacing.sm,
  },
  contextText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  naturalAlignment: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    backgroundColor: DarkTheme.cardBackgroundAlt,
  },
  naturalAlignmentTitle: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  naturalAlignmentText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  naturalAlignmentNote: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: '#34C759',
    marginBottom: Spacing.sm,
  },
  avoidTitle: {
    color: '#FF3B30'
  },
  worksGrid: {
    gap: 10,
  },
  workCard: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: DarkTheme.cardBackgroundAlt,
  },
  workCardRecommended: {
    borderColor: 'rgba(52, 199, 89, 0.35)',
  },
  workCardAvoid: {
    borderColor: 'rgba(255, 59, 48, 0.35)',
  },
  workCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  workIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DarkTheme.cardBackground,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  workIcon: {
    fontSize: 14,
  },
  workText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20
  },
  workTextContainer: {
    flex: 1,
  },
  workDescription: {
    marginTop: 2,
    fontSize: 12,
    color: DarkTheme.textMuted,
    lineHeight: 16,
  },
  workTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  workTagRecommended: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    borderColor: 'rgba(52, 199, 89, 0.35)',
  },
  workTagAvoid: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderColor: 'rgba(255, 59, 48, 0.35)',
  },
  workTagText: {
    fontSize: 10,
    fontWeight: Typography.weightSemibold,
  },
  workTagTextRecommended: {
    color: '#34C759',
  },
  workTagTextAvoid: {
    color: '#FF3B30',
  },
  emptyText: {
    fontSize: 14,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12
  },
  modernContextSection: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  modernContextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  modernContextTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  modernToggleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: DarkTheme.cardBackground,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  modernToggleText: {
    fontSize: 11,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textTertiary,
  },
  modernContextContent: {
    marginTop: Spacing.sm,
  },
  modernContextBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modernContextBullet: {
    marginRight: 8,
    color: DarkTheme.textMuted,
    fontSize: 14,
    lineHeight: 18,
  },
  modernContextExplanation: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
});

export default ClassicalWisdomCard;
