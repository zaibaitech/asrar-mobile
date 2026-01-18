import React, { useEffect, useMemo } from 'react';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg';

/**
 * Asrār Logo - Sacred Geometry Logo Component for React Native
 * 
 * Incorporates:
 * - 8-pointed star (Octagram) - divine order
 * - 3 concentric rings - أسرار = 462 → 4+6+2 = 12 → 3
 * - 3 dots in triangular formation - trinity of body, soul, spirit
 * - Subtle ع (Ayn) curve - source/spring
 * - Center eye with inner dot - the "seed"
 */

export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'aether';
export type LogoVariant = 'icon' | 'wordmark' | 'horizontal';

type MonoVariant = 'light' | 'dark';

export interface AsrarLogoProps {
  /** Size in pixels */
  size?: number;
  /** Logo variant */
  variant?: LogoVariant;
  /** Element theme for colors */
  element?: ElementType;
  /** Use monochrome colors (for light/dark mode) */
  mono?: boolean;
  /** Custom mono color (when mono=true) */
  monoColor?: string;
  /** Mono variant (light/dark) when mono=true and monoColor is not set */
  monoVariant?: MonoVariant;
  /** Show background (for app icons) */
  showBackground?: boolean;
  /** Show sacred geometry grid */
  showGrid?: boolean;
  /** Enable subtle rotation animation */
  animated?: boolean;
  /** Rotation duration for animated logo */
  rotationDurationMs?: number;
}

const AnimatedG = Animated.createAnimatedComponent(G);

// Element-based color palettes
const elementPalettes = {
  fire: {
    primary: '#DC2626',
    secondary: '#F97316',
    tertiary: '#FCD34D',
    glow: '#FEF3C7',
  },
  water: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    tertiary: '#67E8F9',
    glow: '#E0F2FE',
  },
  earth: {
    primary: '#166534',
    secondary: '#22C55E',
    tertiary: '#A3E635',
    glow: '#ECFCCB',
  },
  air: {
    primary: '#6366F1',
    secondary: '#A78BFA',
    tertiary: '#E0E7FF',
    glow: '#F5F3FF',
  },
  aether: {
    primary: '#4F46E5',
    secondary: '#8B5CF6',
    tertiary: '#EC4899',
    glow: '#FDF4FF',
  },
};

// Generate the main 8-pointed star path (two overlapping squares)
const generateOctagram = (
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number
): string => {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return (
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') +
    ' Z'
  );
};

// Generate concentric circles for the 3 rings (number symbolism)
const generateRings = (_cx: number, _cy: number, baseRadius: number) => {
  return [
    { radius: baseRadius * 1.4, opacity: 0.15, strokeWidth: 2 },
    { radius: baseRadius * 1.25, opacity: 0.25, strokeWidth: 1.5 },
    { radius: baseRadius * 1.1, opacity: 0.35, strokeWidth: 1 },
  ];
};

