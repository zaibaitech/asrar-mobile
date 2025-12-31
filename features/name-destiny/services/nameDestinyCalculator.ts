/**
 * Name Destiny Calculator Service
 * Pure calculation logic - portable from web
 * Mobile Implementation - Expo Go 54
 */

import {
    calculateBurj,
    calculateDestiny as calculateCoreDestiny,
    calculateHadadKabir,
    calculateSaghir,
    calculateTabElement,
    normalizeArabic,
} from '@/utils/coreCalculations';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjadMaps';
import { BURUJ, ELEMENTS } from '../constants/elements';
import { NameDestinyResult, PlanetaryHour } from '../types';
import { computeDivineResonance } from './divineResonance';

/**
 * Calculate digital root (Ṣaghīr) of a number using shared logic
 */
export function digitalRoot(num: number): number {
  return calculateSaghir(num);
}

/**
 * 1-indexed modulo helper (preserves legacy API)
 */
export function modIndex(num: number, length: number): number {
  const remainder = num % length;
  return remainder === 0 ? length : remainder;
}

/**
 * Calculate Abjad/Hadad value for provided text
 */
export function calculateAbjadValue(
  text: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): number {
  return calculateHadadKabir(text, abjad);
}

/**
 * Get planetary day from planet name (Chaldean order)
 * Each planet rules a specific day of the week
 */
function getPlanetaryDay(planet: string): { en: string; ar: string; fr: string } {
  const planetDays: Record<string, { en: string; ar: string; fr: string }> = {
    'Sun': { en: 'Sunday', ar: 'الأحد', fr: 'Dimanche' },
    'Moon': { en: 'Monday', ar: 'الاثنين', fr: 'Lundi' },
    'Mars': { en: 'Tuesday', ar: 'الثلاثاء', fr: 'Mardi' },
    'Mercury': { en: 'Wednesday', ar: 'الأربعاء', fr: 'Mercredi' },
    'Jupiter': { en: 'Thursday', ar: 'الخميس', fr: 'Jeudi' },
    'Venus': { en: 'Friday', ar: 'الجمعة', fr: 'Vendredi' },
    'Saturn': { en: 'Saturday', ar: 'السبت', fr: 'Samedi' },
  };
  return planetDays[planet] || planetDays['Sun'];
}

/**
 * Get planetary hour from Saghir value
 */
function getPlanetaryHour(saghir: number): PlanetaryHour {
  const hours: Record<number, PlanetaryHour> = {
    1: {
      name: 'Sun',
      ar: 'الشمس',
      fr: 'Soleil',
      planet: 'Sun',
      color: '#FFD700',
      day: getPlanetaryDay('Sun')
    },
    2: {
      name: 'Moon',
      ar: 'القمر',
      fr: 'Lune',
      planet: 'Moon',
      color: '#C0C0C0',
      day: getPlanetaryDay('Moon')
    },
    3: {
      name: 'Mars',
      ar: 'المريخ',
      fr: 'Mars',
      planet: 'Mars',
      color: '#FF4500',
      day: getPlanetaryDay('Mars')
    },
    4: {
      name: 'Mercury',
      ar: 'عطارد',
      fr: 'Mercure',
      planet: 'Mercury',
      color: '#FFA500',
      day: getPlanetaryDay('Mercury')
    },
    5: {
      name: 'Jupiter',
      ar: 'المشتري',
      fr: 'Jupiter',
      planet: 'Jupiter',
      color: '#4169E1',
      day: getPlanetaryDay('Jupiter')
    },
    6: {
      name: 'Venus',
      ar: 'الزهرة',
      fr: 'Vénus',
      planet: 'Venus',
      color: '#00CED1',
      day: getPlanetaryDay('Venus')
    },
    7: {
      name: 'Saturn',
      ar: 'زحل',
      fr: 'Saturne',
      planet: 'Saturn',
      color: '#8B4513',
      day: getPlanetaryDay('Saturn')
    },
    8: {
      name: 'Sun',
      ar: 'الشمس',
      fr: 'Soleil',
      planet: 'Sun',
      color: '#FFD700',
      day: getPlanetaryDay('Sun')
    },
    9: {
      name: 'Moon',
      ar: 'القمر',
      fr: 'Lune',
      planet: 'Moon',
      color: '#C0C0C0',
      day: getPlanetaryDay('Moon')
    }
  };

  return hours[saghir] || hours[1];
}

/**
 * Main function: Build complete Name Destiny calculation
 */
export function buildDestiny(
  personName: string,
  motherName?: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): NameDestinyResult {
  const sanitizedPerson = normalizeArabic(personName);
  const sanitizedMother = motherName ? normalizeArabic(motherName) : '';

  const coreResult = calculateCoreDestiny(
    sanitizedPerson,
    sanitizedMother,
    abjad
  );

  const tabIndex = calculateTabElement(coreResult.combinedKabir);
  const burjIndex = calculateBurj(coreResult.combinedKabir);

  const element = ELEMENTS[tabIndex];
  const burj = BURUJ[burjIndex];
  const hour = getPlanetaryHour(coreResult.saghir);
  
  // Calculate burj's ruling planet day (e.g., Scorpio -> Mars -> Tuesday)
  const burjDay = getPlanetaryDay(burj.planet);

  // Calculate Divine Name Resonance for the person's name
  let divineResonance;
  try {
    divineResonance = computeDivineResonance(sanitizedPerson, abjad);
  } catch (error) {
    // If divine resonance calculation fails, continue without it
    console.warn('[NameDestiny] Divine resonance calculation failed:', error);
    divineResonance = undefined;
  }

  return {
    personName: coreResult.personName,
    motherName: coreResult.motherName || undefined,
    personKabir: coreResult.personKabir,
    motherKabir: coreResult.motherKabir,
    totalKabir: coreResult.combinedKabir,
    saghir: coreResult.saghir,
    element,
    burj,
    hour,
    burjDay,
    tabIndex,
    burjIndex,
    divineResonance,
    timestamp: Date.now(),
    abjadSystem: abjad === ABJAD_MASHRIQI ? 'mashriqi' : 'maghribi',
  };
}

if (__DEV__) {
  const baseline = calculateCoreDestiny('محمد', 'آمنة', ABJAD_MAGHRIBI);
  const baselineElement = calculateTabElement(baseline.combinedKabir);

  if (baselineElement !== 4) {
    console.warn('[NameDestiny] Baseline tab element expected Water (4)', {
      person: baseline.personName,
      mother: baseline.motherName,
      combinedKabir: baseline.combinedKabir,
      tabElement: baselineElement,
    });
  }
}
