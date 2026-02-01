import { useLanguage } from '@/contexts/LanguageContext';
import type { DailySynthesis } from '@/services/DailySynthesisService';
import type { Planet } from '@/services/PlanetaryHoursService';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WhatThisMeansCardProps {
  synthesis: DailySynthesis;
  dayRuler: Planet;
  moonPhaseName?: string;
  authorityLevel?: 'avoid' | 'conditional' | 'supported';
  authorityDisplayQuality?: 'excellent' | 'good' | 'moderate' | 'challenging';
  hardRestriction?: boolean;
  userRulerHours?: Array<{ planet: Planet; range: string }>;
  dayRulerHours?: Array<{ planet: Planet; range: string }>;
  challengingHours?: Array<{ planet: Planet; range: string }>;
}

/**
 * Quality badge color
 */
function getQualityColor(quality: 'excellent' | 'good' | 'moderate' | 'challenging'): string {
  switch (quality) {
    case 'excellent':
      return '#10b981';
    case 'good':
      return '#3b82f6';
    case 'moderate':
      return '#f59e0b';
    case 'challenging':
    default:
      return '#ef4444';
  }
}

/**
 * Main synthesis card showing:
 * - Narrative summary
 * - Excellent activities
 * - Less favorable activities
 * - Peak hours note
 */
export default function WhatThisMeansCard({
  synthesis,
  dayRuler,
  moonPhaseName,
  authorityLevel = 'conditional',
  authorityDisplayQuality = synthesis.overallQuality,
  hardRestriction = false,
  userRulerHours = [],
  dayRulerHours = [],
  challengingHours = [],
}: WhatThisMeansCardProps) {
  const { t } = useLanguage();
  const qualityColor = getQualityColor(authorityDisplayQuality);
  const peakHoursText = synthesis.peakHours?.trim();

  const isFullMoon = moonPhaseName === 'full';
  const isHardDay = dayRuler === 'Saturn' || dayRuler === 'Mars';

  // When constrained by higher layers, do not show synthesis "excellent" items
  // (they can contain optimistic beginnings that contradict Saturn/Mars or Full Moon rules).
  const useAuthoritativeLists = authorityLevel !== 'supported' || hardRestriction || isFullMoon || isHardDay;

  const bestHeading =
    authorityLevel === 'avoid'
      ? t('dailyEnergy.notAdvisedToday')
      : authorityLevel === 'supported' && !useAuthoritativeLists
        ? t('dailyEnergy.excellentForToday')
        : t('dailyEnergy.bestForToday');

  const avoidHeading =
    authorityLevel === 'supported' && !useAuthoritativeLists
      ? t('dailyEnergy.lessFavorable')
      : t('dailyEnergy.planetaryJudgment.avoidLabel');

  const bestItems = useAuthoritativeLists
    ? [0, 1, 2]
        .map((i) => t(`dailyEnergy.planetaryJudgment.bestFor.${dayRuler.toLowerCase()}.${i}`))
        .filter(Boolean)
    : synthesis.excellentFor;

  const avoidItems = useAuthoritativeLists
    ? [0, 1, 2]
        .map((i) => t(`dailyEnergy.planetaryJudgment.avoid.${dayRuler.toLowerCase()}.${i}`))
        .filter(Boolean)
    : synthesis.lessFavorable;
  
  return (
    <View style={[styles.card, { borderColor: qualityColor }]}>
      <Text style={styles.cardTitle}>
        ✨ {t('dailyEnergy.whatThisMeans')}
      </Text>

      <Text style={styles.scopeText}>{t('dailyEnergy.scope.day')}</Text>
      
      {/* Summary Text */}
      <Text style={styles.summary}>{synthesis.summaryText}</Text>

      {isFullMoon && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{t('dailyEnergy.authorityNotes.fullMoonBeginnings')}</Text>
        </View>
      )}

      {(dayRuler === 'Saturn' || dayRuler === 'Mars') && authorityLevel !== 'supported' && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            {t('dailyEnergy.authorityNotes.saturnOrMarsCap', {
              planet: t(`dailyEnergy.planets.${dayRuler.toLowerCase()}`),
            })}
          </Text>
        </View>
      )}
      
      {/* Best For */}
      {bestItems.length > 0 && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>
            🟢 {bestHeading}
          </Text>
          {bestItems.map((item, index) => (
            <Text key={index} style={styles.actionItem}>• {item}</Text>
          ))}
        </View>
      )}
      
      {/* Avoid / Less Favorable */}
      {avoidItems.length > 0 && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>
            ⚠️ {avoidHeading}
          </Text>
          {avoidItems.map((item, index) => (
            <Text key={index} style={styles.actionItem}>• {item}</Text>
          ))}
        </View>
      )}
      
      {/* Peak Hours Note */}
      {!!peakHoursText && (
        <View style={styles.timingNote}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteLabel}>{t('dailyEnergy.peakHours')}: </Text>
            {peakHoursText}
          </Text>
        </View>
      )}

      {/* Personalized Hours */}
      {(userRulerHours.length > 0 || dayRulerHours.length > 0 || challengingHours.length > 0) && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>🕰️ {t('dailyEnergy.recommendations.personalizedHoursTitle')}</Text>

          {userRulerHours.length > 0 && (
            <>
              <Text style={styles.hoursSubtitle}>✅ {t('dailyEnergy.recommendations.bestForYou')}</Text>
              {userRulerHours.map((h, idx) => (
                <Text key={`u-${idx}`} style={styles.actionItem}>• {t(`planets.${h.planet.toLowerCase()}`)} ({h.range})</Text>
              ))}
            </>
          )}

          {dayRulerHours.length > 0 && (
            <>
              <Text style={styles.hoursSubtitle}>🌟 {t('dailyEnergy.recommendations.supportiveToday')}</Text>
              {dayRulerHours.map((h, idx) => (
                <Text key={`d-${idx}`} style={styles.actionItem}>• {t(`planets.${h.planet.toLowerCase()}`)} ({h.range})</Text>
              ))}
            </>
          )}

          {challengingHours.length > 0 && (
            <>
              <Text style={styles.hoursSubtitle}>⚠️ {t('dailyEnergy.recommendations.moreDelicate')}</Text>
              {challengingHours.map((h, idx) => (
                <Text key={`c-${idx}`} style={styles.actionItem}>• {t(`planets.${h.planet.toLowerCase()}`)} ({h.range})</Text>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 20, 60, 0.6)',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  summary: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },

  scopeText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -8,
    marginBottom: 14,
  },

  noteBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    padding: 12,
    marginBottom: 14,
  },

  noteText: {
    color: 'rgba(255, 215, 0, 0.95)',
    fontSize: 12,
    lineHeight: 16,
  },
  
  actionSection: {
    marginBottom: 16,
  },
  
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  actionItem: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },

  hoursSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  
  timingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(100, 90, 180, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  
  noteIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  
  noteText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 18,
  },
  
  noteLabel: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
