import { UserAbjadResult } from '@/types/divine-timing';
import { UserProfile } from '@/types/user-profile';
import {
    calculateHadadKabir,
    calculateSaghir,
    calculateTabElement,
    normalizeArabic,
} from '@/utils/coreCalculations';

type ElementalTone = UserAbjadResult['dominantElement'];

const TAB_TO_ELEMENT: Record<1 | 2 | 3 | 4, ElementalTone> = {
  1: 'fire',
  2: 'earth',
  3: 'air',
  4: 'water',
};

/**
 * Best-effort Abjad result from profile.
 *
 * - Uses `profile.nameAr` (+ optional `profile.motherName`) when available.
 * - Returns `null` when we cannot compute a meaningful Abjad signature.
 */
export function getUserAbjadResultFromProfile(profile: UserProfile): UserAbjadResult | null {
  const nameAr = normalizeArabic(profile.nameAr ?? '');
  const motherName = normalizeArabic(profile.motherName ?? '');

  if (!nameAr) {
    return null;
  }

  const kabir = calculateHadadKabir(nameAr) + (motherName ? calculateHadadKabir(motherName) : 0);
  const saghir = calculateSaghir(kabir);
  const hadad = ((kabir % 4) + 4) % 4;
  const tabElement = calculateTabElement(kabir);

  return {
    kabir,
    saghir,
    hadad,
    dominantElement: TAB_TO_ELEMENT[tabElement],
  };
}
