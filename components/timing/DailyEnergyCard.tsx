import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  moonPhase?: 'waxing' | 'waning' | 'full' | 'new';
}

interface DailyEnergyCardProps {
  score: number;  // 0-100
  breakdown?: DailyScoreBreakdown;
  authorityLevel?: 'avoid' | 'conditional' | 'supported';
  hardRestriction?: boolean;
}

export default function DailyEnergyCard({
  score,
  breakdown,
  authorityLevel = 'conditional',
  hardRestriction = false,
}: DailyEnergyCardProps) {
  const { t } = useLanguage();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Get quality label and color (gated by authority so lower layers cannot contradict).
  const getQuality = (score: number) => {
    const isCapped = authorityLevel !== 'supported' || hardRestriction;

    // Authority mapping: never show "excellent" language below 70%, and never on Saturn/Mars restriction days.
    if (authorityLevel === 'avoid') {
      return {
        label: t('common.quality.weak'),
        color: '#EF4444',
        bgColor: '#EF444420',
        borderColor: '#EF444440',
        icon: '⛔',
      };
    }

    if (isCapped) {
      // At best "moderate" language, even if the numeric score is high.
      if (score >= 40) {
        return {
          label: t('common.quality.moderate'),
          color: '#F59E0B',
          bgColor: '#F59E0B20',
          borderColor: '#F59E0B40',
          icon: '🛡️',
        };
      }
      return {
        label: t('common.quality.weak'),
        color: '#EF4444',
        bgColor: '#EF444420',
        borderColor: '#EF444440',
        icon: '🌙',
      };
    }

    if (score >= 80) return { 
      label: t('common.quality.excellent'), 
      color: '#10B981',
      bgColor: '#10B98120',
      borderColor: '#10B98140',
      icon: '✨',
    };
    if (score >= 60) return { 
      label: t('common.quality.good'), 
      color: '#3B82F6',
      bgColor: '#3B82F620',
      borderColor: '#3B82F640',
      icon: '🌟',
    };
    if (score >= 40) return { 
      label: t('common.quality.moderate'), 
      color: '#F59E0B',
      bgColor: '#F59E0B20',
      borderColor: '#F59E0B40',
      icon: '⚖️',
    };
    return { 
      label: t('common.quality.weak'), 
      color: '#EF4444',
      bgColor: '#EF444420',
      borderColor: '#EF444440',
      icon: '🌙',
    };
  };
  
  const quality = getQuality(score);
  
  // Get planet name translation
  const getPlanetName = (planet: Planet): string => {
    const planetKey = planet.toLowerCase();
    return t(`planets.${planetKey}`) || planet;
  };
  
  // Get recommendation based on score
  const getRecommendation = (score: number) => {
    if (score >= 80) {
      return {
        key: 'excellent',
        title: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.excellent.title'),
        description: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.excellent.description'),
        practices: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.excellent.practices'),
        caution: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.excellent.caution'),
      };
    } else if (score >= 60) {
      return {
        key: 'good',
        title: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.good.title'),
        description: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.good.description'),
        practices: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.good.practices'),
        caution: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.good.caution'),
      };
    } else if (score >= 40) {
      return {
        key: 'moderate',
        title: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.moderate.title'),
        description: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.moderate.description'),
        practices: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.moderate.practices'),
        caution: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.moderate.caution'),
      };
    }
    return {
      key: 'weak',
      title: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.weak.title'),
      description: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.weak.description'),
      practices: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.weak.practices'),
      caution: t('home.dailyGuidanceDetails.dailyEnergyCard.recommendations.weak.caution'),
    };
  };
  
  const recommendation = getRecommendation(score);
  const lunarPhaseLabel = breakdown?.moonPhase 
    ? t(`home.dailyGuidanceDetails.dailyEnergyCard.lunar.${breakdown.moonPhase}`)
    : '';
  
  // Calculate score percentage for visual indicator
  const scorePercentage = (score / 100) * 100;
  
  return (
    <View style={styles.cardContainer}>
      {/* Main Card with Gradient */}
      <LinearGradient
        colors={[quality.bgColor, 'rgba(88, 77, 150, 0.15)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: quality.color }]}
      >
        {/* Header with Icon and Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerIcon}>{quality.icon}</Text>
          <View style={styles.headerText}>
            <Text style={styles.label}>
              {t('home.dailyGuidanceDetails.dailyEnergyCard.title')}
            </Text>
            <Text style={styles.scopeText}>{t('dailyEnergy.scope.day')}</Text>
            <Text style={[styles.qualityLabel, { color: quality.color }]}>
              {quality.label}
            </Text>
          </View>
        </View>
        
        {/* Main Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreNumber, { color: quality.color }]}>
            {score}%
          </Text>
          {/* Score Progress Bar */}
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={[quality.color, `${quality.color}80`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${scorePercentage}%` }]}
            />
          </View>
        </View>
        
        {/* Explanation Text */}
        <Text style={styles.explanation}>
          {t('home.dailyGuidanceDetails.dailyEnergyCard.scoreExplanation')}
        </Text>
        
        {/* Lunar Phase Info */}
        {lunarPhaseLabel && (
          <View style={[styles.lunarInfo, { backgroundColor: `${quality.color}15` }]}>
            <Text style={styles.lunarInfoText}>{lunarPhaseLabel}</Text>
          </View>
        )}
        
        {/* Breakdown Toggle */}
        {breakdown && (
          <>
            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setShowBreakdown(!showBreakdown)}
            >
              <View style={styles.toggleHeader}>
                <Ionicons 
                  name={showBreakdown ? 'chevron-down' : 'chevron-forward'} 
                  size={16} 
                  color={quality.color}
                  style={styles.toggleIcon}
                />
                <Text style={[styles.breakdownToggleText, { color: quality.color }]}>
                  {t('home.dailyGuidanceDetails.dailyEnergyCard.weightedCalculation')}
                </Text>
              </View>
            </TouchableOpacity>
            
            {showBreakdown && (
              <View style={styles.breakdown}>
                {/* Day Ruler */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownLabel}>
                    <Text style={styles.breakdownLabelText}>
                      {getPlanetName(breakdown.dayRuler)} 
                    </Text>
                    <Text style={styles.breakdownLabelSmall}>
                      {t('notifications.timing.dayRuler')}
                    </Text>
                  </View>
                  <View style={styles.breakdownValueContainer}>
                    <Text style={styles.breakdownValue}>
                      {breakdown.dayRulerPower}%
                    </Text>
                    <Text style={styles.breakdownOperator}>× 50%</Text>
                    <Text style={[styles.breakdownContribution, { color: quality.color }]}>
                      = {breakdown.dayRulerContribution}
                    </Text>
                  </View>
                </View>
                
                {/* Moon */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownLabel}>
                    <Text style={styles.breakdownLabelText}>
                      {t('planets.moon')}
                    </Text>
                    <Text style={styles.breakdownLabelSmall}>
                      {t('manazilScreen.mansion')}
                    </Text>
                  </View>
                  <View style={styles.breakdownValueContainer}>
                    <Text style={styles.breakdownValue}>
                      {breakdown.moonPower}%
                    </Text>
                    <Text style={styles.breakdownOperator}>× 30%</Text>
                    <Text style={[styles.breakdownContribution, { color: quality.color }]}>
                      = {breakdown.moonContribution}
                    </Text>
                  </View>
                </View>
                
                {/* Other Planets */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownLabel}>
                    <Text style={styles.breakdownLabelText}>
                      {t('home.dailyGuidanceDetails.dailyEnergyCard.otherPlanets')}
                    </Text>
                    <Text style={styles.breakdownLabelSmall}>
                      Influences supplémentaires
                    </Text>
                  </View>
                  <View style={styles.breakdownValueContainer}>
                    <Text style={styles.breakdownValue}>
                      {breakdown.othersPower}%
                    </Text>
                    <Text style={styles.breakdownOperator}>× 20%</Text>
                    <Text style={[styles.breakdownContribution, { color: quality.color }]}>
                      = {breakdown.othersContribution}
                    </Text>
                  </View>
                </View>
                
                {/* Divider */}
                <View style={[styles.divider, { borderColor: `${quality.color}30` }]} />
                
                {/* Total */}
                <View style={styles.breakdownRow}>
                  <Text style={[styles.totalLabel, { color: quality.color }]}>
                    {t('home.dailyGuidanceDetails.dailyEnergyCard.total')}
                  </Text>
                  <Text style={[styles.totalValue, { color: quality.color }]}>
                    {breakdown.totalScore}%
                  </Text>
                </View>
                
                {/* Calculation Note */}
                <Text style={styles.calculationNote}>
                  📊 {t('home.dailyGuidanceDetails.dailyEnergyCard.calculationNote')}
                </Text>
              </View>
            )}
          </>
        )}
        
        {/* Recommendations Toggle */}
        <TouchableOpacity
          style={[styles.recommendationsToggle, { backgroundColor: `${quality.color}15` }]}
          onPress={() => setShowRecommendations(!showRecommendations)}
        >
          <View style={styles.toggleHeader}>
            <Ionicons 
              name={showRecommendations ? 'chevron-down' : 'chevron-forward'} 
              size={16} 
              color={quality.color}
              style={styles.toggleIcon}
            />
            <Text style={[styles.recommendationsToggleText, { color: quality.color }]}>
              💡 {recommendation.title}
            </Text>
          </View>
        </TouchableOpacity>
        
        {showRecommendations && (
          <View style={styles.recommendations}>
            <Text style={styles.recommendationDescription}>
              {recommendation.description}
            </Text>
            
            <View style={[styles.recommendationBox, { borderLeftColor: quality.color }]}>
              <Text style={[styles.recommendationBoxLabel, { color: quality.color }]}>
                ✓ Pratiques
              </Text>
              <Text style={styles.recommendationBoxText}>
                {recommendation.practices}
              </Text>
            </View>
            
            <View style={[styles.cautionBox, { borderLeftColor: '#F59E0B' }]}>
              <Text style={[styles.cautionBoxLabel, { color: '#F59E0B' }]}>
                ⚠️ À noter
              </Text>
              <Text style={styles.cautionBoxText}>
                {recommendation.caution}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  
  card: {
    backgroundColor: 'rgba(88, 77, 150, 0.15)',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    gap: 12,
  },
  
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  headerIcon: {
    fontSize: 32,
  },
  
  headerText: {
    flex: 1,
  },
  
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  scopeText: {
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
  },
  
  qualityLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  
  scoreContainer: {
    alignItems: 'center',
    gap: 12,
  },
  
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -1,
  },
  
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  
  explanation: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  
  lunarInfo: {
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  lunarInfoText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  
  breakdownToggle: {
    marginTop: 8,
    paddingVertical: 12,
  },
  
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  toggleIcon: {
    marginRight: 4,
  },
  
  breakdownToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  breakdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 10,
  },
  
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  
  breakdownLabel: {
    flex: 1,
  },
  
  breakdownLabelText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
  },
  
  breakdownLabelSmall: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    marginTop: 2,
  },
  
  breakdownValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  breakdownValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  
  breakdownOperator: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  
  breakdownContribution: {
    fontSize: 13,
    fontWeight: '700',
  },
  
  divider: {
    height: 1,
    marginVertical: 8,
    borderTopWidth: 1,
  },
  
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  
  calculationNote: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 8,
  },
  
  recommendationsToggle: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
  },
  
  recommendationsToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  recommendations: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  
  recommendationDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  
  recommendationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    gap: 6,
  },
  
  recommendationBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  
  recommendationBoxText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    lineHeight: 16,
  },
  
  cautionBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    gap: 6,
  },
  
  cautionBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  
  cautionBoxText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    lineHeight: 16,
  },
});
