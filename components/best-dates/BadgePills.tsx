/**
 * BadgePills — ported from asrar.app's SunnahBadges.tsx.
 * Generic pill-with-popover renderer, reused for Sunnah and Travel badge
 * arrays (both are structurally { id, label, note, tone }).
 */

import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Colors from '@/constants/Colors';
import { UiLang } from '@/services/ikhtiyaratEngine/copy';

export interface BadgeLike {
  id: string;
  label: { en: string; fr: string; ar: string };
  note: { en: string; fr: string; ar: string };
  tone: 'positive' | 'neutral' | 'caution';
}

const TONE_COLOR: Record<BadgeLike['tone'], string> = {
  positive: '#22C55E',
  neutral: '#3B82F6',
  caution: '#F59E0B',
};

export interface BadgePillsProps {
  badges: BadgeLike[];
  language: UiLang;
}

export default function BadgePills({ badges, language }: BadgePillsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [openId, setOpenId] = useState<string | null>(null);

  if (badges.length === 0) return null;

  const openBadge = badges.find((b) => b.id === openId) ?? null;

  return (
    <View style={styles.row}>
      {badges.map((badge) => {
        const color = TONE_COLOR[badge.tone];
        return (
          <Pressable
            key={badge.id}
            onPress={() => setOpenId(badge.id)}
            style={[styles.pill, { backgroundColor: `${color}12`, borderColor: `${color}40` }]}
          >
            <Text style={[styles.pillText, { color }]}>
              {badge.label[language === 'ar' ? 'en' : language]}
              {language !== 'ar' && <Text style={styles.pillArabic}> {badge.label.ar}</Text>}
            </Text>
          </Pressable>
        );
      })}

      <Modal visible={!!openBadge} transparent animationType="fade" onRequestClose={() => setOpenId(null)}>
        <Pressable style={styles.overlay} onPress={() => setOpenId(null)}>
          <Pressable style={[styles.popover, { backgroundColor: colors.card }]} onPress={() => {}}>
            {openBadge && (
              <>
                <Text style={[styles.noteText, { color: colors.text }]}>
                  {openBadge.note[language === 'ar' ? 'ar' : language]}
                </Text>
                {language !== 'ar' && (
                  <Text style={[styles.noteArabic, { color: colors.textTertiary }]}>{openBadge.note.ar}</Text>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
  },
  pillText: { fontSize: 12, fontWeight: '600' },
  pillArabic: { fontSize: 11, opacity: 0.7 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popover: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    padding: 14,
  },
  noteText: { fontSize: 13, lineHeight: 19 },
  noteArabic: { fontSize: 12, marginTop: 6, textAlign: 'right' },
});
