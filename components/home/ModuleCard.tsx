/**
 * ModuleCard Component
 * Primary module cards with glassmorphism and element-based theming
 * 
 * Implements Islamic geometric principles:
 * - Symmetry and balance in layout
 * - Layered depth through transparency
 * - Element-based color symbolism (Fire/Earth/Air/Water)
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Borders, DarkTheme, ElementAccents, Shadows, Spacing, Typography } from '../../constants/DarkTheme';
import { ModuleCardProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ModuleCard({
  title,
  titleArabic,
  description,
  icon,
  element,
  onPress,
  comingSoon = false,
}: ModuleCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const accent = ElementAccents[element];

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
    opacity.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={comingSoon ? undefined : onPress}
      onPressIn={comingSoon ? undefined : handlePressIn}
      onPressOut={comingSoon ? undefined : handlePressOut}
      style={[styles.container, animatedStyle]}
      disabled={comingSoon}
    >
      {/* Glassmorphism background with gradient */}
      <LinearGradient
        colors={[
          `${accent.primary}15`, // 15% opacity
          `${accent.secondary}10`, // 10% opacity
          'rgba(45, 21, 21, 0.6)', // Base card color with transparency
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Frosted glass effect overlay */}
        <View style={[styles.glassOverlay, { borderColor: `${accent.primary}40` }]}>
          {/* Element accent bar - Islamic left-to-right reading flow */}
          <View style={[styles.accentBar, { backgroundColor: accent.primary }]} />
          
          {/* Content container */}
          <View style={styles.content}>
            {/* Icon and Title Row */}
            <View style={styles.header}>
              <Text style={styles.icon}>{icon}</Text>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.titleArabic, { color: accent.secondary }]}>
                  {titleArabic}
                </Text>
              </View>
            </View>
            
            {/* Description */}
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
            
            {/* Coming Soon Badge */}
            {comingSoon && (
              <View style={[styles.badge, { backgroundColor: accent.glow }]}>
                <Text style={[styles.badgeText, { color: accent.primary }]}>
                  قريباً • Coming Soon
                </Text>
              </View>
            )}
            
            {/* Subtle glow effect */}
            <View style={[styles.glow, { backgroundColor: accent.glow }]} />
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.screenPadding,
    marginVertical: Spacing.sm,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(30, 20, 36, 0.65)',
    overflow: 'hidden',
    ...Shadows.card,
  },
  gradientBackground: {
    borderRadius: Borders.radiusLg,
    overflow: 'hidden',
  },
  glassOverlay: {
    borderRadius: Borders.radiusLg,
    borderWidth: 0, // Remove border since container now has it
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: Borders.radiusLg,
    borderBottomLeftRadius: Borders.radiusLg,
  },
  content: {
    padding: Spacing.cardPadding,
    paddingLeft: Spacing.cardPadding + 8, // Extra space for accent bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 48,
    marginRight: Spacing.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  titleArabic: {
    fontSize: Typography.label,
    fontWeight: Typography.weightMedium,
    opacity: 0.9,
  },
  description: {
    fontSize: Typography.body,
    fontWeight: Typography.weightRegular,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Borders.radiusSm,
    marginTop: Spacing.md,
  },
  badgeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  glow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
  },
});
