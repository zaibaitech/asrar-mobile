/**
 * DestinyHeader - Reusable header for Name Destiny screens
 */

import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DestinyHeaderProps {
  title: string;
  onBack: () => void;
  language: 'en' | 'fr';
  onLanguageChange: (lang: 'en' | 'fr') => void;
}

export function DestinyHeader({ title, onBack, language, onLanguageChange }: DestinyHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color="#e2e8f0" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.languageRow}>
        {(['en', 'fr'] as const).map((lang) => {
          const active = language === lang;
          return (
            <TouchableOpacity
              key={lang}
              onPress={() => onLanguageChange(lang)}
              style={[styles.languagePill, active && styles.languagePillActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.languagePillText, active && styles.languagePillTextActive]}>
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  languagePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languagePillActive: {
    backgroundColor: '#7c3aed',
    borderColor: 'rgba(124, 58, 237, 0.6)',
  },
  languagePillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  languagePillTextActive: {
    color: '#ffffff',
  },
});
