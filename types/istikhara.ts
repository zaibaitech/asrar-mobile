// Istikhara API Request and Response Types
import type { BurujProfile } from '../services/istikhara/types';

export type Language = 'en' | 'fr' | 'ar';

export interface BirthProfile {
  dobISO: string;
  birthTime: string | null;
  hasBirthTime: boolean;
  timezone: string;
  birthLocation: {
    latitude: number;
    longitude: number;
    label?: string;
  } | null;
  sunSign: {
    burjAr: string;
    burjEn: string;
    burjIndex: number;
  };
}

export interface IstikharaRequest {
  personName: string;
  motherName: string;
  language?: Language;
}

export { BurujProfile };

export interface IstikharaData {
  personTotal: number;
  motherTotal: number;
  combinedTotal: number;
  burujRemainder: number;
  burujProfile: BurujProfile;
  repetitionCount: number;
  birthProfile?: BirthProfile;
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
