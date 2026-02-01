import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type MomentGuidanceCardProps = {
  title: string;
  summary: string;
  excellentForTitle: string;
  excellentForItems: string[];
  avoidTitle?: string;
  avoidItems?: string[];
  timingNote?: string;
};

export function MomentGuidanceCard({
  title,
  summary,
  excellentForTitle,
  excellentForItems,
  avoidTitle,
  avoidItems,
  timingNote,
}: MomentGuidanceCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{excellentForTitle}</Text>
        {excellentForItems.map((item, idx) => (
          <View key={`${item}-${idx}`} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: '#34D399' }]}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      {!!avoidTitle && !!avoidItems?.length && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{avoidTitle}</Text>
          {avoidItems.map((item, idx) => (
            <View key={`${item}-${idx}`} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color: '#F97316' }]}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {!!timingNote && (
        <View style={styles.note}>
          <Text style={styles.noteText}>{timingNote}</Text>
        </View>
      )}
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
  summary: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
  },
  note: {
    marginTop: 4,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  noteText: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    lineHeight: 18,
  },
});
