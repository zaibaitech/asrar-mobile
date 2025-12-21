// Re-export types from services for component use
export * from '../../services/istikhara/types';

// Additional component-specific types
export interface ZodiacSign {
  en: string;
  fr: string;
  arabic: string;
}

export interface PracticeNight {
  primary: { en: string; fr: string };
  note?: { en: string; fr: string };
}
