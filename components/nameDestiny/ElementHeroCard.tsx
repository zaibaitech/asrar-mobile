/**
 * ElementHeroCard - Large primary card displaying user's Tab element
 */

import type { ElementType } from '@/utils/elementTheme';
import { getElementTheme } from '@/utils/elementTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplet, Flame, Leaf, Wind } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ElementHeroCardProps {
  element: ElementType;
  elementAr?: string;
  elementFr?: string;
}

const ELEMENT_ICONS = {
  Fire: Flame,
  Air: Wind,
  Water: Droplet,
  Earth: Leaf,
};

export function ElementHeroCard({ element, elementAr, elementFr }: ElementHeroCardProps) {
  const theme = getElementTheme(element);
  const IconComponent = ELEMENT_ICONS[element];

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.borderColor,
          borderWidth: 2,
          shadowColor: theme.glowColor,
          shadowOpacity: 0.5,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
        },
      ]}
    >
      <LinearGradient
        colors={[`${theme.accentColor}30`, `${theme.accentColor}18`, 'rgba(30, 41, 59, 0.95)']}
        style={styles.gradient}
      >
        <View style={[styles.accentBar, { backgroundColor: theme.accentColor }]} />

        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.backgroundColor }]}>
            <IconComponent size={56} color={theme.accentColor} strokeWidth={2} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>YOUR PERSONAL ELEMENT (TAB)</Text>

        <View style={styles.nameContainer}>
          <Text style={[styles.elementName, { color: theme.accentColor }]}>{element}</Text>
          {elementAr && <Text style={styles.elementArabic}>{elementAr}</Text>}
        </View>

        <Text style={styles.subtitle}>{theme.subtitle}</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {element === 'Fire' &&
              'Passionate, dynamic energy. Transformative power that drives action and illuminates the path forward.'}
            {element === 'Air' &&
              'Intellectual, communicative essence. Free-flowing wisdom that connects ideas and facilitates understanding.'}
            {element === 'Water' &&
              'Emotional, intuitive wisdom. Adaptive nature that flows through challenges with grace and depth.'}
            {element === 'Earth' &&
              'Grounded, stable foundation. Nurturing strength that provides security and steady growth.'}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 6,
    elevation: 10,
  },
  gradient: {
    paddingVertical: 28,
    paddingHorizontal: 22,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(148, 163, 184, 0.18)',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  elementName: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  elementArabic: {
    fontSize: 22,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 15,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '500',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 21,
    textAlign: 'center',
  },
});
