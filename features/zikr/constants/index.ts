/**
 * Zikr Module Constants
 * =====================
 * Preset data for Ṣalawāt, Divine Names, and default configurations.
 * Based on web app's Ramadan Challenge presets.
 */

import type {
    ChallengeConfig,
    ChallengeType,
    ChallengeTypeStyle,
    DivineNameOption,
    SalawatPreset,
    SessionTag
} from '../types';

// ─── Session Tags ────────────────────────────────────────────────────────────────

export const SESSION_TAGS: SessionTag[] = [
  'Fajr',
  'Ḍuḥā / Morning',
  'Ẓuhr',
  'ʿAṣr',
  'Maghrib / Ifṭār',
  'ʿIshāʾ / Tarāwīḥ',
  'Other'
];

// ─── Default Values ──────────────────────────────────────────────────────────────

export const DEFAULT_QUICK_ADD_PRESETS = [33, 100, 313, 500, 1000];

export const STORAGE_KEY = 'zikr_challenges_v1';

// ─── Category Styles ─────────────────────────────────────────────────────────────

export const CHALLENGE_TYPE_STYLES: Record<ChallengeType, ChallengeTypeStyle> = {
  ISTIGHFAR: {
    bg: 'rgba(56, 142, 60, 0.15)',
    text: '#4CAF50',
    accent: '#388E3C',
    icon: '🤲',
    labelEn: 'Istighfār',
    labelFr: 'Istighfār',
  },
  SALAWAT: {
    bg: 'rgba(33, 150, 243, 0.15)',
    text: '#2196F3',
    accent: '#1976D2',
    icon: '💚',
    labelEn: 'Ṣalawāt',
    labelFr: 'Ṣalawāt',
  },
  DIVINE_NAME: {
    bg: 'rgba(156, 39, 176, 0.15)',
    text: '#AB47BC',
    accent: '#7B1FA2',
    icon: '✨',
    labelEn: 'Divine Name',
    labelFr: 'Nom Divin',
  },
  CUSTOM: {
    bg: 'rgba(255, 152, 0, 0.15)',
    text: '#FF9800',
    accent: '#F57C00',
    icon: '📿',
    labelEn: 'Custom Wird',
    labelFr: 'Wird Personnalisé',
  },
  PROPHETIC_NAMES: {
    bg: 'rgba(212, 175, 55, 0.15)',
    text: '#D4AF37',
    accent: '#B8860B',
    icon: '🕌',
    labelEn: '201 Names',
    labelFr: '201 Noms',
  },
};

// ─── Istighfār Default ───────────────────────────────────────────────────────────

export const ISTIGHFAR_CONFIG: ChallengeConfig = {
  title: 'Istighfār',
  arabicText: 'أَسْتَغْفِرُ اللّٰهَ',
  transliteration: 'Astaghfiru-llāh',
  meaning: 'I seek forgiveness from Allah',
  meaningFr: 'Je demande pardon à Allah',
  dailyTarget: 100,
  totalTarget: 3000,
  quickAddPresets: [33, 100, 500, 1000],
};

// ─── Ṣalawāt Presets ─────────────────────────────────────────────────────────────

