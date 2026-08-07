/**
 * Senegambian tradition (ʿUrf) layer — a THIRD verdict layer alongside
 * the astro score (TierBadge) and Islamic-calendar Sunnah badges
 * (hijri.ts). This layer is purely cultural/customary commentary tied to
 * the Wolof/Hijri month (HIJRI_MONTH_NAMES in hijri.ts) — it never
 * feeds into the numeric score or tier, and is always additive UI.
 * Ported verbatim from asrar.app's src/lib/ikhtiyarat/urf.ts (already has
 * full EN/FR/AR — no draft translations needed here).
 *
 * Tone matters here: Diggi (Safar) carries a customary caution in some
 * Senegambian communities, but the note explicitly cites the Prophet's ﷺ
 * negation of the Safar omen — informative, never mocking the custom,
 * and never implying marriage is disliked in Safar as a matter of fiqh.
 */

import { HIJRI_MONTH_NAMES } from './hijri';

export interface UrfBadge {
  id: string;
  label: { en: string; fr: string; ar: string };
  note: { en: string; fr: string; ar: string };
  tone: 'positive' | 'neutral' | 'caution';
}

const TAMXARIT_WOLOF = HIJRI_MONTH_NAMES[0].wolof;   // Muharram
const DIGGI_WOLOF = HIJRI_MONTH_NAMES[1].wolof;      // Safar
const GAMMU_WOLOF = HIJRI_MONTH_NAMES[2].wolof;      // Rabi' al-Awwal
const KORI_WOLOF = HIJRI_MONTH_NAMES[9].wolof;       // Shawwal

/**
 * Returns the Senegambian ʿurf badge for a given Hijri month (1-12), or
 * null if that month carries no specific customary note.
 */
export function getUrfBadgeForMonth(hijriMonth: number): UrfBadge | null {
  switch (hijriMonth) {
    case 1: // Muharram / Tamxarit
      return {
        id: 'tamxarit',
        label: { en: `Favored month (${TAMXARIT_WOLOF})`, fr: `Mois favorisé (${TAMXARIT_WOLOF})`, ar: `شهر مفضل (${TAMXARIT_WOLOF})` },
        note: {
          en: `Favored month in Senegambian custom — ${TAMXARIT_WOLOF} (Muḥarram) is one of the sacred months (min al-ashhur al-ḥurum).`,
          fr: `Mois favorisé selon la coutume sénégambienne — ${TAMXARIT_WOLOF} (Mouharram) fait partie des mois sacrés (min al-ashhur al-ḥurum).`,
          ar: `شهر مفضل في العرف السنغامبي — ${TAMXARIT_WOLOF} (محرم) من الأشهر الحرم.`,
        },
        tone: 'positive',
      };

    case 2: // Safar / Diggi
      return {
        id: 'diggi-safar',
        label: { en: `Traditionally cautious (${DIGGI_WOLOF})`, fr: `Prudence traditionnelle (${DIGGI_WOLOF})`, ar: `تحفظ تقليدي (${DIGGI_WOLOF})` },
        note: {
          en: `Traditionally avoided for weddings in some Senegambian communities. Note: the Prophet ﷺ explicitly negated the Ṣafar omen ("…wa-lā ṣafar" — Bukhārī & Muslim); marriage in Ṣafar (${DIGGI_WOLOF}) is fully permissible in fiqh.`,
          fr: `Traditionnellement évité pour les mariages dans certaines communautés sénégambiennes. Note : le Prophète ﷺ a explicitement nié le présage de Safar (« ...wa-lā ṣafar » — Bukhārī et Muslim) ; le mariage pendant Safar (${DIGGI_WOLOF}) est pleinement permis en fiqh.`,
          ar: `يُتجنب تقليديًا لحفلات الزفاف في بعض المجتمعات السنغامبية. ملاحظة: نفى النبي ﷺ صراحة تشاؤم صفر ("...ولا صفر" — البخاري ومسلم)؛ والزواج في صفر (${DIGGI_WOLOF}) جائز تمامًا في الفقه.`,
        },
        tone: 'caution',
      };

    case 3: // Rabi' al-Awwal / Gàmmu
      return {
        id: 'gammu',
        label: { en: `Festive month (${GAMMU_WOLOF})`, fr: `Mois festif (${GAMMU_WOLOF})`, ar: `شهر احتفالي (${GAMMU_WOLOF})` },
        note: {
          en: `Mawlid month — ${GAMMU_WOLOF} is festive in Senegambian custom, associated with the Prophet's ﷺ birth.`,
          fr: `Mois du Mawlid — ${GAMMU_WOLOF} est festif selon la coutume sénégambienne, associé à la naissance du Prophète ﷺ.`,
          ar: `شهر المولد — ${GAMMU_WOLOF} احتفالي في العرف السنغامبي، مرتبط بمولد النبي ﷺ.`,
        },
        tone: 'positive',
      };

    case 10: // Shawwal / Kori
      return {
        id: 'kori-shawwal',
        label: { en: `Sunnah-recommended (${KORI_WOLOF})`, fr: `Recommandé (Sunna) (${KORI_WOLOF})`, ar: `مستحب سنّةً (${KORI_WOLOF})` },
        note: {
          en: `Sunnah-recommended — the Prophet ﷺ married ʿĀʾisha (RA) in Shawwāl (${KORI_WOLOF}).`,
          fr: `Recommandé (Sunna) — le Prophète ﷺ a épousé ʿĀʾisha (RA) pendant Chawwal (${KORI_WOLOF}).`,
          ar: `مستحب في السنة — تزوج النبي ﷺ عائشة رضي الله عنها في شوال (${KORI_WOLOF}).`,
        },
        tone: 'positive',
      };

    default:
      return null;
  }
}
