/**
 * Person ↔ Person Zodiac/Elemental Result View
 * Shown whenever either person used a date of birth instead of a name —
 * the abjad 4-method breakdown has no valid input for a DOB-only person,
 * so this view surfaces the complementary whole-sign aspect comparison
 * instead.
 *
 * No percentages anywhere: a single calendar date with unknown time and
 * place cannot support numeric precision. Outcomes are one of three tiers
 * (Saʿīd / Muʿtadil / Maḥdhūr), matching the dignity system's existing
 * resolution elsewhere in the app.
 */

import { AdBanner } from '@/components/ads/AdBanner';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ElementAccents } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PersonPersonCompatibility, PersonPersonParticipant } from '../../services/compatibility/types';
import { TierBadge } from './TierBadge';

const RELATIONSHIP_EMOJI: Record<PersonPersonCompatibility['relationshipContext'], string> = {
  marriage: '💕',
  friendship: '🤝',
  family: '👨‍👩‍👧',
  work: '💼',
  business: '🤝‍💼',
  universal: '✨',
};

const RELATIONSHIP_COLORS: Record<PersonPersonCompatibility['relationshipContext'], readonly [string, string]> = {
  marriage: ['#ec4899', '#f43f5e'],
  friendship: ['#3b82f6', '#2563eb'],
  family: ['#22c55e', '#16a34a'],
  work: ['#8b5cf6', '#7c3aed'],
  business: ['#0ea5e9', '#0284c7'],
  universal: ['#6366f1', '#8b5cf6'],
};

const LAYER_TITLE_KEYS = [
  'compatibility.results.zodiac.aspectEngine.layer1.title',
  'compatibility.results.zodiac.aspectEngine.layer2.title',
  'compatibility.results.zodiac.aspectEngine.layer3.title',
  'compatibility.results.zodiac.aspectEngine.layer4.title',
  'compatibility.results.zodiac.aspectEngine.layer5.title',
];

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
        {zodiac.ambiguous ? ' *' : ''}
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
  const router = useRouter();
  const { person1, person2, relationshipContext, evaluation, zodiacAspectResult } = result;
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

      {/* Ambiguity warning — either person's Sun sign unresolved */}
      {zodiacAspectResult?.ambiguityNote && (
        <View style={styles.ambiguityBox}>
          <Text style={[styles.ambiguityTitle, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.ambiguity.title')}
          </Text>
          <Text style={[styles.ambiguityText, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.ambiguity.explanation', {
              signs: zodiacAspectResult.ambiguityNote.candidateSigns.join(' / '),
            })}
          </Text>
          <Text style={[styles.ambiguityHint, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.ambiguity.addBirthTimeHint')}
          </Text>
        </View>
      )}

      {/* Elemental / Zāhir-Bāṭin / Planetary comparison — always available, no numbers */}
      <View style={styles.section}>
        <Text style={[styles.explanationText, isRTL && styles.textRTL]}>
          {localize(evaluation.elementalRelationship.explanation, language)}
        </Text>
        <Text style={[styles.explanationText, isRTL && styles.textRTL]}>
          {localize(evaluation.zahirBatinInteraction.explanation, language)}
        </Text>
        <Text style={[styles.explanationText, isRTL && styles.textRTL]}>
          {localize(evaluation.planetaryResonance.explanation, language)}
        </Text>
      </View>

      {/* Whole-Sign Aspect Analysis — only when both people used DOB */}
      {bothDob && zodiacAspectResult && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.aspectEngine.overallTitle')}
          </Text>

          <TierBadge tier={zodiacAspectResult.overallTier} large isRTL={isRTL} />

          {/* Same-sign double-edge — mandatory, never positive-only */}
          {zodiacAspectResult.sameSignConjunction && (
            <View style={styles.doubleEdgeBox}>
              <Text style={[styles.doubleEdgeTitle, isRTL && styles.textRTL]}>
                {t('compatibility.results.zodiac.sameSignDoubleEdge.intro', {
                  sign: (isRTL ? person1.zodiac?.burjAr : person1.zodiac?.burjEn) ?? '',
                })}
              </Text>
              <Text style={[styles.doubleEdgeText, isRTL && styles.textRTL]}>
                {t('compatibility.results.zodiac.sameSignDoubleEdge.positive', {
                  ruler: person1.zodiac?.planetaryRuler ?? '',
                })}
              </Text>
              <Text style={[styles.doubleEdgeText, isRTL && styles.textRTL]}>
                {t('compatibility.results.zodiac.sameSignDoubleEdge.challenge', {
                  ruler: person1.zodiac?.planetaryRuler ?? '',
                })}
              </Text>
            </View>
          )}

          <View style={styles.layerList}>
            {zodiacAspectResult.layers.map((layer, idx) => (
              <View key={layer.layer} style={styles.layerRow}>
                <Text style={[styles.layerTitle, isRTL && styles.textRTL]}>
                  {t(LAYER_TITLE_KEYS[idx])}
                </Text>
                <TierBadge tier={layer.tier} detailText={t(layer.detailKey)} isRTL={isRTL} />
              </View>
            ))}
          </View>

          {zodiacAspectResult.emphasizedFindings.length > 0 && (
            <View style={styles.emphasizedBox}>
              <Text style={[styles.emphasizedTitle, isRTL && styles.textRTL]}>
                {t('compatibility.results.zodiac.aspectEngine.emphasizedTitle')}
              </Text>
              {zodiacAspectResult.emphasizedFindings.map((finding, idx) => (
                <Text key={idx} style={[styles.emphasizedText, isRTL && styles.textRTL]}>
                  {t(finding.detailKey)}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Persistent scope disclaimer */}
      {(bothDob || mixedPairing) && (
        <Text style={[styles.disclaimerText, isRTL && styles.textRTL]}>
          {t('compatibility.results.zodiac.scopeDisclaimer')}
        </Text>
      )}

      {/* Mixed pairing note — exactly one DOB */}
      {mixedPairing && (
        <View style={styles.noteBox}>
          <Text style={[styles.noteText, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.mixedNote')}
          </Text>
        </View>
      )}

      {/* Best Dates cross-link — marriage context only */}
      {relationshipContext === 'marriage' && (
        <Pressable
          style={styles.crossLinkCard}
          onPress={() => router.push('/best-dates-check')}
        >
          <Text style={[styles.crossLinkTitle, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.bestDatesCrossLink.title')}
          </Text>
          <Text style={[styles.crossLinkCta, isRTL && styles.textRTL]}>
            {t('compatibility.results.zodiac.bestDatesCrossLink.cta')}
          </Text>
        </Pressable>
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
    marginBottom: 16,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  layerList: {
    marginTop: 16,
    gap: 14,
  },
  layerRow: {
    gap: 6,
  },
  layerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B0B0B0',
  },
  emphasizedBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  emphasizedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  emphasizedText: {
    fontSize: 13,
    color: '#E5E5E5',
    marginBottom: 4,
    lineHeight: 18,
  },
  doubleEdgeBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  doubleEdgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 6,
  },
  doubleEdgeText: {
    fontSize: 13,
    color: '#E5E5E5',
    marginBottom: 4,
    lineHeight: 18,
  },
  ambiguityBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  ambiguityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 6,
  },
  ambiguityText: {
    fontSize: 12,
    color: '#E5E5E5',
    marginBottom: 6,
    lineHeight: 17,
  },
  ambiguityHint: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 17,
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
  crossLinkCard: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.25)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  crossLinkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f9a8d4',
    marginBottom: 4,
  },
  crossLinkCta: {
    fontSize: 12,
    color: '#E5E5E5',
  },
});
