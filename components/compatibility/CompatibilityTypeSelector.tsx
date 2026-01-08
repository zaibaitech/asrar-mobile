/**
 * Compatibility Type Selector Component
 * Step 1: Choose compatibility calculation type
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { CompatibilityType } from '../../services/compatibility/types';

interface CompatibilityTypeSelectorProps {
  selectedType: CompatibilityType;
  onSelectType: (type: CompatibilityType) => void;
  language: 'en' | 'fr' | 'ar';
}

export function CompatibilityTypeSelector({
  selectedType,
  onSelectType,
  language
}: CompatibilityTypeSelectorProps) {
  const { t } = useLanguage();
  
  // Map type IDs to translation key suffixes (camelCase)
  const typeKeyMap: Record<CompatibilityType, string> = {
    'person-person': 'personPerson',
    'person-divine-name': 'personDivineName',
    'divine-intention': 'divineIntention',
  };
  
  const types: Array<{
    type: CompatibilityType;
    icon: string;
  }> = [
    {
      type: 'person-person',
      icon: '👥',
    },
    {
      type: 'person-divine-name',
      icon: '🤲',
    },
    {
      type: 'divine-intention',
      icon: '🎯',
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {t('compatibility.form.chooseType')}
      </Text>
      
      {types.map((item) => (
        <TouchableOpacity
          key={item.type}
          style={[
            styles.typeCard,
            selectedType === item.type && styles.typeCardActive
          ]}
          onPress={() => onSelectType(item.type)}
        >
          <Text style={styles.typeIcon}>{item.icon}</Text>
          
          <View style={styles.typeContent}>
            <Text style={[
              styles.typeTitle,
              selectedType === item.type && styles.typeTitleActive
            ]}>
              {t(`compatibility.form.type.${typeKeyMap[item.type]}` as any)}
            </Text>
            
            <Text style={styles.typeDesc}>
              {t(`compatibility.form.type.${typeKeyMap[item.type]}Desc` as any)}
            </Text>
          </View>
          
          {selectedType === item.type && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeCardActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8b5cf6',
  },
  typeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeTitleActive: {
    color: '#ffffff',
  },
  typeDesc: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
