/**
 * Element Theming Utility
 * Provides consistent color schemes and styling for each Tab element
 */

export type ElementType = 'Fire' | 'Air' | 'Water' | 'Earth';

export interface ElementTheme {
  accentColor: string;
  borderColor: string;
  glowColor: string;
  gradientColors: readonly [string, string, string];
  iconName: string;
  subtitle: string;
  arabicLabel: string;
  temperamentLabel: string;
  backgroundColor: string;
}

const ELEMENT_THEMES: Record<ElementType, ElementTheme> = {
  Fire: {
    accentColor: '#FF5A5F',
    borderColor: '#FF5A5F',
    glowColor: 'rgba(255, 90, 95, 0.3)',
    gradientColors: ['#ef4444', '#dc2626', '#b91c1c'],
    iconName: 'flame',
    subtitle: 'Hot & Dry',
    arabicLabel: 'نار',
    temperamentLabel: 'Choleric',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  Air: {
    accentColor: '#4CC9F0',
    borderColor: '#4CC9F0',
    glowColor: 'rgba(76, 201, 240, 0.3)',
    gradientColors: ['#06b6d4', '#0891b2', '#0e7490'],
    iconName: 'wind',
    subtitle: 'Hot & Moist',
    arabicLabel: 'هواء',
    temperamentLabel: 'Sanguine',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  Water: {
    accentColor: '#3B82F6',
    borderColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    gradientColors: ['#3b82f6', '#2563eb', '#1d4ed8'],
    iconName: 'droplet',
    subtitle: 'Cold & Moist',
    arabicLabel: 'ماء',
    temperamentLabel: 'Phlegmatic',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  Earth: {
    accentColor: '#22C55E',
    borderColor: '#22C55E',
    glowColor: 'rgba(34, 197, 94, 0.3)',
    gradientColors: ['#84cc16', '#65a30d', '#4d7c0f'],
    iconName: 'leaf',
    subtitle: 'Cold & Dry',
    arabicLabel: 'تراب',
    temperamentLabel: 'Melancholic',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
  },
};

export function getElementTheme(element: ElementType): ElementTheme {
  return ELEMENT_THEMES[element] || ELEMENT_THEMES.Water;
}

export function getElementFromString(elementStr?: string): ElementType {
  const normalized = elementStr?.toLowerCase();
  if (normalized === 'fire') return 'Fire';
  if (normalized === 'air') return 'Air';
  if (normalized === 'water') return 'Water';
  if (normalized === 'earth') return 'Earth';
  return 'Water'; // default fallback
}
