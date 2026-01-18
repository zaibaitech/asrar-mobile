export type ManazilLanguage = 'en' | 'fr' | 'ar';

export type TrilingualText = {
  en: string;
  fr: string;
  ar: string;
};

export type Element = 'fire' | 'water' | 'air' | 'earth';

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';

export type DhikrPractice = {
  id: string;
  arabic: string;
  transliteration?: string;
  translation?: TrilingualText;
  count?: number;
  countNote?: TrilingualText;
  bestTimes?: TrilingualText;
  niyyah?: TrilingualText;
  benefitNote?: TrilingualText;
  audioAssetKey?: string;
  sourceNote?: TrilingualText;
};

export type AngelInvocation = {
  id: string;
  angelArabicName: string;
  angelTransliteration?: string;
  invocationArabic?: string;
  invocationTransliteration?: string;
  invocationTranslation?: TrilingualText;
  timingNote?: TrilingualText;
  purposeNote?: TrilingualText;
  pronunciationNote?: TrilingualText;
  sourceNote?: TrilingualText;
};

export type QuranVerse = {
  id: string;
  surah: number;
  ayah: number;
  arabic: string;
  transliteration?: string;
  translation: TrilingualText;
  relevanceNote?: TrilingualText;
  recitationCount?: number;
};

export type WafqGuidance = {
  id: string;
  displayName: TrilingualText;
  timingNote: TrilingualText;
  materialsNote: TrilingualText;
  wafqSquare?: number[][];
  letterFormula?: TrilingualText;
  instructions?: TrilingualText;
  activationNote?: TrilingualText;
  disposalNote?: TrilingualText;
  safetyNote: TrilingualText;
  sourceNote: TrilingualText;
};

export type LetterValue = {
  letter: string;
  name?: string;
  value: number;
  note?: TrilingualText;
};

export type IncenseRecommendation = {
  name: TrilingualText;
  note?: TrilingualText;
};

export type SadaqahSuggestion = {
  suggestion: TrilingualText;
  note?: TrilingualText;
};

export type PlanetaryCorrespondence = {
  rulingPlanet?: Planet;
  favorableHours?: Planet[];
  avoidHours?: Planet[];
  hourGuidance?: Partial<Record<Planet, TrilingualText>>;
};

export type ColorCorrespondence = {
  name: TrilingualText;
  hex?: string;
  note?: TrilingualText;
};

export type StoneCorrespondence = {
  name: TrilingualText;
  note?: TrilingualText;
};

export type MetalCorrespondence = {
  name: TrilingualText;
  note?: TrilingualText;
};

export type ManzilPracticePack = {
  mansionIndex: number; // 0-27
  element: Element;

  titleCalligraphyArabic?: string;
  constellationHint?: TrilingualText;
  elementalAnimation?: 'waterRipple' | 'fireFlicker' | 'earthPulse' | 'airShimmer';

  disclaimer?: TrilingualText;
  sourceNote?: TrilingualText;

  adhkar: DhikrPractice[];
  angels: AngelInvocation[];
  quranVerses: QuranVerse[];

  // Advanced mode only
  wafq?: WafqGuidance[];

  correspondences?: {
    letters?: LetterValue[];
    incense?: IncenseRecommendation[];
    sadaqah?: SadaqahSuggestion[];
    planetary?: PlanetaryCorrespondence;
    colors?: ColorCorrespondence[];
    metals?: MetalCorrespondence[];
    stones?: StoneCorrespondence[];
    numbers?: Array<{ value: number; note?: TrilingualText }>;
  };
};

const T = (en: string, fr: string, ar: string): TrilingualText => ({ en, fr, ar });

const EDUCATIONAL_DISCLAIMER = T(
  'Traditional attributions vary. Use with adab and verify with a qualified teacher.',
  'Les attributions traditionnelles varient. Agissez avec adab et vérifiez auprès d’un enseignant qualifié.',
  'تختلف النِّسَب في بعض التقاليد. التزم بالأدب وتحقّق مع شيخٍ مؤهل.'
);

