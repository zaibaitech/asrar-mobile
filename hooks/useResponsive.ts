/**
 * useResponsive — shared responsive layout hook
 * Uses useWindowDimensions() so it reacts to screen rotation automatically.
 *
 * Breakpoints:
 *   mobile  < 768
 *   tablet  768 – 1024
 *   desktop > 1024
 */

import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390; // iPhone 12/13 design base

export function useResponsive() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width <= 1024;
  const isDesktop = width > 1024;

  /** Number of columns for the main module FlatList */
  const numColumns = isTablet || isDesktop ? 2 : 1;

  /** Card width accounting for horizontal padding (16px each side) and inter-column gap (12px) */
  const cardWidth = numColumns === 2
    ? (width - 16 * 2 - 12) / 2
    : width - 16 * 2;

  /** Number of icons shown in the compact modules row */
  const compactIconCount = isTablet || isDesktop ? 6 : 4;

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    numColumns,
    cardWidth,
    compactIconCount,
  };
}
