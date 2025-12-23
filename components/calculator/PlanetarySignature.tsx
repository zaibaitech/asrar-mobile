import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlanetName } from '../../constants/planets';

interface PlanetarySignatureProps {
  kabir: number;
}

type PlanetData = {
  emoji: string;
  arabic: string;
  transliteration: string;
  dayOfWeek: string;
  dayArabic: string;
  hourNumber: number;
  metal: string;
  color: string;
  colorHex: string;
  spiritualQuality: string;
  bestHours: string;
  timing: string;
};

const PLANET_DATA: Record<PlanetName, PlanetData> = {
  Sun: {
    emoji: '☀️',
    arabic: 'الشَّمْس',
    transliteration: 'Al-Shams',
    dayOfWeek: 'Sunday',
    dayArabic: 'الأَحَد',
    hourNumber: 1,
    metal: 'Gold',
    color: 'Yellow Gold',
    colorHex: '#fbbf24',
    spiritualQuality: 'Divine illumination, leadership, spiritual authority',
    bestHours: 'Dawn, Noon',
    timing: 'Practice dhikr at sunrise for spiritual illumination',
  },
  Moon: {
    emoji: '🌙',
    arabic: 'القَمَر',
    transliteration: 'Al-Qamar',
    dayOfWeek: 'Monday',
    dayArabic: 'الاثْنَيْن',
    hourNumber: 2,
    metal: 'Silver',
    color: 'Silver White',
    colorHex: '#e2e8f0',
    spiritualQuality: 'Receptivity, intuition, emotional depth, nurturing',
    bestHours: 'Night, Dawn',
    timing: 'During lunar hours, especially at night for emotional healing',
  },
  Mars: {
    emoji: '♂️',
    arabic: 'المِرِّيخ',
    transliteration: 'Al-Mirrīkh',
    dayOfWeek: 'Tuesday',
    dayArabic: 'الثُّلَاثَاء',
    hourNumber: 3,
    metal: 'Iron',
    color: 'Red',
    colorHex: '#ef4444',
    spiritualQuality: 'Courage, determination, spiritual warfare',
    bestHours: 'Morning, Noon',
    timing: 'Practice dhikr with vigor during daytime hours',
  },
  Mercury: {
    emoji: '☿️',
    arabic: 'عُطَارِد',
    transliteration: 'ʿUṭārid',
    dayOfWeek: 'Wednesday',
    dayArabic: 'الأَرْبِعَاء',
    hourNumber: 4,
    metal: 'Mercury (Quicksilver)',
    color: 'Mixed Colors',
    colorHex: '#06b6d4',
    spiritualQuality: 'Communication, wisdom, intellectual clarity',
    bestHours: 'Dawn, Morning',
    timing: 'Ideal for seeking knowledge and understanding',
  },
  Jupiter: {
    emoji: '♃',
    arabic: 'المُشْتَرِي',
    transliteration: 'Al-Mushtarī',
    dayOfWeek: 'Thursday',
    dayArabic: 'الخَمِيس',
    hourNumber: 5,
    metal: 'Tin',
    color: 'Blue',
    colorHex: '#3b82f6',
    spiritualQuality: 'Expansion, abundance, divine blessings',
    bestHours: 'Morning, Midday',
    timing: 'Thursday morning for seeking divine favor and expansion',
  },
  Venus: {
    emoji: '♀️',
    arabic: 'الزُّهْرَة',
    transliteration: 'Al-Zuhrah',
    dayOfWeek: 'Friday',
    dayArabic: 'الجُمُعَة',
    hourNumber: 6,
    metal: 'Copper',
    color: 'Green',
    colorHex: '#10b981',
    spiritualQuality: 'Beauty, harmony, divine love',
    bestHours: 'Sunset, Evening',
    timing: 'Friday evening for cultivating love and harmony',
  },
  Saturn: {
    emoji: '♄',
    arabic: 'زُحَل',
    transliteration: 'Zuḥal',
    dayOfWeek: 'Saturday',
    dayArabic: 'السَّبْت',
    hourNumber: 7,
    metal: 'Lead',
    color: 'Black/Dark',
    colorHex: '#1e293b',
    spiritualQuality: 'Discipline, patience, spiritual maturity',
    bestHours: 'Night, Late Hours',
    timing: 'Saturday night for deep contemplation and patience',
  },
};

