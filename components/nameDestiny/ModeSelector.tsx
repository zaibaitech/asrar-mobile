/**
 * Mode Selectors Component
 * Input Type + Understanding Level selectors
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { InputType, UnderstandingLevel, getInputTypeLabel, getUnderstandingLevelLabel } from '../../features/name-destiny/types/enums';

interface ModeSelectorProps {
  inputType: InputType;
  understandingLevel: UnderstandingLevel;
  onInputTypeChange: (type: InputType) => void;
  onUnderstandingLevelChange: (level: UnderstandingLevel) => void;
  language?: 'en' | 'fr' | 'ar';
}

export function ModeSelector({
  inputType,
  understandingLevel,
  onInputTypeChange,
  onUnderstandingLevelChange,
  language = 'en',
}: ModeSelectorProps) {
  const inputTypes = [
    InputType.NAME_PERSON,
    InputType.NAME_MOTHER_PAIR,
    InputType.DIVINE_NAME,
    InputType.QURAN_VERSE,
    InputType.SENTENCE,
    InputType.FREE_TEXT,
  ];

  const levels = [
    UnderstandingLevel.BEGINNER,
    UnderstandingLevel.INTERMEDIATE,
    UnderstandingLevel.CLASSICAL,
  ];

  const titles = {
    en: {
      inputType: 'Input Type',
      level: 'Understanding Level',
    },
    fr: {
      inputType: 'Type d\'Entrée',
      level: 'Niveau de Compréhension',
    },
    ar: {
      inputType: 'نوع الإدخال',
      level: 'مستوى الفهم',
    },
  };

  const t = titles[language];

  return (
    <View style={styles.container}>
      {/* Input Type Selector */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorTitle}>{t.inputType}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {inputTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => onInputTypeChange(type)}
              style={({ pressed }) => [
                styles.chip,
                inputType === type && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  inputType === type && styles.chipTextActive,
                ]}
              >
                {getInputTypeLabel(type, language)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Understanding Level Selector */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorTitle}>{t.level}</Text>
        <View style={styles.segmentedControl}>
          {levels.map((level, index) => (
            <Pressable
              key={level}
              onPress={() => onUnderstandingLevelChange(level)}
              style={({ pressed }) => [
                styles.segment,
                index === 0 && styles.segmentFirst,
                index === levels.length - 1 && styles.segmentLast,
                understandingLevel === level && styles.segmentActive,
                pressed && styles.segmentPressed,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  understandingLevel === level && styles.segmentTextActive,
                ]}
              >
                {getUnderstandingLevelLabel(level, language)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  selectorSection: {
    gap: 10,
  },
  selectorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    letterSpacing: 0.3,
  },
  chipContainer: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  chipActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderColor: '#a78bfa',
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  chipTextActive: {
    color: '#a78bfa',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(148, 163, 184, 0.2)',
  },
  segmentFirst: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  segmentLast: {
    borderRightWidth: 0,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  segmentActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.25)',
  },
  segmentPressed: {
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  segmentTextActive: {
    color: '#a78bfa',
  },
});
