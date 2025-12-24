/**
 * Name Destiny Results Screen
 * Mobile Implementation - Expo Go 54
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ResponsiveAppHeader from '../../../components/AppHeader';
import { useLanguage } from '../../../contexts/LanguageContext';
import { NameDestinyResult } from '../types/nameDestiny';
import { StatDisplay, StatGrid, ElementChart, BurjWidget } from '../components';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  // Parse the result from params
  const result: NameDestinyResult = params.data ? JSON.parse(params.data as string) : null;
  const personName = params.personName as string;
  const motherName = params.motherName as string;

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No results to display</Text>
      </SafeAreaView>
    );
  }

  // Extract element name from the result object
  const elementName = typeof result.element === 'string' ? result.element : result.element?.en || 'Fire';

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ResponsiveAppHeader
        currentLanguage={language === 'en' ? 'EN' : 'FR'}
        onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
        onProfilePress={() => router.push('/modal')}
        onMenuPress={() => console.log('Menu pressed')}
      />
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#312e81']}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#cbd5e1" />
          <Text style={styles.backButtonText}>New Calculation</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>✨</Text>
            <Text style={styles.headerTitle}>Your Destiny Revealed</Text>
            <Text style={styles.headerSubtitle}>
              {personName} • {motherName}
            </Text>
          </View>

          {/* Sacred Numbers - Using StatDisplay component */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Sacred Numbers</Text>
            <StatGrid columns={2}>
              <StatDisplay
                label="Kabir"
                value={result.kabir}
                description="Grand Total"
                gradientColors={['rgba(168, 85, 247, 0.3)', 'rgba(139, 92, 246, 0.2)']}
                color="#c084fc"
              />
              <StatDisplay
                label="Saghir"
                value={result.saghir}
                description="Spiritual Essence"
                gradientColors={['rgba(236, 72, 153, 0.3)', 'rgba(219, 39, 119, 0.2)']}
                color="#ec4899"
              />
            </StatGrid>
          </View>

          {/* Element - Using ElementChart component */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Elemental Nature</Text>
            <ElementChart 
              element={{
                en: elementName,
                ar: typeof result.element === 'string' ? '' : result.element?.ar || '',
                fr: typeof result.element === 'string' ? '' : result.element?.fr || '',
              }}
            />
          </View>

          {/* Burj - Using BurjWidget component */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Zodiac Influence</Text>
            <BurjWidget
              burj={{
                en: typeof result.burj === 'string' ? result.burj : result.burj?.en || '',
                ar: typeof result.burj === 'string' ? '' : result.burj?.ar || '',
                fr: typeof result.burj === 'string' ? '' : result.burj?.fr || '',
                planet: typeof result.burj === 'object' ? result.burj?.planet : undefined,
                element: elementName,
              }}
              hour={{
                name: typeof result.hour === 'string' ? result.hour : result.hour?.name || result.hour?.en || '',
                ar: typeof result.hour === 'string' ? '' : result.hour?.ar || '',
              }}
            />
          </View>

          {/* Spiritual Guidance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌙 Spiritual Guidance</Text>
            <View style={styles.guidanceCard}>
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.2)', 'rgba(22, 163, 74, 0.1)']}
                style={styles.guidanceCardGradient}
              >
                <Text style={styles.guidanceText}>
                  Your destiny is encoded in the sacred numerology of your name. The Kabir ({result.kabir}) represents your overall spiritual journey, while the Saghir ({result.saghir}) reveals your essential nature.
                  {'\n\n'}
                  Your {elementName} element connects you to specific spiritual practices and times of power. The constellation {typeof result.burj === 'string' ? result.burj : result.burj?.en || ''} and planetary hour {typeof result.hour === 'string' ? result.hour : result.hour?.name || result.hour?.en || ''} mark your most spiritually potent moments.
                  {'\n\n'}
                  Use this knowledge for self-understanding and spiritual growth. Remember that destiny is a guide, not a fixed path—your choices and devotion shape your journey.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  guidanceCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  guidanceCardGradient: {
    padding: 20,
  },
  guidanceText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#f87171',
    textAlign: 'center',
    marginTop: 40,
  },
});
