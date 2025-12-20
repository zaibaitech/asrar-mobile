import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { IstikharaData } from '../../../types/istikhara';
import * as Haptics from 'expo-haptics';

interface SpiritualTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function SpiritualTab({ data, elementColor }: SpiritualTabProps) {
  const { spiritual_practices } = data.burujProfile;
  const { repetitionCount } = data;
  const [currentCount, setCurrentCount] = useState(0);

  const handleIncrement = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentCount((prev) => prev + 1);
  };

  const handleReset = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setCurrentCount(0);
  };

  const progress = Math.min((currentCount / repetitionCount) * 100, 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Dhikr Counter */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>📿 Dhikr Counter</Text>
          
          <View style={styles.counterContainer}>
            <Text style={styles.targetLabel}>Target: {repetitionCount} repetitions</Text>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress}%`, backgroundColor: elementColor },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>

            <View style={styles.countDisplay}>
              <Text style={[styles.currentCount, { color: elementColor }]}>{currentCount}</Text>
              <Text style={styles.countSeparator}>/</Text>
              <Text style={styles.targetCount}>{repetitionCount}</Text>
            </View>

            <View style={styles.counterButtons}>
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: elementColor }]}
                onPress={handleIncrement}
                activeOpacity={0.8}
              >
                <Text style={styles.counterButtonText}>+ Count</Text>
              </TouchableOpacity>

              {currentCount > 0 && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Divine Names */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>🕌 Divine Names (Asma ul Husna)</Text>
          <Text style={styles.sectionDescription}>
            Recite these divine names {repetitionCount} times each
          </Text>
          <View style={styles.namesContainer}>
            {spiritual_practices.divine_names.map((name, index) => (
              <View key={index} style={[styles.nameCard, { borderColor: elementColor }]}>
                <Text style={styles.nameText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Practices */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>🌅 Daily & Weekly Practices</Text>
          {spiritual_practices.daily_practices.map((practice, index) => (
            <View key={index} style={styles.practiceItem}>
              <View style={[styles.practiceBullet, { backgroundColor: elementColor }]}>
                <Text style={styles.practiceBulletText}>✓</Text>
              </View>
              <Text style={styles.practiceText}>{practice}</Text>
            </View>
          ))}
        </View>

        {/* Timing Recommendations */}
        <View style={[styles.card, { borderLeftColor: '#fbbf24' }]}>
          <Text style={styles.cardTitle}>⏰ Timing Recommendations</Text>
          <View style={styles.timingContainer}>
            <Text style={styles.timingIcon}>🕐</Text>
            <Text style={styles.timingText}>{spiritual_practices.timing}</Text>
          </View>
        </View>

        {/* Dhikr Count Info */}
        <View style={[styles.card, { borderLeftColor: '#3b82f6' }]}>
          <Text style={styles.cardTitle}>ℹ️ About Your Dhikr Count</Text>
          <Text style={styles.infoText}>
            The number {repetitionCount} is calculated from your combined Abjad numerology total. 
            This personalized count is significant for your spiritual practice and should be 
            maintained when reciting the divine names and performing dhikr.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
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
  sectionDescription: {
    fontSize: 14,
    color: '#a8b2d1',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  counterContainer: {
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 14,
    color: '#a8b2d1',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
  },
  countDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  currentCount: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  countSeparator: {
    fontSize: 32,
    color: '#8892b0',
    marginHorizontal: 8,
  },
  targetCount: {
    fontSize: 32,
    color: '#a8b2d1',
  },
  counterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  counterButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  counterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  resetButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  namesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nameCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nameText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  practiceBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  practiceBulletText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  practiceText: {
    flex: 1,
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 22,
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
    padding: 16,
  },
  timingIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  timingText: {
    flex: 1,
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 24,
  },
});
