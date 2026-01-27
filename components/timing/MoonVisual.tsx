import type { MoonPhaseName } from '@/services/MoonPhaseService';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Stop } from 'react-native-svg';

interface MoonVisualProps {
  phasePercentage: number;  // 0-100
  phaseName: MoonPhaseName;
  size?: number;
}

export default function MoonVisual({
  phasePercentage,
  phaseName,
  size = 120,
}: MoonVisualProps) {
  const radius = size / 2;
  const center = size / 2;
  
  // Determine if waxing or waning
  const isWaxing = ['waxing_crescent', 'first_quarter', 'waxing_gibbous'].includes(phaseName);
  
  // Calculate shadow position based on phase
  // For waxing: shadow moves from right to center
  // For waning: shadow moves from left to center
  const shadowOffset = isWaxing
    ? (100 - phasePercentage) / 100
    : (phasePercentage - 100) / 100;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Moon glow effect */}
          <LinearGradient id="moonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F5F5DC" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E8E8C8" stopOpacity="0.9" />
          </LinearGradient>
          
          {/* Shadow gradient */}
          <LinearGradient id="moonShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#1E1E3C" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#1E1E3C" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        
        {/* Outer glow */}
        <Circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="url(#moonGlow)"
          strokeWidth="2"
          opacity={0.3}
        />
        
        {/* Moon base (lit portion) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#moonGlow)"
        />
        
        {/* Shadow (dark portion) */}
        {phasePercentage < 100 && (
          <Ellipse
            cx={center + (shadowOffset * radius)}
            cy={center}
            rx={Math.max(1, radius * (1 - phasePercentage / 100))}
            ry={radius}
            fill="url(#moonShadow)"
          />
        )}
      </Svg>
      
      {/* Subtle outer glow */}
      <View 
        style={[
          styles.glow,
          {
            width: size + 40,
            height: size + 40,
            borderRadius: (size + 40) / 2,
            opacity: phasePercentage / 200, // More glow when fuller
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  glow: {
    position: 'absolute',
    backgroundColor: '#F5F5DC',
    opacity: 0.15,
  },
});
