/**
 * ResultsCard - Reusable card component for displaying result data
 * Mobile Implementation - Expo Go 54
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ResultsCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  gradientColors?: readonly [string, string, ...string[]];
}

export function ResultsCard({
  title,
  subtitle,
  value,
  description,
  icon,
  color = '#4f46e5',
  gradientColors = ['rgba(79, 70, 229, 0.3)', 'rgba(99, 102, 241, 0.2)'],
}: ResultsCardProps) {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.card}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          
          <Text style={[styles.value, { color }]}>{value}</Text>
          
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
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    padding: 20,
    position: 'relative',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconContainer: {
    marginBottom: 12,
  },
  content: {
    paddingLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});
