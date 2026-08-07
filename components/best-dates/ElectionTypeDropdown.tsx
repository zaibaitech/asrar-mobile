/**
 * ElectionTypeDropdown — replaces the Marriage/Travel two-button toggle
 * with a proper dropdown select, since more election types (business,
 * medical, home, education — already scored by the ported engine's
 * source app) are expected to be added later. A button-row would grow
 * awkwardly; a dropdown scales cleanly to N options.
 */

import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { ElectionType } from '@/services/ikhtiyaratEngine';

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

export default function ElectionTypeDropdown({ value, options, onChange, label }: ElectionTypeDropdownProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Pressable
        style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text style={[styles.triggerText, { color: colors.text }]}>{selected?.label ?? ''}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={[styles.card, { backgroundColor: colors.card }]} onPress={() => {}}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.option, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: item.value === value ? '#059669' : colors.text },
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && <Ionicons name="checkmark" size={18} color="#059669" />}
                </Pressable>
              )}
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
