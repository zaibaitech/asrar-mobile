/**
 * Element Progress Bar Component
 * Animated horizontal bar showing element percentage
 */

import { getElementColor, getElementLabel } from '@/utils/elementMeaning';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ElementProgressBarProps {
  element: 'fire' | 'air' | 'water' | 'earth';
  percentage: number;
  isDominant?: boolean;
  language: 'en' | 'ar' | 'fr';
}

export function ElementProgressBar({ 
  element, 
  percentage, 
  isDominant = false,
  language 
}: ElementProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const color = getElementColor(element);
  const label = getElementLabel(element);

  useEffect(() => {
    // Stagger animations slightly
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.spring(animatedWidth, {
        toValue: percentage,
        tension: 40,
        friction: 8,
        useNativeDriver: false
      })
    ]).start();
  }, [percentage]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }]}>
      <View style={styles.labelRow}>
        <View style={styles.labelContainer}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={[
            styles.elementLabel,
            isDominant && styles.elementLabelBold
          ]}>
            {label[language]}
          </Text>
        </View>
        
        <View style={styles.percentageContainer}>
          <Text style={[
            styles.percentageText,
            isDominant && styles.percentageBold
          ]}>
            {percentage}%
          </Text>
          {isDominant && (
            <View style={[styles.dominantBadge, { backgroundColor: color }]}>
              <Text style={styles.dominantText}>
                {language === 'ar' ? 'مهيمن' : language === 'fr' ? 'DOMINANT' : 'DOMINANT'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.barTrack}>
        <Animated.View 
          style={[
            styles.barFill, 
            { 
              width: widthInterpolation,
              backgroundColor: color,
              shadowColor: color,
              shadowOpacity: isDominant ? 0.5 : 0.3
            }
          ]} 
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  elementLabel: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  elementLabelBold: {
    fontWeight: '700',
    color: '#f1f5f9',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  percentageBold: {
    fontWeight: '700',
    color: '#f1f5f9',
  },
  dominantBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  dominantText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 3,
  },
});
