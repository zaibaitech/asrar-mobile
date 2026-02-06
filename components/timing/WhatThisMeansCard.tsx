import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailySynthesis } from '@/services/DailySynthesisService';

interface WhatThisMeansCardProps {
  synthesis: DailySynthesis;
}

/**
 * Quality badge color
 */
function getQualityColor(quality: DailySynthesis['overallQuality']): string {
  switch (quality) {
    case 'excellent': return '#10b981';
    case 'good': return '#3b82f6';
    case 'moderate': return '#f59e0b';
    case 'challenging': return '#ef4444';
  }
}

/**
 * Main synthesis card showing:
 * - Narrative summary
 * - Excellent activities
 * - Less favorable activities
 * - Peak hours note
 */
export default function WhatThisMeansCard({ synthesis }: WhatThisMeansCardProps) {
  const { t } = useLanguage();
  const qualityColor = getQualityColor(synthesis.overallQuality);
  const peakHoursText = synthesis.peakHours?.trim();
  
  return (
    <View style={[styles.card, { borderColor: qualityColor }]}>
      <Text style={styles.cardTitle}>
        ✨ {t('dailyEnergy.whatThisMeans')}
      </Text>
      
      {/* Summary Text */}
      <Text style={styles.summary}>{synthesis.summaryText}</Text>
      
      {/* Excellent For */}
      {synthesis.excellentFor.length > 0 && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>
            🟢 {t('dailyEnergy.excellentForToday')}
          </Text>
          {synthesis.excellentFor.map((item, index) => (
            <Text key={index} style={styles.actionItem}>• {item}</Text>
          ))}
        </View>
      )}
      
      {/* Less Favorable */}
      {synthesis.lessFavorable.length > 0 && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>
            ⚠️ {t('dailyEnergy.lessFavorable')}
          </Text>
          {synthesis.lessFavorable.map((item, index) => (
            <Text key={index} style={styles.actionItem}>• {item}</Text>
          ))}
        </View>
      )}
      
      {/* Peak Hours Note */}
      {!!peakHoursText && (
        <View style={styles.timingNote}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteLabel}>{t('dailyEnergy.peakHours')}: </Text>
            {peakHoursText}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 20, 60, 0.6)',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  summary: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  
  actionSection: {
    marginBottom: 16,
  },
  
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  actionItem: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
  
  timingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(100, 90, 180, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  
  noteIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  
  noteText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 18,
  },
  
  noteLabel: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
