/**
 * Medical-specific informational badges — parallel to travelBadges.ts.
 * Surfaces the classical Zodiac Man caution (avoid procedures on the
 * body part ruled by the sign the Moon occupies, see zodiacMan.ts) as a
 * caution note. Never affects score: this engine has no per-request
 * "target body part" input, so it cannot be evaluated as a pass/fail
 * rule the way the other significators in medical.ts can.
 * Ported from asrar.app's src/lib/ikhtiyarat/medicalBadges.ts (already
 * has full EN/FR/AR — no draft translations needed for the badge copy
 * itself; only zodiacMan.ts's body-part names are drafted).
 */

import { ElectionResult } from './types';
import { ZODIAC_MAN_BODY_PART } from './zodiacMan';
import { ZodiacSign } from './ephemeris';

export interface MedicalBadge {
  id: string;
  label: { en: string; fr: string; ar: string };
  note: { en: string; fr: string; ar: string };
  tone: 'positive' | 'neutral' | 'caution';
}

/** Badges derived from the chosen bestWindow's Moon sign and day-of-week. Score-neutral. */
export function getMedicalBadges(result: ElectionResult, moonSign: ZodiacSign): MedicalBadge[] {
  const badges: MedicalBadge[] = [];
  const bodyPart = ZODIAC_MAN_BODY_PART[moonSign];
  const dayOfWeek = result.bestWindow.time.getDay();

  badges.push({
    id: 'zodiac-man-caution',
    label: { en: 'Zodiac Man Caution', fr: 'Prudence — Homme Zodiacal', ar: 'تنبيه الإنسان الفلكي' },
    note: {
      en: `The Moon is in a sign classically ruling the ${bodyPart.en}. Traditional sources advise avoiding surgery or bloodletting on that area while the Moon transits its ruling sign — informational only, always follow qualified medical advice.`,
      fr: `La Lune est dans un signe qui gouverne classiquement ${bodyPart.fr}. Les sources traditionnelles conseillent d'éviter une chirurgie ou une saignée sur cette zone pendant que la Lune transite son signe régent — ceci est purement informatif, suivez toujours l'avis d'un professionnel de santé qualifié.`,
      ar: `القمر في برج يحكم تقليديًا ${bodyPart.ar}. تنصح المصادر التقليدية بتجنب الجراحة أو الفصد في تلك المنطقة أثناء عبور القمر لبرجه الحاكم — هذا للعلم فقط، اتبع دائمًا نصيحة طبية مؤهلة.`,
    },
    tone: 'caution',
  });

  if (dayOfWeek === 1) {
    badges.push({
      id: 'monday',
      label: { en: 'Monday', fr: 'Lundi', ar: 'يوم الاثنين' },
      note: {
        en: 'Monday is the day of the Moon, the classical significator of the body — informational only.',
        fr: 'Le lundi est le jour de la Lune, le significateur classique du corps — ceci est informatif uniquement.',
        ar: 'الاثنين هو يوم القمر، الدلالة الكلاسيكية للجسد — هذا للعلم فقط.',
      },
      tone: 'neutral',
    });
  }

  return badges;
}
