import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { DarkTheme } from '../../constants/DarkTheme';

interface CompatibilityGaugeProps {
  score: number;
  label: string;
  color: string;
  language?: 'en' | 'fr' | 'ar';
  size?: number;
}

export function CompatibilityGauge({ 
  score, 
  label, 
  color, 
  language = 'en',
  size = 120 
}: CompatibilityGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        width={10}
        fill={normalizedScore}
        tintColor={color}
        backgroundColor="rgba(255, 255, 255, 0.1)"
        rotation={0}
        lineCap="round"
        duration={1500}
      >
        {() => (
          <Text style={[styles.scoreText, { color }]}>
            {Math.round(normalizedScore)}%
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
