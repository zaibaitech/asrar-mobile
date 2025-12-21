/**
 * Istikhara Color Palette - Matching Web App Design
 * Element-based color schemes with gradients, borders, and effects
 */

export const ElementColors = {
  fire: {
    // Gradients
    primary: ['#7f1d1d', '#c2410c', '#7f1d1d'], // from-red-900 via-orange-700 to-red-900
    light: ['#991b1b', '#ea580c', '#991b1b'], // lighter variant
    background: ['rgba(127, 29, 29, 0.4)', 'rgba(194, 65, 12, 0.3)', 'rgba(127, 29, 29, 0.2)'],
    bgGradient: ['rgba(127, 29, 29, 0.3)', 'rgba(194, 65, 12, 0.2)'], // for LinearGradient
    
    // Solid colors
    primarySolid: '#ef4444', // Single color for icons/text
    secondary: 'rgba(239, 68, 68, 0.2)', // for backgrounds
    border: '#fb923c', // border-red-400/50
    text: '#fecaca', // text-red-200
    textBright: '#fee2e2', // text-red-100
    accent: '#fdba74', // text-orange-300
    iconBg: 'rgba(239, 68, 68, 0.2)', // bg-red-500/20
    
    // Effects
    glow: 'rgba(239, 68, 68, 0.3)',
    progressColor: '#ef4444',
    pulseColor: '#ef4444',
  },
  
  earth: {
    // Gradients
    primary: ['#78350f', '#a16207', '#78350f'], // from-amber-900 via-yellow-700 to-amber-900
    light: ['#92400e', '#ca8a04', '#92400e'],
    background: ['rgba(120, 53, 15, 0.4)', 'rgba(161, 98, 7, 0.3)', 'rgba(120, 53, 15, 0.2)'],
    bgGradient: ['rgba(120, 53, 15, 0.3)', 'rgba(161, 98, 7, 0.2)'],
    
    // Solid colors
    primarySolid: '#f59e0b',
    secondary: 'rgba(245, 158, 11, 0.2)',
    border: '#fbbf24', // border-amber-400/50
    text: '#fde68a', // text-amber-200
    textBright: '#fef3c7', // text-amber-100
    accent: '#fde047', // text-yellow-300
    iconBg: 'rgba(245, 158, 11, 0.2)',
    
    // Effects
    glow: 'rgba(245, 158, 11, 0.3)',
    progressColor: '#f59e0b',
    pulseColor: '#f59e0b',
  },
  
  air: {
    // Gradients
    primary: ['#164e63', '#1e40af', '#164e63'], // from-cyan-900 via-blue-700 to-cyan-900
    light: ['#155e75', '#1d4ed8', '#155e75'],
    background: ['rgba(22, 78, 99, 0.4)', 'rgba(30, 64, 175, 0.3)', 'rgba(22, 78, 99, 0.2)'],
    bgGradient: ['rgba(22, 78, 99, 0.3)', 'rgba(30, 64, 175, 0.2)'],
    
    // Solid colors
    primarySolid: '#06b6d4',
    secondary: 'rgba(6, 182, 212, 0.2)',
    border: '#22d3ee', // border-cyan-400/50
    text: '#a5f3fc', // text-cyan-200
    textBright: '#cffafe', // text-cyan-100
    accent: '#93c5fd', // text-blue-300
    iconBg: 'rgba(6, 182, 212, 0.2)',
    
    // Effects
    glow: 'rgba(6, 182, 212, 0.3)',
    progressColor: '#06b6d4',
    pulseColor: '#06b6d4',
  },
  
  water: {
    // Gradients
    primary: ['#1e3a8a', '#4338ca', '#1e3a8a'], // from-blue-900 via-indigo-700 to-blue-900
    light: ['#1e40af', '#4f46e5', '#1e40af'],
    background: ['rgba(30, 58, 138, 0.4)', 'rgba(67, 56, 202, 0.3)', 'rgba(30, 58, 138, 0.2)'],
    bgGradient: ['rgba(30, 58, 138, 0.3)', 'rgba(67, 56, 202, 0.2)'],
    
    // Solid colors
    primarySolid: '#3b82f6',
    secondary: 'rgba(59, 130, 246, 0.2)',
    border: '#60a5fa', // border-blue-400/50
    text: '#bfdbfe', // text-blue-200
    textBright: '#dbeafe', // text-blue-100
    accent: '#a78bfa', // text-indigo-300
    iconBg: 'rgba(59, 130, 246, 0.2)',
    
    // Effects
    glow: 'rgba(59, 130, 246, 0.3)',
    progressColor: '#3b82f6',
    pulseColor: '#3b82f6',
  },
};

export const CommonColors = {
  // Background gradients
  formBg: ['rgba(15, 23, 42, 0.8)', 'rgba(30, 41, 59, 0.8)'], // from-slate-900/80 to-slate-800/80
  cardBg: 'rgba(0, 0, 0, 0.2)',
  overlayBg: 'rgba(0, 0, 0, 0.5)',
  
  // Borders
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderMedium: 'rgba(255, 255, 255, 0.2)',
  
  // Text
  white: '#ffffff',
  textLight: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  
  // Interactive
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const getElementColors = (element: 'fire' | 'earth' | 'air' | 'water') => {
  return ElementColors[element] || ElementColors.fire;
};
