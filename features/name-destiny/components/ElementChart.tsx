/**
 * ElementChart - Visual element display with gradient background
 * Mobile Implementation - Expo Go 54
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Leaf, Wind, Droplet } from 'lucide-react-native';

interface ElementChartProps {
  element: {
    en: string;
    ar: string;
    fr: string;
    quality?: string;
    color?: string;
  };
  percentage?: number;
  showPercentage?: boolean;
}

const ELEMENT_CONFIG: Record<string, { 
  icon: any; 
  gradient: readonly [string, string, string]; 
  primaryColor: string;
  description: string;
}> = {
  Fire: {
    icon: Flame,
    gradient: ['#ef4444', '#dc2626', '#b91c1c'],
    primaryColor: '#ef4444',
    description: 'Passionate, dynamic, transformative energy',
  },
  Earth: {
    icon: Leaf,
    gradient: ['#84cc16', '#65a30d', '#4d7c0f'],
    primaryColor: '#84cc16',
    description: 'Grounded, stable, nurturing foundation',
  },
  Air: {
    icon: Wind,
    gradient: ['#06b6d4', '#0891b2', '#0e7490'],
    primaryColor: '#06b6d4',
    description: 'Intellectual, communicative, free-flowing',
  },
  Water: {
    icon: Droplet,
    gradient: ['#3b82f6', '#2563eb', '#1d4ed8'],
    primaryColor: '#3b82f6',
    description: 'Emotional, intuitive, adaptive wisdom',
  },
};

export function ElementChart({ 
  element, 
  percentage, 
  showPercentage = false 
}: ElementChartProps) {
  const config = ELEMENT_CONFIG[element.en] || ELEMENT_CONFIG.Fire;
  const ElementIcon = config.icon;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${config.primaryColor}40`, `${config.primaryColor}20`, 'transparent']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <ElementIcon size={40} color={config.primaryColor} strokeWidth={2} />
          <View style={styles.titleContainer}>
            <Text style={[styles.elementName, { color: config.primaryColor }]}>
              {element.en}
            </Text>
            <Text style={styles.elementArabic}>{element.ar}</Text>
          </View>
          {showPercentage && percentage !== undefined && (
            <View style={[styles.percentageBadge, { backgroundColor: config.primaryColor }]}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          )}
        </View>

        <Text style={styles.description}>{config.description}</Text>
        
        {element.quality && (
          <View style={styles.qualityContainer}>
            <Text style={styles.qualityLabel}>Quality:</Text>
            <Text style={styles.qualityValue}>{element.quality}</Text>
          </View>
        )}

        {/* Visual bar representation */}
        {showPercentage && percentage !== undefined && (
          <View style={styles.barContainer}>
            <View style={styles.barBackground}>
              <LinearGradient
                colors={config.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.barFill, { width: `${percentage}%` }]}
              />
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  elementName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  elementArabic: {
    fontSize: 18,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  percentageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: 12,
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qualityLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginRight: 8,
  },
  qualityValue: {
    fontSize: 13,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  barContainer: {
    marginTop: 8,
  },
  barBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
