/**
 * Cosmic Blueprint Card
 * "What This Means For You" summary at the top of Birth Profile results
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { BirthInsights } from '@/types/calculator-enhanced';
import { generateBlueprint } from '@/utils/blueprintGenerator';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CosmicBlueprintCardProps {
  insights: BirthInsights;
}

export const CosmicBlueprintCard: React.FC<CosmicBlueprintCardProps> = ({ insights }) => {
  const { t, tSafe, language } = useLanguage();
  const blueprint = generateBlueprint(insights, (k, f) => tSafe(k, f || ''), language);

  const youAre = tSafe('cosmicBlueprint.youAre', language === 'ar' ? 'أنت' : language === 'fr' ? 'Vous êtes un' : "You're a");
  const withA = tSafe('cosmicBlueprint.with', language === 'ar' ? 'بـ' : language === 'fr' ? 'avec un' : 'with a');
  const who = tSafe('cosmicBlueprint.who', language === 'ar' ? 'الذي' : language === 'fr' ? 'qui' : 'who');

  return (
    <LinearGradient
      colors={['#4c1d95', '#1e1b4b']}
      style={styles.container}
    >
      <Text style={styles.title}>
        {tSafe('cosmicBlueprint.title', '💫 Your Cosmic Blueprint')}
      </Text>

      <View style={styles.content}>
        <Text style={[styles.description, language === 'ar' && styles.rtlText]}>
          {youAre} <Text style={styles.highlight}>{blueprint.leadership}</Text>{' '}
          {withA} <Text style={styles.highlight}>{blueprint.emotional}</Text>{' '}
          {who} <Text style={styles.highlight}>{blueprint.thinking}</Text>.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            {tSafe('cosmicBlueprint.yourGift', language === 'ar' ? 'موهبتك:' : language === 'fr' ? 'Votre don:' : 'Your gift:')}
          </Text>
          <Text style={styles.value}>{blueprint.gift}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            {tSafe('cosmicBlueprint.yourChallenge', language === 'ar' ? 'تحدّيك:' : language === 'fr' ? 'Votre défi:' : 'Your challenge:')}
          </Text>
          <Text style={styles.value}>{blueprint.challenge}</Text>
        </View>

        {blueprint.careerPaths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>
              {tSafe('cosmicBlueprint.bestPath', language === 'ar' ? 'أفضل مسار:' : language === 'fr' ? 'Meilleur chemin:' : 'Best path:')}
            </Text>
            <Text style={styles.value}>{blueprint.careerPaths.join(' • ')}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#8B7BF7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    gap: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#a78bfa',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
});

export default CosmicBlueprintCard;
