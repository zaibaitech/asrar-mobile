// Planetary rulerships based on Abjad totals (mod 7)
export const PLANETARY_RULERS = {
  0: { name: 'Saturn', nameArabic: 'زحل', element: 'earth' as const },
  1: { name: 'Sun', nameArabic: 'الشمس', element: 'fire' as const },
  2: { name: 'Moon', nameArabic: 'القمر', element: 'water' as const },
  3: { name: 'Mars', nameArabic: 'المريخ', element: 'fire' as const },
  4: { name: 'Mercury', nameArabic: 'عطارد', element: 'air' as const },
  5: { name: 'Jupiter', nameArabic: 'المشتري', element: 'water' as const },
  6: { name: 'Venus', nameArabic: 'الزهرة', element: 'earth' as const },
} as const;

// Planetary relationships (for Planetary-Cosmic method)
export const PLANETARY_RELATIONSHIPS: Record<string, {
  friendly: string[];
  neutral: string[];
  opposing: string[];
}> = {
  Sun: {
    friendly: ['Moon', 'Mars', 'Jupiter'],
    neutral: ['Mercury', 'Venus'],
    opposing: ['Saturn']
  },
  Moon: {
    friendly: ['Sun', 'Mercury', 'Venus'],
    neutral: ['Mars', 'Jupiter'],
    opposing: ['Saturn']
  },
  Mars: {
    friendly: ['Sun', 'Jupiter'],
    neutral: ['Venus'],
    opposing: ['Mercury', 'Moon', 'Saturn']
  },
  Mercury: {
    friendly: ['Sun', 'Venus', 'Moon'],
    neutral: ['Jupiter'],
    opposing: ['Mars']
  },
  Jupiter: {
    friendly: ['Sun', 'Moon', 'Mars'],
    neutral: ['Mercury', 'Saturn'],
    opposing: ['Venus']
  },
  Venus: {
    friendly: ['Mercury', 'Saturn', 'Moon'],
    neutral: ['Mars', 'Sun'],
    opposing: ['Jupiter']
  },
  Saturn: {
    friendly: ['Mercury', 'Venus'],
    neutral: ['Jupiter'],
    opposing: ['Sun', 'Moon', 'Mars']
  }
};
