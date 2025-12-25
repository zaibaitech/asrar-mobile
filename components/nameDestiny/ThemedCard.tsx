/**
 * ThemedCard - Dark card with element border accent
 */

import type { ElementType } from '@/utils/elementTheme';
import { getElementTheme } from '@/utils/elementTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ThemedCardProps {
  children: React.ReactNode;
  element?: ElementType;
  style?: any;
  innerStyle?: any;
}

export function ThemedCard({ children, element, style, innerStyle }: ThemedCardProps) {
  const theme = element ? getElementTheme(element) : null;

  return (
    <View
      style={[
        styles.card,
        theme && {
          borderColor: theme.borderColor,
          borderWidth: 2,
          shadowColor: theme.glowColor,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.9)']}
        style={[styles.gradient, innerStyle]}
      >
        {theme && <View style={[styles.accentLine, { backgroundColor: theme.accentColor }]} />}
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  gradient: {
    padding: 20,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
