/**
 * ElectionTypeDropdown — replaces the Marriage/Travel two-button toggle
 * with a proper dropdown select, since more election types (business,
 * medical, home, education — already scored by the ported engine's
 * source app) are expected to be added later. A button-row would grow
 * awkwardly; a dropdown scales cleanly to N options.
 */

import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@/constants/DarkTheme';
import { ElectionType } from '@/services/ikhtiyaratEngine';

const FEATURE_ACCENT = '#059669';

export interface ElectionTypeOption {
  value: ElectionType;
  label: string;
}

export interface ElectionTypeDropdownProps {
  value: ElectionType;
  options: ElectionTypeOption[];
  onChange: (value: ElectionType) => void;
  label: string;
}

export default function ElectionTypeDropdown({ value, options, onChange, label }: Readonly<ElectionTypeDropdownProps>) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Text style={[styles.label, { color: DarkTheme.textSecondary }]}>{label}</Text>
      <Pressable
        style={[styles.trigger, { borderColor: DarkTheme.borderSubtle, backgroundColor: DarkTheme.cardBackground }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text style={[styles.triggerText, { color: DarkTheme.textPrimary }]}>{selected?.label ?? ''}</Text>
        <Ionicons name="chevron-down" size={18} color={DarkTheme.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={[styles.card, { backgroundColor: DarkTheme.cardBackground }]} onPress={() => {}}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    style={[styles.option, { borderBottomColor: DarkTheme.borderSubtle }]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? FEATURE_ACCENT : DarkTheme.textPrimary },
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={FEATURE_ACCENT} />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    maxHeight: '60%',
    borderRadius: 14,
    paddingVertical: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});
