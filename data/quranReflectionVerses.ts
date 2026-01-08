/**
 * Qur'an Reflection Verses Dataset
 * =================================
 * Curated verses for Divine Timing reflection
 * 
 * IMPORTANT: These verses are for spiritual reflection only.
 * They do NOT constitute tafsir or religious rulings.
 */

import { ElementalTone } from '@/types/divine-timing';

export interface QuranReflectionVerse {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahNameEn: string;
  surahNameAr: string;
  arabicText: string;
  translationEn: string;
  translationFr: string;
  tags: string[];
  elements?: ElementalTone[];
  cycleStates?: string[];
}

/**
 * Curated dataset of verses for reflection
 * Each verse is tagged for thematic alignment with intentions and cycles
 */
export const QURAN_REFLECTION_VERSES: QuranReflectionVerse[] = [
  // Trust & Patience
  {
    id: 'trust-1',
    surahNumber: 2,
    ayahNumber: 286,
    surahNameEn: 'Al-Baqarah',
    surahNameAr: 'البقرة',
    arabicText: 'لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translationEn: 'Allah does not burden a soul beyond that it can bear.',
    translationFr: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    tags: ['patience', 'trust', 'rest', 'general'],
    elements: ['water', 'earth'],
    cycleStates: ['review / restraint', 'completion / closure'],
  },
  
  // New Beginnings
  {
    id: 'start-1',
    surahNumber: 94,
    ayahNumber: 5,
    surahNameEn: 'Ash-Sharh',
    surahNameAr: 'الشرح',
    arabicText: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translationEn: 'For indeed, with hardship comes ease.',
    translationFr: 'Avec la difficulté vient certes une facilité.',
    tags: ['start', 'patience', 'trust', 'general'],
    elements: ['fire', 'air'],
    cycleStates: ['initiation', 'growth / expansion'],
  },
  
  // Knowledge & Study
  {
    id: 'study-1',
    surahNumber: 20,
    ayahNumber: 114,
    surahNameEn: 'Ta-Ha',
    surahNameAr: 'طه',
    arabicText: 'وَقُل رَّبِّ زِدْنِى عِلْمًا',
    translationEn: 'And say, "My Lord, increase me in knowledge."',
    translationFr: 'Et dis : « Seigneur, accroît mes connaissances. »',
    tags: ['study', 'start', 'general'],
    elements: ['air', 'fire'],
    cycleStates: ['initiation', 'growth / expansion'],
  },
  
  // Travel & Journey
  {
    id: 'travel-1',
    surahNumber: 29,
    ayahNumber: 69,
    surahNameEn: 'Al-Ankabut',
    surahNameAr: 'العنكبوت',
    arabicText: 'وَٱلَّذِينَ جَـٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
    translationEn: 'And those who strive for Us - We will surely guide them to Our ways.',
    translationFr: 'Et ceux qui luttent pour Notre cause, Nous les guiderons certes sur Nos sentiers.',
    tags: ['travel', 'start', 'trust', 'general'],
    elements: ['fire', 'air'],
    cycleStates: ['initiation', 'growth / expansion'],
  },
  
  // Communication & Wisdom
  {
    id: 'communication-1',
    surahNumber: 16,
    ayahNumber: 125,
    surahNameEn: 'An-Nahl',
    surahNameAr: 'النحل',
    arabicText: 'ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلْحِكْمَةِ وَٱلْمَوْعِظَةِ ٱلْحَسَنَةِ',
    translationEn: 'Invite to the way of your Lord with wisdom and good instruction.',
    translationFr: 'Appelle au sentier de ton Seigneur avec sagesse et belle exhortation.',
    tags: ['communication', 'study', 'general'],
    elements: ['air', 'water'],
    cycleStates: ['growth / expansion', 'review / restraint'],
  },
  
  // Relationships & Connection
  {
    id: 'relationship-1',
    surahNumber: 49,
    ayahNumber: 10,
    surahNameEn: 'Al-Hujurat',
    surahNameAr: 'الحجرات',
    arabicText: 'إِنَّمَا ٱلْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا۟ بَيْنَ أَخَوَيْكُمْ',
    translationEn: 'The believers are but brothers, so make reconciliation between your brothers.',
    translationFr: 'Les croyants ne sont que des frères, établissez donc la paix entre vos frères.',
    tags: ['relationship', 'communication', 'general'],
    elements: ['water', 'earth'],
    cycleStates: ['growth / expansion', 'review / restraint'],
  },
  
  // Rest & Reflection
  {
    id: 'rest-1',
    surahNumber: 13,
    ayahNumber: 28,
    surahNameEn: 'Ar-Ra\'d',
    surahNameAr: 'الرعد',
    arabicText: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
    translationEn: 'Verily, in the remembrance of Allah do hearts find rest.',
    translationFr: "N'est-ce point par l'évocation d'Allah que les cœurs se tranquillisent ?",
    tags: ['rest', 'trust', 'general'],
    elements: ['water', 'earth'],
    cycleStates: ['review / restraint', 'completion / closure'],
  },
  
  // Patience & Perseverance
  {
    id: 'patience-1',
    surahNumber: 103,
    ayahNumber: 3,
    surahNameEn: 'Al-Asr',
    surahNameAr: 'العصر',
    arabicText: 'وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ',
    translationEn: 'And advised each other to truth and advised each other to patience.',
    translationFr: 'Et se recommandent mutuellement la vérité et se recommandent mutuellement la patience.',
    tags: ['patience', 'study', 'general'],
    elements: ['earth', 'water'],
    cycleStates: ['review / restraint', 'growth / expansion'],
  },
  
  // Divine Guidance
  {
    id: 'guidance-1',
    surahNumber: 1,
    ayahNumber: 6,
    surahNameEn: 'Al-Fatihah',
    surahNameAr: 'الفاتحة',
    arabicText: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
    translationEn: 'Guide us to the straight path.',
    translationFr: 'Guide-nous sur le droit chemin.',
    tags: ['trust', 'start', 'travel', 'general'],
    elements: ['fire', 'air'],
    cycleStates: ['initiation', 'growth / expansion'],
  },
  
  // Gratitude & Provision
  {
    id: 'gratitude-1',
    surahNumber: 14,
    ayahNumber: 7,
    surahNameEn: 'Ibrahim',
    surahNameAr: 'إبراهيم',
    arabicText: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    translationEn: 'If you are grateful, I will surely increase you [in favor].',
    translationFr: "Si vous êtes reconnaissants, J'augmenterai certes [Mes bienfaits] pour vous.",
    tags: ['general', 'rest', 'start'],
    elements: ['water', 'earth'],
    cycleStates: ['completion / closure', 'initiation'],
  },
  
  // Completion & Closure
  {
    id: 'completion-1',
    surahNumber: 5,
    ayahNumber: 3,
    surahNameEn: 'Al-Ma\'idah',
    surahNameAr: 'المائدة',
    arabicText: 'ٱلْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ',
    translationEn: 'This day I have perfected for you your religion.',
    translationFr: "Aujourd'hui, J'ai parachevé pour vous votre religion.",
    tags: ['general', 'study'],
    elements: ['earth', 'water'],
    cycleStates: ['completion / closure'],
  },
  
  // Seeking Help
  {
    id: 'help-1',
    surahNumber: 2,
    ayahNumber: 45,
    surahNameEn: 'Al-Baqarah',
    surahNameAr: 'البقرة',
    arabicText: 'وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ',
    translationEn: 'And seek help through patience and prayer.',
    translationFr: 'Et cherchez secours dans la patience et la prière.',
    tags: ['patience', 'rest', 'trust', 'general'],
    elements: ['water', 'earth'],
    cycleStates: ['review / restraint', 'completion / closure'],
  },
  
  // Action & Initiative
  {
    id: 'action-1',
    surahNumber: 13,
    ayahNumber: 11,
    surahNameEn: 'Ar-Ra\'d',
    surahNameAr: 'الرعد',
    arabicText: 'إِنَّ ٱللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا۟ مَا بِأَنفُسِهِمْ',
    translationEn: 'Indeed, Allah will not change the condition of a people until they change what is in themselves.',
    translationFr: "Allah ne modifie point l'état d'un peuple tant qu'ils ne modifient pas ce qui est en eux-mêmes.",
    tags: ['start', 'study', 'general'],
    elements: ['fire', 'air'],
    cycleStates: ['initiation', 'growth / expansion'],
  },
  
  // Trust in Divine Plan
  {
    id: 'trust-2',
    surahNumber: 65,
    ayahNumber: 3,
    surahNameEn: 'At-Talaq',
    surahNameAr: 'الطلاق',
    arabicText: 'وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ',
    translationEn: 'And whoever relies upon Allah - then He is sufficient for him.',
    translationFr: 'Et quiconque place sa confiance en Allah, Il lui suffit.',
    tags: ['trust', 'patience', 'rest', 'general'],
    elements: ['water', 'earth'],
    cycleStates: ['review / restraint', 'completion / closure'],
  },
  
  // Clarity & Understanding
  {
    id: 'clarity-1',
    surahNumber: 39,
    ayahNumber: 9,
    surahNameEn: 'Az-Zumar',
    surahNameAr: 'الزمر',
    arabicText: 'قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ',
    translationEn: 'Say, "Are those who know equal to those who do not know?"',
    translationFr: 'Dis : « Sont-ils égaux, ceux qui savent et ceux qui ne savent pas ? »',
    tags: ['study', 'communication', 'general'],
    elements: ['air', 'fire'],
    cycleStates: ['growth / expansion', 'initiation'],
  },
  
  // Mercy & Compassion
  {
    id: 'mercy-1',
    surahNumber: 21,
    ayahNumber: 107,
    surahNameEn: 'Al-Anbya',
    surahNameAr: 'الأنبياء',
    arabicText: 'وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةً لِّلْعَـٰلَمِينَ',
    translationEn: 'And We have not sent you, [O Muhammad], except as a mercy to the worlds.',
    translationFr: "Et Nous ne t'avons envoyé qu'en miséricorde pour l'univers.",
    tags: ['relationship', 'communication', 'general'],
    elements: ['water', 'air'],
    cycleStates: ['growth / expansion'],
  },
  
  // Steadfastness
  {
    id: 'steadfast-1',
    surahNumber: 41,
    ayahNumber: 30,
    surahNameEn: 'Fussilat',
    surahNameAr: 'فصلت',
    arabicText: 'إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَـٰمُوا۟',
    translationEn: 'Indeed, those who have said, "Our Lord is Allah," and then remained steadfast.',
    translationFr: "Ceux qui disent : « Notre Seigneur est Allah », et qui se tiennent dans le droit chemin.",
    tags: ['patience', 'trust', 'general'],
    elements: ['earth', 'fire'],
    cycleStates: ['growth / expansion', 'review / restraint'],
  },
  
  // Ease After Hardship
  {
    id: 'ease-1',
    surahNumber: 94,
    ayahNumber: 6,
    surahNameEn: 'Ash-Sharh',
    surahNameAr: 'الشرح',
    arabicText: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translationEn: 'Indeed, with hardship comes ease.',
    translationFr: 'Oui, avec la difficulté vient une facilité.',
    tags: ['patience', 'trust', 'start', 'general'],
    elements: ['water', 'air'],
    cycleStates: ['completion / closure', 'initiation'],
  },
  
  // Remembrance
  {
    id: 'remembrance-1',
    surahNumber: 33,
    ayahNumber: 41,
    surahNameEn: 'Al-Ahzab',
    surahNameAr: 'الأحزاب',
    arabicText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ ٱللَّهَ ذِكْرًا كَثِيرًا',
    translationEn: 'O you who have believed, remember Allah with much remembrance.',
    translationFr: "Ô vous qui croyez ! Invoquez Allah d'une invocation abondante.",
    tags: ['rest', 'general', 'trust'],
    elements: ['water', 'earth'],
    cycleStates: ['review / restraint', 'completion / closure'],
  },
  
  // Hope & Optimism
  {
    id: 'hope-1',
    surahNumber: 39,
    ayahNumber: 53,
    surahNameEn: 'Az-Zumar',
    surahNameAr: 'الزمر',
    arabicText: 'لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ',
    translationEn: 'Do not despair of the mercy of Allah.',
    translationFr: "Ne désespérez pas de la miséricorde d'Allah.",
    tags: ['trust', 'patience', 'general'],
    elements: ['water', 'air'],
    cycleStates: ['review / restraint', 'initiation'],
  },
];

/**
 * Get verse by ID
 */
export function getVerseById(id: string): QuranReflectionVerse | undefined {
  return QURAN_REFLECTION_VERSES.find(v => v.id === id);
}

/**
 * Get verse by surah and ayah numbers
 */
export function getVerseBySurahAyah(
  surahNumber: number,
  ayahNumber: number
): QuranReflectionVerse | undefined {
  return QURAN_REFLECTION_VERSES.find(
    v => v.surahNumber === surahNumber && v.ayahNumber === ayahNumber
  );
}

/**
 * Get all verses with a specific tag
 */
export function getVersesByTag(tag: string): QuranReflectionVerse[] {
  return QURAN_REFLECTION_VERSES.filter(v => v.tags.includes(tag));
}
