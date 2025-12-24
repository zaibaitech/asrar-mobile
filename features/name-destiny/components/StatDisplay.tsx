/**
 * StatDisplay - Generic stat card for displaying numbers with labels
 * Mobile Implementation - Expo Go 54
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StatDisplayProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  gradientColors?: readonly [string, string, ...string[]];
  size?: 'small' | 'medium' | 'large';
}

export function StatDisplay({
  label,
  value,
  description,
  icon,
  color = '#4f46e5',
  gradientColors = ['rgba(79, 70, 229, 0.3)', 'rgba(99, 102, 241, 0.2)'],
  size = 'medium',
}: StatDisplayProps) {
  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      value: styles.valueSmall,
      label: styles.labelSmall,
    },
    medium: {
      container: styles.containerMedium,
      value: styles.valueMedium,
      label: styles.labelMedium,
    },
    large: {
      container: styles.containerLarge,
      value: styles.valueLarge,
      label: styles.labelLarge,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.wrapper, currentSize.container]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
      >
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={[styles.label, currentSize.label]}>{label}</Text>
          <Text style={[styles.value, currentSize.value, { color }]}>
            {value}
          </Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        
        <View style={[styles.accent, { backgroundColor: color }]} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  iconContainer: {
    marginBottom: 8,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  value: {
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
  // Small size
  containerSmall: {
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 11,
  },
  valueSmall: {
    fontSize: 24,
  },
  // Medium size
  containerMedium: {
    marginBottom: 12,
  },
  labelMedium: {
    fontSize: 13,
  },
  valueMedium: {
    fontSize: 36,
  },
  // Large size
  containerLarge: {
    marginBottom: 16,
  },
  labelLarge: {
    fontSize: 15,
  },
  valueLarge: {
    fontSize: 48,
  },
});

// Grid layout helper for multiple stats
interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function StatGrid({ children, columns = 2 }: StatGridProps) {
  return (
    <View style={[
      gridStyles.container,
      columns === 3 && gridStyles.threeColumns,
    ]}>
      {children}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  threeColumns: {
    gap: 8,
  },
});