export const SALAWAT_PRESETS: SalawatPreset[] = [
  {
    id: 'salawat_ibrahimiyya',
    title: 'Ṣalāt al-Ibrāhīmiyya',
    titleFr: 'Salat al-Ibrahimiyya',
    tradition: 'Ṣaḥīḥ al-Bukhārī',
    traditionFr: 'Sahih al-Bukhari',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīm wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīm wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd.',
    meaning: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious.',
    meaningFr: 'Ô Allah, prie sur Muhammad et sur la famille de Muhammad, comme Tu as prié sur Ibrahim et sur la famille d\'Ibrahim. Tu es certes Digne de louange et de gloire. Ô Allah, bénis Muhammad et la famille de Muhammad, comme Tu as béni Ibrahim et la famille d\'Ibrahim. Tu es certes Digne de louange et de gloire.',
    quickAddPresets: [10, 33, 100, 500],
    recommendedDaily: 100,
    note: 'The prayer taught by the Prophet ﷺ himself, recited in every prayer.',
    noteFr: 'La prière enseignée par le Prophète ﷺ lui-même, récitée dans chaque prière.',
  },
  {
    id: 'salawat_simple',
    title: 'Ṣalāt Mufrada',
    titleFr: 'Salat Mufrada',
    tradition: 'Universal',
    traditionFr: 'Universel',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    transliteration: 'Allāhumma ṣalli ʿalā Sayyidinā Muḥammad',
    meaning: 'O Allah, send prayers upon our master Muhammad',
    meaningFr: 'Ô Allah, prie sur notre maître Muhammad',
    quickAddPresets: [33, 100, 500, 1000],
    recommendedDaily: 500,
    note: 'Simple and beautiful. Ideal for high-count recitation.',
    noteFr: 'Simple et magnifique. Idéal pour la récitation en grand nombre.',
  },
  {
    id: 'salawat_fatih',
    title: 'Ṣalāt al-Fātiḥ',
    titleFr: 'Salat al-Fatih',
    tradition: 'Tijāniyya',
    traditionFr: 'Tijaniyya',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā Sayyidinā Muḥammadin-il-Fātiḥi limā ughliq, wal-Khātimi limā sabaq, Nāṣir-il-Ḥaqqi bil-Ḥaqq, wal-Hādī ilā Ṣirāṭika-l-Mustaqīm, wa ʿalā ālihī ḥaqqa qadrihī wa miqdārihī-l-ʿaẓīm.',
    meaning: 'O Allah, send prayers upon our master Muhammad, the Opener of what was closed, the Seal of what preceded, the Helper of truth by truth, the Guide to Your Straight Path, and upon his family, according to his immense worth and measure.',
    meaningFr: 'Ô Allah, prie sur notre maître Muhammad, l\'Ouvreur de ce qui était fermé, le Sceau de ce qui a précédé, le Secoureur de la vérité par la vérité, le Guide vers Ton Chemin Droit, et sur sa famille, selon sa valeur et sa mesure immenses.',
    quickAddPresets: [12, 33, 100, 313],
    recommendedDaily: 100,
    note: 'One recitation equals 6,000 other prayers upon the Prophet ﷺ.',
    noteFr: 'Une récitation équivaut à 6 000 autres prières sur le Prophète ﷺ.',
  },
  {
    id: 'salawat_nariyya',
    title: 'Ṣalāt al-Nāriyya',
    titleFr: 'Salat al-Nariyya',
    tradition: 'Imam al-Qurṭubī',
    traditionFr: 'Imam al-Qurtubi',
    arabicText: 'اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ وَتُقْضَى بِهِ الْحَوَائِجُ وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِمِ وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ وَعَلَى آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ',
    transliteration: 'Allāhumma ṣalli ṣalātan kāmilatan wa sallim salāman tāmman ʿalā Sayyidinā Muḥammad-il-ladhī tanḥallu bihī-l-ʿuqad, wa tanfariju bihī-l-kurab, wa tuqḍā bihī-l-ḥawāʾij, wa tunālu bihī-r-raghāʾib wa ḥusn-ul-khawātim, wa yustasqā-l-ghamāmu bi-wajhihī-l-karīm, wa ʿalā ālihī wa ṣaḥbihī fī kulli lamḥatin wa nafasin bi-ʿadadi kulli maʿlūmin lak.',
    meaning: 'O Allah, send a complete prayer and perfect peace upon our master Muhammad, by whom knots are untied, hardships are relieved, needs are fulfilled, wishes are attained along with good endings, and rain is sought through his noble face; and upon his family and companions, in every glance and breath, by the number of everything known to You.',
    meaningFr: 'Ô Allah, envoie une prière complète et une paix parfaite sur notre maître Muhammad, par qui les nœuds sont dénoués, les difficultés sont soulagées, les besoins sont satisfaits, les souhaits sont atteints ainsi que les bonnes fins, et la pluie est demandée par son noble visage ; et sur sa famille et ses compagnons, à chaque regard et souffle, par le nombre de tout ce qui T\'est connu.',
    quickAddPresets: [11, 33, 100, 4444],
    recommendedDaily: 100,
    note: 'The "Fiery Prayer" - known for solving difficulties. Recite 4,444× for urgent needs.',
    noteFr: 'La "Prière Ardente" - connue pour résoudre les difficultés. Récitez 4 444× pour les besoins urgents.',
  },
  {
    id: 'salawat_mashishiyya',
    title: 'Ṣalāt al-Mashīshiyya',
    titleFr: 'Salat al-Mashishiyya',
    tradition: 'Shādhilī',
    traditionFr: 'Shadhili',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مَنْ مِنْهُ انْشَقَّتِ الْأَسْرَارُ وَانْفَلَقَتِ الْأَنْوَارُ وَفِيهِ ارْتَقَتِ الْحَقَائِقُ وَتَنَزَّلَتْ عُلُومُ آدَمَ فَأَعْجَزَ الْخَلَائِقَ',
    transliteration: 'Allāhumma ṣalli ʿalā man minhu-nshaqqa-til-asrār, wa-nfalaqati-l-anwār, wa fīhi-rtaqati-l-ḥaqāʾiq, wa tanazzalat ʿulūmu Ādam fa-aʿjazal-khalāʾiq.',
    meaning: 'O Allah, send prayers upon him from whom secrets burst forth and lights split open, in whom realities ascended and sciences of Adam descended, rendering all creation powerless.',
    meaningFr: 'Ô Allah, prie sur celui de qui les secrets ont jailli et les lumières se sont ouvertes, en qui les réalités se sont élevées et les sciences d\'Adam sont descendues, rendant toute la création impuissante.',
    quickAddPresets: [7, 33, 100],
    recommendedDaily: 33,
    note: 'A profound prayer connecting to the spiritual reality of the Prophet ﷺ.',
    noteFr: 'Une prière profonde connectant à la réalité spirituelle du Prophète ﷺ.',
  },
  {
    id: 'salawat_jawharatul_kamal',
    title: 'Jawharatu l-Kamāl',
    titleFr: 'Jawharatul Kamal',
    tradition: 'Tijāniyya',
    traditionFr: 'Tijaniyya',
    arabicText: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ وَالْيَاقُوتَةِ الْمُتَحَقِّقَةِ الْحَائِطَةِ بِمَرْكَزِ الْفُهُومِ وَالْمَعَانِي وَنُورِ الْأَكْوَانِ الْمُتَكَوِّنَةِ الْآدَمِيِّ صَاحِبِ الْحَقِّ الرَّبَّانِيِّ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā ʿayni-r-raḥmati-r-rabbāniyya, wal-yāqūtati-l-mutaḥaqqiqati-l-ḥāʾiṭati bi-markazi-l-fuhūmi wal-maʿānī, wa nūri-l-akwāni-l-mutakawwinati-l-ādamiyyi ṣāḥibi-l-ḥaqqi-r-rabbānī.',
    meaning: 'O Allah, send prayers and peace upon the Spring of Divine Mercy, and the Ruby of realized truth that encompasses the center of understandings and meanings, and the Light of all created beings of the Adamic human, the possessor of Divine Truth.',
    meaningFr: 'Ô Allah, prie et accorde la paix sur la Source de la Miséricorde Divine, et le Rubis de la vérité réalisée qui englobe le centre des compréhensions et des significations, et la Lumière de tous les êtres créés de l\'humain adamique, le possesseur de la Vérité Divine.',
    quickAddPresets: [7, 12, 33, 100],
    recommendedDaily: 12,
    note: 'The Jewel of Perfection. Requires wuḍūʾ and facing qibla traditionally.',
    noteFr: 'Le Joyau de la Perfection. Traditionnellement, nécessite les ablutions et de faire face à la qibla.',
  },
];

