/**
 * Name Destiny Calculator Service
 * Pure calculation logic - portable from web
 * Mobile Implementation - Expo Go 54
 */

import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjadMaps';
import { ELEMENTS, BURUJ } from '../constants/elements';
import { NameDestinyResult, PlanetaryHour } from '../types';

/**
 * Calculate digital root (Saghir) of a number
 */
export function digitalRoot(num: number): number {
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

/**
 * Modulo index for cycling through arrays
 */
export function modIndex(num: number, length: number): number {
  return ((num - 1) % length) + 1;
}

/**
 * Calculate Abjad value of Arabic text
 */
export function calculateAbjadValue(
  text: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): number {
  let total = 0;
  for (const char of text) {
    const value = abjad[char];
    if (value) {
      total += value;
    }
  }
  return total;
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
      color: '#FFD700'
    },
    2: {
      name: 'Moon',
      ar: 'القمر',
      fr: 'Lune',
      planet: 'Moon',
      color: '#C0C0C0'
    },
    3: {
      name: 'Mars',
      ar: 'المريخ',
      fr: 'Mars',
      planet: 'Mars',
      color: '#FF4500'
    },
    4: {
      name: 'Mercury',
      ar: 'عطارد',
      fr: 'Mercure',
      planet: 'Mercury',
      color: '#FFA500'
    },
    5: {
      name: 'Jupiter',
      ar: 'المشتري',
      fr: 'Jupiter',
      planet: 'Jupiter',
      color: '#4169E1'
    },
    6: {
      name: 'Venus',
      ar: 'الزهرة',
      fr: 'Vénus',
      planet: 'Venus',
      color: '#00CED1'
    },
    7: {
      name: 'Saturn',
      ar: 'زحل',
      fr: 'Saturne',
      planet: 'Saturn',
      color: '#8B4513'
    },
    8: {
      name: 'Sun',
      ar: 'الشمس',
      fr: 'Soleil',
      planet: 'Sun',
      color: '#FFD700'
    },
    9: {
      name: 'Moon',
      ar: 'القمر',
      fr: 'Lune',
      planet: 'Moon',
      color: '#C0C0C0'
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
  // Calculate person's Kabir
  const personKabir = calculateAbjadValue(personName, abjad);
  
  // Calculate mother's Kabir if provided
  const motherKabir = motherName ? calculateAbjadValue(motherName, abjad) : 0;
  
  // Total Kabir
  const totalKabir = personKabir + motherKabir;
  
  // Calculate Saghir (digital root)
  const saghir = digitalRoot(totalKabir);
  
  // Determine element (1-4)
  const elementIndex = modIndex(saghir, 4);
  const element = ELEMENTS[elementIndex];
  
  // Determine burj (1-12)
  const burjIndex = modIndex(totalKabir, 12);
  const burj = BURUJ[burjIndex];
  
  // Determine planetary hour
  const hour = getPlanetaryHour(saghir);
  
  return {
    personName,
    motherName,
    personKabir,
    motherKabir,
    totalKabir,
    saghir,
    element,
    burj,
    hour,
    timestamp: Date.now(),
    abjadSystem: abjad === ABJAD_MASHRIQI ? 'mashriqi' : 'maghribi'
  };
}
