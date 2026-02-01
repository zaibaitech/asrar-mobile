/**
 * InfoTooltip Component
 * Displays an ℹ️ icon that shows explanatory tooltip on press
 * 
 * Usage:
 * - With direct text: <InfoTooltip text={t('tooltips.sun')} />
 * - With key lookup: <InfoTooltip tooltipKey="sun" />
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InfoTooltipProps {
  /** Direct text to display (preferred) */
  text?: string;
  /** Key for tooltip lookup (fallback) - will look up `tooltips.${tooltipKey}` */
  tooltipKey?: string;
  size?: number;
  color?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  tooltipKey,
  size = 16,
  color = '#8B7BF7',
}) => {
  const [visible, setVisible] = useState(false);
  const { tSafe } = useLanguage();

  // Use direct text if provided, otherwise lookup by key
  const tooltipText = text || (tooltipKey ? tSafe(`tooltips.${tooltipKey}`, '') : '');

  // Don't render if no tooltip text
  if (!tooltipText) return null;

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.iconContainer}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="information-circle-outline" size={size} color={color} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>{tooltipText}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeButtonText}>
                {tSafe('common.buttons.ok', 'OK')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipContainer: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 20,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: '#8B7BF7',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#8B7BF7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InfoTooltip;
