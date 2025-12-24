/**
 * Theme System for Name Destiny Feature
 * Mobile Implementation - Expo Go 54
 */

import { useColorScheme } from 'react-native';

export interface Theme {
  // Background colors
  background: {
    primary: string;
    secondary: string;
    card: string;
    elevated: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // UI Element colors
  ui: {
    border: string;
    divider: string;
    shadow: string;
    overlay: string;
  };
  
  // Brand colors
  brand: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Element colors (for Abjad calculations)
  elements: {
    fire: string;
    earth: string;
    air: string;
    water: string;
  };
  
  // Semantic colors
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Gradient definitions
  gradients: {
    background: readonly [string, string, ...string[]];
    card: readonly [string, string];
    primary: readonly [string, string];
    element: readonly [string, string];
  };
}

export const lightTheme: Theme = {
  background: {
    primary: '#f8fafc',
    secondary: '#f1f5f9',
    card: '#ffffff',
    elevated: '#ffffff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
  ui: {
    border: '#e2e8f0',
    divider: '#cbd5e1',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  brand: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
  },
  elements: {
    fire: '#f87171',
    earth: '#92400e',
    air: '#06b6d4',
    water: '#3b82f6',
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  gradients: {
    background: ['#f8fafc', '#e0e7ff', '#ddd6fe'],
    card: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
    primary: ['#6366f1', '#8b5cf6'],
    element: ['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.1)'],
  },
};

export const darkTheme: Theme = {
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    card: '#1e293b',
    elevated: '#334155',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
  },
  ui: {
    border: '#334155',
    divider: '#475569',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  brand: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    accent: '#f472b6',
  },
  elements: {
    fire: '#fca5a5',
    earth: '#d97706',
    air: '#22d3ee',
    water: '#60a5fa',
  },
  semantic: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  gradients: {
    background: ['#0f172a', '#1e1b4b', '#312e81'],
    card: ['rgba(30, 41, 59, 0.9)', 'rgba(30, 41, 59, 0.7)'],
    primary: ['#818cf8', '#a78bfa'],
    element: ['rgba(129, 140, 248, 0.2)', 'rgba(167, 139, 250, 0.1)'],
  },
};

/**
 * Hook to get current theme based on color scheme
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

/**
 * Get element color based on element name
 */
export function getElementColor(element: string, theme: Theme): string {
  const elementLower = element.toLowerCase();
  switch (elementLower) {
    case 'fire':
      return theme.elements.fire;
    case 'earth':
      return theme.elements.earth;
    case 'air':
      return theme.elements.air;
    case 'water':
      return theme.elements.water;
    default:
      return theme.brand.primary;
  }
}

/**
 * Get element gradient based on element name
 */
export function getElementGradient(element: string, theme: Theme): readonly [string, string] {
  const elementLower = element.toLowerCase();
  const baseColor = getElementColor(element, theme);
  
  // Create gradient with opacity variations
  const isDark = theme.background.primary === '#0f172a';
  const opacity1 = isDark ? '0.3' : '0.2';
  const opacity2 = isDark ? '0.2' : '0.1';
  
  return [
    `${baseColor}${opacity1}`,
    `${baseColor}${opacity2}`,
  ] as const;
}
