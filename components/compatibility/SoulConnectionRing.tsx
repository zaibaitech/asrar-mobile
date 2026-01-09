/**
 * Soul Connection Ring - 9-Segment Visual Display
 * Displays the mod-9 Soul Connection result as a ring of 9 beads
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface SoulConnectionRingProps {
  value: number; // 1-9
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function SoulConnectionRing({ 
  value, 
  size = 100,
  activeColor = '#d97706',
  inactiveColor = 'rgba(217, 119, 6, 0.15)'
}: SoulConnectionRingProps) {
  const beadCount = 9;
  const beadRadius = size / 20; // Size of each bead
  const ringRadius = (size / 2) - beadRadius - 5; // Radius of the ring
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate bead positions around the circle
  const beads = Array.from({ length: beadCount }, (_, i) => {
    const angle = (i * 360 / beadCount - 90) * (Math.PI / 180); // Start at top (-90 degrees)
    const x = centerX + ringRadius * Math.cos(angle);
    const y = centerY + ringRadius * Math.sin(angle);
    const isActive = i + 1 === value;
    
    return { x, y, isActive, number: i + 1 };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Draw all beads */}
          {beads.map((bead, index) => (
            <Circle
              key={index}
              cx={bead.x}
              cy={bead.y}
              r={bead.isActive ? beadRadius * 1.2 : beadRadius}
              fill={bead.isActive ? activeColor : inactiveColor}
              stroke={bead.isActive ? activeColor : 'transparent'}
              strokeWidth={bead.isActive ? 2 : 0}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
