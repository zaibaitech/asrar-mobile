/**
 * Manual Verse Selector Modal
 * ============================
 * Modal for manually selecting a Qur'an verse
 */

import { SurahAyahSelector } from '@/components/calculator/SurahAyahSelector';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ManualVerseSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (surah: number, ayah: number) => void;
  colorScheme?: 'light' | 'dark';
}

export function ManualVerseSelector({
  visible,
  onClose,
  onSelect,
  colorScheme = 'light',
}: ManualVerseSelectorProps) {
  const colors = Colors[colorScheme];
  
  const handleVerseSelect = (surah: number, ayah: number) => {
    onSelect(surah, ayah);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Select a Verse
          </Text>
          <View style={styles.closeButton} />
        </View>
        
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Choose any verse from the Qur'an for reflection
          </Text>
        </View>
        
        {/* Selector */}
        <View style={styles.selectorContainer}>
          <SurahAyahSelector
            onSelect={handleVerseSelect}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  selectorContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
