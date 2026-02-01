/**
 * Manazil Data Export for BirthProfileService
 * Re-exports lunar mansion data in a simple format
 */

import { LUNAR_MANSIONS } from '../data/lunarMansions';

export const MANAZIL_DATA = LUNAR_MANSIONS.map(mansion => ({
  index: mansion.index + 1, // Convert 0-indexed to 1-indexed
  name: mansion.nameArabic,
  transliteration: mansion.nameTransliteration,
  element: mansion.element,
}));
