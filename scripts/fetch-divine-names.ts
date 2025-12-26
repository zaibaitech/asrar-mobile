/**
 * Script to fetch all 99 Divine Names from free API
 * Source: Free Islamic API
 */

// Abjad Maghribi mapping (inlined to avoid import issues)
const ABJAD_MAGHRIBI: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
  'ب': 2,
  'ج': 3,
  'د': 4,
  'ه': 5, 'ة': 5,
  'و': 6,
  'ز': 7,
  'ح': 8,
  'ط': 9,
  'ي': 10, 'ى': 10,
  'ك': 20,
  'ل': 30,
  'م': 40,
  'ن': 50,
  'س': 60,
  'ع': 70,
  'ف': 80,
  'ص': 90,
  'ق': 100,
  'ر': 200,
  'ش': 300,
  'ت': 400,
  'ث': 500,
  'خ': 600,
  'ذ': 700,
  'ض': 800,
  'ظ': 900,
  'غ': 1000,
};

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
    if (ABJAD_MAGHRIBI[char]) {
      total += ABJAD_MAGHRIBI[char];
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
 * Abjad values calculated using Maghribi system
 */

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
export function getDivineNameByNumber(number: number): DivineName | undefined {
  return DIVINE_NAMES.find(n => n.number === number);
}

export function findDivineNamesByValue(abjadValue: number, tolerance = 0): DivineName[] {
  return DIVINE_NAMES.filter(n => Math.abs(n.abjadValue - abjadValue) <= tolerance);
}

export function getAllDivineNames(): DivineName[] {
  return DIVINE_NAMES;
}
`;

  return header + data + helpers;
}

// Run the script
fetchDivineNames();
