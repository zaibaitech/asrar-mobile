/**
 * Prayer Guidance Usage Examples
 * 
 * This file demonstrates how to use the Classical Planetary Hour Practices
 * data with the bilingual translation system.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  sundayHourPractices,
  getHourPractice,
  getRulingPlanet,
  PLANETARY_HOUR_SEQUENCE,
  type ClassicalHourPractice,
  type ClassicalWork,
} from '@/data/classical-hour-practices';

// ============================================================================
// Example 1: Display a Single Hour with Translations
// ============================================================================

export function HourDetailCard({ day, hourNumber }: { day: string; hourNumber: number }) {
  const { t } = useLanguage();
  const hourData = getHourPractice(day as any, hourNumber as any);

  if (!hourData) {
    return <Text>No data available for this hour</Text>;
  }

  return (
    <View style={styles.card}>
      {/* Hour Header */}
      <Text style={styles.hourTitle}>
        {t('prayerGuidance.hours.hourNumber', { number: hourNumber })}
      </Text>

      {/* Ruling Planet */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.hours.rulingPlanet')}:</Text>
        <Text style={styles.value}>
          {t(`prayerGuidance.planets.${hourData.planet}`)}
        </Text>
      </View>

      {/* Recommended Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('prayerGuidance.hours.recommendedWorks')}
        </Text>
        {hourData.recommendedWorks.map((work) => (
          <WorkItem key={work.id} work={work} />
        ))}
      </View>

      {/* Avoid Works */}
      {hourData.avoidWorks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('prayerGuidance.hours.avoidWorks')}
          </Text>
          {hourData.avoidWorks.map((work) => (
            <WorkItem key={work.id} work={work} variant="avoid" />
          ))}
        </View>
      )}

      {/* Classical Arabic Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('prayerGuidance.hours.classicalText')}
        </Text>
        <Text style={styles.arabicText}>{hourData.arabicText}</Text>
      </View>

      {/* Source */}
      <View style={styles.footer}>
        <Text style={styles.sourceText}>
          {t('prayerGuidance.hours.source')}: {hourData.source.title}
        </Text>
        <Text style={styles.traditionText}>
          {t('prayerGuidance.hours.tradition')}: {hourData.source.tradition}
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// Example 2: Work Item Component (Reusable)
// ============================================================================

function WorkItem({ work, variant = 'recommended' }: { 
  work: ClassicalWork; 
  variant?: 'recommended' | 'avoid' 
}) {
  const { t } = useLanguage();

  return (
    <View style={[styles.workItem, variant === 'avoid' && styles.avoidWork]}>
      <Text style={styles.workName}>{t(work.nameKey)}</Text>
      {work.descriptionKey && (
        <Text style={styles.workDescription}>{t(work.descriptionKey)}</Text>
      )}
    </View>
  );
}

// ============================================================================
// Example 3: Display All Sunday Hours
// ============================================================================

export function SundayHoursScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>
        {t('prayerGuidance.days.Sunday')} - {t('prayerGuidance.title')}
      </Text>
      <Text style={styles.subtitle}>{t('prayerGuidance.subtitle')}</Text>

      {sundayHourPractices.map((hourPractice) => (
        <HourDetailCard
          key={hourPractice.hourNumber}
          day="Sunday"
          hourNumber={hourPractice.hourNumber}
        />
      ))}
    </ScrollView>
  );
}

// ============================================================================
// Example 4: Planetary Sequence Visualization
// ============================================================================

