/**
 * Travel-specific Sunnah/informational badges — parallel to hijri.ts's
 * getSunnahBadges(), but keyed off the chosen window's time-of-day and
 * day-of-week rather than the Hijri calendar, since travel timing (bukūr,
 * Friday) is about clock time, not the Islamic month. Never affects
 * score — purely additive UI, same contract as getSunnahBadges().
 * Ported verbatim from asrar.app's src/lib/ikhtiyarat/travelBadges.ts
 * (already has full EN/FR/AR — no draft translations needed here).
 */

import { ElectionResult } from './types';

export interface TravelBadge {
  id: string;
  label: { en: string; fr: string; ar: string };
  note: { en: string; fr: string; ar: string };
  tone: 'positive' | 'neutral' | 'caution';
}

const BUKUR_START_HOUR = 5;
const BUKUR_END_HOUR = 10;

/** Badges derived from the chosen bestWindow's local hour and day-of-week. Score-neutral. */
export function getTravelBadges(result: ElectionResult): TravelBadge[] {
  const badges: TravelBadge[] = [];
  const localHour = result.bestWindow.time.getHours();
  const dayOfWeek = result.bestWindow.time.getDay();

  if (localHour >= BUKUR_START_HOUR && localHour < BUKUR_END_HOUR) {
    badges.push({
      id: 'bukur',
      label: { en: 'Early Departure (Bukūr)', fr: 'Départ matinal (Bukūr)', ar: 'التبكير في السفر' },
      note: {
        en: '"Allāhumma bārik li-ummatī fī bukūrihā" — O Allah, bless my ummah in its early mornings.',
        fr: '« Allāhumma bārik li-ummatī fī bukūrihā » — Ô Allah, bénis mon ummah dans ses matins.',
        ar: 'اللهم بارك لأمتي في بكورها.',
      },
      tone: 'positive',
    });
  }

  if (dayOfWeek === 4) {
    badges.push({
      id: 'thursday',
      label: { en: 'Thursday', fr: 'Jeudi', ar: 'يوم الخميس' },
      note: {
        en: 'The Prophet ﷺ preferred to set out on journeys on Thursday (Bukhārī).',
        fr: 'Le Prophète ﷺ préférait partir en voyage le jeudi (Bukhārī).',
        ar: 'كان النبي ﷺ يستحب الخروج في السفر يوم الخميس (رواه البخاري).',
      },
      tone: 'positive',
    });
  }

  // Informational only, never a penalty or prohibition — travel after the
  // Jumuʿah call is discouraged in fiqh for those obligated to attend, but
  // this does not reduce the score or imply travel itself is disliked.
  if (dayOfWeek === 5) {
    badges.push({
      id: 'friday-jumuah-caution',
      label: { en: 'Friday Caution', fr: 'Prudence le vendredi', ar: 'تنبيه يوم الجمعة' },
      note: {
        en: 'For those obligated to attend Jumuʿah, departing after the call to Friday prayer is discouraged in fiqh — this is informational only and does not affect the score.',
        fr: "Pour ceux qui sont tenus d'assister à la Jumuʿah, partir après l'appel à la prière du vendredi est déconseillé en fiqh — ceci est purement informatif et n'affecte pas le score.",
        ar: 'من كان ملزمًا بحضور الجمعة، يُكره له السفر بعد النداء لصلاة الجمعة في الفقه — هذا للعلم فقط ولا يؤثر على النتيجة.',
      },
      tone: 'caution',
    });
  }

  return badges;
}
