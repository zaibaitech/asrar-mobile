/**
 * BurjWidget - Zodiac information card
 * Mobile Implementation - Expo Go 54
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Moon, Sun } from 'lucide-react-native';

interface BurjWidgetProps {
  burj: {
    en: string;
    ar: string;
    fr: string;
    planet?: string;
    element?: string;
    ruler?: string;
  };
  hour?: {
    name: string;
    ar: string;
    planet?: string;
  };
  compact?: boolean;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

export function BurjWidget({ burj, hour, compact = false }: BurjWidgetProps) {
  const symbol = ZODIAC_SYMBOLS[burj.en] || '⭐';

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.3)', 'rgba(37, 99, 235, 0.2)']}
          style={styles.compactGradient}
        >
          <Text style={styles.symbol}>{symbol}</Text>
          <View style={styles.compactContent}>
            <Text style={styles.compactName}>{burj.en}</Text>
            <Text style={styles.compactArabic}>{burj.ar}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.3)', 'rgba(37, 99, 235, 0.2)']}
        style={styles.gradient}
      >
        {/* Header with symbol */}
        <View style={styles.header}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbolLarge}>{symbol}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.burjName}>{burj.en}</Text>
            <Text style={styles.burjArabic}>{burj.ar}</Text>
          </View>
          <Star size={24} color="#60a5fa" fill="#60a5fa" />
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {burj.planet && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Sun size={16} color="#fbbf24" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ruling Planet</Text>
                <Text style={styles.detailValue}>{burj.planet}</Text>
              </View>
            </View>
          )}

          {burj.element && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Moon size={16} color="#a78bfa" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Element</Text>
                <Text style={styles.detailValue}>{burj.element}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Planetary Hour */}
        {hour && (
          <View style={styles.hourSection}>
            <View style={styles.divider} />
            <View style={styles.hourContent}>
              <Text style={styles.hourLabel}>Ruling Hour</Text>
              <Text style={styles.hourValue}>{hour.name}</Text>
              <Text style={styles.hourArabic}>{hour.ar}</Text>
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
    marginBottom: 20,
  },
  symbolContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  symbolLarge: {
    fontSize: 32,
  },
  symbol: {
    fontSize: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  burjName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  burjArabic: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    padding: 12,
    borderRadius: 8,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  hourSection: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 16,
  },
  hourContent: {
    alignItems: 'center',
  },
  hourLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hourValue: {
    fontSize: 20,
    color: '#60a5fa',
    fontWeight: '700',
    marginBottom: 4,
  },
  hourArabic: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  compactContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  compactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  compactContent: {
    flex: 1,
  },
  compactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  compactArabic: {
    fontSize: 14,
    color: '#cbd5e1',
  },
});
