/**
 * 🔒 Planetary Coming Soon Screen
 * 
 * Placeholder screen shown when user attempts to access frozen Planetary details module.
 * This module is being refined for future release.
 * 
 * Usage: User taps Planet Transit widget or any disabled planet detail link
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanetaryComingSoonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#1A1625', '#2D1B3D']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.planetIcon}>🪐</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {t('planet.comingSoon.title')}
          </Text>

          <Text style={styles.message} numberOfLines={5}>
            {t('planet.comingSoon.message')}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.push('/(tabs)' as any)}
          >
            <Ionicons name="home" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText} numberOfLines={1}>
              {t('planet.comingSoon.backHome')}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(107, 92, 165, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  planetIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: Typography.body,
    fontWeight: Typography.weightRegular,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeightRelaxed,
    marginBottom: Spacing.xl * 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#6B5CA5',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: '#FFFFFF',
  },
});
