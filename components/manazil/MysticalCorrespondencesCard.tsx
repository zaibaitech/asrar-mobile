import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import type { ManazilLanguage, ManzilPracticePack, Planet } from '@/data/manazilPractices';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExpandableCard } from './ExpandableCard';

function pickText(
  text: { en: string; fr: string; ar: string } | undefined,
  language: ManazilLanguage
): string | null {
  if (!text) return null;
  return text[language] ?? text.en;
}

export function MysticalCorrespondencesCard(props: { accent: string; pack: ManzilPracticePack; language?: ManazilLanguage }) {
  const { accent, pack } = props;
  const language: ManazilLanguage = props.language ?? 'en';
  const c = pack.correspondences;

  const letters = c?.letters?.filter(Boolean) ?? [];
  const incense = c?.incense?.filter(Boolean) ?? [];
  const sadaqah = c?.sadaqah?.filter(Boolean) ?? [];
  const colors = c?.colors?.filter(Boolean) ?? [];
  const metals = c?.metals?.filter(Boolean) ?? [];
  const stones = c?.stones?.filter(Boolean) ?? [];
  const numbers = c?.numbers?.filter(Boolean) ?? [];

  const ruling: Planet | undefined = c?.planetary?.rulingPlanet;

  return (
    <ExpandableCard title="Mystical Correspondences" icon="grid-outline" accentColor={accent}>
      {pack.disclaimer ? <Text style={styles.disclaimer}>{pickText(pack.disclaimer, language)}</Text> : null}

      {ruling ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="planet-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Ruler</Text>
          </View>
          <Text style={styles.line}>{ruling}</Text>
        </View>
      ) : null}

      {letters.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="text-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Letters</Text>
          </View>
          {letters.map((l, idx) => (
            <Text key={idx} style={styles.line}>{`${l.letter}${l.name ? ` (${l.name})` : ''} = ${l.value}`}</Text>
          ))}
        </View>
      ) : null}

      {numbers.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="calculator-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Numbers</Text>
          </View>
          {numbers.map((n, idx) => (
            <Text key={idx} style={styles.line}>
              {n.value}{n.note ? ` — ${pickText(n.note, language)}` : ''}
            </Text>
          ))}
        </View>
      ) : null}

      {colors.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="color-palette-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Colors</Text>
          </View>
          <View style={styles.colorRow}>
            {colors.map((col, idx) => (
              <View key={idx} style={styles.colorChip}>
                <View style={[styles.swatch, { backgroundColor: col.hex ?? accent }]} />
                <Text style={styles.colorText}>{pickText(col.name, language)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {metals.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="sparkles-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Metals</Text>
          </View>
          {metals.map((m, idx) => (
            <Text key={idx} style={styles.line}>{pickText(m.name, language)}</Text>
          ))}
        </View>
      ) : null}

      {stones.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="diamond-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Stones</Text>
          </View>
          {stones.map((s, idx) => (
            <Text key={idx} style={styles.line}>{pickText(s.name, language)}</Text>
          ))}
        </View>
      ) : null}

      {incense.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="flame-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Fumigation / Incense</Text>
          </View>
          {incense.map((i, idx) => (
            <Text key={idx} style={styles.line}>{pickText(i.name, language)}</Text>
          ))}
        </View>
      ) : null}

      {sadaqah.length > 0 ? (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Ionicons name="heart-outline" size={16} color={accent} />
            <Text style={styles.blockTitle}>Ṣadaqah</Text>
          </View>
          {sadaqah.map((s, idx) => (
            <Text key={idx} style={styles.line}>{pickText(s.suggestion, language)}</Text>
          ))}
        </View>
      ) : null}

      {pack.sourceNote ? <Text style={styles.note}>{pickText(pack.sourceNote, language)}</Text> : null}
    </ExpandableCard>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  block: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  blockTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  line: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: 4,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  colorText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  note: {
    marginTop: Spacing.md,
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
  },
});
