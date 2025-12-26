/**
 * Calculation Type Selector Component
 * Allows user to select what they are calculating
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalculationType } from '../../types/calculator-enhanced';

interface CalculationTypeSelectorProps {
  selectedType: CalculationType;
  onTypeChange: (type: CalculationType) => void;
}

interface TypeOption {
  type: CalculationType;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    type: 'name',
    icon: '👤',
    title: 'Name',
    subtitle: 'Single name analysis',
    color: '#6366f1',
  },
  {
    type: 'lineage',
    icon: '🌳',
    title: 'Lineage',
    subtitle: 'Name + Mother',
    color: '#8b5cf6',
  },
  {
    type: 'phrase',
    icon: '📝',
    title: 'Phrase',
    subtitle: 'Sentence or text',
    color: '#ec4899',
  },
  {
    type: 'quran',
    icon: '📖',
    title: 'Qur\'an',
    subtitle: 'Surah + Ayah',
    color: '#10b981',
  },
  {
    type: 'dhikr',
    icon: '🤲',
    title: 'Dhikr',
    subtitle: 'Divine Names',
    color: '#f59e0b',
  },
  {
    type: 'general',
    icon: '🔤',
    title: 'General',
    subtitle: 'Raw letters',
    color: '#06b6d4',
  },
];

export const CalculationTypeSelector: React.FC<CalculationTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>🎯 Calculation Type</Text>
      <Text style={styles.subtitle}>What would you like to calculate?</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.type;
          
          return (
            <TouchableOpacity
              key={option.type}
              style={styles.optionWrapper}
              onPress={() => onTypeChange(option.type)}
              activeOpacity={0.7}
            >
              {isSelected ? (
                <LinearGradient
                  colors={[option.color, option.color + 'dd']}
                  style={styles.option}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.iconSelected}>{option.icon}</Text>
                  <Text style={styles.titleSelected}>{option.title}</Text>
                  <Text style={styles.subtitleSelected}>{option.subtitle}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.option, styles.optionInactive]}>
                  <Text style={styles.iconInactive}>{option.icon}</Text>
                  <Text style={styles.titleInactive}>{option.title}</Text>
                  <Text style={styles.subtitleInactive}>{option.subtitle}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#0f172a',
  },
  
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  
  scrollContent: {
    gap: 12,
    paddingVertical: 4,
  },
  
  optionWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  option: {
    width: 110,
    height: 100,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  
  optionInactive: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  
  iconSelected: {
    fontSize: 28,
    marginBottom: 2,
  },
  
  iconInactive: {
    fontSize: 24,
    opacity: 0.6,
  },
  
  titleSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  
  titleInactive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  
  subtitleSelected: {
    fontSize: 11,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  
  subtitleInactive: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});
