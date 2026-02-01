/**
 * Action Card Component
 * "Try This Now" dhikr recommendation at the bottom of Birth Profile results
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { BirthInsights } from '@/types/calculator-enhanced';
import { generateActionItem } from '@/utils/actionGenerator';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionCardProps {
  insights: BirthInsights;
}

export const ActionCard: React.FC<ActionCardProps> = ({ insights }) => {
  const { tSafe, language } = useLanguage();
  const actionItem = generateActionItem(insights, language as 'en' | 'fr' | 'ar');

  const handleSetReminder = () => {
    Alert.alert(
      tSafe('actionCard.reminderTitle', language === 'ar' ? 'تذكير' : language === 'fr' ? 'Rappel' : 'Reminder'),
      tSafe('actionCard.reminderMessage', language === 'ar' ? 'ميزة التذكير قادمة قريباً!' : language === 'fr' ? 'Fonction de rappel bientôt disponible!' : 'Reminder feature coming soon!'),
      [{ text: tSafe('common.buttons.ok', 'OK') }]
    );
  };

  const handleLearnMore = () => {
    Alert.alert(
      actionItem.dhikr.name,
      `${actionItem.dhikr.meaning}\n\n${tSafe('actionCard.benefitLabel', language === 'ar' ? 'الفائدة:' : language === 'fr' ? 'Bienfait:' : 'Benefit:')} ${actionItem.dhikr.benefit}`,
      [{ text: tSafe('common.buttons.ok', 'OK') }]
    );
  };

  const basedOnLabel = tSafe('actionCard.basedOn', language === 'ar' ? 'بناءً على' : language === 'fr' ? 'Basé sur votre' : 'Based on your');
  const practiceLabel = tSafe('actionCard.practice', language === 'ar' ? 'مارس هذا الذكر من أجل' : language === 'fr' ? 'Pratiquez ce dhikr pour' : 'Practice this dhikr for');
  const timesLabel = tSafe('actionCard.times', language === 'ar' ? 'مرة' : language === 'fr' ? 'fois' : 'times');
  const afterLabel = tSafe('actionCard.after', language === 'ar' ? 'بعد' : language === 'fr' ? 'après' : 'after');
  const bestDaysLabel = tSafe('actionCard.bestDays', language === 'ar' ? 'أفضل الأيام هذا الأسبوع:' : language === 'fr' ? 'Meilleurs jours cette semaine:' : 'Best days this week:');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {tSafe('actionCard.title', '✨ Try This Now')}
      </Text>

      <View style={styles.content}>
        <Text style={[styles.basedOn, language === 'ar' && styles.rtlText]}>
          {basedOnLabel} {tSafe(`common.planets.${actionItem.planet.toLowerCase()}`, actionItem.planet)}:
        </Text>

        <View style={styles.dhikrContainer}>
          <Text style={styles.dhikrArabic}>{actionItem.dhikr.arabic}</Text>
          <Text style={styles.dhikrName}>"{actionItem.dhikr.name}"</Text>
          <Text style={styles.dhikrMeaning}>({actionItem.dhikr.meaning})</Text>
        </View>

        <Text style={[styles.instruction, language === 'ar' && styles.rtlText]}>
          {practiceLabel} {actionItem.dhikr.benefit}
        </Text>

        <Text style={styles.count}>
          ×{actionItem.dhikr.count} {timesLabel} {afterLabel} {actionItem.dhikr.timing}
        </Text>

        <View style={styles.daysSection}>
          <Text style={[styles.daysLabel, language === 'ar' && styles.rtlText]}>
            {bestDaysLabel}
          </Text>
          <View style={styles.daysContainer}>
            {actionItem.bestDays.map((day, index) => (
              <View key={`${day}-${index}`} style={styles.dayPill}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleSetReminder}
          >
            <Text style={styles.buttonPrimaryText}>
              {tSafe('actionCard.setReminder', language === 'ar' ? 'تعيين تذكير' : language === 'fr' ? 'Définir un Rappel' : 'Set Reminder')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={handleLearnMore}
          >
            <Text style={styles.buttonSecondaryText}>
              {tSafe('actionCard.learnMore', language === 'ar' ? 'اعرف المزيد' : language === 'fr' ? 'En Savoir Plus' : 'Learn More')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8B7BF7',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    gap: 12,
  },
  basedOn: {
    fontSize: 14,
    color: '#E0E0FF',
    textAlign: 'center',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  dhikrContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  dhikrArabic: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dhikrName: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 4,
  },
  dhikrMeaning: {
    fontSize: 14,
    color: '#E0E0FF',
    fontStyle: 'italic',
  },
  instruction: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  count: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
  },
  daysSection: {
    marginTop: 8,
  },
  daysLabel: {
    fontSize: 14,
    color: '#E0E0FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dayPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#8B7BF7',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonSecondaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ActionCard;
