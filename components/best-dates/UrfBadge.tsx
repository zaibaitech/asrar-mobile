/**
 * UrfBadge — ported from asrar.app's UrfBadge.tsx. Single-badge variant
 * (not an array), with its own distinct purple/indigo tone palette —
 * deliberately different from BadgePills' green/blue/amber so ʿUrf (a
 * cultural/customary layer, never affecting the score) never looks like
 * the same kind of verdict as Sunnah/fiqh badges.
 */

import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Colors from '@/constants/Colors';
import { UiLang } from '@/services/ikhtiyaratEngine/copy';
import { UrfBadge as UrfBadgeData } from '@/services/ikhtiyaratEngine/urf';

const TONE_COLOR: Record<UrfBadgeData['tone'], string> = {
  positive: '#8B5CF6',
  neutral: '#6366F1',
  caution: '#D97706',
};

export interface UrfBadgeProps {
  badge: UrfBadgeData;
  language: UiLang;
}

export default function UrfBadge({ badge, language }: UrfBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [open, setOpen] = useState(false);
  const color = TONE_COLOR[badge.tone];

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.pill, { backgroundColor: `${color}12`, borderColor: `${color}40` }]}
      >
        <Text style={[styles.pillText, { color }]}>
          {badge.label[language === 'ar' ? 'en' : language]}
          {language !== 'ar' && <Text style={styles.pillArabic}> {badge.label.ar}</Text>}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={[styles.popover, { backgroundColor: colors.card }]} onPress={() => {}}>
            <Text style={[styles.noteText, { color: colors.text }]}>
              {badge.note[language === 'ar' ? 'ar' : language]}
            </Text>
            {language !== 'ar' && (
              <Text style={[styles.noteArabic, { color: colors.textTertiary }]}>{badge.note.ar}</Text>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
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
