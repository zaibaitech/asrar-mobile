import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { PLANETARY_ZIKR } from '@/constants/planetaryZikr';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type PlanetaryZikrCardProps = {
  planetKey: string;
};

export function PlanetaryZikrCard({ planetKey }: PlanetaryZikrCardProps) {
  const { tSafe } = useLanguage();
  const data = PLANETARY_ZIKR[planetKey as keyof typeof PLANETARY_ZIKR];
  if (!data) return null;

  const localizedPlanetLabel = tSafe(`planetaryZikr.planets.${planetKey}.label`, data.label);
  const localizedTitle = tSafe('planetaryZikr.recommendedTitle', '{planet} - Recommended Zikr', {
    planet: localizedPlanetLabel,
  });
  const localizedSectionNote = data.sectionNote
    ? tSafe(`planetaryZikr.planets.${planetKey}.sectionNote`, data.sectionNote)
    : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{localizedTitle}</Text>
      {!!localizedSectionNote && <Text style={styles.sectionNote}>{localizedSectionNote}</Text>}

      <View style={styles.list}>
        {data.zikr.map((item) => (
          <View key={`${planetKey}-${item.name}-${item.count}`} style={styles.item}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{item.count}×</Text>
              </View>
            </View>
            {!!item.note && (
              <Text style={styles.noteTag}>
                {tSafe(`planetaryZikr.planets.${planetKey}.entries.${item.id}.note`, item.note)}
              </Text>
            )}
            <Text style={styles.benefit}>
              {tSafe(`planetaryZikr.planets.${planetKey}.entries.${item.id}.benefit`, item.benefit)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  sectionNote: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    lineHeight: 18,
  },
  list: {
    gap: 10,
  },
  item: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : undefined,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.24)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F5D26A',
  },
  noteTag: {
    alignSelf: 'flex-start',
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
  benefit: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
  },
});