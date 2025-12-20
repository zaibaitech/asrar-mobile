// Istikhara API Request and Response Types

export type Language = 'en' | 'fr' | 'ar';

export interface IstikharaRequest {
  personName: string;
  motherName: string;
  language?: Language;
}

export interface MultilingualText {
  en: string;
  fr: string;
  arabic: string;
}

export interface BurujPersonality {
  temperament: string;
  communication: string;
  loved_by: string;
  challenged_by: string;
  life_blessings: string;
  divine_support: string;
  dreams: string;
  anger: string;
}

export interface BurujCareer {
  categories: string[];
  recommended_industries: string[];
  careers_to_avoid: string[];
  guiding_principles: string[];
}

export interface BlessedDay {
  day: string;
  activities: string[];
  prophet: string;
  special_notes: string;
}

export interface Sadaqah {
  description: string;
  suggested_amount?: string;
  impact?: string;
}

export interface SpiritualPractices {
  divine_names: string[];
  dhikr_count: number;
  daily_practices: string[];
  timing: string;
}

export interface BurujProfile {
  buruj_number: number;
  sign: MultilingualText;
  element: string;
  planet: string;
  personality: BurujPersonality;
  career: BurujCareer;
  blessed_day: BlessedDay;
  monthly_sadaqah: Sadaqah;
  lifetime_sadaqah: Sadaqah;
  spiritual_practices: SpiritualPractices;
}

export interface IstikharaData {
  personTotal: number;
  motherTotal: number;
  combinedTotal: number;
  burujRemainder: number;
  burujProfile: BurujProfile;
  repetitionCount: number;
}

export interface IstikharaResponse {
  success: boolean;
  data: IstikharaData;
  timestamp: string;
}

export interface IstikharaError {
  success: false;
  error: string;
  message?: string;
}

// History item for AsyncStorage
export interface IstikharaHistoryItem {
  id: string;
  personName: string;
  motherName: string;
  result: IstikharaData;
  timestamp: string;
}