export const PlanetarySignature: React.FC<PlanetarySignatureProps> = ({ kabir }) => {
  // Calculate planetary hour from kabir value
  const hourNumber = (kabir % 7) + 1; // 1-7
  const planetNames: PlanetName[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const planetName = planetNames[hourNumber - 1];
  const planetData = PLANET_DATA[planetName];

  return (
    <View style={[styles.container, { borderColor: planetData.colorHex }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>✨</Text>
        <Text style={styles.title}>Planetary Signature</Text>
        <View style={[styles.levelBadge, { backgroundColor: planetData.colorHex }]}>
          <Text style={styles.levelText}>Intermediate</Text>
        </View>
      </View>
      
      <Text style={styles.subtitle}>The 7 classical planets</Text>
      
      {/* Planet Main Card */}
      <View style={[styles.planetCard, { backgroundColor: planetData.colorHex + '20', borderColor: planetData.colorHex }]}>
        <Text style={styles.planetEmoji}>{planetData.emoji}</Text>
        <Text style={styles.planetName}>{planetName}</Text>
        <Text style={styles.planetArabic}>{planetData.arabic}</Text>
        <Text style={styles.planetTranslit}>{planetData.transliteration}</Text>
      </View>
      
      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Planet */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Planet</Text>
          <Text style={styles.detailEmoji}>{planetData.emoji}</Text>
          <Text style={styles.detailValue}>{planetName}</Text>
        </View>
        
        {/* Day of Week */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Day of Week</Text>
          <Text style={styles.detailValue}>{planetData.dayOfWeek}</Text>
          <Text style={styles.detailArabic}>{planetData.dayArabic}</Text>
        </View>
        
        {/* Hour Number */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Hour Number</Text>
          <Text style={styles.detailValueLarge}>{hourNumber}</Text>
        </View>
      </View>
      
      {/* Metal & Color */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Metal</Text>
          <Text style={styles.detailValue}>{planetData.metal}</Text>
        </View>
        
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Color</Text>
          <View style={[styles.colorSwatch, { backgroundColor: planetData.colorHex }]} />
          <Text style={styles.detailValue}>{planetData.color}</Text>
        </View>
      </View>
      
      {/* Spiritual Quality */}
      <View style={styles.qualityCard}>
        <Text style={styles.qualityLabel}>💫 Spiritual Quality</Text>
        <Text style={styles.qualityText}>{planetData.spiritualQuality}</Text>
      </View>
      
      {/* Best Hours */}
      <View style={styles.timingCard}>
        <Text style={styles.timingLabel}>⏰ Best Hours</Text>
        <Text style={styles.timingValue}>{planetData.bestHours}</Text>
      </View>
      
      {/* Dhikr Recommendation */}
      <View style={[styles.dhikrCard, { backgroundColor: planetData.colorHex + '15', borderColor: planetData.colorHex }]}>
        <Text style={styles.dhikrTitle}>📿 Dhikr Recommendation</Text>
        <Text style={styles.dhikrTiming}>{planetData.timing}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 14,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: -8,
  },
  
  // Planet Card
  planetCard: {
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    gap: 6,
  },
  planetEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  planetName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f1f5f9',
  },
  planetArabic: {
    fontSize: 22,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  planetTranslit: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  detailEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  detailValueLarge: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f1f5f9',
  },
  detailArabic: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#334155',
  },
  
  // Quality Card
  qualityCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  qualityLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  qualityText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  
  // Timing Card
  timingCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  timingValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a5b4fc',
  },
  
  // Dhikr Card
  dhikrCard: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
  },
  dhikrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  dhikrTiming: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