const TBD = T('TBD (curation in progress).', 'À compléter (curation en cours).', 'قيد الإعداد.');

function placeholderPack(index: number, element: Element): ManzilPracticePack {
  return {
    mansionIndex: index,
    element,
    disclaimer: EDUCATIONAL_DISCLAIMER,
    sourceNote: TBD,
    adhkar: [
      {
        id: 'adhkar-istighfar',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfiru llāh',
        translation: T('I seek Allah’s forgiveness.', 'Je demande le pardon d’Allah.', 'أستغفر الله.'),
        count: 100,
        bestTimes: T('After prayers', 'Après les prières', 'بعد الصلاة'),
        niyyah: T('To return to sincerity.', 'Pour revenir à la sincérité.', 'للرجوع إلى الإخلاص.'),
        sourceNote: TBD,
      },
    ],
    angels: [],
    quranVerses: [],
    correspondences: {
      letters: [],
      incense: [],
      sadaqah: [],
      planetary: {},
    },
  };
}

// NOTE: We only ship fully-authored content for a few mansions to establish the pattern.
// All others render safely with placeholders.
export const MANAZIL_PRACTICE_PACKS: Record<number, ManzilPracticePack> = {
  // 0 — Al-Sharatān
  0: {
    mansionIndex: 0,
    element: 'fire',
    titleCalligraphyArabic: 'الشرطان',
    constellationHint: T('Stylized “two points” gate', 'Porte stylisée “deux points”', 'باب مُصوَّر بنقطتين'),
    elementalAnimation: 'fireFlicker',
    disclaimer: EDUCATIONAL_DISCLAIMER,
    sourceNote: T('Curated for app; not a legal/medical guarantee.', 'Curation app; sans garantie.', 'محتوى إرشادي دون ضمان.'),
    adhkar: [
      {
        id: 'adhkar-niyyah',
        arabic: 'اللَّهُمَّ إِنِّي نَوَيْتُ…',
        translation: T('O Allah, I intend…', 'Ô Allah, j’ai l’intention…', 'اللهم إني نويت…'),
        countNote: T('Set once, clearly.', 'Une fois, clairement.', 'مرة واحدة بوضوح.'),
        bestTimes: T('Before starting work', 'Avant de commencer', 'قبل بدء العمل'),
        niyyah: T('To begin with sincerity and simplicity.', 'Commencer avec sincérité et simplicité.', 'لبداية بإخلاص وبساطة.'),
      },
      {
        id: 'adhkar-ya-hayyu',
        arabic: 'يَا حَيُّ يَا قَيُّومُ',
        transliteration: 'Yā Ḥayyu Yā Qayyūm',
        translation: T('O Ever-Living, O Sustainer.', 'Ô Vivant, Ô Subsistant.', 'يا حي يا قيوم'),
        count: 100,
        bestTimes: T('After Fajr', 'Après Fajr', 'بعد الفجر'),
        niyyah: T('For steadiness and clean beginnings.', 'Pour la stabilité et un début propre.', 'للثبات وبداية نظيفة.'),
      },
    ],
    angels: [
      {
        id: 'angel-jibril',
        angelArabicName: 'جبريل',
        angelTransliteration: 'Jibrīl',
        purposeNote: T('Asking for guidance and clarity (general).', 'Demander guidance et clarté (général).', 'طلب الهداية والوضوح (عام).'),
        sourceNote: EDUCATIONAL_DISCLAIMER,
      },
    ],
    quranVerses: [
      {
        id: 'q-94-5',
        surah: 94,
        ayah: 5,
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translation: T('With hardship comes ease.', 'Avec la difficulté vient la facilité.', 'فإن مع العسر يسرا'),
        relevanceNote: T('A gentle anchor when starting anew.', 'Un ancrage doux pour recommencer.', 'تثبيت لطيف عند البدء من جديد.'),
      },
    ],
    wafq: [
      {
        id: 'wafq-educational',
        displayName: T('Educational Wafq (template)', 'Wafq pédagogique (modèle)', 'وفق تعليمي (نموذج)'),
        timingNote: T('Only with teacher supervision.', 'Seulement avec supervision.', 'فقط بإذن شيخ.'),
        materialsNote: T('Paper and clean ink; avoid superstition.', 'Papier et encre propre; éviter الخرافة.', 'ورق وحبر نظيف؛ تجنب الخرافة.'),
        wafqSquare: [
          [4, 9, 2],
          [3, 5, 7],
          [8, 1, 6],
        ],
        safetyNote: T('Do not treat as a guarantee. Avoid harm, fear, or coercion.', 'Aucune garantie. Évitez dommage/peur.', 'لا ضمان. تجنب الضرر والخوف.'),
        sourceNote: EDUCATIONAL_DISCLAIMER,
      },
    ],
    correspondences: {
      letters: [{ letter: 'ا', name: 'Alif', value: 1, note: T('Beginning / uprightness.', 'Début / droiture.', 'ابتداء/استقامة') }],
      incense: [{ name: T('Frankincense', 'Oliban', 'لبان'), note: T('Keep it subtle.', 'Avec douceur.', 'بلطف') }],
      sadaqah: [{ suggestion: T('Feed someone quietly.', 'Nourrir quelqu’un discrètement.', 'أطعم إنسانًا في الخفاء') }],
      planetary: { favorableHours: ['Sun', 'Jupiter'], avoidHours: ['Saturn'] },
    },
  },

  // 11 — Al-Ṣarfah (index 11)
  11: {
    mansionIndex: 11,
    element: 'fire',
    titleCalligraphyArabic: 'الصرفة',
    constellationHint: T('A “turning point” in the Lion’s sky', 'Un “tournant” dans le ciel du Lion', 'منعطف في سماء الأسد'),
    elementalAnimation: 'fireFlicker',
    disclaimer: EDUCATIONAL_DISCLAIMER,
    sourceNote: T('Example pack; refine with your chain/sources.', 'Exemple; affiner avec vos sources.', 'مثال يحتاج توثيقًا من السند.'),
    adhkar: [
      {
        id: 'adhkar-istighfar-100',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfiru llāh',
        translation: T('I ask Allah for forgiveness.', 'Je demande le pardon d’Allah.', 'أستغفر الله.'),
        count: 100,
        bestTimes: T('After Fajr, then again after Maghrib', 'Après Fajr, puis après Maghrib', 'بعد الفجر ثم بعد المغرب'),
        niyyah: T('To clear the inner smoke so the fire becomes light.', 'Pour purifier afin que le feu devienne نور.', 'لتصفية القلب حتى يصير النار نورًا.'),
        benefitNote: T('A cleansing opener before “fire” work.', 'Un nettoyant avant عمل النار.', 'تنقية قبل أعمال النار.'),
      },
      {
        id: 'adhkar-ya-nur',
        arabic: 'يَا نُورُ',
        transliteration: 'Yā Nūr',
        translation: T('O Light.', 'Ô Lumière.', 'يا نور.'),
        count: 100,
        bestTimes: T('At sunrise or in the Sun hour', 'Au lever du soleil ou ساعة الشمس', 'عند الشروق أو في ساعة الشمس'),
        niyyah: T('To transmute heat into clarity and direction.', 'Transformer chaleur en clarté.', 'لتحويل الحرارة إلى وضوح واتجاه.'),
      },
    ],
    angels: [
      {
        id: 'angel-mikail',
        angelArabicName: 'ميكائيل',
        angelTransliteration: 'Mīkāʾīl',
        purposeNote: T('Provision, nurture, and gentle opening (general attribution).', 'Subsistance et ouverture (général).', 'رزق وتيسير (نسبة عامة).'),
        invocationArabic: 'اللَّهُمَّ ارْزُقْنَا رِزْقًا حَلَالًا طَيِّبًا وَافْتَحْ لَنَا فَتْحًا مُبِينًا',
        invocationTransliteration: 'Allāhumma urzuqnā rizqan ḥalālan ṭayyiban waftaḥ lanā fatḥan mubīnan',
        invocationTranslation: T(
          'O Allah, grant us lawful, good provision and a clear opening.',
          'Ô Allah, accorde-nous une subsistance licite et une ouverture claire.',
          'اللهم ارزقنا رزقًا حلالًا طيبًا وافتح لنا فتحًا مبينًا.'
        ),
        timingNote: T('Best: after Fajr or in Jupiter/Sun hours.', 'Après Fajr ou ساعة المشتري/الشمس.', 'بعد الفجر أو ساعة المشتري/الشمس.'),
        sourceNote: EDUCATIONAL_DISCLAIMER,
      },
      {
        id: 'angel-israfil',
        angelArabicName: 'إسرافيل',
        angelTransliteration: 'Isrāfīl',
        purposeNote: T('Awakening, renewal, and stirring the heart (general attribution).', 'Éveil et renouvellement (général).', 'إيقاظ القلب وتجديد (نسبة عامة).'),
        invocationArabic: 'اللَّهُمَّ أَحْيِ قَلْبِي بِنُورِكَ وَاجْعَلْنِي مِنَ الْمُسْتَيْقِظِينَ',
        invocationTransliteration: 'Allāhumma aḥyi qalbī binūrika wajʿalnī mina l-mustayqiẓīn',
        invocationTranslation: T(
          'O Allah, revive my heart with Your light and make me among the awakened.',
          'Ô Allah, ravive mon cœur par Ta lumière et fais-moi parmi les éveillés.',
          'اللهم أحي قلبي بنورك واجعلني من المستيقظين.'
        ),
        timingNote: T('Best: sunrise, or at a turning point you can actually act on.', 'Au lever du soleil, ou quand vous pouvez agir.', 'عند الشروق أو عند منعطف يمكن فيه الفعل.'),
        sourceNote: EDUCATIONAL_DISCLAIMER,
      },
    ],
    quranVerses: [
      {
        id: 'q-21-69',
        surah: 21,
        ayah: 69,
        arabic: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ',
        transliteration: 'Qulnā yā nāru kūnī bardan wa-salāman ʿalā Ibrāhīm',
        translation: T(
          'We said: “O Fire, be coolness and peace upon Abraham.”',
          'Nous dîmes : « Ô feu, sois fraîcheur et paix pour Abraham. »',
          'قلنا يا نار كوني بردًا وسلامًا على إبراهيم.'
        ),
        relevanceNote: T('Core teaching: fire can be disciplined into سلام.', 'Le feu peut devenir سلام.', 'النار يمكن تهذيبها إلى سلام.'),
      },
      {
        id: 'q-55-26-27',
        surah: 55,
        ayah: 26,
        arabic: 'كُلُّ مَنْ عَلَيْهَا فَانٍ',
        transliteration: 'Kullu man ʿalayhā fān',
        translation: T('Everyone upon it will perish.', 'Tout ce qui est sur elle périra.', 'كل من عليها فان.'),
        relevanceNote: T('A fire-mansion reminder: let what must burn, burn.', 'Rappel: laisser ce qui doit brûler.', 'تذكير: دع ما يجب أن يحترق يحترق.'),
      },
      {
        id: 'q-55-27',
        surah: 55,
        ayah: 27,
        arabic: 'وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ',
        transliteration: 'Wa-yabqā wajhu Rabbika dhū l-jalāli wa-l-ikrām',
        translation: T('And the Face of your Lord remains—Owner of Majesty and Honor.', 'Et demeure la Face de ton Seigneur…', 'ويبقى وجه ربك ذو الجلال والإكرام.'),
        relevanceNote: T('Keeps the “turning” aligned to what remains.', 'Aligner le tournant avec ce qui demeure.', 'توجيه التحول نحو الباقي.'),
      },
      {
        id: 'q-24-35',
        surah: 24,
        ayah: 35,
        arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ…',
        transliteration: 'Allāhu nūru s-samāwāti wa-l-arḍ…',
        translation: T(
          'Allah is the Light of the heavens and the earth…',
          'Allah est la Lumière des cieux et de la terre…',
          'الله نور السماوات والأرض…'
        ),
        relevanceNote: T('Fire refined into light: the aim is نور, not heat.', 'Le but: نور, pas la chaleur.', 'الغاية: نور لا حرارة.'),
      },
    ],
    wafq: [
      {
        id: 'wafq-sarfah-educational-3x3',
        displayName: T('Wafq (3×3) — educational square', 'Wafq (3×3) — carré pédagogique', 'وفق (٣×٣) — مربع تعليمي'),
        timingNote: T('Only with teacher supervision; keep intention clean.', 'Seulement avec supervision; intention propre.', 'فقط بإذن شيخ؛ صفِّ النية.'),
        materialsNote: T('Plain paper; clean ink; keep away from harm/fear.', 'Papier; encre propre; éviter الخوف.', 'ورق؛ حبر نظيف؛ تجنب الأذى والخوف.'),
        letterFormula: T('Letters of the gate: ص ر ف (90 + 200 + 80)', 'Lettres: ص ر ف', 'حروف الباب: ص ر ف'),
        wafqSquare: [
          [4, 9, 2],
          [3, 5, 7],
          [8, 1, 6],
        ],
        instructions: T(
          'Write the square once, then recite the chosen adhkār with calm breath. Do not treat as a guarantee; treat as a contemplative aid.',
          'Écrivez le carré une fois, puis récitez l’adhkār choisi avec respiration calme. Aucun ضمان.',
          'اكتب المربع مرة واحدة ثم اقرأ الذكر المختار بنَفَسٍ هادئ. لا تتعامل معه كضمان.'
        ),
        activationNote: T('End with duʿāʾ and gratitude; keep it private.', 'Finir par duʿāʾ et gratitude; garder discret.', 'اختم بالدعاء والشكر؛ واجعله في السر.'),
        disposalNote: T('Dispose respectfully (e.g., store safely or bury). Avoid throwing in trash.', 'Élimination باحترام (حفظ أو دفن).', 'تخلّص باحترام (حفظ أو دفن).'),
        safetyNote: T('Never use to control others. Stop if fear/compulsion appears.', 'Ne jamais contrôler autrui. Arrêter عند الخوف.', 'لا لاستعماله في التحكم بالناس. توقّف عند الخوف.'),
        sourceNote: EDUCATIONAL_DISCLAIMER,
      },
    ],
    correspondences: {
      letters: [
        { letter: 'ص', name: 'Ṣād', value: 90 },
        { letter: 'ر', name: 'Rā', value: 200 },
        { letter: 'ف', name: 'Fā', value: 80 },
      ],
      incense: [
        { name: T('Frankincense', 'Oliban', 'لبان') },
        { name: T('Cinnamon', 'Cannelle', 'قرفة') },
        { name: T('Saffron (very light)', 'Safran (léger)', 'زعفران (قليل)') },
        { name: T('Myrrh (light)', 'Myrrhe (léger)', 'مرّ (خفيف)') },
      ],
      sadaqah: [
        {
          suggestion: T('Give warm food (soup/bread) to someone quietly.', 'Donner un repas chaud discrètement.', 'أطعم طعامًا ساخنًا في الخفاء.'),
        },
        {
          suggestion: T('Support fire-related trades (bakers, cooks, metalworkers) with fairness.', 'Soutenir métiers du feu avec justice.', 'أعن أهل المهن المرتبطة بالنار بالعدل.'),
        },
      ],
      planetary: {
        rulingPlanet: 'Sun',
        favorableHours: ['Sun', 'Jupiter', 'Mars'],
        avoidHours: ['Saturn'],
        hourGuidance: {
          Sun: T('Do the “Yā Nūr” dhikr; act on one clear decision.', 'اذكر “يا نور”؛ قرار واضح.', 'اذكر “يا نور” واتخذ قرارًا واضحًا.'),
          Jupiter: T('Make duʿāʾ for expansion; give ṣadaqah.', 'دعاء للتوسعة مع صدقة.', 'ادعُ للتوسعة مع صدقة.'),
          Mars: T('Channel heat into disciplined effort; avoid anger.', 'حوّل الحرارة إلى انضباط.', 'حوّل الحرارة إلى انضباط وتجنّب الغضب.'),
          Saturn: T('Do istighfār only; avoid binding vows or harsh words.', 'استغفار فقط؛ تجنّب القسوة.', 'استغفار فقط وتجنّب القسوة.'),
        },
      },
      colors: [
        { name: T('Red', 'Rouge', 'أحمر'), hex: '#ef4444' },
        { name: T('Gold', 'Or', 'ذهبي'), hex: '#f59e0b' },
        { name: T('Orange', 'Orange', 'برتقالي'), hex: '#fb923c' },
      ],
      metals: [{ name: T('Gold', 'Or', 'ذهب') }],
      stones: [
        { name: T('Ruby', 'Rubis', 'ياقوت') },
        { name: T('Carnelian', 'Cornaline', 'عقيق') },
        { name: T('Sunstone', 'Pierre de soleil', 'حجر الشمس') },
      ],
      numbers: [
        { value: 12, note: T('Manzil number (1-based).', 'Numéro de manzil (base 1).', 'رقم المنزلة (بالعدّ).') },
        { value: 370, note: T('Ṣād + Rā + Fā = 90 + 200 + 80.', 'مجموع ص+ر+ف.', 'مجموع ص+ر+ف.') },
      ],
    },
  },

  // 27 — Baṭn al-Ḥūt
  27: {
    mansionIndex: 27,
    element: 'water',
    titleCalligraphyArabic: 'بطن الحوت',
    constellationHint: T('Stylized deep-water cluster', 'Grappe stylisée “profondeur”', 'نقاط تدل على العمق'),
    elementalAnimation: 'waterRipple',
    disclaimer: EDUCATIONAL_DISCLAIMER,
    sourceNote: T('Example pack; refine with your sources.', 'Exemple; affiner.', 'مثال؛ يُحسَّن توثيقه.'),
    adhkar: [
      {
        id: 'adhkar-yunus',
        arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        transliteration: 'Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn',
        translation: T('There is no deity but You; glory be to You; I was among the wrongdoers.', 'Nul dieu sauf Toi; gloire à Toi; j’ai été ظلم.', 'لا إله إلا أنت سبحانك إني كنت من الظالمين'),
        countNote: T('Recite with presence.', 'Réciter avec présence.', 'اقرأ بحضور قلب.'),
        bestTimes: T('In solitude, after ʿIshāʾ', 'En solitude, après ʿIshāʾ', 'في الخلوة بعد العشاء'),
        niyyah: T('To return to honesty and hope.', 'Revenir à vérité et espoir.', 'للرجوع إلى الصدق والرجاء.'),
      },
    ],
    angels: [],
    quranVerses: [
      {
        id: 'q-21-87',
        surah: 21,
        ayah: 87,
        arabic: 'فَنَادَىٰ فِي الظُّلُمَاتِ…',
        translation: T('He called out in the darkness…', 'Il appela dans les ténèbres…', 'فنادى في الظلمات…'),
        relevanceNote: T('A reminder that relief follows truthfulness.', 'Le soulagement suit la vérité.', 'الفرج بعد الصدق.'),
      },
    ],
    correspondences: {
      letters: [{ letter: 'ن', name: 'Nūn', value: 50, note: T('Often linked to “Nun” imagery; verify.', 'Souvent lié à نون; vérifier.', 'يربط بالنون؛ تحقق.') }],
      incense: [{ name: T('Musk (light)', 'Musc (léger)', 'مسك (خفيف)') }],
      sadaqah: [{ suggestion: T('Support someone quietly; protect dignity.', 'Soutenir discrètement; préserver dignité.', 'أعن في الخفاء واحفظ الكرامة.') }],
      planetary: { favorableHours: ['Moon'], avoidHours: ['Mars'] },
    },
  },
};

// Fill missing mansions with safe placeholders so UI can always render.
export function getManzilPracticePack(index0: number, element: Element): ManzilPracticePack {
  const normalized = ((index0 % 28) + 28) % 28;
  return MANAZIL_PRACTICE_PACKS[normalized] ?? placeholderPack(normalized, element);
}
