/**
 * Responsive Design Utilities
 * Mobile Implementation - Expo Go 54
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints based on common device sizes
export const breakpoints = {
  xs: 375,  // iPhone SE
  sm: 390,  // iPhone 12/13
  md: 430,  // iPhone 14 Pro Max
  lg: 540,  // Large Android phones
} as const;

/**
 * Check if current screen is small (iPhone SE size)
 */
export function isSmallScreen(): boolean {
  return SCREEN_WIDTH < breakpoints.sm;
}

/**
 * Check if current screen is medium size
 */
export function isMediumScreen(): boolean {
  return SCREEN_WIDTH >= breakpoints.sm && SCREEN_WIDTH < breakpoints.md;
}

/**
 * Check if current screen is large
 */
export function isLargeScreen(): boolean {
  return SCREEN_WIDTH >= breakpoints.md;
}

/**
 * Get responsive value based on screen size
 */
export function responsive<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  default: T;
}): T {
  if (SCREEN_WIDTH < breakpoints.xs && values.xs !== undefined) {
    return values.xs;
  }
  if (SCREEN_WIDTH < breakpoints.sm && values.sm !== undefined) {
    return values.sm;
  }
  if (SCREEN_WIDTH < breakpoints.md && values.md !== undefined) {
    return values.md;
  }
  if (SCREEN_WIDTH >= breakpoints.lg && values.lg !== undefined) {
    return values.lg;
  }
  return values.default;
}

/**
 * Scale value based on screen width
 */
export function scaleFont(size: number): number {
  const scale = SCREEN_WIDTH / 390; // Base: iPhone 12/13
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

/**
 * Scale spacing based on screen width
 */
export function scaleSpacing(spacing: number): number {
  const scale = SCREEN_WIDTH / 390;
  return Math.round(spacing * scale);
}

/**
 * Get screen info for debugging
 */
export function getScreenInfo() {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    platform: Platform.OS,
    pixelRatio: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
    isSmall: isSmallScreen(),
    isMedium: isMediumScreen(),
    isLarge: isLargeScreen(),
  };
}

/**
 * Log screen info for testing
 */
export function logScreenInfo() {
  const info = getScreenInfo();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 SCREEN INFO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Width: ${info.width}px`);
  console.log(`Height: ${info.height}px`);
  console.log(`Platform: ${info.platform}`);
  console.log(`Pixel Ratio: ${info.pixelRatio}`);
  console.log(`Font Scale: ${info.fontScale}`);
  console.log(`Size Category: ${info.isSmall ? 'Small' : info.isMedium ? 'Medium' : 'Large'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Export screen dimensions
export { SCREEN_HEIGHT, SCREEN_WIDTH };

