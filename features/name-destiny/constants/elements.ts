/**
 * Elements (Ṭabāʾiʿ) and Zodiac (Burūj) Constants
 * Mobile Implementation - Expo Go 54
 */

export interface ElementData {
  en: string;
  ar: string;
  fr: string;
  quality: string;
  color: string;
}

export interface BurjData {
  en: string;
  ar: string;
  fr: string;
  planet: string;
  element: string;
  ruler: string;
}

export const ELEMENTS: Record<number, ElementData> = {
  1: {
    en: 'Fire',
    ar: 'نار',
    fr: 'Feu',
    quality: 'Hot & Dry',
    color: '#ff6b6b'
  },
  2: {
    en: 'Earth',
    ar: 'تراب',
    fr: 'Terre',
    quality: 'Cold & Dry',
    color: '#8b5a3c'
  },
  3: {
    en: 'Air',
    ar: 'هواء',
    fr: 'Air',
    quality: 'Hot & Moist',
    color: '#4ecdc4'
  },
  4: {
    en: 'Water',
    ar: 'ماء',
    fr: 'Eau',
    quality: 'Cold & Moist',
    color: '#4a90e2'
  }
};

export const BURUJ: Record<number, BurjData> = {
  1: {
    en: 'Aries',
    ar: 'الحمل',
    fr: 'Bélier',
    planet: 'Mars',
    element: 'Fire',
    ruler: 'Mars'
  },
  2: {
    en: 'Taurus',
    ar: 'الثور',
    fr: 'Taureau',
    planet: 'Venus',
    element: 'Earth',
    ruler: 'Venus'
  },
  3: {
    en: 'Gemini',
    ar: 'الجوزاء',
    fr: 'Gémeaux',
    planet: 'Mercury',
    element: 'Air',
    ruler: 'Mercury'
  },
  4: {
    en: 'Cancer',
    ar: 'السرطان',
    fr: 'Cancer',
    planet: 'Moon',
    element: 'Water',
    ruler: 'Moon'
  },
  5: {
    en: 'Leo',
    ar: 'الأسد',
    fr: 'Lion',
    planet: 'Sun',
    element: 'Fire',
    ruler: 'Sun'
  },
  6: {
    en: 'Virgo',
    ar: 'العذراء',
    fr: 'Vierge',
    planet: 'Mercury',
    element: 'Earth',
    ruler: 'Mercury'
  },
  7: {
    en: 'Libra',
    ar: 'الميزان',
    fr: 'Balance',
    planet: 'Venus',
    element: 'Air',
    ruler: 'Venus'
  },
  8: {
    en: 'Scorpio',
    ar: 'العقرب',
    fr: 'Scorpion',
    planet: 'Mars',
    element: 'Water',
    ruler: 'Mars/Pluto'
  },
  9: {
    en: 'Sagittarius',
    ar: 'القوس',
    fr: 'Sagittaire',
    planet: 'Jupiter',
    element: 'Fire',
    ruler: 'Jupiter'
  },
  10: {
    en: 'Capricorn',
    ar: 'الجدي',
    fr: 'Capricorne',
    planet: 'Saturn',
    element: 'Earth',
    ruler: 'Saturn'
  },
  11: {
    en: 'Aquarius',
    ar: 'الدلو',
    fr: 'Verseau',
    planet: 'Saturn',
    element: 'Air',
    ruler: 'Saturn/Uranus'
  },
  12: {
    en: 'Pisces',
    ar: 'الحوت',
    fr: 'Poissons',
    planet: 'Jupiter',
    element: 'Water',
    ruler: 'Jupiter/Neptune'
  }
};
