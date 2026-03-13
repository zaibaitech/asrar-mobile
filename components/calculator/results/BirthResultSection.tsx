/**
 * Birth Profile Results Component
 * Displays spiritual birth profile calculation results in cards
 */

import { InfoTooltip } from '@/components/InfoTooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { BirthInsights } from '@/types/calculator-enhanced';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionCard } from './ActionCard';
import { CosmicBlueprintCard } from './CosmicBlueprintCard';

interface BirthProfileResultsProps {
  insights: BirthInsights;
}

export const BirthProfileResults: React.FC<BirthProfileResultsProps> = ({ insights }) => {
  const { t, tSafe, language } = useLanguage();
  const [moonExpanded, setMoonExpanded] = useState(false);

  const getElementColor = (element: string): string => {
    const colors = {
      fire: '#ef4444',
      water: '#3b82f6',
      air: '#eab308',
      earth: '#22c55e',
    };
    return colors[element as keyof typeof colors] || '#6366f1';
  };

  const getPlanetLabel = (planetName: string): string => {
    const key = planetName.trim().toLowerCase();
    return tSafe(`common.planets.${key}`, planetName);
  };

  const getZodiacLabel = (signName: string): string => {
    const key = signName.trim().toLowerCase();
    return tSafe(`common.zodiacSigns.${key}`, signName);
  };

  const guidanceBullets = (insights.spiritualImprint.guidanceBulletsKeys || [])
    .map((key: string) => ({ key, text: tSafe(key, '') }))
    .filter((item: { key: string; text: string }) => item.text.trim().length > 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Summary chips banner — quick-glance key facts */}
      <View style={styles.chipsBanner}>
        <View style={styles.chip}>
          <Text style={styles.chipLabel}>☀️</Text>
          <Text style={styles.chipValue}>{getZodiacLabel(insights.chartBasics.sunSign.sign)}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipLabel}>🌙</Text>
          <Text style={styles.chipValue}>{getZodiacLabel(insights.chartBasics.moonSign.sign)}</Text>
        </View>
        {insights.chartBasics.ascendant && (
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>⬆️</Text>
            <Text style={styles.chipValue}>
              {getZodiacLabel(insights.chartBasics.ascendant.sign)}{' '}
              {tSafe('birth.summaryBanner.rising', 'Rising')}
            </Text>
          </View>
        )}
        <View style={[styles.chip, styles.chipAccent]}>
          <Text style={styles.chipValue}>
            {t(`common.elements.${insights.spiritualImprint.dominantElement}`)}
          </Text>
        </View>
        <View style={[styles.chip, styles.chipAccent]}>
          <Text style={styles.chipValue}>{getPlanetLabel(insights.spiritualImprint.dominantPlanet)}</Text>
        </View>
      </View>

      {/* Cosmic Blueprint - "What This Means For You" summary */}
      <CosmicBlueprintCard insights={insights} />

      {/* Card 1: Birth Summary */}
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>🌟 {t('calculator.birth.results.birthSummary')}</Text>
        
        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>☀️ {t('calculator.birth.results.sun')}</Text>
            <InfoTooltip tooltipKey="sun" />
          </View>
          <View style={styles.valueContainer}>
            <View style={styles.valueWithTooltip}>
              <Text style={[styles.value, { color: getElementColor(insights.chartBasics.sunSign.element) }]}>
                {getZodiacLabel(insights.chartBasics.sunSign.sign)}
              </Text>
              <InfoTooltip tooltipKey={insights.chartBasics.sunSign.sign.toLowerCase()} size={14} />
            </View>
            <Text style={styles.subValue}>
              {insights.chartBasics.sunSign.degree.toFixed(1)}° • {t(`common.elements.${insights.chartBasics.sunSign.element}`)}
            </Text>
          </View>
        </View>

        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>🌙 {t('calculator.birth.results.moon')}</Text>
            <InfoTooltip tooltipKey="moon" />
          </View>
          <View style={styles.valueContainer}>
            <View style={styles.valueWithTooltip}>
              <Text style={[styles.value, { color: getElementColor(insights.chartBasics.moonSign.element) }]}>
                {getZodiacLabel(insights.chartBasics.moonSign.sign)}
              </Text>
              <InfoTooltip tooltipKey={insights.chartBasics.moonSign.sign.toLowerCase()} size={14} />
            </View>
            <Text style={styles.subValue}>
              {insights.chartBasics.moonSign.degree.toFixed(1)}° • {t(`common.elements.${insights.chartBasics.moonSign.element}`)}
            </Text>
          </View>
        </View>

        {insights.chartBasics.ascendant && (
          <View style={styles.dataRow}>
            <View style={styles.labelWithTooltip}>
              <Text style={styles.label}>⬆️ {t('calculator.birth.results.ascendant')}</Text>
              <InfoTooltip tooltipKey="ascendant" />
            </View>
            <View style={styles.valueContainer}>
              <View style={styles.valueWithTooltip}>
                <Text style={[styles.value, { color: getElementColor(insights.chartBasics.ascendant.element) }]}>
                  {getZodiacLabel(insights.chartBasics.ascendant.sign)}
                </Text>
                <InfoTooltip tooltipKey={insights.chartBasics.ascendant.sign.toLowerCase()} size={14} />
              </View>
              <Text style={styles.subValue}>
                {insights.chartBasics.ascendant.degree.toFixed(1)}° • {t(`common.elements.${insights.chartBasics.ascendant.element}`)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.separator} />

        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>🌌 {t('calculator.birth.results.manzil')}</Text>
            <InfoTooltip tooltipKey="lunarMansion" />
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{insights.chartBasics.lunarMansion.arabicName}</Text>
            <Text style={styles.subValue}>
              {t('calculator.birth.results.manzilNumber', { number: insights.chartBasics.lunarMansion.index })}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Card 2: Angles (only if time known) */}
      {insights.chartBasics.ascendant && (
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>📐 {t('calculator.birth.results.angles')}</Text>
          
          <View style={styles.dataRow}>
            <View style={styles.labelWithTooltip}>
              <Text style={styles.label}>{t('calculator.birth.results.ascendant')}</Text>
              <InfoTooltip tooltipKey="ascendant" />
            </View>
            <Text style={[styles.value, { color: getElementColor(insights.chartBasics.ascendant.element) }]}>
              {getZodiacLabel(insights.chartBasics.ascendant.sign)} {insights.chartBasics.ascendant.degree.toFixed(1)}°
            </Text>
          </View>

          {insights.chartBasics.descendant && (
            <View style={styles.dataRow}>
              <View style={styles.labelWithTooltip}>
                <Text style={styles.label}>{t('calculator.birth.results.descendant')}</Text>
                <InfoTooltip tooltipKey="descendant" />
              </View>
              <Text style={[styles.value, { color: getElementColor(insights.chartBasics.descendant.element) }]}>
                {getZodiacLabel(insights.chartBasics.descendant.sign)} {insights.chartBasics.descendant.degree.toFixed(1)}°
              </Text>
            </View>
          )}
        </LinearGradient>
      )}

      {/* Card 3: Planets */}
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>🪐 {t('calculator.birth.results.planets')}</Text>
        
        {insights.planets.map((planet: any, index: number) => {
          const insightText = tSafe(
            `birth.planetInsight.${planet.planet.toLowerCase()}.${planet.condition.label}`,
            ''
          );
          return (
            <View key={index} style={styles.planetRow}>
              <View style={styles.planetHeader}>
                <View style={styles.labelWithTooltip}>
                  <Text style={styles.planetName}>{getPlanetLabel(planet.planet)}</Text>
                  <InfoTooltip tooltipKey={planet.planet.toLowerCase()} size={14} />
                </View>
                {planet.retrograde && (
                  <Text style={styles.retroBadge}>℞</Text>
                )}
              </View>

              <View style={styles.planetDetails}>
                <View style={styles.valueWithTooltip}>
                  <Text style={styles.planetSign}>
                    {getZodiacLabel(planet.sign)} {planet.degree.toFixed(1)}°
                  </Text>
                  <InfoTooltip tooltipKey={planet.sign.toLowerCase()} size={12} />
                </View>
                <View style={styles.conditionWithTooltip}>
                  <View style={[styles.conditionBadge, {
                    backgroundColor: planet.condition.label === 'strong' ? '#22c55e33' :
                                     planet.condition.label === 'weak' ? '#ef444433' : '#64748b33'
                  }]}>
                    <Text style={[styles.conditionText, {
                      color: planet.condition.label === 'strong' ? '#22c55e' :
                             planet.condition.label === 'weak' ? '#ef4444' : '#94a3b8'
                    }]}>
                      {t(`calculator.birth.condition.${planet.condition.label}`)} ({planet.condition.score})
                    </Text>
                  </View>
                  <InfoTooltip tooltipKey={planet.condition.label} size={12} />
                </View>
              </View>

              {insightText ? (
                <Text style={styles.planetInsightText}>💡 {insightText}</Text>
              ) : null}
            </View>
          );
        })}
      </LinearGradient>

      {/* Card 4: Moon Timing */}
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.card}
      >
        <View style={styles.moonCardHeader}>
          <Text style={[styles.cardTitle, styles.moonCardTitle]}>🌙 {t('calculator.birth.results.moonTiming')}</Text>
          <Pressable onPress={() => setMoonExpanded(!moonExpanded)} style={styles.moonToggle}>
            <Text style={styles.moonToggleText}>
              {moonExpanded
                ? tSafe('birth.results.hideMoonDetails', 'Hide details')
                : tSafe('birth.results.showMoonDetails', 'See lunar details')}
            </Text>
            <Ionicons
              name={moonExpanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="#8B7BF7"
            />
          </Pressable>
        </View>

        {/* Phase — always visible */}
        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>{t('calculator.birth.results.phase')}</Text>
            <InfoTooltip tooltipKey="lunarPhase" />
          </View>
          <Text style={styles.value}>
            {t(`moon.${insights.moonTiming.phase}.title`)}
          </Text>
        </View>

        {/* Expand: Lunar Day, Illumination, Direction */}
        {moonExpanded && (
          <>
            <View style={styles.dataRow}>
              <View style={styles.labelWithTooltip}>
                <Text style={styles.label}>{t('calculator.birth.results.lunarDay')}</Text>
                <InfoTooltip tooltipKey="lunarDay" />
              </View>
              <Text style={styles.value}>
                {t('calculator.birth.results.dayNumber', { day: insights.moonTiming.lunarDay })}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <View style={styles.labelWithTooltip}>
                <Text style={styles.label}>{t('calculator.birth.results.illumination')}</Text>
                <InfoTooltip tooltipKey="illumination" />
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${insights.moonTiming.illumination}%` }]} />
                <Text style={styles.progressText}>{insights.moonTiming.illumination}%</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <View style={styles.labelWithTooltip}>
                <Text style={styles.label}>{t('calculator.birth.results.direction')}</Text>
                <InfoTooltip tooltipKey={insights.moonTiming.isWaxing ? 'waxingMoon' : 'waningMoon'} />
              </View>
              <Text style={styles.value}>
                {insights.moonTiming.isWaxing ? t('moon.ui.waxing') : t('moon.ui.waning')}
              </Text>
            </View>
          </>
        )}
      </LinearGradient>

      {/* Card 5: Spiritual Imprint */}
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>✨ {t('calculator.birth.results.spiritualImprint')}</Text>
        
        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>{t('calculator.birth.results.dominantElement')}</Text>
            <InfoTooltip tooltipKey={`element_${insights.spiritualImprint.dominantElement}`} />
          </View>
          <Text style={[styles.value, { color: getElementColor(insights.spiritualImprint.dominantElement) }]}>
            {t(`common.elements.${insights.spiritualImprint.dominantElement}`)}
          </Text>
        </View>

        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>{t('calculator.birth.results.dominantPlanet')}</Text>
            <InfoTooltip tooltipKey={insights.spiritualImprint.dominantPlanet} />
          </View>
          <Text style={styles.value}>{getPlanetLabel(insights.spiritualImprint.dominantPlanet)}</Text>
        </View>

        <View style={styles.dataRow}>
          <View style={styles.labelWithTooltip}>
            <Text style={styles.label}>{t('calculator.birth.results.temperament')}</Text>
            <InfoTooltip tooltipKey={`temperament_${insights.spiritualImprint.temperament}`} />
          </View>
          <Text style={styles.value}>
            {t(`calculator.birth.temperament.${insights.spiritualImprint.temperament}`)}
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>{t('calculator.birth.results.guidance')}</Text>
        {guidanceBullets.map((item: { key: string; text: string }, index: number) => (
          <View key={`${item.key}-${index}`} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item.text}</Text>
          </View>
        ))}
      </LinearGradient>

      {/* Card 6: Name Resonance (if present) */}
      {insights.nameResonance && (
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>🔗 {t('calculator.birth.results.nameResonance')}</Text>
          
          <View style={styles.dataRow}>
            <Text style={styles.label}>{t('calculator.birth.results.birthElement')}</Text>
            <Text style={[styles.value, { color: getElementColor(insights.nameResonance.birthElement) }]}>
              {t(`common.elements.${insights.nameResonance.birthElement}`)}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.label}>{t('calculator.birth.results.birthRuler')}</Text>
            <Text style={styles.value}>{insights.nameResonance.birthRuler}</Text>
          </View>

          <View style={styles.separator} />

          <View style={[styles.alignmentBadge, {
            backgroundColor: insights.nameResonance.alignment === 'aligned' ? '#22c55e33' :
                           insights.nameResonance.alignment === 'challenging' ? '#ef444433' : '#eab30833'
          }]}>
            <Text style={[styles.alignmentText, {
              color: insights.nameResonance.alignment === 'aligned' ? '#22c55e' :
                     insights.nameResonance.alignment === 'challenging' ? '#ef4444' : '#eab308'
            }]}>
              {t(`calculator.birth.alignment.${insights.nameResonance.alignment}`)}
            </Text>
          </View>

          <Text style={styles.explanation}>
            {t(insights.nameResonance.explanationKey)}
          </Text>
        </LinearGradient>
      )}

      {/* Action Card - "Try This Now" */}
      <ActionCard insights={insights} />

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          {t('calculator.birth.disclaimer')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  contentContainer: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#334155',
    gap: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginTop: 8,
    marginBottom: 4,
  },

  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    flex: 1,
  },

  labelWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },

  valueWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  conditionWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  planetInsightText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 17,
  },

  moonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  moonCardTitle: {
    marginBottom: 0,
  },

  moonToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  moonToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7BF7',
  },

  chipsBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4c1d95',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312e81',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },

  chipAccent: {
    backgroundColor: '#4c1d95',
  },

  chipLabel: {
    fontSize: 12,
  },

  chipValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e0e7ff',
  },

  valueContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },

  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
  },

  subValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },

  planetRow: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  planetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  planetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
  },

  retroBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  planetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  planetSign: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  conditionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  conditionText: {
    fontSize: 12,
    fontWeight: '700',
  },

  progressBar: {
    flex: 1,
    height: 24,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginLeft: 12,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
  },

  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
    color: '#f1f5f9',
  },

  bulletRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingRight: 8,
  },

  bullet: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginRight: 8,
    marginTop: 2,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    lineHeight: 20,
  },

  alignmentBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  alignmentText: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  explanation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    lineHeight: 20,
    marginTop: 8,
  },

  disclaimer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },

  disclaimerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
// Also export as BirthResultSection for compatibility
export { BirthProfileResults as BirthResultSection };
