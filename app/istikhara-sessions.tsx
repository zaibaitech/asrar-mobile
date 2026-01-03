/**
 * Guided Istikhārah - Main Screen
 * ================================
 * Introduction to authentic Istikhārah prayer with access to complete guide
 */

import ResponsiveAppHeader from '@/components/AppHeader';
import BottomTabBar from '@/components/BottomTabBar';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

export default function IstikharaSessionsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ResponsiveAppHeader
          currentLanguage={language === 'en' ? 'EN' : 'FR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
          onProfilePress={() => router.push('/profile')}
          onMenuPress={() => router.push('/(tabs)/two')}
        />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Introduction */}
        <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
          <View style={styles.heroIcon}>
            <Ionicons name="moon" size={32} color="#a78bfa" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Ṣalāt al-Istikhārah
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            The Prayer of Seeking Guidance - a Sunnah practice to seek Allah's guidance when making important decisions
          </Text>
          <View style={styles.heroHadith}>
            <Ionicons name="bookmarks" size={16} color="#fbbf24" />
            <Text style={[styles.heroHadithText, { color: colors.textSecondary }]}>
              "When one of you is concerned about a matter, let him pray two rak'ahs..."
            </Text>
          </View>
          <Text style={[styles.heroReference, { color: colors.textTertiary }]}>
            — Sahih al-Bukhari 1162
          </Text>
        </View>

        {/* Primary Action - Prayer Guide */}
        <View style={styles.primarySection}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            📖 LEARN THE AUTHENTIC METHOD
          </Text>
          <TouchableOpacity
            style={[styles.prayerGuideButton, { backgroundColor: '#dcfce7', borderColor: '#16a34a' }]}
            onPress={() => router.push('/istikhara-prayer-guide' as any)}
          >
            <View style={styles.prayerGuideContent}>
              <View style={styles.prayerGuideIcon}>
                <Ionicons name="book" size={28} color="#16a34a" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prayerGuideTitle, { color: '#15803d' }]}>
                  Complete Prayer Guide
                </Text>
                <Text style={[styles.prayerGuideSubtitle, { color: '#166534' }]}>
                  Step-by-step instructions • Authentic dua • Prerequisites • Post-prayer guidance
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#16a34a" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Additional Information */}
        <View style={[styles.infoCard, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
          <Ionicons name="bulb" size={18} color="#b45309" />
          <Text style={[styles.infoText, { color: '#78350f' }]}>
            Istikhārah is performed when facing an important decision. The prayer consists of 2 rak'ahs followed by a specific supplication taught by the Prophet Muhammad ﷺ.
          </Text>
        </View>

        {/* When to Perform */}
        <View style={styles.whenCard}>
          <Text style={[styles.whenTitle, { color: colors.text }]}>
            When to Perform Istikhārah
          </Text>
          <View style={styles.whenList}>
            <View style={styles.whenItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.whenItemText, { color: colors.textSecondary }]}>
                Marriage or important relationships
              </Text>
            </View>
            <View style={styles.whenItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.whenItemText, { color: colors.textSecondary }]}>
                Career decisions or job changes
              </Text>
            </View>
            <View style={styles.whenItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.whenItemText, { color: colors.textSecondary }]}>
                Major purchases or investments
              </Text>
            </View>
            <View style={styles.whenItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.whenItemText, { color: colors.textSecondary }]}>
                Travel or relocation decisions
              </Text>
            </View>
            <View style={styles.whenItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.whenItemText, { color: colors.textSecondary }]}>
                Any permissible matter requiring guidance
              </Text>
            </View>
          </View>
        </View>
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
      
      <BottomTabBar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  heroCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  heroHadith: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  heroHadithText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
    flex: 1,
  },
  heroReference: {
    fontSize: 12,
    fontWeight: '600',
  },
  primarySection: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  whenCard: {
    gap: 16,
  },
  whenTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  whenList: {
    gap: 12,
  },
  whenItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  whenItemText: {
    fontSize: 15,
    lineHeight: 21,
    flex: 1,
  },
  prayerGuideButton: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 18,
  },
  prayerGuideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  prayerGuideIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
  },
  prayerGuideTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  prayerGuideSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
