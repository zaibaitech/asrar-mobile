/**
 * Daily Reminder Service
 * Combines authentic Islamic content with Ilm al-Huruf wisdom
 * 
 * SOURCES:
 * - Al-Quran Cloud API (https://alquran.cloud/api)
 * - Authentic Hadith collections
 * - Divine Names (Asma ul-Husna)
 * - Planetary wisdom from Maghribi system
 * - Element-based spiritual guidance
 */

import { ASMA_LIST } from '../utils/hadad-core';
import { getTodayBlessing } from './DayBlessingService';

export interface DailyReminder {
  type: 'quran' | 'hadith' | 'divine-name' | 'wisdom';
  textArabic: string;
  text: string;
  source: string;
  planetaryContext?: string;
  elementalWisdom?: string;
  dhikrRecommendation?: string;
}

// Authentic Hadith Collection (Sahih sources)
const AUTHENTIC_HADITH = [
  {
    textArabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih Bukhari 5027",
  },
  {
    textArabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    text: "This world is a prison for the believer and paradise for the disbeliever.",
    source: "Sahih Muslim 2956",
  },
  {
    textArabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    text: "The strong believer is better and more beloved to Allah than the weak believer.",
    source: "Sahih Muslim 2664",
  },
  {
    textArabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    text: "Whoever takes a path in search of knowledge, Allah will make easy for him the path to Paradise.",
    source: "Sahih Muslim 2699",
  },
  {
    textArabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    source: "Sahih Bukhari 6018",
  },
  {
    textArabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    text: "The Muslim is the one from whose tongue and hand the Muslims are safe.",
    source: "Sahih Bukhari 10",
  },
  {
    textArabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    text: "Your smile in the face of your brother is charity.",
    source: "Sunan al-Tirmidhi 1956",
  },
  {
    textArabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih Bukhari 13",
  },
  {
    textArabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    text: "The best of people are those most beneficial to others.",
    source: "Mu'jam al-Awsat 5787",
  },
  {
    textArabic: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا",
    text: "Indeed Allah is pure and accepts only that which is pure.",
    source: "Sahih Muslim 1015",
  },
];

// Quranic verses with context
const QURANIC_VERSES = [
  {
    textArabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    source: "Quran 13:28",
  },
  {
    textArabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    text: "And whoever is mindful of Allah, He will make a way out for them.",
    source: "Quran 65:2",
  },
  {
    textArabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    text: "Indeed, with hardship comes ease.",
    source: "Quran 94:5",
  },
  {
    textArabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    text: "And do not despair of the mercy of Allah.",
    source: "Quran 12:87",
  },
  {
    textArabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    text: "Indeed, Allah is with those who are patient.",
    source: "Quran 2:153",
  },
  {
    textArabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    text: "And seek help through patience and prayer.",
    source: "Quran 2:45",
  },
  {
    textArabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    text: "Indeed, Allah will not change the condition of a people until they change what is in themselves.",
    source: "Quran 13:11",
  },
  {
    textArabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    text: "And say: My Lord, increase me in knowledge.",
    source: "Quran 20:114",
  },
  {
    textArabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    text: "So remember Me; I will remember you.",
    source: "Quran 2:152",
  },
  {
    textArabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    text: "I did not create jinn and humans except to worship Me.",
    source: "Quran 51:56",
  },
];

// Traditional Islamic wisdom
const TRADITIONAL_WISDOM = [
  {
    textArabic: "الصَّبْرُ مِفْتَاحُ الْفَرَجِ",
    text: "Patience is the key to relief.",
    source: "Islamic Wisdom",
  },
  {
    textArabic: "الْعِلْمُ نُورٌ وَالْجَهْلُ ظَلَامٌ",
    text: "Knowledge is light and ignorance is darkness.",
    source: "Islamic Proverb",
  },
  {
    textArabic: "مَنْ عَرَفَ نَفْسَهُ فَقَدْ عَرَفَ رَبَّهُ",
    text: "Whoever knows themselves, knows their Lord.",
    source: "Sufi Wisdom",
  },
  {
    textArabic: "الْقَنَاعَةُ كَنْزٌ لَا يَفْنَى",
    text: "Contentment is a treasure that never perishes.",
    source: "Islamic Wisdom",
  },
  {
    textArabic: "لَا خَيْرَ فِي كَثْرَةِ الْكَلَامِ",
    text: "There is no good in excessive speech.",
    source: "Traditional Wisdom",
  },
];

/**
 * Get daily reminder with planetary and elemental context
 */
