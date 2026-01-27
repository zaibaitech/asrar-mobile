import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DailyScoreBreakdown {
  dayRuler: Planet;
  dayRulerPower: number;
  dayRulerContribution: number;
  moonPower: number;
  moonContribution: number;
  othersPower: number;
  othersContribution: number;
  totalScore: number;
}

interface DailyEnergyCardProps {
  score: number;  // 0-100
  breakdown?: DailyScoreBreakdown;
}

export default function DailyEnergyCard({
  score,
  breakdown,
}: DailyEnergyCardProps) {
  const { t } = useLanguage();
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Get quality label and color
  const getQuality = (score: number) => {
    if (score >= 80) return { label: t('common.quality.excellent'), color: '#10B981' };
    if (score >= 60) return { label: t('common.quality.good'), color: '#3B82F6' };
    if (score >= 40) return { label: t('common.quality.moderate'), color: '#F59E0B' };
    return { label: t('common.quality.weak'), color: '#EF4444' };
  };
  
  const quality = getQuality(score);
  
  // Get planet name translation
  const getPlanetName = (planet: Planet): string => {
    const planetKey = planet.toLowerCase();
    return t(`planets.${planetKey}`) || planet;
  };
  
  return (
    <View style={[styles.card, { borderColor: quality.color }]}>
      {/* Main Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>{t('home.dailyGuidanceDetails.dailyEnergyCard.title')}</Text>
        <Text style={[styles.scoreNumber, { color: quality.color }]}>
          {score}%
        </Text>
        <Text style={[styles.qualityLabel, { color: quality.color }]}>
          {quality.label}
        </Text>
      </View>
      
      {/* Breakdown Toggle */}
      {breakdown && (
        <>
          <TouchableOpacity
            style={styles.breakdownToggle}
            onPress={() => setShowBreakdown(!showBreakdown)}
          >
            <Text style={styles.breakdownToggleText}>
              {showBreakdown ? '▼' : '▶'} {t('home.dailyGuidanceDetails.dailyEnergyCard.weightedCalculation')}
            </Text>
          </TouchableOpacity>
          
          {showBreakdown && (
            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  {getPlanetName(breakdown.dayRuler)} ({t('notifications.timing.dayRuler')}):
                </Text>
                <Text style={styles.breakdownValue}>
                  {breakdown.dayRulerPower}% × 50% = {breakdown.dayRulerContribution}
                </Text>
              </View>
              
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  {t('planets.moon')}:
                </Text>
                <Text style={styles.breakdownValue}>
                  {breakdown.moonPower}% × 30% = {breakdown.moonContribution}
                </Text>
              </View>
              
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  {t('home.dailyGuidanceDetails.dailyEnergyCard.otherPlanets')}:
                </Text>
                <Text style={styles.breakdownValue}>
                  {breakdown.othersPower}% × 20% = {breakdown.othersContribution}
                </Text>
              </View>
              
              <View style={[styles.breakdownRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>
                  {t('home.dailyGuidanceDetails.dailyEnergyCard.total')}:
                </Text>
                <Text style={[styles.totalValue, { color: quality.color }]}>
                  {breakdown.totalScore}%
                </Text>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(88, 77, 150, 0.15)',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  
  scoreContainer: {
    alignItems: 'center',
  },
  
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  breakdownToggle: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  
  breakdownToggleText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  
  breakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  breakdownLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    flex: 1,
  },
  
  breakdownValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
