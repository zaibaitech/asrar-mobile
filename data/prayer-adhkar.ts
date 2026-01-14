/**
 * Prayer-Specific Adhkar Database
 * 
 * Complete collection of authentic Sunnah adhkar (remembrances) to be recited
 * after each of the five daily prayers, sourced from Sahih hadith collections.
 * 
 * Also includes classical spiritual practices from established Islamic traditions,
 * particularly the West African Maghribi scholarly tradition.
 * 
 * Sources:
 * - Sahih Muslim: Book of Prayer, Chapter on Adhkar after Prayer
 * - Sahih al-Bukhari: Book of Supplications
 * - Sunan Abu Dawud: Book of Prayer
 * - Jami' at-Tirmidhi: Book of Invocations
 * - Shadhili, Tijani, Qadiri traditions
 * 
 * @module prayer-adhkar
 */

// Types
export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type Tradition = 'Shadhili' | 'Tijani' | 'Qadiri' | 'Naqshbandi' | 'West African Scholarly';

// Interfaces
export interface Dhikr {
  arabic: string;
  transliteration: string;
  translation: { en: string; fr: string };
  count: number;
  benefitKey: string; // Translation key for benefit description
  source: string;
}

export interface ClassicalPractice {
  arabic: string;
  transliteration: string;
  translation: { en: string; fr: string };
  count: number;
  benefitKey: string; // Translation key for benefit description
  tradition: Tradition;
  source: string;
  planetaryConnectionKey?: string; // Translation key for planetary connection
}

export interface PrayerAdhkar {
  prayer: Prayer;
  
  // Standard Sunnah adhkar (non-controversial, authenticated)
  sunnahAdhkar: Dhikr[];
  
  // Classical additional practices (optional, from established traditions)
  classicalPractices?: ClassicalPractice[];
}

// ============================================================================
// PRAYER ADHKAR DATABASE
// ============================================================================

