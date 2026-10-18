/**
 * Script to fetch all 99 Divine Names from free API
 * Source: Free Islamic API
 */

// The stored abjadValue fields in data/divine-names.ts use the Mashriqi table
// (the shared one in constants/abjad-maps.ts); the helpers in that file convert
// them to the app-wide system (Maghribi by default) at runtime.
import { ABJAD_MASHRIQI } from '../constants/abjad-maps';

interface ApiDivineName {
  number: number;
  name: string;
  transliteration: string;
  en: { meaning: string };
  fr?: { meaning: string };
}

// Al Asmaa API endpoint (free)
const API_URL = 'https://api.aladhan.com/v1/asmaAlHusna';

// Calculate abjad value using our existing system
function calculateAbjadValue(arabic: string): number {
  let total = 0;
  for (const char of arabic) {
    if (ABJAD_MASHRIQI[char]) {
      total += ABJAD_MASHRIQI[char];
    }
  }
  return total;
}

async function fetchDivineNames() {
  try {
    console.log('Fetching Divine Names from API...');
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data.code !== 200 || !data.data) {
      throw new Error('Failed to fetch divine names');
    }

    const names = data.data.map((item: any, index: number) => {
      const number = index + 1;
      const arabic = item.name;
      const transliteration = item.transliteration;
      const meaningEn = item.en?.meaning || '';
      
      // Calculate abjad value
      const abjadValue = calculateAbjadValue(arabic);
      
      // Generate spiritual influence based on number
      const influence = generateSpiritualInfluence(number, meaningEn);
      
      return {
        number,
        arabic,
        transliteration,
        abjadValue,
        meaning: {
          en: meaningEn,
          fr: '', // Will need French translation API or manual addition
        },
        spiritualInfluence: {
          en: influence,
          fr: '',
        },
        reflection: {
          en: `Reflect on the attribute of ${meaningEn} in your life.`,
          fr: '',
        },
      };
    });

    console.log(`✅ Fetched ${names.length} Divine Names`);
    
    // Generate TypeScript code
    const tsCode = generateTypeScriptFile(names);
    console.log('\n--- Copy this to data/divine-names.ts ---\n');
    console.log(tsCode);
    
  } catch (error) {
    console.error('Error fetching divine names:', error);
  }
}

function generateSpiritualInfluence(number: number, meaning: string): string {
  // Generate contextual spiritual influence based on the meaning
  const influences: { [key: number]: string } = {
    1: 'Cultivates awareness of divine oneness and mercy in all aspects of life',
    2: 'Encourages compassion, forgiveness, and loving-kindness toward all creation',
    3: 'Promotes sovereignty over one\'s spiritual state and leadership through service',
    4: 'Inspires reverence, humility, and recognition of the sacred in daily life',
    5: 'Brings peace, harmony, and trust in divine protection',
    // Add more specific ones as needed
  };
  
  return influences[number] || `Deepens connection to the divine quality of ${meaning}`;
}

function generateTypeScriptFile(names: any[]): string {
  const header = `/**
 * Complete 99 Divine Names Database
 * Generated from Al Aladhan API
 * Stored abjadValue fields use the Mashriqi table; use the helpers at the end
 * of this file for values in the app-wide system (Maghribi by default).
 */

import {
  AbjadSystemKey,
  abjadSystemOfMap,
  getAbjadMap,
  getActiveAbjadMap,
  storedMashriqiValueForSystem,
} from '../constants/abjad-maps';

export interface DivineName {
  number: number;
  arabic: string;
  transliteration: string;
  abjadValue: number;
  meaning: {
    en: string;
    fr: string;
  };
  spiritualInfluence: {
    en: string;
    fr: string;
  };
  reflection: {
    en: string;
    fr: string;
  };
}

export const DIVINE_NAMES: DivineName[] = `;

  const data = JSON.stringify(names, null, 2);
  
  const helpers = `;

// Helper functions
//
// The abjadValue fields above are the stored (Mashriqi) values. The helpers
// return the Names with abjadValue in the app-wide system (Maghribi by default),
// so every tool that shows or matches a Name's value follows the user's choice.

const divineNamesBySystem: Partial<Record<AbjadSystemKey, DivineName[]>> = {};

export function getDivineNamesForSystem(abjad: Record<string, number> = getActiveAbjadMap()): DivineName[] {
  const key = abjadSystemOfMap(abjad);
  return (divineNamesBySystem[key] ??= DIVINE_NAMES.map((n) => ({
    ...n,
    abjadValue: storedMashriqiValueForSystem(n.abjadValue, n.arabic, getAbjadMap(key)),
  })));
}

export function getDivineNameByNumber(number: number, abjad: Record<string, number> = getActiveAbjadMap()): DivineName | undefined {
  return getDivineNamesForSystem(abjad).find(n => n.number === number);
}

export function findDivineNamesByValue(abjadValue: number, tolerance = 0, abjad: Record<string, number> = getActiveAbjadMap()): DivineName[] {
  return getDivineNamesForSystem(abjad).filter(n => Math.abs(n.abjadValue - abjadValue) <= tolerance);
}

export function getAllDivineNames(abjad: Record<string, number> = getActiveAbjadMap()): DivineName[] {
  return getDivineNamesForSystem(abjad);
}
`;

  return header + data + helpers;
}

// Run the script
fetchDivineNames();
