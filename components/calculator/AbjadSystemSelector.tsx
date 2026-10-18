/**
 * The calculator's Maghribi / Mashriqi selector, shared by every calculator screen.
 * Without props it reads and writes the app-wide system (persisted), so switching
 * here switches every calculation in the app.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AbjadSystemKey } from '../../constants/abjad-maps';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAbjadSystem } from '../../hooks/useAbjadSystem';

interface AbjadSystemSelectorProps {
  system?: AbjadSystemKey;
  onSystemChange?: (system: AbjadSystemKey) => void;
  showLabel?: boolean;
  showNote?: boolean;
}

export function AbjadSystemSelector({ system: systemProp, onSystemChange, showLabel = true, showNote = true }: AbjadSystemSelectorProps) {
  const { t } = useLanguage();
  const app = useAbjadSystem();
  const system = systemProp ?? app.system;
  const onChange = onSystemChange ?? app.setSystem;

  const renderButton = (value: AbjadSystemKey, icon: string) => (
    <TouchableOpacity
      style={styles.systemButtonWrapper}
      onPress={() => onChange(value)}
      accessibilityRole="button"
      accessibilityState={{ selected: system === value }}
      testID={`abjad-system-${value}`}
    >
      {system === value ? (
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.systemButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.systemTextActive}>{icon} {t(`calculator.abjad.${value}`)}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.systemButton, styles.systemButtonInactive]}>
          <Text style={styles.systemTextInactive}>{t(`calculator.abjad.${value}`)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.selectorContainer} testID="abjad-system-selector">
      {showLabel && <Text style={styles.selectorLabel}>🎯 {t('calculator.form.abjadSystem')}</Text>}
      <View style={styles.systemSelector}>
        {renderButton('maghribi', '🌙')}
        {renderButton('mashriqi', '☀️')}
      </View>
      {showNote && <Text style={styles.note} testID="abjad-system-note">{t('calculator.abjad.systemNote')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    gap: 12,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  systemSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  systemButtonWrapper: {
    flex: 1,
  },
  systemButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  systemButtonInactive: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
    elevation: 0,
  },
  systemTextActive: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  systemTextInactive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94a3b8',
  },
  note: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: -4,
  },
});