export const prayerAdhkarDatabase: PrayerAdhkar[] = [
  // ==========================================================================
  // FAJR (Dawn Prayer)
  // ==========================================================================
  {
    prayer: 'Fajr',
    sunnahAdhkar: [
      // Standard Tasbih after every prayer
      {
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: 'SubḥānAllāh',
        translation: {
          en: 'Glory be to Allah',
          fr: 'Gloire à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.glorificationPurification',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'الْحَمْدُ للهِ',
        transliteration: 'Alḥamdulillāh',
        translation: {
          en: 'All praise is for Allah',
          fr: 'Toute louange est à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.gratitudeContentment',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: 'Allāhu Akbar',
        translation: {
          en: 'Allah is the Greatest',
          fr: 'Allah est le Plus Grand'
        },
        count: 34,
        benefitKey: 'prayerAdhkar.benefits.magnificationReverence',
        source: 'Sahih Muslim 597'
      },
      
      // Ayat al-Kursi (Verse of the Throne)
      {
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...',
        translation: {
          en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
          fr: 'Allah - il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionUntilNext',
        source: 'Sahih al-Bukhari 2311'
      },
      
      // Al-Mu'awwidhatayn (The Two Protections) - 3x after Fajr and Maghrib
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul huwa Allāhu aḥad, Allāhu al-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad',
        translation: {
          en: 'Say: He is Allah, the One. Allah, the Eternal. He begets not, nor was He begotten. And there is none comparable to Him.',
          fr: 'Dis: Il est Allah, l\'Unique. Allah, le Seul à être imploré. Il n\'a jamais engendré, n\'a pas été engendré. Et nul n\'est égal à Lui.'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.tawhidAffirmationMorning',
        source: 'Sunan Abu Dawud 5082'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-falaq, min sharri mā khalaq...',
        translation: {
          en: 'Say: I seek refuge in the Lord of daybreak, from the evil of what He has created...',
          fr: 'Dis: Je cherche protection auprès du Seigneur de l\'aube naissante, contre le mal de ce qu\'Il a créé...'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.protectionEvilEye',
        source: 'Sunan Abu Dawud 5082'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-nās, maliki al-nās, ilāhi al-nās...',
        translation: {
          en: 'Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer...',
          fr: 'Dis: Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, Dieu des hommes, contre le mal du tentateur qui se dérobe...'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.protectionWhispersShaytan',
        source: 'Sunan Abu Dawud 5082'
      },
      
      // Morning protection du'a
      {
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Aṣbaḥnā wa aṣbaḥa al-mulku lillāh, wa al-ḥamdu lillāh...',
        translation: {
          en: 'We have entered morning and the dominion has entered morning belonging to Allah. And praise is to Allah. There is no deity but Allah alone, with no partner. To Him belongs dominion and praise, and He is capable of all things.',
          fr: 'Nous avons atteint le matin et le royaume appartient à Allah. Louange à Allah. Il n\'y a de divinité qu\'Allah, seul sans associé. À Lui la royauté, à Lui la louange, et Il est Capable de toute chose.'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.morningProtection',
        source: 'Sahih Muslim 2723'
      },
      
      // Sayyid al-Istighfar (Master of Seeking Forgiveness)
      {
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: 'Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā ʿabduk...',
        translation: {
          en: 'O Allah, You are my Lord. There is no deity but You. You created me and I am Your servant. I am keeping my covenant and promise to You as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me and I acknowledge my sins. So forgive me, for none forgives sins but You.',
          fr: 'Ô Allah, Tu es mon Seigneur. Il n\'y a de divinité que Toi. Tu m\'as créé et je suis Ton serviteur. Je tiens mon engagement envers Toi autant que je le peux. Je cherche refuge auprès de Toi contre le mal que j\'ai commis. Je reconnais Tes bienfaits sur moi et je reconnais mes péchés. Pardonne-moi, car nul ne pardonne les péchés sauf Toi.'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.paradiseGuarantee',
        source: 'Sahih al-Bukhari 6306'
      }
    ],
    
    classicalPractices: [
      {
        arabic: 'يَا نُورُ',
        transliteration: 'Yā Nūr',
        translation: {
          en: 'O Light',
          fr: 'Ô Lumière'
        },
        count: 100,
        benefitKey: 'prayerAdhkar.benefits.spiritualIllumination',
        tradition: 'Shadhili',
        source: 'Wird al-Laṭīf',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.sunFajr'
      },
      {
        arabic: 'يَا وَكِيلُ',
        transliteration: 'Yā Wakīl',
        translation: {
          en: 'O Trustee',
          fr: 'Ô Garant'
        },
        count: 66,
        benefitKey: 'prayerAdhkar.benefits.trustProvision',
        tradition: 'Tijani',
        source: 'Jawāhir al-Maʿānī',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.mercuryProvision'
      },
      {
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ',
        transliteration: 'Lā ḥawla wa lā quwwata illā billāhi al-ʿaliyyi al-ʿaẓīm',
        translation: {
          en: 'There is no power nor strength except by Allah, the Most High, the Magnificent',
          fr: 'Il n\'y a de puissance ni de force qu\'en Allah, le Très-Haut, le Magnifique'
        },
        count: 100,
        benefitKey: 'prayerAdhkar.benefits.strengtheningTrials',
        tradition: 'West African Scholarly',
        source: 'Mawāhib al-Laṭīf (West African compilation)'
      }
    ]
  },

  // ==========================================================================
  // DHUHR (Noon Prayer)
  // ==========================================================================
  {
    prayer: 'Dhuhr',
    sunnahAdhkar: [
      {
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: 'SubḥānAllāh',
        translation: {
          en: 'Glory be to Allah',
          fr: 'Gloire à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.glorificationPurification',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'الْحَمْدُ للهِ',
        transliteration: 'Alḥamdulillāh',
        translation: {
          en: 'All praise is for Allah',
          fr: 'Toute louange est à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.gratitudeContentment',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: 'Allāhu Akbar',
        translation: {
          en: 'Allah is the Greatest',
          fr: 'Allah est le Plus Grand'
        },
        count: 34,
        benefitKey: 'prayerAdhkar.benefits.magnificationReverence',
        source: 'Sahih Muslim 597'
      },
      
      {
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...',
        translation: {
          en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
          fr: 'Allah - il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionUntilNext',
        source: 'Sahih al-Bukhari 2311'
      },
      
      // Single recitation of the last three surahs
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul huwa Allāhu aḥad...',
        translation: {
          en: 'Say: He is Allah, the One...',
          fr: 'Dis: Il est Allah, l\'Unique...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.tawhidEquivalent',
        source: 'Sahih Muslim 811'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-falaq...',
        translation: {
          en: 'Say: I seek refuge in the Lord of daybreak...',
          fr: 'Dis: Je cherche protection auprès du Seigneur de l\'aube...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionEvil',
        source: 'Sahih Muslim 814'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-nās...',
        translation: {
          en: 'Say: I seek refuge in the Lord of mankind...',
          fr: 'Dis: Je cherche protection auprès du Seigneur des hommes...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionWhispers',
        source: 'Sahih Muslim 814'
      },
      
      // Du'a after prayer
      {
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Lā ilāha illā Allāhu waḥdahu lā sharīka lah, lahu al-mulk wa lahu al-ḥamd, wa huwa ʿalā kulli shayʾin qadīr',
        translation: {
          en: 'There is no deity but Allah alone, with no partner. To Him belongs dominion and praise, and He is capable of all things.',
          fr: 'Il n\'y a de divinité qu\'Allah, seul sans associé. À Lui la royauté, à Lui la louange, et Il est Capable de toute chose.'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.forgivenessSeaFoam',
        source: 'Sahih Muslim 597'
      }
    ],
    
    classicalPractices: [
      {
        arabic: 'يَا حَيُّ يَا قَيُّومُ',
        transliteration: 'Yā Ḥayyu yā Qayyūm',
        translation: {
          en: 'O Ever-Living, O Sustainer',
          fr: 'Ô Vivant, ô Subsistant'
        },
        count: 70,
        benefitKey: 'prayerAdhkar.benefits.vitalityMidday',
        tradition: 'Qadiri',
        source: 'Al-Ghunya li-Ṭālibī Ṭarīq al-Ḥaqq',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.sunPeak'
      },
      {
        arabic: 'يَا رَزَّاقُ',
        transliteration: 'Yā Razzāq',
        translation: {
          en: 'O Provider',
          fr: 'Ô Pourvoyeur'
        },
        count: 100,
        benefitKey: 'prayerAdhkar.benefits.openingProvision',
        tradition: 'Tijani',
        source: 'Rimāḥ Ḥizb al-Raḥīm',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.jupiterAbundance'
      }
    ]
  },

  // ==========================================================================
  // ASR (Afternoon Prayer)
  // ==========================================================================
  {
    prayer: 'Asr',
    sunnahAdhkar: [
      {
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: 'SubḥānAllāh',
        translation: {
          en: 'Glory be to Allah',
          fr: 'Gloire à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.glorificationPurification',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'الْحَمْدُ للهِ',
        transliteration: 'Alḥamdulillāh',
        translation: {
          en: 'All praise is for Allah',
          fr: 'Toute louange est à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.gratitudeContentment',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: 'Allāhu Akbar',
        translation: {
          en: 'Allah is the Greatest',
          fr: 'Allah est le Plus Grand'
        },
        count: 34,
        benefitKey: 'prayerAdhkar.benefits.magnificationReverence',
        source: 'Sahih Muslim 597'
      },
      
      {
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...',
        translation: {
          en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
          fr: 'Allah - il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionUntilNext',
        source: 'Sahih al-Bukhari 2311'
      },
      
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul huwa Allāhu aḥad...',
        translation: {
          en: 'Say: He is Allah, the One...',
          fr: 'Dis: Il est Allah, l\'Unique...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.tawhidAffirmation',
        source: 'Sahih Muslim 811'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-falaq...',
        translation: {
          en: 'Say: I seek refuge in the Lord of daybreak...',
          fr: 'Dis: Je cherche protection auprès du Seigneur de l\'aube...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionEvil',
        source: 'Sahih Muslim 814'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-nās...',
        translation: {
          en: 'Say: I seek refuge in the Lord of mankind...',
          fr: 'Dis: Je cherche protection auprès du Seigneur des hommes...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionWhispers',
        source: 'Sahih Muslim 814'
      },
      
      // Istighfar
      {
        arabic: 'أَسْتَغْفِرُ اللهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfiru Allāha alladhī lā ilāha illā huwa al-ḥayya al-qayyūm wa atūbu ilayh',
        translation: {
          en: 'I seek forgiveness from Allah, there is no deity but Him, the Ever-Living, the Sustainer, and I repent to Him',
          fr: 'Je demande pardon à Allah, il n\'y a de divinité que Lui, le Vivant, le Subsistant, et je me repens à Lui'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.forgivenessEvenFled',
        source: 'Sunan Abu Dawud 1517'
      }
    ],
    
    classicalPractices: [
      {
        arabic: 'يَا لَطِيفُ',
        transliteration: 'Yā Laṭīf',
        translation: {
          en: 'O Subtle, O Gentle',
          fr: 'Ô Bienveillant, Ô Subtil'
        },
        count: 129,
        benefitKey: 'prayerAdhkar.benefits.gentlenessDifficulties',
        tradition: 'Shadhili',
        source: 'Ḥizb al-Barr',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.venusGentleness'
      },
      {
        arabic: 'يَا قَوِيُّ',
        transliteration: 'Yā Qawiyy',
        translation: {
          en: 'O Most Strong',
          fr: 'Ô Très Fort'
        },
        count: 117,
        benefitKey: 'prayerAdhkar.benefits.strengthCompleteDay',
        tradition: 'West African Scholarly',
        source: 'Dalāʾil al-Khayrāt commentary'
      }
    ]
  },

  // ==========================================================================
  // MAGHRIB (Sunset Prayer)
  // ==========================================================================
  {
    prayer: 'Maghrib',
    sunnahAdhkar: [
      {
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: 'SubḥānAllāh',
        translation: {
          en: 'Glory be to Allah',
          fr: 'Gloire à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.glorificationPurification',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'الْحَمْدُ للهِ',
        transliteration: 'Alḥamdulillāh',
        translation: {
          en: 'All praise is for Allah',
          fr: 'Toute louange est à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.gratitudeContentment',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: 'Allāhu Akbar',
        translation: {
          en: 'Allah is the Greatest',
          fr: 'Allah est le Plus Grand'
        },
        count: 34,
        benefitKey: 'prayerAdhkar.benefits.magnificationReverence',
        source: 'Sahih Muslim 597'
      },
      
      {
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...',
        translation: {
          en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
          fr: 'Allah - il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionUntilNext',
        source: 'Sahih al-Bukhari 2311'
      },
      
      // Al-Mu'awwidhatayn (The Two Protections) - 3x after Fajr and Maghrib
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul huwa Allāhu aḥad, Allāhu al-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad',
        translation: {
          en: 'Say: He is Allah, the One. Allah, the Eternal. He begets not, nor was He begotten. And there is none comparable to Him.',
          fr: 'Dis: Il est Allah, l\'Unique. Allah, le Seul à être imploré. Il n\'a jamais engendré, n\'a pas été engendré. Et nul n\'est égal à Lui.'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.tawhidAffirmationEvening',
        source: 'Sunan Abu Dawud 5082'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-falaq, min sharri mā khalaq...',
        translation: {
          en: 'Say: I seek refuge in the Lord of daybreak, from the evil of what He has created...',
          fr: 'Dis: Je cherche protection auprès du Seigneur de l\'aube naissante, contre le mal de ce qu\'Il a créé...'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.protectionEvilEye',
        source: 'Sunan Abu Dawud 5082'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-nās, maliki al-nās, ilāhi al-nās...',
        translation: {
          en: 'Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer...',
          fr: 'Dis: Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, Dieu des hommes, contre le mal du tentateur qui se dérobe...'
        },
        count: 3,
        benefitKey: 'prayerAdhkar.benefits.protectionWhispersShaytan',
        source: 'Sunan Abu Dawud 5082'
      },
      
      // Evening protection du'a
      {
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Amsaynā wa amsā al-mulku lillāh, wa al-ḥamdu lillāh...',
        translation: {
          en: 'We have entered evening and the dominion has entered evening belonging to Allah. And praise is to Allah. There is no deity but Allah alone, with no partner. To Him belongs dominion and praise, and He is capable of all things.',
          fr: 'Nous avons atteint le soir et le royaume appartient à Allah. Louange à Allah. Il n\'y a de divinité qu\'Allah, seul sans associé. À Lui la royauté, à Lui la louange, et Il est Capable de toute chose.'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.eveningProtection',
        source: 'Sahih Muslim 2723'
      }
    ],
    
    classicalPractices: [
      {
        arabic: 'يَا جَمِيلُ',
        transliteration: 'Yā Jamīl',
        translation: {
          en: 'O Beautiful',
          fr: 'Ô Beau'
        },
        count: 83,
        benefitKey: 'prayerAdhkar.benefits.beautificationCharacter',
        tradition: 'Shadhili',
        source: 'Ḥizb al-Baḥr',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.venusBeauty'
      },
      {
        arabic: 'يَا سَتَّارُ',
        transliteration: 'Yā Sattār',
        translation: {
          en: 'O Concealer',
          fr: 'Ô Celui qui voile'
        },
        count: 70,
        benefitKey: 'prayerAdhkar.benefits.concealmentFaults',
        tradition: 'Tijani',
        source: 'Ṣalāt al-Fātiḥ commentary',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.moonConcealment'
      },
      {
        arabic: 'يَا وَدُودُ',
        transliteration: 'Yā Wadūd',
        translation: {
          en: 'O Most Loving',
          fr: 'Ô Très Affectueux'
        },
        count: 20,
        benefitKey: 'prayerAdhkar.benefits.increasingLoveHearts',
        tradition: 'West African Scholarly',
        source: 'Sharḥ Dalāʾil al-Khayrāt'
      }
    ]
  },

  // ==========================================================================
  // ISHA (Night Prayer)
  // ==========================================================================
  {
    prayer: 'Isha',
    sunnahAdhkar: [
      {
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: 'SubḥānAllāh',
        translation: {
          en: 'Glory be to Allah',
          fr: 'Gloire à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.glorificationPurification',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'الْحَمْدُ للهِ',
        transliteration: 'Alḥamdulillāh',
        translation: {
          en: 'All praise is for Allah',
          fr: 'Toute louange est à Allah'
        },
        count: 33,
        benefitKey: 'prayerAdhkar.benefits.gratitudeContentment',
        source: 'Sahih Muslim 597'
      },
      {
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: 'Allāhu Akbar',
        translation: {
          en: 'Allah is the Greatest',
          fr: 'Allah est le Plus Grand'
        },
        count: 34,
        benefitKey: 'prayerAdhkar.benefits.magnificationReverence',
        source: 'Sahih Muslim 597'
      },
      
      {
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm...',
        translation: {
          en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
          fr: 'Allah - il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionUntilNext',
        source: 'Sahih al-Bukhari 2311'
      },
      
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul huwa Allāhu aḥad...',
        translation: {
          en: 'Say: He is Allah, the One...',
          fr: 'Dis: Il est Allah, l\'Unique...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.tawhidAffirmation',
        source: 'Sahih Muslim 811'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-falaq...',
        translation: {
          en: 'Say: I seek refuge in the Lord of daybreak...',
          fr: 'Dis: Je cherche protection auprès du Seigneur de l\'aube...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionEvil',
        source: 'Sahih Muslim 814'
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Qul aʿūdhu bi-rabbi al-nās...',
        translation: {
          en: 'Say: I seek refuge in the Lord of mankind...',
          fr: 'Dis: Je cherche protection auprès du Seigneur des hommes...'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.protectionWhispers',
        source: 'Sahih Muslim 814'
      },
      
      // Before sleep du'a (often recited after Isha)
      {
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allāhumma amūtu wa aḥyā',
        translation: {
          en: 'In Your name, O Allah, I die and I live',
          fr: 'En Ton nom, ô Allah, je meurs et je vis'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.remembranceSleep',
        source: 'Sahih al-Bukhari 6312'
      },
      
      // Night protection
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
        transliteration: 'Allāhumma innī aʿūdhu bika min al-hammi wa al-ḥazan...',
        translation: {
          en: 'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, and from being heavily in debt and from being overcome by men',
          fr: 'Ô Allah, je cherche refuge auprès de Toi contre le souci et la tristesse, contre l\'incapacité et la paresse, contre la lâcheté et l\'avarice, contre le poids de la dette et la domination des hommes'
        },
        count: 1,
        benefitKey: 'prayerAdhkar.benefits.comprehensiveProtection',
        source: 'Sahih al-Bukhari 6369'
      }
    ],
    
    classicalPractices: [
      {
        arabic: 'يَا حَفِيظُ',
        transliteration: 'Yā Ḥafīẓ',
        translation: {
          en: 'O Guardian',
          fr: 'Ô Gardien'
        },
        count: 998,
        benefitKey: 'prayerAdhkar.benefits.protectionNight',
        tradition: 'Shadhili',
        source: 'Wird al-Saḥar',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.saturnProtection'
      },
      {
        arabic: 'يَا سَلَامُ',
        transliteration: 'Yā Salām',
        translation: {
          en: 'O Peace',
          fr: 'Ô Paix'
        },
        count: 131,
        benefitKey: 'prayerAdhkar.benefits.peacefulSleep',
        tradition: 'Tijani',
        source: 'Wird al-Layl',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.moonNight'
      },
      {
        arabic: 'يَا مُؤْمِنُ',
        transliteration: 'Yā Muʾmin',
        translation: {
          en: 'O Granter of Security',
          fr: 'Ô Celui qui accorde la sécurité'
        },
        count: 136,
        benefitKey: 'prayerAdhkar.benefits.securityFear',
        tradition: 'Qadiri',
        source: 'Wird al-Ṣaghīr',
        planetaryConnectionKey: 'prayerAdhkar.planetaryConnections.saturnSecurity'
      }
    ]
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all adhkar for a specific prayer
 */
export function getAdhkarForPrayer(prayer: Prayer): PrayerAdhkar | undefined {
  return prayerAdhkarDatabase.find(pa => pa.prayer === prayer);
}

/**
 * Get only Sunnah adhkar for a specific prayer
 */
export function getSunnahAdhkarForPrayer(prayer: Prayer): Dhikr[] {
  const prayerAdhkar = getAdhkarForPrayer(prayer);
  return prayerAdhkar?.sunnahAdhkar || [];
}

/**
 * Get only classical practices for a specific prayer
 */
export function getClassicalPracticesForPrayer(prayer: Prayer): ClassicalPractice[] {
  const prayerAdhkar = getAdhkarForPrayer(prayer);
  return prayerAdhkar?.classicalPractices || [];
}

/**
 * Get classical practices by tradition
 */
export function getClassicalPracticesByTradition(tradition: Tradition): ClassicalPractice[] {
  const allPractices: ClassicalPractice[] = [];
  
  prayerAdhkarDatabase.forEach(pa => {
    if (pa.classicalPractices) {
      const filtered = pa.classicalPractices.filter(cp => cp.tradition === tradition);
      allPractices.push(...filtered);
    }
  });
  
  return allPractices;
}

/**
 * Get classical practices with planetary connection
 */
export function getClassicalPracticesWithPlanetaryConnection(): ClassicalPractice[] {
  const allPractices: ClassicalPractice[] = [];
  
  prayerAdhkarDatabase.forEach(pa => {
    if (pa.classicalPractices) {
      const filtered = pa.classicalPractices.filter(cp => cp.planetaryConnectionKey);
      allPractices.push(...filtered);
    }
  });
  
  return allPractices;
}

/**
 * Get total count of adhkar for a prayer
 */
export function getTotalAdhkarCount(prayer: Prayer): number {
  const prayerAdhkar = getAdhkarForPrayer(prayer);
  if (!prayerAdhkar) return 0;
  
  let total = 0;
  
  // Count Sunnah adhkar
  prayerAdhkar.sunnahAdhkar.forEach(dhikr => {
    total += dhikr.count;
  });
  
  // Optionally count classical practices
  if (prayerAdhkar.classicalPractices) {
    prayerAdhkar.classicalPractices.forEach(practice => {
      total += practice.count;
    });
  }
  
  return total;
}

/**
 * Search adhkar by Arabic text
 */
export function searchAdhkarByArabic(searchTerm: string): Array<{
  prayer: Prayer;
  dhikr: Dhikr | ClassicalPractice;
  type: 'sunnah' | 'classical';
}> {
  const results: Array<{
    prayer: Prayer;
    dhikr: Dhikr | ClassicalPractice;
    type: 'sunnah' | 'classical';
  }> = [];
  
  prayerAdhkarDatabase.forEach(pa => {
    // Search Sunnah adhkar
    pa.sunnahAdhkar.forEach(dhikr => {
      if (dhikr.arabic.includes(searchTerm)) {
        results.push({ prayer: pa.prayer, dhikr, type: 'sunnah' });
      }
    });
    
    // Search classical practices
    if (pa.classicalPractices) {
      pa.classicalPractices.forEach(practice => {
        if (practice.arabic.includes(searchTerm)) {
          results.push({ prayer: pa.prayer, dhikr: practice, type: 'classical' });
        }
      });
    }
  });
  
  return results;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default prayerAdhkarDatabase;
