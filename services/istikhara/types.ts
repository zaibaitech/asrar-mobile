/**
 * TypeScript Interfaces for Istikhara Module
 * Istikharah al-Asmā' - Personal Spiritual Guidance
 */

export type ElementType = 'fire' | 'earth' | 'air' | 'water';

export interface BilingualText {
  en: string;
  fr: string;
}

export interface PersonalityProfile {
  en: {
    temperament: string;
    communication?: string;
    social_loved?: string;
    social_challenge?: string;
    social_unpopular?: string;
    social_attraction?: string;
    life_blessing?: string;
    divine_support?: string;
    challenge?: string;
    dreams: string;
    anger_pattern?: string;
    note?: string;
  };
  fr: {
    temperament: string;
    communication?: string;
    social_loved?: string;
    social_challenge?: string;
    social_unpopular?: string;
    social_attraction?: string;
    life_blessing?: string;
    divine_support?: string;
    challenge?: string;
    dreams: string;
    anger_pattern?: string;
    note?: string;
  };
}

export interface CareerCategory {
  category: string;
  icon: string;
  items: string[];
}

export interface CareerGuidance {
  traditional: BilingualText;
  modern_recommended: {
    en: CareerCategory[];
    fr: CareerCategory[];
  };
  avoid: {
    traditional: BilingualText;
    modern: BilingualText;
  };
  principle: BilingualText;
}

export interface BlessedDay {
  day: BilingualText;
  day_number: number | null;
  best_for: {
    en: string[];
    fr: string[];
  };
  special_notes?: {
    en: string[];
    fr: string[];
  };
  associated_prophet?: BilingualText & { arabic: string };
  note?: BilingualText;
  temporary_suggestion?: BilingualText;
}

export interface MonthlySadaqah {
  traditional: BilingualText;
  frequency: BilingualText;
  context?: BilingualText;
  purpose?: BilingualText;
  avoid_note?: BilingualText;
  modern_alternatives: {
    en: string[];
    fr: string[];
  };
}

export interface LifetimeSadaqah {
  traditional: BilingualText;
  components?: {
    en: string[];
    fr: string[];
  };
  best_timing: {
    en: string[];
    fr: string[];
  };
  significance?: BilingualText;
  cultural_note?: BilingualText;
  note?: BilingualText;
  technical_note?: BilingualText;
}

export interface SadaqahPractices {
  monthly: MonthlySadaqah;
  lifetime: LifetimeSadaqah;
}

export interface DivineNames {
  arabic: string;
  transliteration: string;
  translation: BilingualText;
}

export interface QuranicVerse {
  arabic: string;
  transliteration: string;
  translation: BilingualText;
  reference: string;
}

export interface Angel {
  arabic: string;
  transliteration: string;
  name?: BilingualText;
}

export interface Jinn {
  arabic: string;
  transliteration: string;
  meaning?: BilingualText;
}

export interface PracticeNight {
  primary: BilingualText;
  note?: BilingualText;
}

export interface ZodiacSign {
  en: string;
  fr: string;
  arabic: string;
  note?: BilingualText;
}

export interface SpiritualPractice {
  practice_night: PracticeNight;
  zodiac_sign: ZodiacSign | { en: string; fr: string; note?: BilingualText };
  divine_names: DivineNames | { note: BilingualText };
  quranic_verse?: QuranicVerse;
  angel: Angel;
  jinn: Jinn;
  instructions?: {
    en: string[];
    fr: string[];
  };
}

export interface BurujProfile {
  element: ElementType;
  element_emoji: string;
  element_number: number;
  colors: [string, string];
  personality: PersonalityProfile;
  career: CareerGuidance;
  blessed_day: BlessedDay;
  sadaqah: SadaqahPractices;
  spiritual_practice: SpiritualPractice;
}

export interface BurujData {
  buruj_data: {
    [key: string]: BurujProfile;
  };
}

export interface IstikharaCalculationResult {
  personName: string;
  motherName: string;
  personTotal: number;
  motherTotal: number;
  combinedTotal: number;
  burujRemainder: number;
  burujProfile: BurujProfile;
  repetitionCount: number;
}

export interface IstikharaFormData {
  personName: string;
  motherName: string;
}

export interface ElementColors {
  fire: [string, string];
  earth: [string, string];
  air: [string, string];
  water: [string, string];
}

export const ELEMENT_COLORS: ElementColors = {
  fire: ['#FF6B35', '#F7931E'],
  earth: ['#8B4513', '#6B8E23'],
  air: ['#87CEEB', '#4682B4'],
  water: ['#1E90FF', '#000080']
};

export const ELEMENT_EMOJI: Record<ElementType, string> = {
  fire: '🔥',
  earth: '🌍',
  air: '💨',
  water: '💧'
};

export const DAYS_OF_WEEK: { [key: number]: BilingualText } = {
  0: { en: 'Sunday', fr: 'Dimanche' },
  1: { en: 'Monday', fr: 'Lundi' },
  2: { en: 'Tuesday', fr: 'Mardi' },
  3: { en: 'Wednesday', fr: 'Mercredi' },
  4: { en: 'Thursday', fr: 'Jeudi' },
  5: { en: 'Friday', fr: 'Vendredi' },
  6: { en: 'Saturday', fr: 'Samedi' }
};
