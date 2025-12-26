/**
 * Practical Guidance Card
 * Shows actionable advice: what to do, avoid, best times
 */

import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Clock, XCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PracticalGuidanceCardProps {
  doActions: string[];
  avoidActions: string[];
  bestTime?: string;
  language?: 'en' | 'fr' | 'ar';
}

export function PracticalGuidanceCard({
  doActions,
  avoidActions,
  bestTime,
  language = 'en',
}: PracticalGuidanceCardProps) {
  const titles = {
    en: {
      main: 'Practical Guidance',
      do: 'Do',
      avoid: 'Avoid',
      bestTime: 'Best Time Window (Element & Season)',
    },
    fr: {
      main: 'Conseils Pratiques',
      do: 'Faire',
      avoid: 'Éviter',
      bestTime: 'Meilleure Fenêtre (Élément & Saison)',
    },
    ar: {
      main: 'إرشادات عملية',
      do: 'افعل',
      avoid: 'تجنب',
      bestTime: 'أفضل نافذة (العنصر والموسم)',
    },
  };

  const t = titles[language];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(236, 72, 153, 0.12)', 'rgba(219, 39, 119, 0.06)']}
        style={styles.gradient}
      >
        <Text style={styles.title}>{t.main}</Text>

        {/* Do Section */}
        {doActions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle size={16} color="#10b981" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>{t.do}</Text>
            </View>
            <View style={styles.actionsList}>
              {doActions.map((action, index) => (
                <Text style={styles.actionText} key={index}>
                  • {action}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Avoid Section */}
        {avoidActions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <XCircle size={16} color="#ef4444" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>{t.avoid}</Text>
            </View>
            <View style={styles.actionsList}>
              {avoidActions.map((action, index) => (
                <Text style={styles.actionText} key={index}>
                  • {action}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Best Time Section */}
        {bestTime && (
          <View style={[styles.section, styles.timeSection]}>
            <View style={styles.sectionHeader}>
              <Clock size={16} color="#a78bfa" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>{t.bestTime}</Text>
            </View>
            <Text style={styles.timeText}>{bestTime}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
  },
  gradient: {
    padding: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsList: {
    paddingLeft: 24,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  timeSection: {
    marginBottom: 0,
  },
  timeText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
    paddingLeft: 24,
  },
});
