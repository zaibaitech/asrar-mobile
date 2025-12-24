/**
 * DivineNameCard - Display Divine Name (Ism Ilahi) information
 * Mobile Implementation - Expo Go 54
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';

interface DivineNameCardProps {
  name: {
    en: string;
    ar: string;
    transliteration?: string;
    meaning?: string;
    attributes?: string[];
  };
  resonance?: number;
  showResonance?: boolean;
}

export function DivineNameCard({ 
  name, 
  resonance, 
  showResonance = false 
}: DivineNameCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.3)', 'rgba(139, 92, 246, 0.2)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={24} color="#c084fc" fill="#c084fc" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.arabicName}>{name.ar}</Text>
            <Text style={styles.englishName}>{name.en}</Text>
            {name.transliteration && (
              <Text style={styles.transliteration}>{name.transliteration}</Text>
            )}
          </View>
          {showResonance && resonance !== undefined && (
            <View style={styles.resonanceBadge}>
              <Text style={styles.resonanceValue}>{resonance}%</Text>
            </View>
          )}
        </View>

        {/* Meaning */}
        {name.meaning && (
          <View style={styles.meaningSection}>
            <Text style={styles.meaningLabel}>Meaning</Text>
            <Text style={styles.meaningText}>{name.meaning}</Text>
          </View>
        )}

        {/* Attributes */}
        {name.attributes && name.attributes.length > 0 && (
          <View style={styles.attributesSection}>
            <Text style={styles.attributesLabel}>Divine Attributes</Text>
            <View style={styles.attributesContainer}>
              {name.attributes.map((attr, index) => (
                <View key={index} style={styles.attributeTag}>
                  <Text style={styles.attributeText}>{attr}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Resonance Bar */}
        {showResonance && resonance !== undefined && (
          <View style={styles.resonanceBarContainer}>
            <View style={styles.resonanceBar}>
              <LinearGradient
                colors={['#c084fc', '#a855f7', '#9333ea']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.resonanceBarFill, { width: `${resonance}%` }]}
              />
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
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(192, 132, 252, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  arabicName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 4,
    textAlign: 'right',
  },
  englishName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c084fc',
    marginBottom: 2,
  },
  transliteration: {
    fontSize: 14,
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
  resonanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#c084fc',
  },
  resonanceValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  meaningSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 8,
  },
  meaningLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  meaningText: {
    fontSize: 14,
    color: '#f1f5f9',
    lineHeight: 22,
  },
  attributesSection: {
    marginBottom: 12,
  },
  attributesLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attributeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(192, 132, 252, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
  },
  attributeText: {
    fontSize: 12,
    color: '#c084fc',
    fontWeight: '600',
  },
  resonanceBarContainer: {
    marginTop: 12,
  },
  resonanceBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  resonanceBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
