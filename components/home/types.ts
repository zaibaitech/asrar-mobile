/**
 * Type definitions for Home Screen components
 */

import { ElementType } from '../../contexts/ThemeContext';

export interface ModuleCardProps {
  title: string;
  titleArabic: string;
  description: string;
  icon: string; // Emoji or icon name
  element: ElementType;
  onPress: () => void;
  comingSoon?: boolean;
}

export interface WidgetProps {
  title: string;
  value: string | number;
  icon: string;
  element?: ElementType;
  onPress?: () => void;
}

export interface DhikrCounterState {
  count: number;
  lastUpdated: Date;
}

export interface DailyQuote {
  text: string;
  textArabic?: string;
  source: string;
  date: string;
}

export interface BlessedDayInfo {
  dayName: string;
  dayNameArabic: string;
  blessing: string;
  element: ElementType;
}
