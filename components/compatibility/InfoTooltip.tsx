import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DarkTheme } from '../../constants/DarkTheme';

interface InfoTooltipProps {
  title?: string;
  content: string | string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
}

export function InfoTooltip({ 
  title, 
  content, 
  position = 'top',
  maxWidth = '280px' 
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const contentArray = Array.isArray(content) ? content : [content];
  
  return (
    <>
      <TouchableOpacity 
        onPress={() => setIsVisible(true)}
        style={styles.iconButton}
        accessible
        accessibilityLabel={title || 'Learn more'}
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="information-circle" size={20} color={DarkTheme.textMuted} />
      </TouchableOpacity>
      
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.tooltip}>
            {title && (
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
            )}
            
            <View style={styles.contentContainer}>
              {contentArray.map((text, idx) => (
                <Text key={idx} style={styles.text}>
                  {text}
                </Text>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    marginLeft: 6,
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tooltip: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  titleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  contentContainer: {
    padding: 16,
    gap: 10,
  },
  text: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
});
