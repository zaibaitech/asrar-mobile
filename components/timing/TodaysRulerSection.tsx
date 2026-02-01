import { useLanguage } from '@/contexts/LanguageContext';
import type { Element, Planet } from '@/services/PlanetaryHoursService';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TodaysRulerSectionProps {
  dayRuler: Planet;
  dayElement: Element;
  dayDescription: string;
  transitPower?: number;
  transitSign?: string;
  transitDignity?: string;
  currentHour?: {
    planet: Planet;
    range: string;
  };
}

/**
 * Get element icon
 */
function getElementIcon(element: Element): string {
  switch (element) {
    case 'fire': return '🔥';
    case 'water': return '💧';
    case 'air': return '🌬️';
    case 'earth': return '🌍';
  }
}

/**
 * Get planet info - placeholder if PLANET_INFO not exported
 */
function getPlanetInfo(planet: Planet): { symbol: string; arabicName: string } {
  const info: Record<Planet, { symbol: string; arabicName: string }> = {
    Sun: { symbol: '☉', arabicName: 'الشمس' },
    Moon: { symbol: '☽', arabicName: 'القمر' },
    Mars: { symbol: '♂', arabicName: 'المريخ' },
    Mercury: { symbol: '☿', arabicName: 'عطارد' },
    Jupiter: { symbol: '♃', arabicName: 'المشتري' },
    Venus: { symbol: '♀', arabicName: 'الزهرة' },
    Saturn: { symbol: '♄', arabicName: 'زحل' },
  };
  return info[planet];
}

/**
 * Displays today's ruling planet with element and transit info
 */
export default function TodaysRulerSection({
  dayRuler,
  dayElement,
  dayDescription,
  transitPower,
  transitSign,
  transitDignity,
  currentHour,
}: TodaysRulerSectionProps) {
  const { t } = useLanguage();
  const planetInfo = getPlanetInfo(dayRuler);
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('dailyEnergy.todaysRuler')}
      </Text>
      
      <View style={styles.planetDisplay}>
        <Text style={styles.planetIcon}>{planetInfo.symbol}</Text>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>
            {t(`planets.${dayRuler.toLowerCase()}`)} • {planetInfo.arabicName}
          </Text>
          <View style={styles.elementRow}>
            <Text style={styles.elementIcon}>{getElementIcon(dayElement)}</Text>
            <Text style={styles.elementText}>
              {t('notifications.timing.element')}: {t(`elements.${dayElement}`)}
            </Text>
          </View>

          {currentHour && (
            <View style={styles.elementRow}>
              <Text style={styles.elementIcon}>⏳</Text>
              <Text style={styles.elementText}>
                {t('dailyEnergy.todaysProfile.currentHourLabel')}: {t(`planets.${currentHour.planet.toLowerCase()}`)} ({currentHour.range})
              </Text>
            </View>
          )}
          <Text style={styles.description}>{dayDescription}</Text>
        </View>
      </View>
      
      {transitSign && transitPower !== undefined && (
        <View style={styles.transitInfo}>
          <Text style={styles.label}>{t('dailyEnergy.currentTransit')}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {t('dailyEnergy.transitIn', {
                sign: transitSign,
                dignity: transitDignity ? ` (${transitDignity})` : '',
              })}
            </Text>
          </View>
          <StrengthBar value={transitPower} />
        </View>
      )}
    </View>
  );
}

/**
 * Simple strength bar component
 */
function StrengthBar({ value }: { value: number }) {
  const { t } = useLanguage();
  const getStrengthLabel = (score: number): string => {
    if (score >= 80) return t('dailyEnergy.strengthLabels.veryStrong');
    if (score >= 60) return t('dailyEnergy.strengthLabels.strong');
    if (score >= 40) return t('dailyEnergy.strengthLabels.moderate');
    if (score >= 20) return t('dailyEnergy.strengthLabels.weak');
    return t('dailyEnergy.strengthLabels.veryWeak');
  };
  
  const getBarColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };
  
  return (
    <View style={styles.strengthBarContainer}>
      <View style={styles.strengthBarBackground}>
        <View 
          style={[
            styles.strengthBarFill, 
            { width: `${value}%`, backgroundColor: getBarColor(value) }
          ]} 
        />
      </View>
      <Text style={styles.strengthLabel}>{getStrengthLabel(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  
  planetDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  
  planetIcon: {
    fontSize: 48,
    lineHeight: 48,
  },
  
  planetInfo: {
    flex: 1,
  },
  
  planetName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  
  elementIcon: {
    fontSize: 16,
  },
  
  elementText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  
  transitInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(100, 90, 180, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(180, 170, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  strengthBarContainer: {
    marginTop: 8,
  },
  
  strengthBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  strengthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  strengthLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});
