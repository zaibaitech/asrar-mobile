import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type JudgmentStatus = 'supportive' | 'neutral' | 'restrictive';

type MoonPhaseName =
  | 'new'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent'
  | string;

interface PlanetaryJudgmentCardProps {
  dayRuler: Planet;
  moonPhaseName?: MoonPhaseName;
}

function getStatusForRuler(ruler: Planet): JudgmentStatus {
  switch (ruler) {
    case 'Jupiter':
    case 'Venus':
    case 'Sun':
      return 'supportive';
    case 'Saturn':
    case 'Mars':
      return 'restrictive';
    case 'Moon':
    case 'Mercury':
    default:
      return 'neutral';
  }
}

function getPhaseModifier(phaseName?: MoonPhaseName): 'amplify' | 'soften' | 'neutral' {
  if (!phaseName) return 'neutral';
  if (phaseName === 'full') return 'amplify';
  if (phaseName === 'new') return 'neutral';

  const waxing = new Set(['waxing_crescent', 'first_quarter', 'waxing_gibbous']);
  const waning = new Set(['waning_gibbous', 'last_quarter', 'waning_crescent']);

  if (waxing.has(phaseName)) return 'amplify';
  if (waning.has(phaseName)) return 'soften';

  return 'neutral';
}

function getStatusColor(status: JudgmentStatus): string {
  switch (status) {
    case 'supportive':
      return '#10b981';
    case 'restrictive':
      return '#ef4444';
    default:
      return '#64B5F6';
  }
}

function planetKey(planet: Planet): string {
  return `dailyEnergy.planets.${planet.toLowerCase()}`;
}

export default function PlanetaryJudgmentCard({ dayRuler, moonPhaseName }: PlanetaryJudgmentCardProps) {
  const { t } = useLanguage();

  const status = getStatusForRuler(dayRuler);
  const statusColor = getStatusColor(status);
  const phaseModifier = getPhaseModifier(moonPhaseName);

  const title = t('dailyEnergy.planetaryJudgment.title');
  const cosmicVerdict = t('dailyEnergy.planetaryJudgment.cosmicVerdict');
  const scopeLabel = t('dailyEnergy.scope.day');

  const statusLabel = t(`dailyEnergy.planetaryJudgment.status.${status}`);
  const classicalTerm = t(`dailyEnergy.planetaryJudgment.classicalTerms.${status}`);
  const rulerName = t(planetKey(dayRuler));

  const intro = t('dailyEnergy.planetaryJudgment.intro', { planet: rulerName });
  const rulerTone = t(`dailyEnergy.planetaryJudgment.rulerTone.${dayRuler.toLowerCase()}`);
  const phaseTone = t(`dailyEnergy.planetaryJudgment.phaseModifier.${phaseModifier}`);

  const bestForLabel = t('dailyEnergy.planetaryJudgment.bestForLabel');
  const avoidLabel = t('dailyEnergy.planetaryJudgment.avoidLabel');
  const disclaimer = t('dailyEnergy.planetaryJudgment.disclaimer');

  const bestForItems = [0, 1, 2]
    .map((i) => t(`dailyEnergy.planetaryJudgment.bestFor.${dayRuler.toLowerCase()}.${i}`))
    .filter(Boolean);

  const avoidItems = [0, 1, 2]
    .map((i) => t(`dailyEnergy.planetaryJudgment.avoid.${dayRuler.toLowerCase()}.${i}`))
    .filter(Boolean);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{cosmicVerdict}</Text>
          <Text style={styles.scopeText}>{scopeLabel}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}18`, borderColor: `${statusColor}35` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          {!!classicalTerm && (
            <Text style={[styles.classicalText, { color: `${statusColor}cc` }]}>{`(${classicalTerm})`}</Text>
          )}
        </View>
      </View>

      <Text style={styles.description}>{`${intro} ${rulerTone} ${phaseTone}`}</Text>

      {/* Best For / Avoid */}
      <View style={styles.guidanceContainer}>
        {/* Best For */}
        <View style={styles.section}>
          <View style={[styles.accentBar, styles.favorableAccent]} />
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>✅</Text>
              <Text style={styles.sectionTitle}>{bestForLabel}</Text>
            </View>
            
            {bestForItems.map((activity, index) => (
              <Text key={index} style={styles.activityText}>
                • {activity}
              </Text>
            ))}
          </View>
        </View>

        {/* Avoid */}
        <View style={styles.section}>
          <View style={[styles.accentBar, styles.warningAccent]} />
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>⚠️</Text>
              <Text style={styles.sectionTitle}>{avoidLabel}</Text>
            </View>
            
            {avoidItems.map((activity, index) => (
              <Text key={index} style={styles.activityText}>
                • {activity}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.disclaimer}>{disclaimer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },

  titleBlock: {
    flex: 1,
  },

  title: {
    color: DarkTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  scopeText: {
    marginTop: 6,
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  classicalText: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.9,
  },

  description: {
    color: DarkTheme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  guidanceContainer: {
    gap: 20,
    marginBottom: 16,
  },

  section: {
    flexDirection: 'row',
    gap: 16,
  },

  accentBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 80,
  },

  favorableAccent: {
    backgroundColor: '#10b981',
  },

  warningAccent: {
    backgroundColor: '#f59e0b',
  },

  sectionContent: {
    flex: 1,
    gap: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },

  sectionEmoji: {
    fontSize: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },

  activityText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#d1d5db',
    paddingLeft: 8,
  },

  disclaimer: {
    marginTop: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
