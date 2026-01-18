import { Borders, DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function ExpandableCard(props: {
  title: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  accentColor: string;
  initiallyExpanded?: boolean;
  rightMetaText?: string;
  children: React.ReactNode;
}) {
  const { title, icon, accentColor, initiallyExpanded = false, rightMetaText, children } = props;

  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  const [contentHeight, setContentHeight] = React.useState(0);

  const progress = useSharedValue(initiallyExpanded ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [expanded, progress]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: contentHeight === 0 ? undefined : contentHeight * progress.value,
      opacity: 0.92 + 0.08 * progress.value,
    };
  });

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 180}deg` }],
    };
  });

  const onToggle = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setExpanded((e) => !e);
  };

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={onToggle}>
        <View style={styles.headerLeft}>
          {icon ? <Ionicons name={icon} size={20} color={accentColor} /> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          {rightMetaText ? <Text style={styles.meta}>{rightMetaText}</Text> : null}
          <Animated.View style={rotateStyle}>
            <Ionicons name="chevron-down" size={18} color={DarkTheme.textTertiary} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Measure content */}
      <View
        style={styles.measure}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && h !== contentHeight) setContentHeight(h);
        }}
        pointerEvents="none"
      >
        {children}
      </View>

      {/* Animated visible content */}
      <Animated.View style={[styles.content, containerStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  meta: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  content: {
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  // offscreen measure layer
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
  },
});
