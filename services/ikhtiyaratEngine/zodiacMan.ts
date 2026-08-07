/**
 * The "Zodiac Man" (Homo Signorum / melothesia) — the classical
 * sign-to-body-part table used across Greek, Islamic, and later European
 * traditional medicine to time surgery, bloodletting (faṣd/ḥijāma), and
 * medication. The one rule cited more consistently than any other across
 * primary and secondary sources: avoid operating on, or drawing blood
 * from, the body part ruled by the sign the Moon currently occupies.
 * Ported from asrar.app's src/lib/ikhtiyarat/zodiacMan.ts. `ar` is a new
 * field per body part — DRAFT translation, needs native/medical-term
 * review before shipping (the source only ships en/fr).
 *
 * This ordering (head at Aries down to feet at Pisces) is stable across
 * sources and not in dispute the way some manzil/modality judgments
 * elsewhere in this feature are — so it is not tagged SCHOLAR-REVIEW.
 */

import { ZodiacSign } from './ephemeris';

interface LocalizedBodyPart {
  en: string;
  fr: string;
  ar: string;
}

export const ZODIAC_MAN_BODY_PART: Record<ZodiacSign, LocalizedBodyPart> = {
  aries: { en: 'head and face', fr: 'tête et visage', ar: 'الرأس والوجه' },
  taurus: { en: 'neck and throat', fr: 'cou et gorge', ar: 'الرقبة والحلق' },
  gemini: { en: 'arms, hands, shoulders, and lungs', fr: 'bras, mains, épaules et poumons', ar: 'الذراعان واليدان والكتفان والرئتان' },
  cancer: { en: 'chest and stomach', fr: 'poitrine et estomac', ar: 'الصدر والمعدة' },
  leo: { en: 'heart and upper back', fr: 'cœur et haut du dos', ar: 'القلب وأعلى الظهر' },
  virgo: { en: 'abdomen and intestines', fr: 'abdomen et intestins', ar: 'البطن والأمعاء' },
  libra: { en: 'kidneys and lower back', fr: 'reins et bas du dos', ar: 'الكليتان وأسفل الظهر' },
  scorpio: { en: 'reproductive organs and bladder', fr: 'organes reproducteurs et vessie', ar: 'الأعضاء التناسلية والمثانة' },
  sagittarius: { en: 'hips, thighs, and liver', fr: 'hanches, cuisses et foie', ar: 'الوركان والفخذان والكبد' },
  capricorn: { en: 'knees, joints, and bones', fr: 'genoux, articulations et os', ar: 'الركبتان والمفاصل والعظام' },
  aquarius: { en: 'ankles and shins', fr: 'chevilles et tibias', ar: 'الكاحلان والساقان' },
  pisces: { en: 'feet', fr: 'pieds', ar: 'القدمان' },
};
