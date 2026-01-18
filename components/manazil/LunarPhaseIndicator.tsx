import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

// Simple approximation: map date to synodic month fraction.
// This is intentionally "good enough" for UI; not an astronomy engine.
function lunarPhaseFraction(date: Date): number {
  // Reference new moon: 2000-01-06 18:14 UTC (approx)
  const ref = Date.UTC(2000, 0, 6, 18, 14, 0, 0);
  const ms = date.getTime() - ref;
  const days = ms / (1000 * 60 * 60 * 24);
  const synodic = 29.530588;
  const frac = ((days % synodic) + synodic) % synodic;
  return frac / synodic; // 0..1
}

export function LunarPhaseIndicator(props: {
  date: Date;
  accent: string;
  label?: string;
}) {
  const { date, accent, label } = props;
  const frac = lunarPhaseFraction(date);

  // orbit dot around moon slowly
  const rot = useSharedValue(0);
  React.useEffect(() => {
    rot.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.linear }), -1, false);
  }, [rot]);

  const orbitStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rot.value * 360}deg` }],
    };
  });

  // illumination: 0 new, 0.5 full
  const illum = 0.5 - Math.abs(frac - 0.5); // 0..0.5
  const illumPct = Math.round((illum / 0.5) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.moonFrame, { borderColor: `${accent}55` }]}>
          <View style={styles.moonBase} />
          {/* simple "shadow" mask */}
          <View
            style={[
              styles.shadow,
              {
                left: `${(1 - illum / 0.5) * 50}%`,
              },
            ]}
          />
          <Animated.View style={[styles.orbit, orbitStyle]}>
            <View style={[styles.orbitDot, { backgroundColor: accent }]} />
          </Animated.View>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaTitle}>{label ?? 'Lunar phase'}</Text>
          <Text style={styles.metaValue}>{illumPct}%</Text>
        </View>
      </View>
    </View>
  );
}

const SIZE = 44;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  moonFrame: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  moonBase: {
    position: 'absolute',
    inset: 0,
    borderRadius: SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIZE,
    backgroundColor: DarkTheme.screenBackground,
    opacity: 0.68,
  },
  orbit: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  orbitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    opacity: 0.9,
  },
  meta: {
    justifyContent: 'center',
  },
  metaTitle: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  metaValue: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginTop: 1,
  },
});
