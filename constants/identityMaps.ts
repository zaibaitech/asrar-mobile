import type { ZodiacSign } from '@/services/PlanetTransitService';

export type SupportedLanguage = 'en' | 'fr' | 'ar';

export type TrilingualLabel = {
  en: string;
  fr: string;
  ar: string;
};

export type ZodiacIdentity = {
  key: ZodiacSign;
  symbol?: string;
} & TrilingualLabel;

/**
 * Zodiac identity map
 * - Do not rely on i18n translations for identity anchors.
 * - Keys are stable identifiers used across the app.
 */
export const ZODIAC_IDENTITY_MAP: Record<ZodiacSign, ZodiacIdentity> = {
  aries: { key: 'aries', en: 'Aries', fr: 'Bélier', ar: 'الحمل', symbol: '♈' },
  taurus: { key: 'taurus', en: 'Taurus', fr: 'Taureau', ar: 'الثور', symbol: '♉' },
  gemini: { key: 'gemini', en: 'Gemini', fr: 'Gémeaux', ar: 'الجوزاء', symbol: '♊' },
  cancer: { key: 'cancer', en: 'Cancer', fr: 'Cancer', ar: 'السرطان', symbol: '♋' },
  leo: { key: 'leo', en: 'Leo', fr: 'Lion', ar: 'الأسد', symbol: '♌' },
  virgo: { key: 'virgo', en: 'Virgo', fr: 'Vierge', ar: 'العذراء', symbol: '♍' },
  libra: { key: 'libra', en: 'Libra', fr: 'Balance', ar: 'الميزان', symbol: '♎' },
  scorpio: { key: 'scorpio', en: 'Scorpio', fr: 'Scorpion', ar: 'العقرب', symbol: '♏' },
  sagittarius: { key: 'sagittarius', en: 'Sagittarius', fr: 'Sagittaire', ar: 'القوس', symbol: '♐' },
  capricorn: { key: 'capricorn', en: 'Capricorn', fr: 'Capricorne', ar: 'الجدي', symbol: '♑' },
  aquarius: { key: 'aquarius', en: 'Aquarius', fr: 'Verseau', ar: 'الدلو', symbol: '♒' },
  pisces: { key: 'pisces', en: 'Pisces', fr: 'Poissons', ar: 'الحوت', symbol: '♓' },
};

/**
 * Burj index in `profile.derived.burjIndex` is 0-11 (Aries..Pisces).
 */
export const ZODIAC_KEYS_BY_BURJ_INDEX: ZodiacSign[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

export function zodiacKeyFromBurjIndex(burjIndex: unknown): ZodiacSign | null {
  if (typeof burjIndex !== 'number' || !Number.isFinite(burjIndex)) return null;
  const idx = Math.floor(burjIndex);
  if (idx < 0 || idx >= ZODIAC_KEYS_BY_BURJ_INDEX.length) return null;
  return ZODIAC_KEYS_BY_BURJ_INDEX[idx];
}

const stripArabicDiacritics = (value: string) =>
  value
    // Harakat / tashkeel
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .trim();

const normalizeLatin = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

const normalizeArabic = (value: string) =>
  stripArabicDiacritics(value)
    .replace(/[\sـ\-_.()]/g, '')
    // unify common variants
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

/**
 * Resolve any stored/profile zodiac value (key, EN/FR, or Arabic name) to a canonical zodiac key.
 */
export function resolveZodiacKey(value: unknown): ZodiacSign | null {
  if (!value) return null;

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return null;

    // Already a key?
    const maybeKey = raw.toLowerCase() as ZodiacSign;
    if (maybeKey in ZODIAC_IDENTITY_MAP) return maybeKey;

    const latin = normalizeLatin(raw);
    const arabic = normalizeArabic(raw);

    for (const key of Object.keys(ZODIAC_IDENTITY_MAP) as ZodiacSign[]) {
      const entry = ZODIAC_IDENTITY_MAP[key];
      if (normalizeLatin(entry.en) === latin) return key;
      if (normalizeLatin(entry.fr) === latin) return key;
      if (normalizeArabic(entry.ar) === arabic) return key;
    }
  }

  return null;
}

/**
 * Planet identity map (classical rulers used across Planet Transit)
 */
export const PLANET_IDENTITY_MAP: Record<string, TrilingualLabel> = {
  sun: { en: 'Sun', fr: 'Soleil', ar: 'الشمس' },
  moon: { en: 'Moon', fr: 'Lune', ar: 'القمر' },
  mars: { en: 'Mars', fr: 'Mars', ar: 'المريخ' },
  mercury: { en: 'Mercury', fr: 'Mercure', ar: 'عطارد' },
  jupiter: { en: 'Jupiter', fr: 'Jupiter', ar: 'المشتري' },
  venus: { en: 'Venus', fr: 'Vénus', ar: 'الزهرة' },
  saturn: { en: 'Saturn', fr: 'Saturne', ar: 'زحل' },
};
