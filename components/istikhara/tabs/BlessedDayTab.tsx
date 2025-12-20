import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IstikharaData } from '../../../types/istikhara';

interface BlessedDayTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function BlessedDayTab({ data, elementColor }: BlessedDayTabProps) {
  const { blessed_day, monthly_sadaqah, lifetime_sadaqah } = data.burujProfile;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Blessed Day Card */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>📅 Your Blessed Day</Text>
          <View style={styles.dayContainer}>
            <Text style={[styles.dayName, { color: elementColor }]}>{blessed_day.day}</Text>
            <Text style={styles.daySubtext}>Best day of the week for important activities</Text>
          </View>
        </View>

        {/* Days of Week Visual */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>Weekly Overview</Text>
          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <View
                key={day}
                style={[
                  styles.dayPill,
                  day === blessed_day.day && {
                    backgroundColor: elementColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    day === blessed_day.day && styles.dayPillTextActive,
                  ]}
                >
                  {day.substring(0, 3)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Favored Activities */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>✨ Favored Activities</Text>
          {blessed_day.activities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityIcon}>🌟</Text>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>

        {/* Associated Prophet */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>👤 Associated Prophet</Text>
          <View style={styles.prophetContainer}>
            <Text style={styles.prophetName}>{blessed_day.prophet}</Text>
          </View>
        </View>

        {/* Special Notes */}
        {blessed_day.special_notes && (
          <View style={[styles.card, { borderLeftColor: '#3b82f6' }]}>
            <Text style={styles.cardTitle}>ℹ️ Special Notes</Text>
            <Text style={styles.notesText}>{blessed_day.special_notes}</Text>
          </View>
        )}

        {/* Monthly Sadaqah */}
        <View style={[styles.card, { borderLeftColor: '#10b981' }]}>
          <Text style={styles.cardTitle}>💚 Monthly Sadaqah</Text>
          <Text style={styles.sadaqahDescription}>{monthly_sadaqah.description}</Text>
          {monthly_sadaqah.suggested_amount && (
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Suggested Amount:</Text>
              <Text style={styles.amountValue}>{monthly_sadaqah.suggested_amount}</Text>
            </View>
          )}
        </View>

        {/* Lifetime Sadaqah */}
        <View style={[styles.card, { borderLeftColor: '#8b5cf6' }]}>
          <Text style={styles.cardTitle}>💜 Lifetime Sadaqah</Text>
          <Text style={styles.sadaqahDescription}>{lifetime_sadaqah.description}</Text>
          {lifetime_sadaqah.impact && (
            <View style={styles.impactContainer}>
              <Text style={styles.impactLabel}>Impact:</Text>
              <Text style={styles.impactText}>{lifetime_sadaqah.impact}</Text>
            </View>
          )}
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
  dayContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dayName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  daySubtext: {
    fontSize: 14,
    color: '#a8b2d1',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayPill: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayPillText: {
    fontSize: 11,
    color: '#a8b2d1',
    fontWeight: '600',
  },
  dayPillTextActive: {
    color: '#ffffff',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  activityText: {
    flex: 1,
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 22,
  },
  prophetContainer: {
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  prophetName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e94560',
  },
  notesText: {
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  sadaqahDescription: {
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 24,
    marginBottom: 12,
  },
  amountContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#a8b2d1',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  impactContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  impactLabel: {
    fontSize: 14,
    color: '#a8b2d1',
    marginBottom: 8,
  },
  impactText: {
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 24,
  },
});
