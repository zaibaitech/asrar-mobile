// Element color mappings for React Native
export const ElementColors = {
  fire: {
    primary: ['#ef4444', '#f97316', '#f59e0b'] as const,
    accent: '#ef4444',
    border: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
  },
  earth: {
    primary: ['#84cc16', '#a3e635', '#bef264'] as const,
    accent: '#84cc16',
    border: '#84cc16',
    background: 'rgba(132, 204, 22, 0.1)',
  },
  air: {
    primary: ['#06b6d4', '#22d3ee', '#67e8f9'] as const,
    accent: '#06b6d4',
    border: '#06b6d4',
    background: 'rgba(6, 182, 212, 0.1)',
  },
  water: {
    primary: ['#3b82f6', '#60a5fa', '#93c5fd'] as const,
    accent: '#3b82f6',
    border: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
  },
};

export function getElementColors(element: string) {
  const normalizedElement = element.toLowerCase() as keyof typeof ElementColors;
  return ElementColors[normalizedElement] || ElementColors.fire;
}
