import { DarkTheme } from '@/constants/DarkTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type Element = 'fire' | 'water' | 'air' | 'earth';

function elementIconName(element: Element): React.ComponentProps<typeof Ionicons>['name'] {
  switch (element) {
    case 'fire':
      return 'flame';
    case 'water':
      return 'water';
    case 'earth':
      return 'leaf';
    case 'air':
    default:
      return 'cloud';
  }
}

export function ElementalSigil(props: {
  element: Element;
  accent: string;
}) {
  const { element, accent } = props;

  const p = useSharedValue(0);
  React.useEffect(() => {
    p.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [p]);

  const style = useAnimatedStyle(() => {
    const base = 1;
    const bump = 0.04 * p.value;
    const scale = base + bump;
    const opacity = 0.8 + 0.2 * p.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const drift = (p.value - 0.5) * 2; // -1..1
    return {
      transform: [{ translateY: drift * -1.5 }],
      opacity: 0.72 + 0.28 * p.value,
    };
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.core,
          style,
          {
            borderColor: `${accent}66`,
            backgroundColor: `${accent}12`,
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              backgroundColor:
                element === 'water'
                  ? 'rgba(79, 195, 247, 0.22)'
                  : element === 'fire'
                    ? 'rgba(255, 107, 107, 0.20)'
                    : element === 'earth'
                      ? 'rgba(139, 115, 85, 0.20)'
                      : 'rgba(255, 255, 255, 0.10)',
            },
          ]}
        />

        <Animated.View style={[styles.iconWrap, iconStyle]} pointerEvents="none">
          <Ionicons name={elementIconName(element)} size={16} color={`${accent}dd`} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
  },
  core: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DarkTheme.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  inner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  iconWrap: {
    position: 'absolute',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
