import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

type Star = {
  x: number; // 0-1
  y: number; // 0-1
  size: number;
  delayMs: number;
  durationMs: number;
  opacityMin: number;
};

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(seed: number, count: number): Star[] {
  const rnd = mulberry32(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const x = rnd();
    const y = rnd();
    const size = 1.5 + rnd() * 2.8;
    const delayMs = Math.floor(rnd() * 1200);
    const durationMs = 1600 + Math.floor(rnd() * 2200);
    const opacityMin = 0.25 + rnd() * 0.35;
    stars.push({ x, y, size, delayMs, durationMs, opacityMin });
  }
  return stars;
}

export function ConstellationMap(props: {
  seed: number;
  tint: string;
  height?: number;
  /** Optional lunar mansion index (0-27). Enables mansion-specific patterns. */
  mansionIndex?: number | null;
  /** Subtle geometric overlay (defaults on). */
  showGeometricOverlay?: boolean;
}) {
  const { seed, tint, height = 140, mansionIndex, showGeometricOverlay = true } = props;
  const stars = React.useMemo(() => buildStars(seed, 22), [seed]);

  const leo = React.useMemo(() => {
    // Minimal, stylized Leo outline for Al‑Ṣarfah (index 11).
    if (mansionIndex !== 11) return null;
    const pts = [
      { x: 0.18, y: 0.62 },
      { x: 0.28, y: 0.50 },
      { x: 0.40, y: 0.44 },
      { x: 0.54, y: 0.46 },
      { x: 0.68, y: 0.52 },
      { x: 0.78, y: 0.60 },
      { x: 0.62, y: 0.70 },
      { x: 0.46, y: 0.72 },
    ];
    const edges: Array<[number, number]> = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 0],
      [2, 7],
    ];
    return { pts, edges };
  }, [mansionIndex]);

  return (
    <View style={[styles.container, { height }]}> 
      {stars.map((s, idx) => (
        <TwinkleStar key={idx} star={s} tint={tint} />
      ))}

      {showGeometricOverlay ? (
        <View style={styles.svgOverlay} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* subtle geometric lattice */}
            {Array.from({ length: 6 }).map((_, i) => {
              const x = 12 + i * 16;
              return (
                <Line key={`v-${i}`} x1={x} y1={-5} x2={x} y2={105} stroke={tint} strokeWidth={0.6} opacity={0.06} />
              );
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 12 + i * 16;
              return (
                <Line key={`h-${i}`} x1={-5} y1={y} x2={105} y2={y} stroke={tint} strokeWidth={0.6} opacity={0.06} />
              );
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const x1 = -5;
              const y1 = 16 * i;
              const x2 = 105;
              const y2 = y1 + 40;
              return (
                <Line key={`d-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tint} strokeWidth={0.6} opacity={0.04} />
              );
            })}
          </Svg>
        </View>
      ) : null}

      {leo ? (
        <View style={styles.svgOverlay} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            {leo.edges.map(([a, b], idx) => (
              <Line
                key={`leo-line-${idx}`}
                x1={leo.pts[a].x * 100}
                y1={leo.pts[a].y * 100}
                x2={leo.pts[b].x * 100}
                y2={leo.pts[b].y * 100}
                stroke={tint}
                strokeWidth={0.9}
                opacity={0.22}
              />
            ))}
            {leo.pts.map((p, idx) => (
              <Circle
                key={`leo-star-${idx}`}
                cx={p.x * 100}
                cy={p.y * 100}
                r={idx % 3 === 0 ? 1.6 : 1.1}
                fill={tint}
                opacity={0.55}
              />
            ))}
          </Svg>
        </View>
      ) : (
        // a few “lines” for non-specific mode
        <>
          <View style={[styles.line, { left: '15%', top: '40%', width: '40%', backgroundColor: tint }]} />
          <View style={[styles.line, { left: '45%', top: '55%', width: '32%', backgroundColor: tint, transform: [{ rotate: '-18deg' }] }]} />
        </>
      )}
    </View>
  );
}

function TwinkleStar({ star, tint }: { star: Star; tint: string }) {
  const p = useSharedValue(0);

  React.useEffect(() => {
    p.value = withDelay(
      star.delayMs,
      withRepeat(
        withTiming(1, { duration: star.durationMs, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      )
    );
  }, [p, star.delayMs, star.durationMs]);

  const style = useAnimatedStyle(() => {
    const opacity = star.opacityMin + (1 - star.opacityMin) * p.value;
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          left: `${star.x * 100}%`,
          top: `${star.y * 100}%`,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: tint,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  svgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
  },
  line: {
    position: 'absolute',
    height: 1,
    opacity: 0.22,
  },
});
