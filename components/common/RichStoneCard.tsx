/**
 * Enhanced Rich Stone Card Component
 * Individual stone card with image, rating, properties, and tap interaction
 */

import { getStoneVisual, type EnhancedStoneData } from '@/constants/enhancedStoneData';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface RichStoneCardProps {
  stone: EnhancedStoneData;
  zodiacSign: string;
  accentColor: string;
  onPress: () => void;
}

export function RichStoneCard({ stone, zodiacSign, accentColor, onPress }: RichStoneCardProps) {
  const { language } = useLanguage();

  const visual = getStoneVisual(stone.id || stone.name);

  const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace('#', '').trim();
    const isShort = normalized.length === 3;
    const isLong = normalized.length === 6;
    if (!isShort && !isLong) return `rgba(255,255,255,${alpha})`;

    const r = parseInt(isShort ? normalized[0] + normalized[0] : normalized.slice(0, 2), 16);
    const g = parseInt(isShort ? normalized[1] + normalized[1] : normalized.slice(2, 4), 16);
    const b = parseInt(isShort ? normalized[2] + normalized[2] : normalized.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return `rgba(255,255,255,${alpha})`;
    return `rgba(${r},${g},${b},${alpha})`;
  };
  
  const rating = stone.zodiacRating[zodiacSign.toLowerCase()] || 3;
  const properties = language === 'fr' ? stone.properties.fr :
                     language === 'ar' ? stone.properties.ar :
                     stone.properties.en;
  
  // Get short benefit (first sentence only)
  const benefit = stone.benefitsFor[zodiacSign.toLowerCase()];
  const shortBenefit = benefit
    ? (language === 'fr' ? benefit.fr :
       language === 'ar' ? benefit.ar :
       benefit.en).split('.')[0] + '.'
    : '';
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: hexToRgba(accentColor, 0.28),
          shadowColor: accentColor,
        },
        pressed && styles.cardPressed
      ]}
    >
      {/* Dark image area + subtle stone icon */}
      <View style={styles.imageContainer}>
        <View style={[styles.iconCircle, { borderColor: hexToRgba(accentColor, 0.22) }]}
        >
          <LinearGradient
            colors={visual.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          />
          <Text style={styles.stoneEmoji}>{visual.emoji}</Text>
        </View>

        {/* Rating overlay */}
        <View style={styles.ratingBadge}>
          {[...Array(rating)].map((_, i) => (
            <Text key={i} style={styles.ratingStar}>⭐</Text>
          ))}
        </View>
      </View>
      
      {/* Card content */}
      <View style={styles.content}>
        {/* Stone name */}
        <Text style={styles.stoneName} numberOfLines={1}>
          {language === 'fr' ? stone.nameFr :
           language === 'ar' ? stone.nameAr :
           stone.name}
        </Text>
        
        {/* Arabic/French translation */}
        <Text style={styles.translationText} numberOfLines={1}>
          {language === 'ar' ? stone.nameFr : stone.nameAr}
        </Text>
        
        {/* Properties pills */}
        <View style={styles.propertiesRow}>
          {properties.slice(0, 3).map((prop, index) => (
            <View
              key={index}
              style={[
                styles.propertyPill,
                { backgroundColor: `${accentColor}22`, borderColor: `${accentColor}55` }
              ]}
            >
              <Text style={[styles.propertyText, { color: accentColor }]} numberOfLines={1}>
                {prop}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Short benefit description */}
        {shortBenefit && (
          <Text style={styles.benefitText} numberOfLines={2}>
            {shortBenefit}
          </Text>
        )}
        
        {/* Tap to learn more */}
        <View style={[styles.learnMore, { backgroundColor: `${accentColor}15` }]}>
          <Sparkles size={14} color={accentColor} />
          <Text style={[styles.learnMoreText, { color: accentColor }]}>
            {language === 'en' ? 'Tap to learn more' :
             language === 'fr' ? 'Appuyer pour en savoir plus' :
             'انقر لمعرفة المزيد'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  iconGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.28,
  },
  stoneEmoji: {
    fontSize: 40,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 2,
  },
  ratingStar: {
    fontSize: 12,
  },
  content: {
    padding: 14,
  },
  stoneName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
  propertiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  propertyPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  propertyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  benefitText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#d1d5db',
    marginBottom: 10,
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