// ─── Divine Name Options ─────────────────────────────────────────────────────────

export const DIVINE_NAME_OPTIONS: DivineNameOption[] = [
  {
    id: 'rahim',
    arabicName: 'يَا رَحِيم',
    transliteration: 'Yā Raḥīm',
    meaning: 'O Most Merciful',
    meaningFr: 'Ô Très Miséricordieux',
    recommendedDaily: 500,
  },
  {
    id: 'razzaq',
    arabicName: 'يَا رَزَّاق',
    transliteration: 'Yā Razzāq',
    meaning: 'O Provider',
    meaningFr: 'Ô Pourvoyeur',
    recommendedDaily: 500,
  },
  {
    id: 'ghaffar',
    arabicName: 'يَا غَفَّار',
    transliteration: 'Yā Ghaffār',
    meaning: 'O Oft-Forgiving',
    meaningFr: 'Ô Grand Pardonneur',
    recommendedDaily: 500,
  },
  {
    id: 'latif',
    arabicName: 'يَا لَطِيف',
    transliteration: 'Yā Laṭīf',
    meaning: 'O Most Subtle, Most Kind',
    meaningFr: 'Ô Très Subtil, Très Bienveillant',
    recommendedDaily: 129,
  },
  {
    id: 'wadud',
    arabicName: 'يَا وَدُود',
    transliteration: 'Yā Wadūd',
    meaning: 'O Most Loving',
    meaningFr: 'Ô Très Aimant',
    recommendedDaily: 500,
  },
  {
    id: 'karim',
    arabicName: 'يَا كَرِيم',
    transliteration: 'Yā Karīm',
    meaning: 'O Most Generous',
    meaningFr: 'Ô Très Généreux',
    recommendedDaily: 500,
  },
  {
    id: 'fattah',
    arabicName: 'يَا فَتَّاح',
    transliteration: 'Yā Fattāḥ',
    meaning: 'O Opener of Ways',
    meaningFr: 'Ô Ouvreur des Voies',
    recommendedDaily: 489,
  },
  {
    id: 'nur',
    arabicName: 'يَا نُور',
    transliteration: 'Yā Nūr',
    meaning: 'O Light',
    meaningFr: 'Ô Lumière',
    recommendedDaily: 500,
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────────

/** Generate UUID */
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/** Get today's date as ISO string */
export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

/** Check if date is today */
export const isToday = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  return dateStr === getToday();
};

/** Check if date is yesterday */
export const isYesterday = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
};

/** Calculate streak based on last logged date */
export const calculateStreak = (
  lastLoggedDate: string | null,
  currentStreak: number,
  todayDate: string
): number => {
  if (!lastLoggedDate) return 1;
  if (lastLoggedDate === todayDate) return currentStreak;
  if (isYesterday(lastLoggedDate)) return currentStreak + 1;
  return 1; // Reset streak if gap > 1 day
};

/** Format number with locale */
export const formatNumber = (num: number, locale: string = 'en'): string => {
  return num.toLocaleString(locale);
};

/** Compute percentage */
export const computePercent = (progress: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((progress / target) * 100));
};
