/**
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

export const QURAN_SURAHS: Surah[] = [
  {
    "number": 1,
    "name": {
      "arabic": "سُورَةُ ٱلْفَاتِحَةِ",
      "transliteration": "Al-Faatiha",
      "en": "The Opening",
      "fr": "L'Ouverture"
    },
    "totalAyahs": 7,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 2,
    "name": {
      "arabic": "سُورَةُ البَقَرَةِ",
      "transliteration": "Al-Baqara",
      "en": "The Cow",
      "fr": "La Vache"
    },
    "totalAyahs": 286,
    "revelationType": "Medinan",
    "rukus": 29
  },
  {
    "number": 3,
    "name": {
      "arabic": "سُورَةُ آلِ عِمۡرَانَ",
      "transliteration": "Aal-i-Imraan",
      "en": "The Family of Imraan",
      "fr": "La Famille d'Imran"
    },
    "totalAyahs": 200,
    "revelationType": "Medinan",
    "rukus": 20
  },
  {
    "number": 4,
    "name": {
      "arabic": "سُورَةُ النِّسَاءِ",
      "transliteration": "An-Nisaa",
      "en": "The Women",
      "fr": "Les Femmes"
    },
    "totalAyahs": 176,
    "revelationType": "Medinan",
    "rukus": 18
  },
  {
    "number": 5,
    "name": {
      "arabic": "سُورَةُ المَائـِدَةِ",
      "transliteration": "Al-Maaida",
      "en": "The Table",
      "fr": "La Table Servie"
    },
    "totalAyahs": 120,
    "revelationType": "Medinan",
    "rukus": 12
  },
  {
    "number": 6,
    "name": {
      "arabic": "سُورَةُ الأَنۡعَامِ",
      "transliteration": "Al-An'aam",
      "en": "The Cattle",
      "fr": "Les Bestiaux"
    },
    "totalAyahs": 165,
    "revelationType": "Meccan",
    "rukus": 17
  },
  {
    "number": 7,
    "name": {
      "arabic": "سُورَةُ الأَعۡرَافِ",
      "transliteration": "Al-A'raaf",
      "en": "The Heights",
      "fr": "Les Murailles"
    },
    "totalAyahs": 206,
    "revelationType": "Meccan",
    "rukus": 21
  },
  {
    "number": 8,
    "name": {
      "arabic": "سُورَةُ الأَنفَالِ",
      "transliteration": "Al-Anfaal",
      "en": "The Spoils of War",
      "fr": "Le Butin"
    },
    "totalAyahs": 75,
    "revelationType": "Medinan",
    "rukus": 8
  },
  {
    "number": 9,
    "name": {
      "arabic": "سُورَةُ التَّوۡبَةِ",
      "transliteration": "At-Tawba",
      "en": "The Repentance",
      "fr": "Le Repentir"
    },
    "totalAyahs": 129,
    "revelationType": "Medinan",
    "rukus": 13
  },
  {
    "number": 10,
    "name": {
      "arabic": "سُورَةُ يُونُسَ",
      "transliteration": "Yunus",
      "en": "Jonas",
      "fr": "Jonas"
    },
    "totalAyahs": 109,
    "revelationType": "Meccan",
    "rukus": 11
  },
  {
    "number": 11,
    "name": {
      "arabic": "سُورَةُ هُودٍ",
      "transliteration": "Hud",
      "en": "Hud",
      "fr": "Houd"
    },
    "totalAyahs": 123,
    "revelationType": "Meccan",
    "rukus": 13
  },
  {
    "number": 12,
    "name": {
      "arabic": "سُورَةُ يُوسُفَ",
      "transliteration": "Yusuf",
      "en": "Joseph",
      "fr": "Joseph"
    },
    "totalAyahs": 111,
    "revelationType": "Meccan",
    "rukus": 12
  },
  {
    "number": 13,
    "name": {
      "arabic": "سُورَةُ الرَّعۡدِ",
      "transliteration": "Ar-Ra'd",
      "en": "The Thunder",
      "fr": "Le Tonnerre"
    },
    "totalAyahs": 43,
    "revelationType": "Medinan",
    "rukus": 5
  },
  {
    "number": 14,
    "name": {
      "arabic": "سُورَةُ إِبۡرَاهِيمَ",
      "transliteration": "Ibrahim",
      "en": "Abraham",
      "fr": "Abraham"
    },
    "totalAyahs": 52,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 15,
    "name": {
      "arabic": "سُورَةُ الحِجۡرِ",
      "transliteration": "Al-Hijr",
      "en": "The Rock",
      "fr": "Al-Hijr"
    },
    "totalAyahs": 99,
    "revelationType": "Meccan",
    "rukus": 10
  },
  {
    "number": 16,
    "name": {
      "arabic": "سُورَةُ النَّحۡلِ",
      "transliteration": "An-Nahl",
      "en": "The Bee",
      "fr": "Les Abeilles"
    },
    "totalAyahs": 128,
    "revelationType": "Meccan",
    "rukus": 13
  },
  {
    "number": 17,
    "name": {
      "arabic": "سُورَةُ الإِسۡرَاءِ",
      "transliteration": "Al-Israa",
      "en": "The Night Journey",
      "fr": "Le Voyage Nocturne"
    },
    "totalAyahs": 111,
    "revelationType": "Meccan",
    "rukus": 12
  },
  {
    "number": 18,
    "name": {
      "arabic": "سُورَةُ الكَهۡفِ",
      "transliteration": "Al-Kahf",
      "en": "The Cave",
      "fr": "La Caverne"
    },
    "totalAyahs": 110,
    "revelationType": "Meccan",
    "rukus": 11
  },
  {
    "number": 19,
    "name": {
      "arabic": "سُورَةُ مَرۡيَمَ",
      "transliteration": "Maryam",
      "en": "Mary",
      "fr": "Marie"
    },
    "totalAyahs": 98,
    "revelationType": "Meccan",
    "rukus": 10
  },
  {
    "number": 20,
    "name": {
      "arabic": "سُورَةُ طه",
      "transliteration": "Taa-Haa",
      "en": "Taa-Haa",
      "fr": "Ta-Ha"
    },
    "totalAyahs": 135,
    "revelationType": "Meccan",
    "rukus": 14
  },
  {
    "number": 21,
    "name": {
      "arabic": "سُورَةُ الأَنبِيَاءِ",
      "transliteration": "Al-Anbiyaa",
      "en": "The Prophets",
      "fr": "Les Prophètes"
    },
    "totalAyahs": 112,
    "revelationType": "Meccan",
    "rukus": 12
  },
  {
    "number": 22,
    "name": {
      "arabic": "سُورَةُ الحَجِّ",
      "transliteration": "Al-Hajj",
      "en": "The Pilgrimage",
      "fr": "Le Pèlerinage"
    },
    "totalAyahs": 78,
    "revelationType": "Medinan",
    "rukus": 8
  },
  {
    "number": 23,
    "name": {
      "arabic": "سُورَةُ المُؤۡمِنُونَ",
      "transliteration": "Al-Muminoon",
      "en": "The Believers",
      "fr": "Les Croyants"
    },
    "totalAyahs": 118,
    "revelationType": "Meccan",
    "rukus": 12
  },
  {
    "number": 24,
    "name": {
      "arabic": "سُورَةُ النُّورِ",
      "transliteration": "An-Noor",
      "en": "The Light",
      "fr": "La Lumière"
    },
    "totalAyahs": 64,
    "revelationType": "Medinan",
    "rukus": 7
  },
  {
    "number": 25,
    "name": {
      "arabic": "سُورَةُ الفُرۡقَانِ",
      "transliteration": "Al-Furqaan",
      "en": "The Criterion",
      "fr": "Le Discernement"
    },
    "totalAyahs": 77,
    "revelationType": "Meccan",
    "rukus": 8
  },
  {
    "number": 26,
    "name": {
      "arabic": "سُورَةُ الشُّعَرَاءِ",
      "transliteration": "Ash-Shu'araa",
      "en": "The Poets",
      "fr": "Les Poètes"
    },
    "totalAyahs": 227,
    "revelationType": "Meccan",
    "rukus": 23
  },
  {
    "number": 27,
    "name": {
      "arabic": "سُورَةُ النَّمۡلِ",
      "transliteration": "An-Naml",
      "en": "The Ant",
      "fr": "Les Fourmis"
    },
    "totalAyahs": 93,
    "revelationType": "Meccan",
    "rukus": 10
  },
  {
    "number": 28,
    "name": {
      "arabic": "سُورَةُ القَصَصِ",
      "transliteration": "Al-Qasas",
      "en": "The Stories",
      "fr": "Le Récit"
    },
    "totalAyahs": 88,
    "revelationType": "Meccan",
    "rukus": 9
  },
  {
    "number": 29,
    "name": {
      "arabic": "سُورَةُ العَنكَبُوتِ",
      "transliteration": "Al-Ankaboot",
      "en": "The Spider",
      "fr": "L'Araignée"
    },
    "totalAyahs": 69,
    "revelationType": "Meccan",
    "rukus": 7
  },
  {
    "number": 30,
    "name": {
      "arabic": "سُورَةُ الرُّومِ",
      "transliteration": "Ar-Room",
      "en": "The Romans",
      "fr": "Les Romains"
    },
    "totalAyahs": 60,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 31,
    "name": {
      "arabic": "سُورَةُ لُقۡمَانَ",
      "transliteration": "Luqman",
      "en": "Luqman",
      "fr": "Luqman"
    },
    "totalAyahs": 34,
    "revelationType": "Meccan",
    "rukus": 4
  },
  {
    "number": 32,
    "name": {
      "arabic": "سُورَةُ السَّجۡدَةِ",
      "transliteration": "As-Sajda",
      "en": "The Prostration",
      "fr": "La Prosternation"
    },
    "totalAyahs": 30,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 33,
    "name": {
      "arabic": "سُورَةُ الأَحۡزَابِ",
      "transliteration": "Al-Ahzaab",
      "en": "The Clans",
      "fr": "Les Coalisés"
    },
    "totalAyahs": 73,
    "revelationType": "Medinan",
    "rukus": 8
  },
  {
    "number": 34,
    "name": {
      "arabic": "سُورَةُ سَبَإٍ",
      "transliteration": "Saba",
      "en": "Sheba",
      "fr": "Saba"
    },
    "totalAyahs": 54,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 35,
    "name": {
      "arabic": "سُورَةُ فَاطِرٍ",
      "transliteration": "Faatir",
      "en": "The Originator",
      "fr": "Le Créateur"
    },
    "totalAyahs": 45,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 36,
    "name": {
      "arabic": "سُورَةُ يسٓ",
      "transliteration": "Yaseen",
      "en": "Yaseen",
      "fr": "Ya-Sin"
    },
    "totalAyahs": 83,
    "revelationType": "Meccan",
    "rukus": 9
  },
  {
    "number": 37,
    "name": {
      "arabic": "سُورَةُ الصَّافَّاتِ",
      "transliteration": "As-Saaffaat",
      "en": "Those drawn up in Ranks",
      "fr": "Les Rangées"
    },
    "totalAyahs": 182,
    "revelationType": "Meccan",
    "rukus": 19
  },
  {
    "number": 38,
    "name": {
      "arabic": "سُورَةُ صٓ",
      "transliteration": "Saad",
      "en": "The letter Saad",
      "fr": "Sad"
    },
    "totalAyahs": 88,
    "revelationType": "Meccan",
    "rukus": 9
  },
  {
    "number": 39,
    "name": {
      "arabic": "سُورَةُ الزُّمَرِ",
      "transliteration": "Az-Zumar",
      "en": "The Groups",
      "fr": "Les Groupes"
    },
    "totalAyahs": 75,
    "revelationType": "Meccan",
    "rukus": 8
  },
  {
    "number": 40,
    "name": {
      "arabic": "سُورَةُ غَافِرٍ",
      "transliteration": "Ghafir",
      "en": "The Forgiver",
      "fr": "Le Pardonneur"
    },
    "totalAyahs": 85,
    "revelationType": "Meccan",
    "rukus": 9
  },
  {
    "number": 41,
    "name": {
      "arabic": "سُورَةُ فُصِّلَتۡ",
      "transliteration": "Fussilat",
      "en": "Explained in detail",
      "fr": "Les Versets Détaillés"
    },
    "totalAyahs": 54,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 42,
    "name": {
      "arabic": "سُورَةُ الشُّورَىٰ",
      "transliteration": "Ash-Shura",
      "en": "Consultation",
      "fr": "La Consultation"
    },
    "totalAyahs": 53,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 43,
    "name": {
      "arabic": "سُورَةُ الزُّخۡرُفِ",
      "transliteration": "Az-Zukhruf",
      "en": "Ornaments of gold",
      "fr": "L'Ornement"
    },
    "totalAyahs": 89,
    "revelationType": "Meccan",
    "rukus": 9
  },
  {
    "number": 44,
    "name": {
      "arabic": "سُورَةُ الدُّخَانِ",
      "transliteration": "Ad-Dukhaan",
      "en": "The Smoke",
      "fr": "La Fumée"
    },
    "totalAyahs": 59,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 45,
    "name": {
      "arabic": "سُورَةُ الجَاثِيَةِ",
      "transliteration": "Al-Jaathiya",
      "en": "Crouching",
      "fr": "L'Agenouillée"
    },
    "totalAyahs": 37,
    "revelationType": "Meccan",
    "rukus": 4
  },
  {
    "number": 46,
    "name": {
      "arabic": "سُورَةُ الأَحۡقَافِ",
      "transliteration": "Al-Ahqaf",
      "en": "The Dunes",
      "fr": "Al-Ahqaf"
    },
    "totalAyahs": 35,
    "revelationType": "Meccan",
    "rukus": 4
  },
  {
    "number": 47,
    "name": {
      "arabic": "سُورَةُ مُحَمَّدٍ",
      "transliteration": "Muhammad",
      "en": "Muhammad",
      "fr": "Muhammad"
    },
    "totalAyahs": 38,
    "revelationType": "Medinan",
    "rukus": 4
  },
  {
    "number": 48,
    "name": {
      "arabic": "سُورَةُ الفَتۡحِ",
      "transliteration": "Al-Fath",
      "en": "The Victory",
      "fr": "La Victoire Éclatante"
    },
    "totalAyahs": 29,
    "revelationType": "Medinan",
    "rukus": 3
  },
  {
    "number": 49,
    "name": {
      "arabic": "سُورَةُ الحُجُرَاتِ",
      "transliteration": "Al-Hujuraat",
      "en": "The Inner Apartments",
      "fr": "Les Appartements"
    },
    "totalAyahs": 18,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 50,
    "name": {
      "arabic": "سُورَةُ قٓ",
      "transliteration": "Qaaf",
      "en": "The letter Qaaf",
      "fr": "Qaf"
    },
    "totalAyahs": 45,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 51,
    "name": {
      "arabic": "سُورَةُ الذَّارِيَاتِ",
      "transliteration": "Adh-Dhaariyat",
      "en": "The Winnowing Winds",
      "fr": "Qui Éparpillent"
    },
    "totalAyahs": 60,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 52,
    "name": {
      "arabic": "سُورَةُ الطُّورِ",
      "transliteration": "At-Tur",
      "en": "The Mount",
      "fr": "At-Tur"
    },
    "totalAyahs": 49,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 53,
    "name": {
      "arabic": "سُورَةُ النَّجۡمِ",
      "transliteration": "An-Najm",
      "en": "The Star",
      "fr": "L'Étoile"
    },
    "totalAyahs": 62,
    "revelationType": "Meccan",
    "rukus": 7
  },
  {
    "number": 54,
    "name": {
      "arabic": "سُورَةُ القَمَرِ",
      "transliteration": "Al-Qamar",
      "en": "The Moon",
      "fr": "La Lune"
    },
    "totalAyahs": 55,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 55,
    "name": {
      "arabic": "سُورَةُ الرَّحۡمَٰن",
      "transliteration": "Ar-Rahmaan",
      "en": "The Beneficent",
      "fr": "Le Tout Miséricordieux"
    },
    "totalAyahs": 78,
    "revelationType": "Medinan",
    "rukus": 8
  },
  {
    "number": 56,
    "name": {
      "arabic": "سُورَةُ الوَاقِعَةِ",
      "transliteration": "Al-Waaqia",
      "en": "The Inevitable",
      "fr": "L'Événement"
    },
    "totalAyahs": 96,
    "revelationType": "Meccan",
    "rukus": 10
  },
  {
    "number": 57,
    "name": {
      "arabic": "سُورَةُ الحَدِيدِ",
      "transliteration": "Al-Hadid",
      "en": "The Iron",
      "fr": "Le Fer"
    },
    "totalAyahs": 29,
    "revelationType": "Medinan",
    "rukus": 3
  },
  {
    "number": 58,
    "name": {
      "arabic": "سُورَةُ المُجَادلَةِ",
      "transliteration": "Al-Mujaadila",
      "en": "The Pleading Woman",
      "fr": "La Discussion"
    },
    "totalAyahs": 22,
    "revelationType": "Medinan",
    "rukus": 3
  },
  {
    "number": 59,
    "name": {
      "arabic": "سُورَةُ الحَشۡرِ",
      "transliteration": "Al-Hashr",
      "en": "The Exile",
      "fr": "L'Exode"
    },
    "totalAyahs": 24,
    "revelationType": "Medinan",
    "rukus": 3
  },
  {
    "number": 60,
    "name": {
      "arabic": "سُورَةُ المُمۡتَحنَةِ",
      "transliteration": "Al-Mumtahana",
      "en": "She that is to be examined",
      "fr": "L'Éprouvée"
    },
    "totalAyahs": 13,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 61,
    "name": {
      "arabic": "سُورَةُ الصَّفِّ",
      "transliteration": "As-Saff",
      "en": "The Ranks",
      "fr": "Le Rang"
    },
    "totalAyahs": 14,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 62,
    "name": {
      "arabic": "سُورَةُ الجُمُعَةِ",
      "transliteration": "Al-Jumu'a",
      "en": "Friday",
      "fr": "Le Vendredi"
    },
    "totalAyahs": 11,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 63,
    "name": {
      "arabic": "سُورَةُ المُنَافِقُونَ",
      "transliteration": "Al-Munaafiqoon",
      "en": "The Hypocrites",
      "fr": "Les Hypocrites"
    },
    "totalAyahs": 11,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 64,
    "name": {
      "arabic": "سُورَةُ التَّغَابُنِ",
      "transliteration": "At-Taghaabun",
      "en": "Mutual Disillusion",
      "fr": "La Grande Perte"
    },
    "totalAyahs": 18,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 65,
    "name": {
      "arabic": "سُورَةُ الطَّلَاقِ",
      "transliteration": "At-Talaaq",
      "en": "Divorce",
      "fr": "Le Divorce"
    },
    "totalAyahs": 12,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 66,
    "name": {
      "arabic": "سُورَةُ التَّحۡرِيمِ",
      "transliteration": "At-Tahrim",
      "en": "The Prohibition",
      "fr": "L'Interdiction"
    },
    "totalAyahs": 12,
    "revelationType": "Medinan",
    "rukus": 2
  },
  {
    "number": 67,
    "name": {
      "arabic": "سُورَةُ المُلۡكِ",
      "transliteration": "Al-Mulk",
      "en": "The Sovereignty",
      "fr": "La Royauté"
    },
    "totalAyahs": 30,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 68,
    "name": {
      "arabic": "سُورَةُ القَلَمِ",
      "transliteration": "Al-Qalam",
      "en": "The Pen",
      "fr": "La Plume"
    },
    "totalAyahs": 52,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 69,
    "name": {
      "arabic": "سُورَةُ الحَاقَّةِ",
      "transliteration": "Al-Haaqqa",
      "en": "The Reality",
      "fr": "Celle qui Montre la Vérité"
    },
    "totalAyahs": 52,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 70,
    "name": {
      "arabic": "سُورَةُ المَعَارِجِ",
      "transliteration": "Al-Ma'aarij",
      "en": "The Ascending Stairways",
      "fr": "Les Voies d'Ascension"
    },
    "totalAyahs": 44,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 71,
    "name": {
      "arabic": "سُورَةُ نُوحٍ",
      "transliteration": "Nooh",
      "en": "Noah",
      "fr": "Noé"
    },
    "totalAyahs": 28,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 72,
    "name": {
      "arabic": "سُورَةُ الجِنِّ",
      "transliteration": "Al-Jinn",
      "en": "The Jinn",
      "fr": "Les Djinns"
    },
    "totalAyahs": 28,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 73,
    "name": {
      "arabic": "سُورَةُ المُزَّمِّلِ",
      "transliteration": "Al-Muzzammil",
      "en": "The Enshrouded One",
      "fr": "L'Enveloppé"
    },
    "totalAyahs": 20,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 74,
    "name": {
      "arabic": "سُورَةُ المُدَّثِّرِ",
      "transliteration": "Al-Muddaththir",
      "en": "The Cloaked One",
      "fr": "Le Revêtu d'un Manteau"
    },
    "totalAyahs": 56,
    "revelationType": "Meccan",
    "rukus": 6
  },
  {
    "number": 75,
    "name": {
      "arabic": "سُورَةُ القِيَامَةِ",
      "transliteration": "Al-Qiyaama",
      "en": "The Resurrection",
      "fr": "La Résurrection"
    },
    "totalAyahs": 40,
    "revelationType": "Meccan",
    "rukus": 4
  },
  {
    "number": 76,
    "name": {
      "arabic": "سُورَةُ الإِنسَانِ",
      "transliteration": "Al-Insaan",
      "en": "Man",
      "fr": "L'Homme"
    },
    "totalAyahs": 31,
    "revelationType": "Medinan",
    "rukus": 4
  },
  {
    "number": 77,
    "name": {
      "arabic": "سُورَةُ المُرۡسَلَاتِ",
      "transliteration": "Al-Mursalaat",
      "en": "The Emissaries",
      "fr": "Les Envoyés"
    },
    "totalAyahs": 50,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 78,
    "name": {
      "arabic": "سُورَةُ النَّبَإِ",
      "transliteration": "An-Naba",
      "en": "The Announcement",
      "fr": "La Nouvelle"
    },
    "totalAyahs": 40,
    "revelationType": "Meccan",
    "rukus": 4
  },
  {
    "number": 79,
    "name": {
      "arabic": "سُورَةُ النَّازِعَاتِ",
      "transliteration": "An-Naazi'aat",
      "en": "Those who drag forth",
      "fr": "Les Anges qui Arrachent"
    },
    "totalAyahs": 46,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 80,
    "name": {
      "arabic": "سُورَةُ عَبَسَ",
      "transliteration": "Abasa",
      "en": "He frowned",
      "fr": "Il S'est Renfrogné"
    },
    "totalAyahs": 42,
    "revelationType": "Meccan",
    "rukus": 5
  },
  {
    "number": 81,
    "name": {
      "arabic": "سُورَةُ التَّكۡوِيرِ",
      "transliteration": "At-Takwir",
      "en": "The Overthrowing",
      "fr": "L'Obscurcissement"
    },
    "totalAyahs": 29,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 82,
    "name": {
      "arabic": "سُورَةُ الانفِطَارِ",
      "transliteration": "Al-Infitaar",
      "en": "The Cleaving",
      "fr": "La Rupture"
    },
    "totalAyahs": 19,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 83,
    "name": {
      "arabic": "سُورَةُ المُطَفِّفِينَ",
      "transliteration": "Al-Mutaffifin",
      "en": "Defrauding",
      "fr": "Les Fraudeurs"
    },
    "totalAyahs": 36,
    "revelationType": "Meccan",
    "rukus": 4
  },
  {
    "number": 84,
    "name": {
      "arabic": "سُورَةُ الانشِقَاقِ",
      "transliteration": "Al-Inshiqaaq",
      "en": "The Splitting Open",
      "fr": "La Déchirure"
    },
    "totalAyahs": 25,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 85,
    "name": {
      "arabic": "سُورَةُ البُرُوجِ",
      "transliteration": "Al-Burooj",
      "en": "The Constellations",
      "fr": "Les Constellations"
    },
    "totalAyahs": 22,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 86,
    "name": {
      "arabic": "سُورَةُ الطَّارِقِ",
      "transliteration": "At-Taariq",
      "en": "The Morning Star",
      "fr": "L'Astre Nocturne"
    },
    "totalAyahs": 17,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 87,
    "name": {
      "arabic": "سُورَةُ الأَعۡلَىٰ",
      "transliteration": "Al-A'laa",
      "en": "The Most High",
      "fr": "Le Très-Haut"
    },
    "totalAyahs": 19,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 88,
    "name": {
      "arabic": "سُورَةُ الغَاشِيَةِ",
      "transliteration": "Al-Ghaashiya",
      "en": "The Overwhelming",
      "fr": "L'Enveloppante"
    },
    "totalAyahs": 26,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 89,
    "name": {
      "arabic": "سُورَةُ الفَجۡرِ",
      "transliteration": "Al-Fajr",
      "en": "The Dawn",
      "fr": "L'Aube"
    },
    "totalAyahs": 30,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 90,
    "name": {
      "arabic": "سُورَةُ البَلَدِ",
      "transliteration": "Al-Balad",
      "en": "The City",
      "fr": "La Cité"
    },
    "totalAyahs": 20,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 91,
    "name": {
      "arabic": "سُورَةُ الشَّمۡسِ",
      "transliteration": "Ash-Shams",
      "en": "The Sun",
      "fr": "Le Soleil"
    },
    "totalAyahs": 15,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 92,
    "name": {
      "arabic": "سُورَةُ اللَّيۡلِ",
      "transliteration": "Al-Lail",
      "en": "The Night",
      "fr": "La Nuit"
    },
    "totalAyahs": 21,
    "revelationType": "Meccan",
    "rukus": 3
  },
  {
    "number": 93,
    "name": {
      "arabic": "سُورَةُ الضُّحَىٰ",
      "transliteration": "Ad-Dhuhaa",
      "en": "The Morning Hours",
      "fr": "Le Jour Montant"
    },
    "totalAyahs": 11,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 94,
    "name": {
      "arabic": "سُورَةُ الشَّرۡحِ",
      "transliteration": "Ash-Sharh",
      "en": "The Consolation",
      "fr": "L'Ouverture de la Poitrine"
    },
    "totalAyahs": 8,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 95,
    "name": {
      "arabic": "سُورَةُ التِّينِ",
      "transliteration": "At-Tin",
      "en": "The Fig",
      "fr": "Le Figuier"
    },
    "totalAyahs": 8,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 96,
    "name": {
      "arabic": "سُورَةُ العَلَقِ",
      "transliteration": "Al-Alaq",
      "en": "The Clot",
      "fr": "L'Adhérence"
    },
    "totalAyahs": 19,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 97,
    "name": {
      "arabic": "سُورَةُ القَدۡرِ",
      "transliteration": "Al-Qadr",
      "en": "The Power, Fate",
      "fr": "La Destinée"
    },
    "totalAyahs": 5,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 98,
    "name": {
      "arabic": "سُورَةُ البَيِّنَةِ",
      "transliteration": "Al-Bayyina",
      "en": "The Evidence",
      "fr": "La Preuve"
    },
    "totalAyahs": 8,
    "revelationType": "Medinan",
    "rukus": 1
  },
  {
    "number": 99,
    "name": {
      "arabic": "سُورَةُ الزَّلۡزَلَةِ",
      "transliteration": "Az-Zalzala",
      "en": "The Earthquake",
      "fr": "La Secousse"
    },
    "totalAyahs": 8,
    "revelationType": "Medinan",
    "rukus": 1
  },
  {
    "number": 100,
    "name": {
      "arabic": "سُورَةُ العَادِيَاتِ",
      "transliteration": "Al-Aadiyaat",
      "en": "The Chargers",
      "fr": "Les Coursiers"
    },
    "totalAyahs": 11,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 101,
    "name": {
      "arabic": "سُورَةُ القَارِعَةِ",
      "transliteration": "Al-Qaari'a",
      "en": "The Calamity",
      "fr": "Le Fracas"
    },
    "totalAyahs": 11,
    "revelationType": "Meccan",
    "rukus": 2
  },
  {
    "number": 102,
    "name": {
      "arabic": "سُورَةُ التَّكَاثُرِ",
      "transliteration": "At-Takaathur",
      "en": "Competition",
      "fr": "La Course aux Richesses"
    },
    "totalAyahs": 8,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 103,
    "name": {
      "arabic": "سُورَةُ العَصۡرِ",
      "transliteration": "Al-Asr",
      "en": "The Declining Day, Epoch",
      "fr": "Le Temps"
    },
    "totalAyahs": 3,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 104,
    "name": {
      "arabic": "سُورَةُ الهُمَزَةِ",
      "transliteration": "Al-Humaza",
      "en": "The Traducer",
      "fr": "Les Calomniateurs"
    },
    "totalAyahs": 9,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 105,
    "name": {
      "arabic": "سُورَةُ الفِيلِ",
      "transliteration": "Al-Fil",
      "en": "The Elephant",
      "fr": "L'Éléphant"
    },
    "totalAyahs": 5,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 106,
    "name": {
      "arabic": "سُورَةُ قُرَيۡشٍ",
      "transliteration": "Quraish",
      "en": "Quraysh",
      "fr": "Quraych"
    },
    "totalAyahs": 4,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 107,
    "name": {
      "arabic": "سُورَةُ المَاعُونِ",
      "transliteration": "Al-Maa'un",
      "en": "Almsgiving",
      "fr": "L'Ustensile"
    },
    "totalAyahs": 7,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 108,
    "name": {
      "arabic": "سُورَةُ الكَوۡثَرِ",
      "transliteration": "Al-Kawthar",
      "en": "Abundance",
      "fr": "L'Abondance"
    },
    "totalAyahs": 3,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 109,
    "name": {
      "arabic": "سُورَةُ الكَافِرُونَ",
      "transliteration": "Al-Kaafiroon",
      "en": "The Disbelievers",
      "fr": "Les Infidèles"
    },
    "totalAyahs": 6,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 110,
    "name": {
      "arabic": "سُورَةُ النَّصۡرِ",
      "transliteration": "An-Nasr",
      "en": "Divine Support",
      "fr": "Les Secours"
    },
    "totalAyahs": 3,
    "revelationType": "Medinan",
    "rukus": 1
  },
  {
    "number": 111,
    "name": {
      "arabic": "سُورَةُ المَسَدِ",
      "transliteration": "Al-Masad",
      "en": "The Palm Fibre",
      "fr": "Les Fibres"
    },
    "totalAyahs": 5,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 112,
    "name": {
      "arabic": "سُورَةُ الإِخۡلَاصِ",
      "transliteration": "Al-Ikhlaas",
      "en": "Sincerity",
      "fr": "Le Monothéisme Pur"
    },
    "totalAyahs": 4,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 113,
    "name": {
      "arabic": "سُورَةُ الفَلَقِ",
      "transliteration": "Al-Falaq",
      "en": "The Dawn",
      "fr": "L'Aube Naissante"
    },
    "totalAyahs": 5,
    "revelationType": "Meccan",
    "rukus": 1
  },
  {
    "number": 114,
    "name": {
      "arabic": "سُورَةُ النَّاسِ",
      "transliteration": "An-Naas",
      "en": "Mankind",
      "fr": "Les Hommes"
    },
    "totalAyahs": 6,
    "revelationType": "Meccan",
    "rukus": 1
  }
];

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
    return `https://quran.com/${surahNumber}/${ayahNumber}`;
  }
  return `https://quran.com/${surahNumber}`;
}

