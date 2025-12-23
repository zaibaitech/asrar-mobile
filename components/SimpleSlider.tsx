/**
 * Simple Slider Component
 * Custom implementation to avoid dependency issues
 */

import React, { useState } from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    PanResponder,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface SimpleSliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: ViewStyle;
}

export const SimpleSlider: React.FC<SimpleSliderProps> = ({
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  minimumTrackTintColor = '#64B5F6',
  maximumTrackTintColor = '#3e3e3e',
  thumbTintColor = '#ffffff',
  style,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);

  const normalizedValue = (value - minimumValue) / (maximumValue - minimumValue);
  const thumbPosition = normalizedValue * sliderWidth;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt: GestureResponderEvent) => {
      updateValue(evt.nativeEvent.locationX);
    },
    onPanResponderMove: (evt: GestureResponderEvent) => {
      updateValue(evt.nativeEvent.locationX);
    },
  });

  const updateValue = (x: number) => {
    const newNormalizedValue = Math.max(0, Math.min(1, x / sliderWidth));
    const newValue = minimumValue + newNormalizedValue * (maximumValue - minimumValue);
    onValueChange(newValue);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.track}>
        <View
          style={[
            styles.minimumTrack,
            { width: thumbPosition, backgroundColor: minimumTrackTintColor },
          ]}
        />
        <View
          style={[
            styles.maximumTrack,
            { backgroundColor: maximumTrackTintColor },
          ]}
        />
      </View>
      <View
        style={[
          styles.thumb,
          { left: thumbPosition - 10, backgroundColor: thumbTintColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  minimumTrack: {
    height: 4,
  },
  maximumTrack: {
    flex: 1,
    height: 4,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
