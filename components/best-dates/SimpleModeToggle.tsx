/**
 * SimpleModeToggle — ported from asrar.app's SimpleModeToggle.tsx.
 * Two-button segmented control: Simple / Detailed.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Colors from '@/constants/Colors';
import { UiLang } from '@/services/ikhtiyaratEngine/copy';
import { ikhtiyaratCopy } from '@/services/ikhtiyaratEngine/copy';

export interface SimpleModeToggleProps {
  simple: boolean;
  onChange: (value: boolean) => void;
  language: UiLang;
}

export default function SimpleModeToggle({ simple, onChange, language }: SimpleModeToggleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const c = ikhtiyaratCopy[language];

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Pressable
        onPress={() => onChange(true)}
        style={[styles.button, simple && { backgroundColor: '#059669' }]}
      >
        <Text style={[styles.text, { color: simple ? '#fff' : colors.textSecondary }]}>
          {c.simpleModeLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange(false)}
        style={[styles.button, !simple && { backgroundColor: '#059669' }]}
      >
        <Text style={[styles.text, { color: !simple ? '#fff' : colors.textSecondary }]}>
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
