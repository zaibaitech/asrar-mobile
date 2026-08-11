/**
 * Person ↔ Person Zodiac/Elemental Result View
 * Shown whenever either person used a date of birth instead of a name —
 * the abjad 4-method breakdown has no valid input for a DOB-only person,
 * so this view surfaces the complementary burj/elemental comparison instead.
 */

import { AdBanner } from '@/components/ads/AdBanner';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ElementAccents } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PersonPersonCompatibility, PersonPersonParticipant } from '../../services/compatibility/types';
import { CompatibilityGauge } from './CompatibilityGauge';

const RELATIONSHIP_EMOJI: Record<PersonPersonCompatibility['relationshipContext'], string> = {
  marriage: '💕',
  friendship: '🤝',
  family: '👨‍👩‍👧',
  work: '💼',
  universal: '✨',
};

const RELATIONSHIP_COLORS: Record<PersonPersonCompatibility['relationshipContext'], readonly [string, string]> = {
  marriage: ['#ec4899', '#f43f5e'],
  friendship: ['#3b82f6', '#2563eb'],
  family: ['#22c55e', '#16a34a'],
  work: ['#8b5cf6', '#7c3aed'],
  universal: ['#6366f1', '#8b5cf6'],
};

function localize(field: { en: string; ar: string }, language: 'en' | 'fr' | 'ar'): string {
  return language === 'ar' ? field.ar : field.en;
}

function InputMethodBadge({ inputMethod, language }: { inputMethod: 'name' | 'dob'; language: 'en' | 'fr' | 'ar' }) {
  const { t } = useLanguage();
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {inputMethod === 'name' ? t('compatibility.results.inputMethodBadge.name') : t('compatibility.results.inputMethodBadge.dob')}
      </Text>
    </View>
  );
}

function SoloCard({ participant, language }: { participant: PersonPersonParticipant; language: 'en' | 'fr' | 'ar' }) {
  const { t } = useLanguage();
  const isRTL = language === 'ar';

  if (participant.inputMethod === 'name' && participant.destiny) {
    const accent = ElementAccents[participant.destiny.element];
    return (
      <View style={[styles.soloCard, { borderColor: accent.primary }]}>
        <Text style={[styles.soloCardTitle, isRTL && styles.textRTL]}>
          {t('compatibility.results.zodiac.soloCardTitleName')}
        </Text>
        <Text style={[styles.soloCardName, isRTL && styles.textRTL]}>{participant.name}</Text>
        <Text style={[styles.soloCardRow, isRTL && styles.textRTL]}>
          {accent.emoji} {t('compatibility.results.zodiac.elementLabel')}: {isRTL ? participant.destiny.burj.ar : participant.destiny.burj.en}
        </Text>
        <Text style={[styles.soloCardRow, isRTL && styles.textRTL]}>
          {t('compatibility.results.zodiac.planetaryRulerLabel')}: {participant.destiny.planet}
        </Text>
      </View>
    );
  }

  const zodiac = participant.zodiac!;
  const accent = ElementAccents[zodiac.element];
  const temperament = zodiac.burujProfile?.personality?.[language]?.temperament
    ?? zodiac.burujProfile?.personality?.en?.temperament;

  return (
    <View style={[styles.soloCard, { borderColor: accent.primary }]}>
      <Text style={[styles.soloCardTitle, isRTL && styles.textRTL]}>
        {t('compatibility.results.zodiac.soloCardTitleDob')}
      </Text>
      <Text style={[styles.soloCardName, isRTL && styles.textRTL]}>{participant.name}</Text>
      <Text style={[styles.soloCardRow, isRTL && styles.textRTL]}>
        {accent.emoji} {t('compatibility.results.zodiac.burjLabel')}: {isRTL ? zodiac.burjAr : zodiac.burjEn}
      </Text>
      <Text style={[styles.soloCardRow, isRTL && styles.textRTL]}>
        {t('compatibility.results.zodiac.planetaryRulerLabel')}: {zodiac.planetaryRuler.charAt(0).toUpperCase() + zodiac.planetaryRuler.slice(1)}
      </Text>
      {!!temperament && (
        <Text style={[styles.soloCardNote, isRTL && styles.textRTL]} numberOfLines={2}>
          {temperament}
        </Text>
      )}
    </View>
  );
}

