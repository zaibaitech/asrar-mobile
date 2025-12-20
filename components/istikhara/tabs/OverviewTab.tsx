import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IstikharaData } from '../../../types/istikhara';

interface OverviewTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function OverviewTab({ data, elementColor }: OverviewTabProps) {
  const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount } = data;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Buruj Sign Card */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>Your Buruj Sign</Text>
          <Text style={styles.burujNumber}>#{burujProfile.buruj_number}</Text>
          <Text style={styles.burujNameArabic}>{burujProfile.sign.arabic}</Text>
          <Text style={styles.burujNameEnglish}>{burujProfile.sign.en}</Text>
          <Text style={styles.burujNameFrench}>({burujProfile.sign.fr})</Text>
        </View>

        {/* Element & Planet Card */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Element</Text>
              <Text style={styles.value}>{getElementEmoji(burujProfile.element)} {burujProfile.element}</Text>
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Planet</Text>
              <Text style={styles.value}>{getPlanetEmoji(burujProfile.planet)} {burujProfile.planet}</Text>
            </View>
          </View>
        </View>

        {/* Abjad Totals Card */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>Abjad Numerology</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Person's Name Total:</Text>
            <Text style={[styles.totalValue, { color: elementColor }]}>{personTotal}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Mother's Name Total:</Text>
            <Text style={[styles.totalValue, { color: elementColor }]}>{motherTotal}</Text>
          </View>
          
          <View style={[styles.totalRow, styles.combinedRow]}>
            <Text style={styles.combinedLabel}>Combined Total:</Text>
            <Text style={[styles.combinedValue, { color: elementColor }]}>{combinedTotal}</Text>
          </View>
        </View>

        {/* Repetition Count Card */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>Dhikr Repetitions</Text>
          <View style={styles.repetitionContainer}>
            <Text style={styles.repetitionIcon}>📿</Text>
            <Text style={[styles.repetitionCount, { color: elementColor }]}>
              {repetitionCount}
            </Text>
            <Text style={styles.repetitionLabel}>times</Text>
          </View>
          <Text style={styles.repetitionHint}>
            Recommended number of repetitions for divine names dhikr
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function getElementEmoji(element: string): string {
  const emojis: Record<string, string> = {
    'Fire': '🔥',
    'Earth': '🌍',
    'Air': '💨',
    'Water': '💧',
  };
  return emojis[element] || '⭐';
}

function getPlanetEmoji(planet: string): string {
  const emojis: Record<string, string> = {
    'Sun': '☀️',
    'Moon': '🌙',
    'Mercury': '☿️',
    'Venus': '♀️',
    'Mars': '♂️',
    'Jupiter': '♃',
    'Saturn': '♄',
  };
  return emojis[planet] || '🪐';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  burujNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 8,
  },
  burujNameArabic: {
    fontSize: 32,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  burujNameEnglish: {
    fontSize: 24,
    fontWeight: '600',
    color: '#a8b2d1',
    textAlign: 'center',
    marginBottom: 4,
  },
  burujNameFrench: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalLabel: {
    fontSize: 16,
    color: '#a8b2d1',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  combinedRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  combinedLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  combinedValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  repetitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  repetitionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  repetitionCount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginRight: 8,
  },
  repetitionLabel: {
    fontSize: 20,
    color: '#a8b2d1',
  },
  repetitionHint: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
