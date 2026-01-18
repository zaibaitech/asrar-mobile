/**
 * Arabic Astrological Terminology
 * ================================
 * 
 * Authentic Arabic terms used in traditional Islamic astronomy (ʿilm al-nujūm)
 * and astrology (ʿilm al-aḥkām al-nujūm)
 */

/**
 * Planet names in Arabic
 * Based on classical Islamic astronomical texts
 */
export const ARABIC_PLANETS: Record<string, string> = {
  SUN: 'الشمس',      // ash-Shams
  MOON: 'القمر',     // al-Qamar
  MERCURY: 'عطارد',  // ʿUṭārid
  VENUS: 'الزهرة',   // az-Zuhra
  MARS: 'المريخ',    // al-Mirrīkh
  JUPITER: 'المشتري', // al-Mushtarī
  SATURN: 'زحل',     // Zuḥal
};

/**
 * Zodiac sign names in Arabic
 * Based on classical burūj (بروج) system
 */
export const ARABIC_ZODIAC: Record<string, string> = {
  ARIES: 'الحمل',       // al-Ḥamal (The Ram)
  TAURUS: 'الثور',      // ath-Thawr (The Bull)
  GEMINI: 'الجوزاء',    // al-Jawzāʾ (The Twins)
  CANCER: 'السرطان',    // as-Saraṭān (The Crab)
  LEO: 'الأسد',         // al-Asad (The Lion)
  VIRGO: 'العذراء',     // al-ʿAdhrāʾ (The Virgin)
  LIBRA: 'الميزان',     // al-Mīzān (The Scale)
  SCORPIO: 'العقرب',    // al-ʿAqrab (The Scorpion)
  SAGITTARIUS: 'القوس', // al-Qaws (The Bow)
  CAPRICORN: 'الجدي',   // al-Jadī (The Goat)
  AQUARIUS: 'الدلو',    // ad-Dalw (The Bucket)
  PISCES: 'الحوت',      // al-Ḥūt (The Fish)
};

/**
 * Classical astrological terms
 */
export const ARABIC_TERMS = {
  // Auspiciousness (السعادة والنحوسة)
  saad: 'سَعْد',              // Saʿd (auspicious/fortunate)
  saadJiddan: 'سَعْد جِدًّا',   // Saʿd jiddan (very auspicious)
  nahs: 'نَحْس',              // Naḥs (inauspicious/challenging)
  nahsJiddan: 'نَحْس جِدًّا',  // Naḥs jiddan (very challenging)
  
  // Motion (الحركة)
  mustaqim: 'مُسْتَقِيم',      // Mustaqīm (direct motion)
  raji: 'راجِع',              // Rājiʿ (retrograde)
  
  // Qualities (الصفات)
  muayyid: 'مُؤَيِّد',        // Muʾayyid (supportive)
  mutadil: 'مُعْتَدِل',       // Muʿtadil (balanced/neutral)
  saab: 'صَعْب',              // Ṣaʿb (difficult)
  mumtaz: 'مُمْتَاز',         // Mumtāz (excellent)
  
  // Elements (العناصر)
  nar: 'نار',                 // Nār (Fire)
  ma: 'ماء',                  // Māʾ (Water)
  hawa: 'هواء',               // Hawāʾ (Air)
  turab: 'تراب',              // Turāb (Earth)
  
  // Zodiac concepts
  burj: 'برج',                // Burj (sign)
  buruj: 'بروج',              // Burūj (zodiac)
  
  // Transit terms
  intiqal: 'انتقال',          // Intiqāl (transit)
  manzil: 'منزل',             // Manzil (station/mansion)
};

/**
 * Get Arabic name for a planet
 */
export function getPlanetArabicName(planet: string): string {
  const key = planet.toUpperCase();
  return ARABIC_PLANETS[key] || planet;
}

/**
 * Get Arabic name for a zodiac sign
 */
export function getZodiacArabicName(sign: string): string {
  const key = sign.toUpperCase();
  return ARABIC_ZODIAC[key] || sign;
}

/**
 * Get Arabic name for an element
 */
export function getElementArabicName(element: string): string {
  switch (element.toLowerCase()) {
    case 'fire': return ARABIC_TERMS.nar;
    case 'water': return ARABIC_TERMS.ma;
    case 'air': return ARABIC_TERMS.hawa;
    case 'earth': return ARABIC_TERMS.turab;
    default: return element;
  }
}

/**
 * Get spiritual quality label with Arabic term
 */
export interface SpiritualQualityLabel {
  main: string;
  arabic: string;
  transliteration: string;
}

export function getSpiritualQualityLabel(
  isAuspicious: boolean,
  language: 'en' | 'fr' | 'ar'
): SpiritualQualityLabel {
  if (isAuspicious) {
    return {
      main: language === 'en' ? 'Auspicious' : language === 'fr' ? 'Favorable' : 'سَعْد',
      arabic: ARABIC_TERMS.saad,
      transliteration: 'Saʿd',
    };
  } else {
    return {
      main: language === 'en' ? 'Challenging' : language === 'fr' ? 'Difficile' : 'نَحْس',
      arabic: ARABIC_TERMS.nahs,
      transliteration: 'Naḥs',
    };
  }
}

/**
 * Get resonance quality with Arabic term
 */
export function getResonanceQuality(
  level: 'excellent' | 'supportive' | 'neutral' | 'challenging',
  language: 'en' | 'fr' | 'ar'
): SpiritualQualityLabel {
  const mapping: Record<string, { en: string; fr: string; ar: string; arabic: string; translit: string }> = {
    excellent: {
      en: 'Excellent',
      fr: 'Excellent',
      ar: 'مُمْتَاز',
      arabic: ARABIC_TERMS.mumtaz,
      translit: 'Mumtāz',
    },
    supportive: {
      en: 'Supportive',
      fr: 'Soutien',
      ar: 'مُؤَيِّد',
      arabic: ARABIC_TERMS.muayyid,
      translit: 'Muʾayyid',
    },
    neutral: {
      en: 'Neutral',
      fr: 'Neutre',
      ar: 'مُعْتَدِل',
      arabic: ARABIC_TERMS.mutadil,
      translit: 'Muʿtadil',
    },
    challenging: {
      en: 'Challenging',
      fr: 'Difficile',
      ar: 'صَعْب',
      arabic: ARABIC_TERMS.saab,
      translit: 'Ṣaʿb',
    },
  };
  
  const data = mapping[level];
  return {
    main: data[language],
    arabic: data.arabic,
    transliteration: data.translit,
  };
}

/**
 * Get motion label with Arabic term
 */
export function getMotionLabel(
  isRetrograde: boolean,
  language: 'en' | 'fr' | 'ar'
): SpiritualQualityLabel {
  if (isRetrograde) {
    return {
      main: language === 'en' ? 'Retrograde' : language === 'fr' ? 'Rétrograde' : 'راجِع',
      arabic: ARABIC_TERMS.raji,
      transliteration: 'Rājiʿ',
    };
  } else {
    return {
      main: language === 'en' ? 'Direct' : language === 'fr' ? 'Direct' : 'مُسْتَقِيم',
      arabic: ARABIC_TERMS.mustaqim,
      transliteration: 'Mustaqīm',
    };
  }
}
