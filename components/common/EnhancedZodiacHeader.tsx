/**
 * Enhanced Zodiac Header Component
 * Rich zodiac header with personality traits, strengths, and warnings
 */

import { type ZodiacData } from '@/constants/zodiacStones';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';

interface EnhancedZodiacHeaderProps {
  zodiacData: ZodiacData;
  gradient: readonly [string, string];
  elementEmoji: string;
  planetEmoji: string;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = (hex || '').replace('#', '').trim();
  const isShort = normalized.length === 3;
  const isLong = normalized.length === 6;
  if (!isShort && !isLong) return `rgba(255,255,255,${alpha})`;

  const r = parseInt(isShort ? normalized[0] + normalized[0] : normalized.slice(0, 2), 16);
  const g = parseInt(isShort ? normalized[1] + normalized[1] : normalized.slice(2, 4), 16);
  const b = parseInt(isShort ? normalized[2] + normalized[2] : normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return `rgba(255,255,255,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

function IslamicPatternOverlay({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="geom" patternUnits="userSpaceOnUse" width="48" height="48">
          <Path
            d="M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z"
            fill={`rgba(255, 255, 255, ${opacity})`}
          />
          <Circle cx="24" cy="24" r="2.2" fill={`rgba(255, 255, 255, ${opacity + 0.01})`} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#geom)" />
    </Svg>
  );
}

export function EnhancedZodiacHeader({
  zodiacData,
  gradient,
  elementEmoji,
  planetEmoji,
}: EnhancedZodiacHeaderProps) {
  const { language } = useLanguage();
  const accent = gradient?.[0] || '#93c5fd';
  
  return (
    <View style={[styles.headerCard, { borderColor: hexToRgba(accent, 0.28), shadowColor: accent }]}>
      <LinearGradient
        colors={[
          hexToRgba(accent, 0.14),
          'rgba(255,255,255,0.06)',
          'rgba(0,0,0,0.22)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View pointerEvents="none" style={styles.patternOverlay}>
        <IslamicPatternOverlay />
      </View>

      <View style={styles.headerContent}>
        {/* Compact horizontal layout */}
        <View style={styles.compactRow}>
          <Text style={styles.zodiacSymbol}>{zodiacData.symbol}</Text>
          <View style={styles.zodiacInfo}>
            <Text style={styles.zodiacName}>
              {language === 'fr' ? zodiacData.zodiacSignFr :
               language === 'ar' ? zodiacData.zodiacSignAr :
               zodiacData.zodiacSign}
            </Text>
            <View style={styles.quickDetails}>
              <Text style={styles.quickDetailText}>{elementEmoji} {language === 'fr' ? zodiacData.elementFr : language === 'ar' ? zodiacData.elementAr : zodiacData.element}</Text>
              <Text style={styles.quickDetailSeparator}>•</Text>
              <Text style={styles.quickDetailText}>{planetEmoji} {language === 'fr' ? zodiacData.planetFr : language === 'ar' ? zodiacData.planetAr : zodiacData.planet}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#0B1020',
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },
  headerContent: {
    padding: 16,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  zodiacSymbol: {
    fontSize: 48,
  },
  zodiacInfo: {
    flex: 1,
  },
  zodiacName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  quickDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickDetailText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  quickDetailSeparator: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
});
