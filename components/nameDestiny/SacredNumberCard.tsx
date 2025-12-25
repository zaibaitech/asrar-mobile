/**
 * SacredNumberCard - Display for Kabir/Saghir values
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SacredNumberCardProps {
  label: string;
  value: number | string;
  description?: string;
  gradientColors?: readonly [string, string];
  accentColor?: string;
}

export function SacredNumberCard({
  label,
  value,
  description,
  gradientColors = ['rgba(139, 92, 246, 0.35)', 'rgba(109, 40, 217, 0.2)'],
  accentColor = '#a78bfa',
}: SacredNumberCardProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: 'center',
  },
  value: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
