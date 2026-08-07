/**
 * Hijri Date Formatting
 * ======================
 * Extracted from components/istikhara/IstikharaSummaryCard.tsx's local
 * formatHijriDate (best-effort, Intl Islamic-calendar support varies by
 * runtime — falls back to '' on unsupported runtimes).
 */

/**
 * Wolof names for the 12 Hijri months. Not present anywhere else in the
 * codebase — these are common Wolof transliterations of the Arabic month
 * names (Wolof does not have distinct native names for the Islamic months;
 * it borrows/transliterates them, similar to many West African languages).
 * NEEDS REVIEW: verify against a native-speaker or established reference
 * before shipping — flagged explicitly, not silently treated as final.
 */
export const WOLOF_HIJRI_MONTH_NAMES: string[] = [
  'Muharram',
  'Safar',
  'Rabiˆul-Awal',
  'Rabiˆus-Saani',
  'Jumaadal-Uula',
  'Jumaadas-Saani',
  'Rajab',
  'Shaˆbaan',
  'Ramadaan',
  'Shawwaal',
  'Zuˆl-Qihda',
  'Zuˆl-Hijja',
];

export function formatHijriDate(date: Date, language: 'en' | 'fr' | 'ar'): string {
  try {
    const locale =
      language === 'fr'
        ? 'fr-FR-u-ca-islamic'
        : language === 'ar'
        ? 'ar-SA-u-ca-islamic'
        : 'en-US-u-ca-islamic';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

/** Returns the 0-based Hijri month index (0=Muharram) for the given date, or null if unavailable. */
export function getHijriMonthIndex(date: Date): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic', { month: 'numeric' }).formatToParts(
      date
    );
    const monthPart = parts.find((p) => p.type === 'month');
    if (!monthPart) return null;
    const monthNum = parseInt(monthPart.value, 10);
    if (Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12) return null;
    return monthNum - 1;
  } catch {
    return null;
  }
}

export function getWolofHijriMonthName(date: Date): string | null {
  const index = getHijriMonthIndex(date);
  if (index === null) return null;
  return WOLOF_HIJRI_MONTH_NAMES[index] ?? null;
}