export const AsrarLogo: React.FC<AsrarLogoProps> = ({
  size = 120,
  variant = 'icon',
  element = 'aether',
  mono = false,
  monoColor,
  monoVariant,
  showBackground = false,
  showGrid = false,
  animated = false,
  rotationDurationMs = 24000,
}) => {
  const showWordmark = variant === 'wordmark' || variant === 'horizontal';
  const horizontal = variant === 'horizontal';

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.35;
  const innerR = outerR * 0.55;
  const rings = generateRings(cx, cy, outerR);

  const colors = elementPalettes[element];
  const uniqueId = useMemo(() => Math.random().toString(36).slice(2, 9), []);
  const gradientId = `asrar-gradient-${element}-${uniqueId}`;
  const backgroundId = `asrar-bg-${element}-${uniqueId}`;

  const getMonoColor = () => {
    if (monoColor) return monoColor;
    if (monoVariant === 'light') return '#1F2937';
    if (monoVariant === 'dark') return '#F9FAFB';
    return '#6B21A8';
  };

  const getColor = (type: keyof typeof colors) => {
    if (mono) {
      return getMonoColor();
    }
    return colors[type];
  };

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      rotation.value = withRepeat(
        withTiming(360, { duration: rotationDurationMs, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [animated, rotation, rotationDurationMs]);

  const animatedProps = useAnimatedProps(() => ({
    rotation: rotation.value,
  }));

  const viewBoxWidth = horizontal && showWordmark ? size * 2.5 : size;
  const viewBoxHeight =
    horizontal && showWordmark ? size : showWordmark && !horizontal ? size * 1.4 : size;

  const backgroundRadius = size * 0.22;

  return (
    <Svg
      width={viewBoxWidth}
      height={viewBoxHeight}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      <Defs>
        {/* Main gradient */}
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={getColor('primary')} />
          <Stop offset="50%" stopColor={getColor('secondary')} />
          <Stop offset="100%" stopColor={getColor('tertiary')} />
        </LinearGradient>

        {/* Background gradient */}
        <LinearGradient id={backgroundId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} />
          <Stop offset="50%" stopColor={colors.secondary} />
          <Stop offset="100%" stopColor={colors.tertiary} />
        </LinearGradient>
      </Defs>

      {showBackground && variant === 'icon' && (
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          rx={backgroundRadius}
          ry={backgroundRadius}
          fill={mono ? (monoVariant === 'light' ? '#F9FAFB' : '#0F172A') : `url(#${backgroundId})`}
        />
      )}

      {/* Background sacred geometry grid (optional) */}
      {showGrid && (
        <G opacity="0.1">
          {[...Array(12)].map((_, i) => (
            <Line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + outerR * 1.8 * Math.cos((i * Math.PI) / 6)}
              y2={cy + outerR * 1.8 * Math.sin((i * Math.PI) / 6)}
              stroke={getColor('primary')}
              strokeWidth="0.5"
            />
          ))}
        </G>
      )}

      {animated ? (
        <AnimatedG animatedProps={animatedProps} originX={cx} originY={cy}>
          {/* Three concentric rings - representing the number 3 */}
          {rings.map((ring, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill="none"
              stroke={mono ? getColor('primary') : `url(#${gradientId})`}
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          ))}

          {/* Outer rotating square (45° rotated) */}
          <G origin={`${cx}, ${cy}`} rotation="45">
            <Rect
              x={cx - outerR * 0.75}
              y={cy - outerR * 0.75}
              width={outerR * 1.5}
              height={outerR * 1.5}
              fill="none"
              stroke={mono ? getColor('primary') : `url(#${gradientId})`}
              strokeWidth="1.5"
              opacity="0.3"
            />
          </G>

          {/* Main 8-pointed star */}
          <G>
            {/* Back layer - slightly larger, more transparent */}
            <Path
              d={generateOctagram(cx, cy, outerR * 1.05, innerR * 1.05)}
              fill={mono ? getColor('primary') : `url(#${gradientId})`}
              opacity="0.3"
            />

            {/* Main star */}
            <Path
              d={generateOctagram(cx, cy, outerR, innerR)}
              fill={mono ? getColor('primary') : `url(#${gradientId})`}
            />
          </G>

          {/* Inner circle with subtle glow - the "eye" center */}
          <Circle
            cx={cx}
            cy={cy}
            r={innerR * 0.5}
            fill={mono ? getColor('primary') : colors.glow}
            fillOpacity={mono ? 0.2 : 0.9}
            stroke={mono ? getColor('primary') : 'none'}
            strokeWidth={mono ? 1.5 : 0}
            strokeOpacity={mono ? 0.6 : 0}
          />

          {/* Center dot - the pupil/seed */}
          <Circle
            cx={cx}
            cy={cy}
            r={innerR * 0.15}
            fill={mono ? getColor('primary') : `url(#${gradientId})`}
            opacity={1}
          />

          {/* Subtle ع (Ayn) inspired curves in the geometry */}
          <G opacity="0.4">
            <Path
              d={`M ${cx - innerR * 0.3} ${cy + innerR * 0.1} 
                  Q ${cx} ${cy - innerR * 0.3} ${cx + innerR * 0.3} ${cy + innerR * 0.1}`}
              fill="none"
              stroke={mono ? getColor('primary') : `url(#${gradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </G>

          {/* Three dots arranged in triangle - number 3 symbolism */}
          {[0, 120, 240].map((angle, i) => {
            const dotRadius = innerR * 0.08;
            const dotDistance = innerR * 0.75;
            const rad = ((angle - 90) * Math.PI) / 180;
            return (
              <Circle
                key={i}
                cx={cx + dotDistance * Math.cos(rad)}
                cy={cy + dotDistance * Math.sin(rad)}
                r={dotRadius}
                fill={mono ? getColor('primary') : `url(#${gradientId})`}
                opacity="0.6"
              />
            );
          })}
        </AnimatedG>
      ) : (
        <G>
          {/* Three concentric rings - representing the number 3 */}
          {rings.map((ring, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill="none"
              stroke={mono ? getColor('primary') : `url(#${gradientId})`}
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          ))}

          {/* Outer rotating square (45° rotated) */}
          <G origin={`${cx}, ${cy}`} rotation="45">
            <Rect
              x={cx - outerR * 0.75}
              y={cy - outerR * 0.75}
              width={outerR * 1.5}
              height={outerR * 1.5}
              fill="none"
              stroke={mono ? getColor('primary') : `url(#${gradientId})`}
              strokeWidth="1.5"
              opacity="0.3"
            />
          </G>

          {/* Main 8-pointed star */}
          <G>
            {/* Back layer - slightly larger, more transparent */}
            <Path
              d={generateOctagram(cx, cy, outerR * 1.05, innerR * 1.05)}
              fill={mono ? getColor('primary') : `url(#${gradientId})`}
              opacity="0.3"
            />

            {/* Main star */}
            <Path
              d={generateOctagram(cx, cy, outerR, innerR)}
              fill={mono ? getColor('primary') : `url(#${gradientId})`}
            />
          </G>

          {/* Inner circle with subtle glow - the "eye" center */}
          <Circle
            cx={cx}
            cy={cy}
            r={innerR * 0.5}
            fill={mono ? getColor('primary') : colors.glow}
            fillOpacity={mono ? 0.2 : 0.9}
            stroke={mono ? getColor('primary') : 'none'}
            strokeWidth={mono ? 1.5 : 0}
            strokeOpacity={mono ? 0.6 : 0}
          />

          {/* Center dot - the pupil/seed */}
          <Circle
            cx={cx}
            cy={cy}
            r={innerR * 0.15}
            fill={mono ? getColor('primary') : `url(#${gradientId})`}
            opacity={1}
          />

          {/* Subtle ع (Ayn) inspired curves in the geometry */}
          <G opacity="0.4">
            <Path
              d={`M ${cx - innerR * 0.3} ${cy + innerR * 0.1} 
                  Q ${cx} ${cy - innerR * 0.3} ${cx + innerR * 0.3} ${cy + innerR * 0.1}`}
              fill="none"
              stroke={mono ? getColor('primary') : `url(#${gradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </G>

          {/* Three dots arranged in triangle - number 3 symbolism */}
          {[0, 120, 240].map((angle, i) => {
            const dotRadius = innerR * 0.08;
            const dotDistance = innerR * 0.75;
            const rad = ((angle - 90) * Math.PI) / 180;
            return (
              <Circle
                key={i}
                cx={cx + dotDistance * Math.cos(rad)}
                cy={cy + dotDistance * Math.sin(rad)}
                r={dotRadius}
                fill={mono ? getColor('primary') : `url(#${gradientId})`}
                opacity="0.6"
              />
            );
          })}
        </G>
      )}

      {/* Wordmark */}
      {showWordmark && (
        <SvgText
          x={horizontal ? size * 1.15 : cx}
          y={horizontal ? cy + 8 : size * 1.25}
          textAnchor={horizontal ? 'start' : 'middle'}
          fontFamily="Georgia, serif"
          fontSize={size * 0.18}
          fontWeight="600"
          fill={mono ? getColor('primary') : `url(#${gradientId})`}
          letterSpacing="0.05em"
        >
          Asrariya
        </SvgText>
      )}
    </Svg>
  );
};

export const AsrarLogoAnimated: React.FC<Omit<AsrarLogoProps, 'animated'>> = (props) => (
  <AsrarLogo {...props} animated />
);

export default AsrarLogo;