export async function getDailyReminder(): Promise<DailyReminder> {
  // Get current planetary day
  const blessing = getTodayBlessing();
  
  // Calculate which type of reminder to show based on day of week
  const dayOfWeek = new Date().getDay();
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  
  let reminder: DailyReminder;
  
  // Rotation: Quran (Sun, Wed), Hadith (Mon, Thu), Divine Name (Tue, Sat), Wisdom (Fri)
  if (dayOfWeek === 0 || dayOfWeek === 3) {
    // Quran
    const verse = QURANIC_VERSES[dayOfYear % QURANIC_VERSES.length];
    reminder = {
      type: 'quran',
      textArabic: verse.textArabic,
      text: verse.text,
      source: verse.source,
    };
  } else if (dayOfWeek === 1 || dayOfWeek === 4) {
    // Hadith
    const hadith = AUTHENTIC_HADITH[dayOfYear % AUTHENTIC_HADITH.length];
    reminder = {
      type: 'hadith',
      textArabic: hadith.textArabic,
      text: hadith.text,
      source: hadith.source,
    };
  } else if (dayOfWeek === 2 || dayOfWeek === 6) {
    // Divine Name
    const divineNameIndex = dayOfYear % ASMA_LIST.length;
    const divineName = ASMA_LIST[divineNameIndex];
    reminder = {
      type: 'divine-name',
      textArabic: divineName.ar,
      text: `${divineName.transliteration} - ${divineName.en}`,
      source: 'Asma ul-Husna',
      dhikrRecommendation: `Recite "${divineName.ar}" ${divineName.counts[0]} times`,
    };
  } else {
    // Traditional Wisdom (Friday)
    const wisdom = TRADITIONAL_WISDOM[dayOfYear % TRADITIONAL_WISDOM.length];
    reminder = {
      type: 'wisdom',
      textArabic: wisdom.textArabic,
      text: wisdom.text,
      source: wisdom.source,
    };
  }
  
  // Add planetary context
  reminder.planetaryContext = `${blessing.emoji} ${blessing.planet}'s Day - ${blessing.quality}`;
  
  // Add elemental wisdom based on today's element
  const elementalWisdom = {
    fire: "Today's fiery energy supports bold action and spiritual courage.",
    water: "Today's flowing energy favors emotional healing and intuition.",
    air: "Today's airy energy enhances communication and learning.",
    earth: "Today's grounding energy supports patience and building foundations.",
  };
  
  reminder.elementalWisdom = elementalWisdom[blessing.element];
  
  return reminder;
}

/**
 * Fetch verse from Al-Quran Cloud API (optional enhancement)
 * Can be called separately for random verses
 */
export async function fetchRandomQuranVerse(): Promise<{
  textArabic: string;
  text: string;
  source: string;
} | null> {
  try {
    // Random surah between 1-114
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${randomSurah}/editions/ar.alafasy,en.sahih`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch verse');
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.length >= 2) {
      const arabicData = data.data[0]; // Arabic
      const englishData = data.data[1]; // English
      
      // Get a random ayah from the surah
      const randomAyah = Math.floor(Math.random() * arabicData.ayahs.length);
      
      return {
        textArabic: arabicData.ayahs[randomAyah].text,
        text: englishData.ayahs[randomAyah].text,
        source: `Quran ${arabicData.ayahs[randomAyah].numberInSurah}:${arabicData.number}`,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Quran verse:', error);
    return null;
  }
}

/**
 * Get Divine Name for the day
 */
export function getDivineNameOfDay(): {
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
} {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  
  const divineNameIndex = dayOfYear % ASMA_LIST.length;
  const divineName = ASMA_LIST[divineNameIndex];
  
  return {
    arabic: divineName.ar,
    transliteration: divineName.transliteration,
    meaning: divineName.en,
    count: divineName.counts[0],
  };
}

/**
 * Get element-based dhikr recommendation
 */
export function getElementalDhikr(element: 'fire' | 'water' | 'air' | 'earth'): {
  dhikr: string;
  arabic: string;
  count: number;
  benefit: string;
} {
  const recommendations = {
    fire: {
      dhikr: 'Yā Qawiyy',
      arabic: 'يَا قَوِيّ',
      count: 116,
      benefit: 'Strengthens willpower and courage',
    },
    water: {
      dhikr: 'Yā Laṭīf',
      arabic: 'يَا لَطِيف',
      count: 129,
      benefit: 'Brings ease and softens hearts',
    },
    air: {
      dhikr: 'Yā ʿAlīm',
      arabic: 'يَا عَلِيم',
      count: 150,
      benefit: 'Increases knowledge and clarity',
    },
    earth: {
      dhikr: 'Yā Ṣabūr',
      arabic: 'يَا صَبُور',
      count: 298,
      benefit: 'Grants patience and steadfastness',
    },
  };
  
  return recommendations[element];
}
