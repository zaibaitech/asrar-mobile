import {
    PLANET_IDENTITY_MAP,
    ZODIAC_IDENTITY_MAP,
    resolveZodiacKey,
    zodiacKeyFromBurjIndex,
    type SupportedLanguage,
    type ZodiacIdentity,
} from '@/constants/identityMaps';
import type { ZodiacSign } from '@/services/PlanetTransitService';

export type Language = SupportedLanguage;

type FormatOptions = {
  /**
   * Forces bilingual output even when UI language is Arabic.
   * Example: "Scorpio (العقرب)" instead of "العقرب".
   */
  forceBilingual?: boolean;
  /**
   * When UI language is Arabic and `forceBilingual` is true, choose which
   * primary language to show before Arabic.
   */
  primaryWhenArabic?: 'en' | 'fr';
  /** Include zodiac glyph (e.g., ♏) when available. */
  includeGlyph?: boolean;
  /** When UI language is Arabic and bilingual output is enabled, show Arabic first: "العقرب (Scorpio)" */
  arabicFirst?: boolean;
};

export function resolveUserZodiacKey(params: {
  burjIndex?: unknown;
  burj?: unknown;
}): ZodiacSign | null {
  const byIndex = zodiacKeyFromBurjIndex(params.burjIndex);
  if (byIndex) return byIndex;
  return resolveZodiacKey(params.burj);
}

function withGlyph(label: string, identity?: ZodiacIdentity, includeGlyph?: boolean) {
  if (!includeGlyph || !identity?.symbol) return label;
  return `${identity.symbol} ${label}`;
}

/**
 * Format zodiac name with active language + Arabic in parentheses
 * EN: "Scorpio (العقرب)"
 * FR: "Scorpion (العقرب)"
 * AR: "العقرب"
 */
export function formatZodiacWithArabic(
  zodiacKey: ZodiacSign,
  language: Language,
  options: FormatOptions = {}
): string {
  const data = ZODIAC_IDENTITY_MAP[zodiacKey];
  const primaryWhenArabic = options.primaryWhenArabic ?? 'en';

  if (!data) {
    return zodiacKey.charAt(0).toUpperCase() + zodiacKey.slice(1);
  }

  // Default Arabic UI behavior is Arabic-only, unless forced.
  if (language === 'ar' && !options.forceBilingual) {
    return withGlyph(data.ar, data, options.includeGlyph);
  }

  // EN/FR: "Scorpio (العقرب)"
  if (language !== 'ar') {
    const primary = data[language];
    const rendered = primary && data.ar ? `${primary} (${data.ar})` : primary || data.ar;
    return withGlyph(rendered, data, options.includeGlyph);
  }

  // AR bilingual (future): "العقرب (Scorpio)" (or French if configured)
  const latin = data[primaryWhenArabic];
  const rendered = options.arabicFirst
    ? `${data.ar}${latin ? ` (${latin})` : ''}`
    : `${latin}${data.ar ? ` (${data.ar})` : ''}`;
  return withGlyph(rendered, data, options.includeGlyph);
}

/**
 * Format planet name with active language + Arabic in parentheses
 * EN: "Mars (المريخ)"
 * FR: "Mars (المريخ)"
 * AR: "المريخ"
 */
export function formatPlanetWithArabic(
  planetKey: string,
  language: Language,
  options: FormatOptions = {}
): string {
  const key = planetKey.toLowerCase();
  const data = PLANET_IDENTITY_MAP[key];
  const primaryWhenArabic = options.primaryWhenArabic ?? 'en';

  if (!data) {
    return planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
  }

  if (language === 'ar' && !options.forceBilingual) {
    return data.ar;
  }

  const primary = language === 'ar' ? data[primaryWhenArabic] : data[language];
  return primary && data.ar ? `${primary} (${data.ar})` : primary || data.ar;
}

/**
 * Get zodiac name in active language only (no Arabic suffix)
 */
export function getZodiacName(
  zodiacKey: ZodiacSign,
  language: Language,
  _translations: any
): string {
  const data = ZODIAC_IDENTITY_MAP[zodiacKey];
  if (!data) return zodiacKey.charAt(0).toUpperCase() + zodiacKey.slice(1);
  return language === 'ar' ? data.ar : data[language];
}

/**
 * Get planet name in active language only (no Arabic suffix)
 */
export function getPlanetName(
  planetKey: string,
  language: Language,
  _translations: any
): string {
  const key = planetKey.toLowerCase();
  const data = PLANET_IDENTITY_MAP[key];
  if (!data) return planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
  return language === 'ar' ? data.ar : data[language];
}

/**
 * Get Arabic name only
 */
export function getArabicName(
  key: string,
  type: 'zodiac' | 'planet',
  translations: any
): string {
  const lower = key.toLowerCase();
  if (type === 'zodiac') {
    const data = (ZODIAC_IDENTITY_MAP as any)[lower];
    return data?.ar || '';
  }
  return PLANET_IDENTITY_MAP[lower]?.ar || '';
}
