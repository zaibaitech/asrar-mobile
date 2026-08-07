/**
 * Hijri calendar layer for the "Sunnah & Fiqh" badge.
 * Ported verbatim from asrar.app's src/lib/ikhtiyarat/hijri.ts (already
 * has full EN/FR/AR — no draft translations needed here).
 *
 * Uses @umalqura/core (Umm al-Qura calendar) for real Gregorian->Hijri
 * conversion. This is intentionally separate from utils/hijriDate.ts,
 * which uses Intl's best-effort Islamic calendar (runtime-dependent,
 * may return '' on unsupported runtimes) — that's fine for a display-only
 * date string, but this module needs a reliable general converter for
 * arbitrary dates to key badge logic off Hijri month/day.
 */

import umalqura from '@umalqura/core';

export const HIJRI_MONTH_NAMES: { en: string; fr: string; ar: string; wolof: string }[] = [
  { en: 'Muharram', fr: 'Mouharram', ar: 'محرم', wolof: 'Tamxarit' },
  { en: 'Safar', fr: 'Safar', ar: 'صفر', wolof: 'Diggi' },
  { en: "Rabi' al-Awwal", fr: 'Rabi al-Awwal', ar: 'ربيع الأول', wolof: 'Gàmmu' },
  { en: "Rabi' al-Thani", fr: 'Rabi al-Thani', ar: 'ربيع الثاني', wolof: 'Rakki Gàmmu' },
  { en: 'Jumada al-Awwal', fr: 'Joumada al-Awwal', ar: 'جمادى الأولى', wolof: 'Rakkaati Gàmmu' },
  { en: 'Jumada al-Thani', fr: 'Joumada al-Thani', ar: 'جمادى الآخرة', wolof: 'Maami Koor' },
  { en: 'Rajab', fr: 'Rajab', ar: 'رجب', wolof: 'Ndeyi Koor' },
  { en: "Sha'ban", fr: 'Chaabane', ar: 'شعبان', wolof: 'Baraxlu' },
  { en: 'Ramadan', fr: 'Ramadan', ar: 'رمضان', wolof: 'Koor' },
  { en: 'Shawwal', fr: 'Chawwal', ar: 'شوال', wolof: 'Kori' },
  { en: "Dhu al-Qi'dah", fr: 'Dhou al-Qi`dah', ar: 'ذو القعدة', wolof: 'Diggi' },
  { en: 'Dhu al-Hijjah', fr: 'Dhou al-Hijjah', ar: 'ذو الحجة', wolof: 'Tabaski' },
];

export interface HijriDate {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-30 */
  day: number;
  daysInMonth: number;
  monthName: { en: string; fr: string; ar: string; wolof: string };
}

export function gregorianToHijri(date: Date): HijriDate {
  const u = umalqura(date);
  return {
    year: u.hy,
    month: u.hm,
    day: u.hd,
    daysInMonth: u.daysInMonth,
    monthName: HIJRI_MONTH_NAMES[u.hm - 1],
  };
}

export interface SunnahBadge {
  id: string;
  label: { en: string; fr: string; ar: string };
  note: { en: string; fr: string; ar: string };
  tone: 'positive' | 'neutral' | 'caution';
}

/**
 * Islamic-calendar layer badges — independent of the astrology score.
 * Fiqh permits nikah year-round; no date is ever flagged as forbidden here.
 */