export function PersonPersonZodiacResultView({
  result,
  language,
}: {
  result: PersonPersonCompatibility;
  language: 'en' | 'fr' | 'ar';
}) {
  const { t } = useLanguage();
  const { person1, person2, relationshipContext, evaluation, burjCompatibility } = result;
  const isRTL = language === 'ar';
  const emoji = RELATIONSHIP_EMOJI[relationshipContext];
  const colors = RELATIONSHIP_COLORS[relationshipContext];

  const bothDob = person1.inputMethod === 'dob' && person2.inputMethod === 'dob';
  const mixedPairing = person1.inputMethod !== person2.inputMethod;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <LinearGradient colors={colors as any} style={styles.headerCard}>
        <View style={styles.namesRow}>
          <View style={styles.personSection}>
            <Text style={styles.nameText}>{person1.name}</Text>
            <InputMethodBadge inputMethod={person1.inputMethod} language={language} />
          </View>
          <Text style={styles.heartEmoji}>{emoji}</Text>
          <View style={styles.personSection}>
            <Text style={styles.nameText}>{person2.name}</Text>
            <InputMethodBadge inputMethod={person2.inputMethod} language={language} />
          </View>
        </View>
        <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>
          {t('compatibility.results.zodiac.title')}
        </Text>
        <Text style={[styles.headerSubtitleSmall, isRTL && styles.textRTL]}>
          {t('compatibility.results.zodiac.subtitle')}
        </Text>
      </LinearGradient>

      {/* Solo Cards */}
      <View style={styles.soloRow}>
        <SoloCard participant={person1} language={language} />
        <SoloCard participant={person2} language={language} />
      </View>

      {/* Elemental / Zāhir-Bāṭin / Planetary comparison — always available */}
      <View style={styles.section}>
        <View style={styles.gaugeRow}>
          <CompatibilityGauge
            score={evaluation.resonanceScore}
            label={t('compatibility.results.zodiac.harmonyScoreLabel')}
            color={colors[0]}
            language={language}
          />
        </View>
        <Text style={[styles.explanationText, isRTL && styles.textRTL]}>
          {localize(evaluation.elementalRelationship.explanation, language)}
        </Text>
        <Text style={[styles.explanationText, isRTL && styles.textRTL]}>
          {localize(evaluation.zahirBatinInteraction.explanation, language)}
        </Text>
        <Text style={[styles.explanationText, isRTL && styles.textRTL]}>
          {localize(evaluation.planetaryResonance.explanation, language)}
        </Text>
        <Text style={[styles.disclaimerText, isRTL && styles.textRTL]}>
          {localize(evaluation.disclaimer, language)}
        </Text>
      </View>

      {/* Zodiac Harmony — only when both people used DOB */}
      {bothDob && burjCompatibility && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.burjLabel')}
          </Text>
          <View style={styles.harmonyRow}>
            <Text style={styles.harmonyScore}>{Math.round(burjCompatibility.harmonyScore)}%</Text>
            <Text style={[styles.harmonyReason, isRTL && styles.textRTL]}>
              {t(`compatibility.results.zodiac.burjReasons.${burjCompatibility.reasonKey}`)}
            </Text>
          </View>
        </View>
      )}

      {/* Mixed pairing note — exactly one DOB */}
      {mixedPairing && (
        <View style={styles.noteBox}>
          <Text style={[styles.noteText, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.mixedNote')}
          </Text>
        </View>
      )}

      <AdBanner />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personSection: {
    flex: 1,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  heartEmoji: {
    fontSize: 28,
    marginHorizontal: 8,
  },
  headerSubtitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitleSmall: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  soloRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  soloCard: {
    flex: 1,
    backgroundColor: '#2D1515',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  soloCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B0B0B0',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  soloCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  soloCardRow: {
    fontSize: 13,
    color: '#E5E5E5',
    marginBottom: 4,
  },
  soloCardNote: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 6,
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#2D1515',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  gaugeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 13,
    color: '#E5E5E5',
    marginBottom: 8,
    lineHeight: 19,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#808080',
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  harmonyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  harmonyScore: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  harmonyReason: {
    flex: 1,
    fontSize: 13,
    color: '#E5E5E5',
  },
  noteBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 12,
    color: '#B0B0B0',
    lineHeight: 18,
  },
});
