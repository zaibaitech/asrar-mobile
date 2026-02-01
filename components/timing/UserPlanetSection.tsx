import type { ZodiacSign } from '@/constants/zodiacData';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Element, Planet } from '@/services/PlanetaryHoursService';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserPlanetSectionProps {
  userPlanet: Planet;
  userElement: Element;
  source: 'name' | 'birth' | 'default';
  zodiacSign?: ZodiacSign;
}

/**
 * Get planet info
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
 * Displays user's personal planet and element
 */
export default function UserPlanetSection({
  userPlanet,
  userElement,
  source,
  zodiacSign,
}: UserPlanetSectionProps) {
  const { t, language } = useLanguage();
  const lang = (language || '').toLowerCase();
  const planetInfo = getPlanetInfo(userPlanet);
  
  const getSourceLabel = (): string => {
    switch (source) {
      case 'birth':
        return t('dailyEnergy.sourceLabels.fromBirthChart');
      case 'name':
        return t('dailyEnergy.sourceLabels.fromName');
      case 'default':
        return t('dailyEnergy.sourceLabels.default');
    }
  };
  
  const zodiacName = zodiacSign
    ? lang === 'ar'
      ? zodiacSign.nameAr
      : lang === 'fr'
        ? zodiacSign.nameFr
        : zodiacSign.nameEn
    : undefined;

  const zodiacModality = zodiacSign
    ? lang === 'fr'
      ? zodiacSign.modalityFr
      : zodiacSign.modality
    : undefined;

  const zodiacTemperament = zodiacSign
    ? lang === 'fr'
      ? zodiacSign.temperamentFr
      : zodiacSign.temperament
    : undefined;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {zodiacSign ? t('dailyEnergy.spiritualBlueprint.title') : t('dailyEnergy.yourPlanet')}
      </Text>
      
      <View style={styles.planetDisplay}>
        <Text style={styles.planetIcon}>{planetInfo.symbol}</Text>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>
            {t(`planets.${userPlanet.toLowerCase()}`)} • {planetInfo.arabicName}
          </Text>

          {zodiacSign && (
            <View style={styles.profileMeta}>
              <Text style={styles.profileMetaLine}>
                {t('dailyEnergy.spiritualBlueprint.signLabel')}: {zodiacName}
              </Text>
              <Text style={styles.profileMetaLine}>
                {t('dailyEnergy.spiritualBlueprint.modalityLabel')}: {zodiacModality}
              </Text>
              <Text style={styles.profileMetaLine}>
                {t('dailyEnergy.spiritualBlueprint.temperamentLabel')}: {zodiacTemperament}
              </Text>
            </View>
          )}

          <View style={styles.elementRow}>
            <Text style={styles.elementIcon}>{getElementIcon(userElement)}</Text>
            <Text style={styles.element}>
              {t(`elements.${userElement}`)}
            </Text>
          </View>
          <Text style={styles.source}>{getSourceLabel()}</Text>
        </View>
      </View>
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
    marginBottom: 4,
  },

  profileMeta: {
    marginBottom: 8,
  },
  profileMetaLine: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 13,
    marginBottom: 2,
  },
  
  elementIcon: {
    fontSize: 16,
  },
  
  element: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  
  source: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
