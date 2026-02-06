import { useLanguage } from '@/contexts/LanguageContext';
import type { MoonPhaseAnalysis } from '@/services/MoonPhaseService';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MoonPhaseEducationalModal from './MoonPhaseEducationalModal';
import MoonVisual from './MoonVisual';

interface MoonPhaseHeaderCardProps {
  moonPhase: MoonPhaseAnalysis;
  isExpanded?: boolean;
  onToggle?: () => void;
  dayRulerPlanet?: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
  authorityLevel?: 'avoid' | 'conditional' | 'supported';
}

export default function MoonPhaseHeaderCard({
  moonPhase,
  isExpanded = true,
  onToggle,
  dayRulerPlanet,
  authorityLevel,
}: MoonPhaseHeaderCardProps) {
  const { t, language } = useLanguage();
  const [showEducation, setShowEducation] = useState(false);
  const currentLang = language;

  const tSafe = (key: string, fallback: string, params?: Record<string, string | number>) => {
    const value = params ? t(key, params) : t(key);
    const last = key.split('.').pop();
    const valueLower = typeof value === 'string' ? value.toLowerCase() : '';
    const lastLower = last ? last.toLowerCase() : '';
    if (!value || value === key || (last && (value === last || valueLower === lastLower))) {
      return fallback;
    }
    return value;
  };
  
  // Get translated phase name
  const phaseName = currentLang === 'ar' 
    ? moonPhase.phaseNameTranslated.ar
    : currentLang === 'fr'
    ? moonPhase.phaseNameTranslated.fr
    : moonPhase.phaseNameTranslated.en;
  
  // Get power quality translation key
  const getPowerQualityLabel = () => {
    switch (moonPhase.powerQuality) {
      case 'Excellent':
        return t('common.quality.excellent');
      case 'Good':
        return t('common.quality.good');
      case 'Moderate':
        return t('common.quality.moderate');
      case 'Weak':
        return t('common.quality.weak');
      case 'Rest':
        return t('moon.ui.rest');
      default:
        return t('common.quality.moderate');
    }
  };
  
  // Collapsed view
  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={[styles.collapsedCard, { backgroundColor: moonPhase.color + '20' }]}
        onPress={onToggle}
      >
        <View style={styles.collapsedContent}>
          <Text style={styles.moonEmoji}>{moonPhase.moonEmoji}</Text>
          <View style={styles.collapsedText}>
            <Text style={styles.collapsedTitle}>
              {phaseName} • {t('moon.ui.dayOfMonth', { day: moonPhase.lunarDay })}
            </Text>
            <Text style={styles.collapsedSubtitle}>
              {tSafe(
                `moon.${moonPhase.phaseName}.title`,
                moonPhase.primaryGuidance?.title ?? phaseName
              )}
            </Text>
          </View>
          <Text style={styles.powerBadge}>{moonPhase.moonPower}%</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  // Expanded view
  return (
    <>
      <View style={[styles.card, { borderColor: moonPhase.color }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.moonIcon}>🌙</Text>
            <Text style={styles.sectionLabel}>{t('moon.ui.lunarTiming')}</Text>
          </View>
          {onToggle && (
            <TouchableOpacity onPress={onToggle}>
              <Text style={styles.collapseButton}>▲</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Phase Name */}
        <View style={styles.phaseNameContainer}>
          <Text style={styles.phaseName}>{phaseName}</Text>
          {currentLang !== 'ar' && (
            <Text style={styles.phaseNameArabic}>
              {moonPhase.phaseNameTranslated.ar}
            </Text>
          )}
        </View>
        
        {/* Moon Visual */}
        <View style={styles.moonVisualContainer}>
          <MoonVisual
            phasePercentage={moonPhase.phasePercentage}
            phaseName={moonPhase.phaseName}
            size={120}
          />
        </View>
        
        {/* Phase Description */}
        <View style={styles.guidanceContainer}>
          <Text style={styles.phaseDescription}>
            {tSafe(
              `moon.${moonPhase.phaseName}.description`,
              moonPhase.primaryGuidance?.description ?? ''
            )}
          </Text>

          <Text style={styles.scopeText}>
            {tSafe('dailyEnergy.scope.moon', tSafe('moon.ui.moonPhase', 'Moon Phase'))}
          </Text>

          {moonPhase.phaseName === 'full' && (
            <Text style={styles.authorityNote}>{t('dailyEnergy.authorityNotes.fullMoonBeginnings')}</Text>
          )}

          {!!dayRulerPlanet && (dayRulerPlanet === 'Saturn' || dayRulerPlanet === 'Mars') && !!authorityLevel && authorityLevel !== 'supported' && (
            <Text style={styles.authorityNote}>
              {t('dailyEnergy.authorityNotes.saturnOrMarsCap', {
                planet: t(`dailyEnergy.planets.${dayRulerPlanet.toLowerCase()}`),
              })}
            </Text>
          )}
        </View>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t('moon.ui.lunarDay')}</Text>
            <Text style={styles.statValue}>
              {t('moon.ui.dayOfMonth', { day: moonPhase.lunarDay })}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t('moon.ui.moonPower')}</Text>
            <Text style={styles.statValue}>
              {moonPhase.moonPower}% ({getPowerQualityLabel()})
            </Text>
          </View>
        </View>

        <Text style={styles.moonPowerNote}>
          {t('moon.ui.moonPowerNote')}
        </Text>
        
        {/* Waxing/Waning Indicator */}
        <View style={styles.phaseTypeContainer}>
          <View style={[
            styles.phaseTypeBadge,
            { backgroundColor: moonPhase.isWaxing ? '#3B82F6' : '#8B5CF6' }
          ]}>
            <Text style={styles.phaseTypeText}>
              {moonPhase.isWaxing 
                ? t('moon.ui.waxing') 
                : t('moon.ui.waning')}
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowEducation(true)}
          >
            <Text style={styles.buttonText}>ℹ️ {t('moon.ui.learnMore')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Educational Modal */}
      <MoonPhaseEducationalModal
        visible={showEducation}
        moonPhase={moonPhase}
        onClose={() => setShowEducation(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 20, 60, 0.8)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(147, 112, 219, 0.6)',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#9370DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  scopeText: {
    marginTop: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  authorityNote: {
    marginTop: 10,
    color: 'rgba(255, 215, 0, 0.9)',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  
  collapsedCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  moonEmoji: {
    fontSize: 32,
  },
  
  collapsedText: {
    flex: 1,
  },
  
  collapsedTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  collapsedSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  
  powerBadge: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  moonIcon: {
    fontSize: 20,
  },
  
  sectionLabel: {
    color: 'rgba(255, 215, 0, 0.9)',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  
  collapseButton: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  
  phaseNameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  phaseName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  phaseNameArabic: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    marginTop: 4,
  },
  
  moonVisualContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  
  guidanceContainer: {
    marginVertical: 16,
  },
  
  phaseDescription: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 4,
  },
  
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  moonPowerNote: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: -6,
  },
  
  phaseTypeContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  
  phaseTypeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  phaseTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  
  button: {
    flex: 1,
    backgroundColor: 'rgba(100, 90, 180, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(180, 170, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
