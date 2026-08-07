/**
 * SimpleModeToggle — ported from asrar.app's SimpleModeToggle.tsx.
 * Two-button segmented control: Simple / Detailed.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DarkTheme } from '@/constants/DarkTheme';
import { ikhtiyaratCopy, UiLang } from '@/services/ikhtiyaratEngine/copy';

const FEATURE_ACCENT = '#059669';

export interface SimpleModeToggleProps {
  simple: boolean;
  onChange: (value: boolean) => void;
  language: UiLang;
}

export default function SimpleModeToggle({ simple, onChange, language }: Readonly<SimpleModeToggleProps>) {
  const c = ikhtiyaratCopy[language];

  return (
    <View style={[styles.container, { borderColor: DarkTheme.borderSubtle }]}>
      <Pressable
        onPress={() => onChange(true)}
        style={[styles.button, simple && { backgroundColor: FEATURE_ACCENT }]}
      >
        <Text style={[styles.text, { color: simple ? '#fff' : DarkTheme.textSecondary }]}>
          {c.simpleModeLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange(false)}
        style={[styles.button, !simple && { backgroundColor: FEATURE_ACCENT }]}
      >
        <Text style={[styles.text, { color: !simple ? '#fff' : DarkTheme.textSecondary }]}>
          {c.detailedModeLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    alignSelf: 'flex-start',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
