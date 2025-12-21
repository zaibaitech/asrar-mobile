/**
 * Theme Context Provider for Istikhara Results
 * Manages element-based theming across the application
 */

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DarkTheme, ElementAccents } from '../constants/DarkTheme';

// Define the element type
export type ElementType = 'fire' | 'earth' | 'air' | 'water';

// Theme context type
interface ThemeContextType {
  element: ElementType;
  setElement: (element: ElementType) => void;
  theme: typeof DarkTheme;
  accent: {
    primary: string;
    secondary: string;
    gradient: readonly string[];
    glow: string;
    emoji: string;
  };
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
  initialElement?: ElementType;
}

/**
 * ThemeProvider component
 * Wrap your app or specific screens with this to provide theme context
 */
export function ThemeProvider({ children, initialElement = 'fire' }: ThemeProviderProps) {
  const [element, setElement] = useState<ElementType>(initialElement);
  
  const value: ThemeContextType = {
    element,
    setElement,
    theme: DarkTheme,
    accent: ElementAccents[element],
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 * 
 * @example
 * const { element, accent, theme } = useTheme();
 * <View style={{ backgroundColor: theme.cardBackground, borderColor: accent.primary }} />
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Hook to get element-specific accent colors
 * Useful when you need accent colors without full theme context
 * 
 * @example
 * const accent = useElementAccent('fire');
 * <Text style={{ color: accent.primary }}>Fire element</Text>
 */
export function useElementAccent(element: ElementType) {
  return ElementAccents[element];
}

export default ThemeProvider;