export function PlanetarySequenceTable({ day }: { day: string }) {
  const { t } = useLanguage();
  const sequence = PLANETARY_HOUR_SEQUENCE[day as keyof typeof PLANETARY_HOUR_SEQUENCE];

  if (!sequence) return null;

  return (
    <View style={styles.table}>
      <Text style={styles.tableTitle}>
        {t('prayerGuidance.days.' + day)} - {t('prayerGuidance.hours.rulingPlanet')}
      </Text>
      
      {sequence.map((planet, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableHour}>
            {t('prayerGuidance.hours.hourNumber', { number: index + 1 })}
          </Text>
          <Text style={styles.tablePlanet}>
            {t(`prayerGuidance.planets.${planet}`)}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// Example 5: Quick Hour Lookup
// ============================================================================

export function QuickHourLookup() {
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = React.useState<string>('Sunday');
  const [selectedHour, setSelectedHour] = React.useState<number>(1);

  const planet = getRulingPlanet(selectedDay as any, selectedHour as any);
  const hourData = getHourPractice(selectedDay as any, selectedHour as any);

  return (
    <View style={styles.lookupContainer}>
      <Text style={styles.lookupTitle}>{t('prayerGuidance.title')}</Text>

      {/* Day Selector - simplified for example */}
      <Text>
        {t('prayerGuidance.days.' + selectedDay)} - {t('prayerGuidance.hours.hourNumber', { number: selectedHour })}
      </Text>

      {/* Planet Display */}
      <Text style={styles.planetDisplay}>
        {t(`prayerGuidance.planets.${planet}`)}
      </Text>

      {/* Hour Details */}
      {hourData && (
        <View>
          {/* Recommended */}
          <Text>{t('prayerGuidance.hours.recommendedWorks')}:</Text>
          {hourData.recommendedWorks.map((work) => (
            <Text key={work.id}>• {t(work.nameKey)}</Text>
          ))}

          {/* Avoid */}
          {hourData.avoidWorks.length > 0 && (
            <>
              <Text>{t('prayerGuidance.hours.avoidWorks')}:</Text>
              {hourData.avoidWorks.map((work) => (
                <Text key={work.id}>• {t(work.nameKey)}</Text>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
}

// ============================================================================
// Example 6: Filter Works by Type
// ============================================================================

export function filterWorksByKeyword(
  practices: ClassicalHourPractice[],
  keyword: string
): ClassicalHourPractice[] {
  return practices.filter((practice) => {
    const allWorks = [...practice.recommendedWorks, ...practice.avoidWorks];
    return allWorks.some((work) => 
      work.id.toLowerCase().includes(keyword.toLowerCase())
    );
  });
}

// Usage:
// const protectionHours = filterWorksByKeyword(sundayHourPractices, 'protection');
// const loveHours = filterWorksByKeyword(sundayHourPractices, 'love');

// ============================================================================
// Example 7: Get Works Summary for a Day
// ============================================================================

export function getWorksSummaryForDay(day: string): {
  totalHours: number;
  recommendedCount: number;
  avoidCount: number;
  planetDistribution: Record<string, number>;
} {
  const practices = sundayHourPractices; // For now, only Sunday
  
  const summary = {
    totalHours: practices.length,
    recommendedCount: 0,
    avoidCount: 0,
    planetDistribution: {} as Record<string, number>,
  };

  practices.forEach((practice) => {
    summary.recommendedCount += practice.recommendedWorks.length;
    summary.avoidCount += practice.avoidWorks.length;
    
    const planet = practice.planet;
    summary.planetDistribution[planet] = (summary.planetDistribution[planet] || 0) + 1;
  });

  return summary;
}

// Usage:
// const summary = getWorksSummaryForDay('Sunday');
// console.log(`Sunday has ${summary.totalHours} hours`);
// console.log(`Total recommended works: ${summary.recommendedCount}`);
// console.log(`Total works to avoid: ${summary.avoidCount}`);

// ============================================================================
// Example 8: Language Switching Demo
// ============================================================================

export function LanguageSwitchingDemo() {
  const { t, language, setLanguage } = useLanguage();
  const hourData = getHourPractice('Sunday', 1);

  return (
    <View>
      {/* Language Toggle */}
      <Text>Current Language: {language}</Text>
      <Text onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}>
        Switch to {language === 'en' ? 'FR' : 'EN'}
      </Text>

      {/* Bilingual Content */}
      {hourData && (
        <View>
          <Text>{t('prayerGuidance.hours.hourNumber', { number: 1 })}</Text>
          <Text>{t(`prayerGuidance.planets.${hourData.planet}`)}</Text>
          
          {hourData.recommendedWorks.map((work) => (
            <View key={work.id}>
              <Text>{t(work.nameKey)}</Text>
              {/* Switches automatically when language changes! */}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hourTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  workItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    marginBottom: 8,
  },
  avoidWork: {
    backgroundColor: '#fff1f0',
  },
  workName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  workDescription: {
    fontSize: 12,
    color: '#666',
  },
  arabicText: {
    fontSize: 16,
    textAlign: 'right',
    lineHeight: 28,
    fontFamily: 'System', // Use Arabic-supporting font
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
  },
  traditionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHour: {
    flex: 1,
    fontWeight: '500',
  },
  tablePlanet: {
    flex: 1,
    textAlign: 'right',
  },
  lookupContainer: {
    padding: 16,
  },
  lookupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planetDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
  },
});

// ============================================================================
// TypeScript Usage Tips
// ============================================================================

/*
 * Type Safety Examples:
 * 
 * 1. Use specific types for day and hour:
 *    const day: DayOfWeek = 'Sunday'; // ✅ Type-safe
 *    const hour: HourNumber = 1;      // ✅ Type-safe
 * 
 * 2. Translation keys are strings, so no type checking:
 *    t('prayerGuidance.planets.Sun')  // Works
 *    t('prayerGuidance.planets.Sun2') // No error (runtime missing key)
 * 
 * 3. Use the humanizeKey fallback from LanguageContext:
 *    Missing keys will display as "Planets Sun" instead of raw key
 * 
 * 4. Access work data type-safely:
 *    const work: ClassicalWork = hourData.recommendedWorks[0];
 *    console.log(work.nameKey); // ✅ TypeScript knows this exists
 */
