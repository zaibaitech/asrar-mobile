/**
 * Type Definitions for Name Destiny Feature
 * Mobile Implementation - Expo Go 54
 */

import { BurjData, ElementData } from '../constants/elements';
import { DivineResonanceResult } from '../services/divineResonance';

export interface NameDestinyResult {
  // Input names
  arabicName?: string;
  personName: string;
  motherName?: string;
  
  // Calculated values
  personKabir: number;
  motherKabir: number;
  totalKabir: number;
  saghir: number;
  tabIndex?: 1 | 2 | 3 | 4;
  burjIndex?: number;
  
  // Derived data
  element: ElementData;
  burj: BurjData;
  hour: PlanetaryHour;
  burjDay?: {
    en: string;
    ar: string;
    fr: string;
  };
  
  // Divine Name Resonance
  divineResonance?: DivineResonanceResult;
  
  // Metadata
  timestamp?: number;
  abjadSystem?: 'maghribi' | 'mashriqi';
}

export interface PlanetaryHour {
  name: string;
  ar: string;
  fr: string;
  planet: string;
  color: string;
  planetKey: string; // Translation key for planet name (e.g., 'planets.sun')
  dayKey: string; // Translation key for day name (e.g., 'days.sunday')
  day?: {
    en: string;
    ar: string;
    fr: string;
  };
}

export interface CalculationOptions {
  abjadSystem?: 'maghribi' | 'mashriqi';
  includeMother?: boolean;
}

export interface StoredCalculation extends NameDestinyResult {
  id: string;
  timestamp: number;
  isFavorite?: boolean;
}

export { BurjData, ElementData };

