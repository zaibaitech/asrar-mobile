/**
 * Planet Status Panel Component
 * ==============================
 * Technical panel showing current astronomical state of the planet
 * - Position (sign, degree)
 * - Motion (direct/retrograde, station status)
 * - Timeline (next sign change)
 * - Speed (degrees per day)
 * - Major aspects to other planets
 */

import { Borders, DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PlanetTransitSnapshot } from '@/services/PlanetTransitService';
import { formatAspect, formatMotion, formatStation } from '@/services/PlanetTransitService';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PlanetStatusPanelProps {
  transitSnapshot: PlanetTransitSnapshot;
  signLabel?: string;
  elementAccentColor?: string;
}

export function PlanetStatusPanel({
  transitSnapshot,
  signLabel,
  elementAccentColor = ElementAccents.fire.primary,
}: PlanetStatusPanelProps) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {t('planetDetail.sections.status')}
        </Text>
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText} numberOfLines={1}>
            {expanded ? t('planetDetail.status.seeLess') : t('planetDetail.status.seeMore')}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={elementAccentColor}
          />
        </Pressable>
      </View>

      {/* Collapsed View - Essential Info */}
      <View style={styles.grid}>
        {/* Sign + Degree */}
        <View style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>
            {t('planetDetail.status.sign')}:
          </Text>
          <Text style={styles.value} numberOfLines={1}>
            {signLabel || '—'}
            {expanded && transitSnapshot.degree !== undefined && (
              <Text style={styles.valueSecondary}>
                {' '}
                {Math.floor(transitSnapshot.degree)}°
                {transitSnapshot.minute ? transitSnapshot.minute + "'" : ''}
              </Text>
            )}
          </Text>
        </View>

        {/* Motion + Retrograde Badge */}
        <View style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>
            {t('planetDetail.status.motion')}:
          </Text>
          <View style={styles.motionContainer}>
            {transitSnapshot.motion === 'retrograde' && (
              <Text style={[styles.retrogradeIcon, { color: ElementAccents.fire.primary }]}>
                ℞
              </Text>
            )}
            <Text
              style={[
                styles.value,
                transitSnapshot.motion === 'retrograde' && {
                  color: ElementAccents.fire.primary,
                },
              ]}
              numberOfLines={1}
            >
              {formatMotion(transitSnapshot.motion, language)}
            </Text>
          </View>
        </View>

        {/* Station (conditional) */}
        {transitSnapshot.station && (
          <View style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {t('planetDetail.status.station')}:
            </Text>
            <Text
              style={[styles.value, styles.stationText]}
              numberOfLines={1}
            >
              {formatStation(transitSnapshot.station, language)}
            </Text>
          </View>
        )}

        {/* Next Sign Change */}
        {transitSnapshot.nextIngress && (
          <View style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {t('planetDetail.status.nextChange')}:
            </Text>
            <Text style={styles.value} numberOfLines={1}>
              {transitSnapshot.nextIngress.daysUntil !== undefined
                ? `${t('planetDetail.status.in')} ${transitSnapshot.nextIngress.daysUntil}${t('planetDetail.status.days')}`
                : '—'}
            </Text>
          </View>
        )}
      </View>

      {/* Expanded View - Technical Details */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.divider} />

          {/* Speed */}
          {transitSnapshot.speedDegPerDay !== undefined && (
            <View style={styles.row}>
              <Text style={styles.label} numberOfLines={1}>
                {t('planetDetail.status.speed')}:
              </Text>
              <Text style={styles.value} numberOfLines={1}>
                {transitSnapshot.speedDegPerDay.toFixed(2)}° {t('planetDetail.status.perDay')}
              </Text>
            </View>
          )}

          {/* Major Aspects */}
          {transitSnapshot.aspects && transitSnapshot.aspects.length > 0 && (
            <View style={styles.aspectsContainer}>
              <Text style={styles.aspectsTitle} numberOfLines={1}>
                {t('planetDetail.status.aspects')}:
              </Text>
              {transitSnapshot.aspects.slice(0, 3).map((aspect, idx) => (
                <View key={idx} style={styles.aspectRow}>
                  <Text
                    style={[styles.aspectType, { color: ElementAccents.water.primary }]}
                    numberOfLines={1}
                  >
                    {formatAspect(aspect.type, language)}
                  </Text>
                  <Text style={styles.aspectTarget} numberOfLines={1}>
                    {aspect.other}
                  </Text>
                  <Text style={styles.aspectOrb} numberOfLines={1}>
                    {aspect.orbDeg.toFixed(1)}°
                  </Text>
                  {aspect.applying !== undefined && (
                    <Text style={styles.aspectArrow}>
                      {aspect.applying ? '→' : '←'}
                    </Text>
                  )}
                </View>
              ))}
              {transitSnapshot.aspects.length === 0 && (
                <Text style={styles.noAspects} numberOfLines={2}>
                  {t('planetDetail.status.noAspects')}
                </Text>
              )}
            </View>
          )}

          {/* Next Ingress Detail */}
          {transitSnapshot.nextIngress && (
            <View style={styles.row}>
              <Text style={styles.label} numberOfLines={1}>
                {t('planetDetail.status.nextIngressFull')}:
              </Text>
              <Text style={styles.value} numberOfLines={1}>
                {transitSnapshot.nextIngress.signKey}
                {transitSnapshot.nextIngress.daysUntil !== undefined && (
                  <Text style={styles.valueSecondary}>
                    {' '}
                    ({transitSnapshot.nextIngress.daysUntil} {t('planetDetail.status.days')})
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    flexShrink: 0,
  },
  toggleText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  grid: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 24,
  },
  label: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
    flexShrink: 0,
    minWidth: 80,
  },
  value: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
    flex: 1,
    minWidth: 0,
    textAlign: 'right',
  },
  valueSecondary: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightRegular,
  },
  motionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
    minWidth: 0,
    justifyContent: 'flex-end',
  },
  retrogradeIcon: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
  },
  stationText: {
    color: ElementAccents.air.primary,
    fontStyle: 'italic',
  },
  expandedSection: {
    gap: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: Spacing.xs,
  },
  aspectsContainer: {
    gap: Spacing.sm,
  },
  aspectsTitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  aspectType: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    minWidth: 90,
    flexShrink: 0,
  },
  aspectTarget: {
    fontSize: 13,
    color: DarkTheme.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  aspectOrb: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flexShrink: 0,
  },
  aspectArrow: {
    fontSize: 14,
    color: ElementAccents.earth.primary,
    flexShrink: 0,
  },
  noAspects: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
  },
});
