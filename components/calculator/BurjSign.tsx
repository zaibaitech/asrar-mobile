import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { calculateBurj } from '../../constants/buruj';
import { ZODIAC_SIGNS } from '../../constants/zodiacData';

interface BurjSignProps {
  kabir: number;
}

export const BurjSign: React.FC<BurjSignProps> = ({ kabir }) => {
  const burjCalc = calculateBurj(kabir);
  const zodiacData = ZODIAC_SIGNS[burjCalc.burj];
  
  if (!zodiacData) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🌙</Text>
        <Text style={styles.title}>Burj (Zodiac Sign)</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Intermediate</Text>
        </View>
      </View>
      
      {/* Main Card */}
      <View style={styles.mainCard}>
        <Text style={styles.symbol}>{zodiacData.symbol}</Text>
        <Text style={styles.nameEn}>{zodiacData.nameEn}</Text>
        <Text style={styles.nameAr}>{zodiacData.nameAr}</Text>
        <Text style={styles.transliteration}>{zodiacData.transliteration}</Text>
        
        <View style={styles.calculation}>
          <Text style={styles.calculationText}>
            Calculation: {kabir} ÷ 12 = {burjCalc.burj}
          </Text>
        </View>
      </View>
      
      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Element */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Element</Text>
          <Text style={styles.detailValue}>
            {zodiacData.temperament.includes('Hot & Dry') ? '🔥 Fire' :
             zodiacData.temperament.includes('Cold & Wet') ? '💧 Water' :
             zodiacData.temperament.includes('Hot & Wet') ? '🌬️ Air' : '🌳 Earth'}
          </Text>
        </View>
        
        {/* Modality */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Modality</Text>
          <Text style={styles.detailValue}>{zodiacData.modality}</Text>
        </View>
      </View>
      
      {/* Planetary Ruler */}
      <View style={styles.planetCard}>
        <Text style={styles.planetLabel}>⭐ Planetary Ruler</Text>
        <Text style={styles.planetEn}>{zodiacData.planetaryRuler.en}</Text>
        <Text style={styles.planetAr}>{zodiacData.planetaryRuler.ar}</Text>
        <Text style={styles.planetTranslit}>{zodiacData.planetaryRuler.transliteration}</Text>
      </View>
      
      {/* Temperament */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>🌡️ Temperament</Text>
        <Text style={styles.infoText}>{zodiacData.temperament}</Text>
      </View>
      
      {/* Spiritual Quality */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>✨ Spiritual Quality</Text>
        <Text style={styles.infoText}>{zodiacData.spiritualQuality}</Text>
      </View>
      
      {/* Classical Reference */}
      <View style={styles.referenceCard}>
        <Text style={styles.referenceLabel}>📖 Classical Reference</Text>
        <Text style={styles.referenceText}>{zodiacData.classicalReference}</Text>
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
    borderColor: '#f59e0b',
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
    backgroundColor: '#f59e0b',
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
  
  // Main Card
  mainCard: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fbbf24',
    gap: 6,
  },
  symbol: {
    fontSize: 48,
    marginBottom: 8,
  },
  nameEn: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f1f5f9',
  },
  nameAr: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fbbf24',
  },
  transliteration: {
    fontSize: 15,
    color: '#cbd5e1',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  calculation: {
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calculationText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fbbf24',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  
  // Planet Card
  planetCard: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  planetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e9d5ff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  planetEn: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  planetAr: {
    fontSize: 20,
    color: '#e9d5ff',
  },
  planetTranslit: {
    fontSize: 13,
    color: '#ddd6fe',
    fontStyle: 'italic',
  },
  
  // Info Cards
  infoCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  
  // Reference Card
  referenceCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  referenceText: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