export function getSunnahBadges(date: Date): SunnahBadge[] {
  const hijri = gregorianToHijri(date);
  const badges: SunnahBadge[] = [];

  if (hijri.month === 10) {
    badges.push({
      id: 'shawwal',
      label: { en: 'Highly Recommended (Sunnah)', fr: 'Fortement recommandé (Sunna)', ar: 'مستحب (سنة)' },
      note: {
        en: 'The Prophet ﷺ married ʿĀʾisha (RA) in Shawwāl — a month long favored for marriage in the Sunnah.',
        fr: "Le Prophète ﷺ a épousé ʿĀʾisha (RA) pendant Chawwal — un mois traditionnellement privilégié pour le mariage.",
        ar: 'تزوج النبي ﷺ عائشة رضي الله عنها في شهر شوال، وهو شهر مستحب للزواج في السنة.',
      },
      tone: 'positive',
    });
  }

  if (date.getDay() === 5) {
    badges.push({
      id: 'jumuah',
      label: { en: 'Blessed day (Jumuʿah)', fr: 'Jour béni (Joumouʿa)', ar: 'يوم مبارك (الجمعة)' },
      note: {
        en: 'Friday is the most blessed day of the week in the Sunnah.',
        fr: 'Le vendredi est le jour le plus béni de la semaine dans la Sunna.',
        ar: 'يوم الجمعة هو أفضل أيام الأسبوع في السنة.',
      },
      tone: 'positive',
    });
  }

  if (hijri.month === 3) {
    badges.push({
      id: 'mawlid',
      label: { en: 'Mawlid month', fr: 'Mois du Mawlid', ar: 'شهر المولد' },
      note: {
        en: "Rabī' al-Awwal, the month associated with the Prophet's ﷺ birth.",
        fr: "Rabi al-Awwal, le mois associé à la naissance du Prophète ﷺ.",
        ar: 'شهر ربيع الأول، الشهر المرتبط بمولد النبي ﷺ.',
      },
      tone: 'positive',
    });
  }

  if (hijri.day > hijri.daysInMonth - 3) {
    badges.push({
      id: 'muhaq',
      label: { en: 'Last days of the Hijri month', fr: 'Derniers jours du mois hégirien', ar: 'أواخر الشهر الهجري' },
      note: {
        en: 'The Moon is near dark-of-moon (muḥāq) in the Hijri calendar — this overlaps with the astrological combustion caution above.',
        fr: 'La lune est proche de la nouvelle lune (muḥāq) dans le calendrier hégirien — cela recoupe la mise en garde astrologique sur la combustion ci-dessus.',
        ar: 'القمر قريب من المحاق في التقويم الهجري، وهذا يتقاطع مع تحذير الاحتراق الفلكي أعلاه.',
      },
      tone: 'caution',
    });
  }

  if (hijri.month === 9) {
    badges.push({
      id: 'ramadan',
      label: { en: 'Ramadan', fr: 'Ramadan', ar: 'رمضان' },
      note: {
        en: 'Celebrations are usually scheduled around Ramadan for practical reasons — nikāḥ itself is permitted year-round, including during Ramadan.',
        fr: "Les célébrations sont généralement planifiées autour du Ramadan pour des raisons pratiques — le nikāḥ lui-même est permis toute l'année, y compris pendant le Ramadan.",
        ar: 'عادة ما تُجدول الاحتفالات حول رمضان لأسباب عملية، والزواج نفسه جائز طوال العام بما في ذلك رمضان.',
      },
      tone: 'neutral',
    });
  }

  const isHajjDays = hijri.month === 12 && hijri.day >= 8 && hijri.day <= 13;
  if (isHajjDays) {
    badges.push({
      id: 'hajj-days',
      label: { en: 'Days of Hajj', fr: 'Jours du Hajj', ar: 'أيام الحج' },
      note: {
        en: 'Celebrations are usually scheduled around the days of Hajj (8–13 Dhū al-Ḥijja) for practical reasons — nikāḥ itself is permitted year-round.',
        fr: 'Les célébrations sont généralement planifiées autour des jours du Hajj (8-13 Dhou al-Hijja) pour des raisons pratiques — le nikāḥ lui-même est permis toute l\'année.',
        ar: 'عادة ما تُجدول الاحتفالات حول أيام الحج (٨-١٣ ذو الحجة) لأسباب عملية، والزواج نفسه جائز طوال العام.',
      },
      tone: 'neutral',
    });
  }

  return badges;
}
