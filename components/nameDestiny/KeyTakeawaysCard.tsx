/**
 * Key Takeaways Card - Beginner-friendly summary
 * Shows 3 plain-language insights at the top of results
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface KeyTakeawaysCardProps {
  takeaways: string[];
  language?: 'en' | 'fr' | 'ar';
}

export function KeyTakeawaysCard({ takeaways, language = 'en' }: KeyTakeawaysCardProps) {
  const titles = {
    en: 'Key Takeaways',
    fr: 'Points Clés',
    ar: 'النقاط الرئيسية',
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(167, 139, 250, 0.15)', 'rgba(139, 92, 246, 0.08)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Lightbulb size={18} color="#a78bfa" strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>{titles[language]}</Text>
        </View>

        <View style={styles.takeawaysList}>
          {takeaways.slice(0, 3).map((takeaway, index) => (
            <View style={styles.takeawayItem} key={index}>
              <View style={styles.bulletCircle}>
                <Text style={styles.bulletNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.takeawayText}>{takeaway}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.25)',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
  },
  gradient: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
  takeawaysList: {
    gap: 12,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a78bfa',
  },
  takeawayText: {
    flex: 1,
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
});
