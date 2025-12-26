/**
 * Script to fetch all 114 Qur'an Surahs from free API
 * Source: Al Quran Cloud API (free, no auth required)
 */

interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Al Quran Cloud API endpoint (free, no auth)
const API_URL = 'https://api.alquran.cloud/v1/surah';

async function fetchQuranSurahs() {
  try {
    console.log('Fetching Qur\'an Surahs from API...');
    
    // Fetch all surahs metadata
    const surahs: any[] = [];
    
    for (let i = 1; i <= 114; i++) {
      const response = await fetch(`${API_URL}/${i}`);
      const data = await response.json();
      
      if (data.code !== 200 || !data.data) {
        throw new Error(`Failed to fetch surah ${i}`);
      }
      
      const surah = data.data;
      
      surahs.push({
        number: surah.number,
        name: {
          arabic: surah.name,
          transliteration: surah.englishName,
          en: surah.englishNameTranslation,
          fr: '', // Will need French translation
        },
        totalAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType as 'Meccan' | 'Medinan',
        rukus: surah.numberOfRukus || Math.ceil(surah.numberOfAyahs / 10), // Estimate if not available
      });
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (i % 10 === 0) {
        console.log(`Fetched ${i}/114 surahs...`);
      }
    }

    console.log(`✅ Fetched all ${surahs.length} Surahs`);
    
    // Generate TypeScript code
    const tsCode = generateTypeScriptFile(surahs);
    console.log('\n--- Copy this to data/quran-surahs.ts ---\n');
    console.log(tsCode);
    
  } catch (error) {
    console.error('Error fetching surahs:', error);
  }
}

function generateTypeScriptFile(surahs: any[]): string {
  const header = `/**
 * Complete 114 Qur'an Surahs Database
 * Generated from Al Quran Cloud API
 */

export interface Surah {
  number: number;
  name: {
    arabic: string;
    transliteration: string;
    en: string;
    fr: string;
  };
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  rukus: number;
}

export const QURAN_SURAHS: Surah[] = `;

  const data = JSON.stringify(surahs, null, 2);
  
  const helpers = `;

// Helper functions
export function getSurahByNumber(number: number): Surah | undefined {
  if (number < 1 || number > 114) return undefined;
  return QURAN_SURAHS.find(s => s.number === number);
}

export function getAllSurahs(): Surah[] {
  return QURAN_SURAHS;
}

export function validateAyah(surahNumber: number, ayahNumber: number): boolean {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return false;
  return ayahNumber >= 1 && ayahNumber <= surah.totalAyahs;
}

export function generateQuranLink(surahNumber: number, ayahNumber?: number): string {
  if (ayahNumber) {
    return \`https://quran.com/\${surahNumber}/\${ayahNumber}\`;
  }
  return \`https://quran.com/\${surahNumber}\`;
}
`;

  return header + data + helpers;
}

// Run the script
fetchQuranSurahs();
