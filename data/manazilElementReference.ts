import type { LunarMansion } from './lunarMansions';

type Element = LunarMansion['element'];

export type ManazilElementReference = {
  index: number;
  nameArabic?: string;
  nameTransliteration?: string;
  element: Element;
  /** Optional human note about the reference provenance. */
  sourceNote?: string;
};

/**
 * Canonical element reference for the 28 manāzil.
 *
 * This is a "lockfile" for element assignments: it lets us detect accidental
 * regressions (like Al‑Ṣarfah being changed back to Water) early in dev.
 *
 * NOTE: This does not claim scholarly completeness; it enforces consistency
 * against the app's intended reference set. If you adopt a different tradition
 * or school, update this table explicitly.
 */
export const MANAZIL_ELEMENT_REFERENCE: ManazilElementReference[] = [
  { index: 0, element: 'fire' },
  { index: 1, element: 'earth' },
  { index: 2, element: 'air' },
  { index: 3, element: 'water' },
  { index: 4, element: 'fire' },
  { index: 5, element: 'earth' },
  { index: 6, element: 'air' },
  { index: 7, element: 'water' },
  { index: 8, element: 'fire' },
  { index: 9, element: 'earth' },
  { index: 10, element: 'air' },
  // Al‑Ṣarfah is intentionally Fire (explicitly corrected)
  { index: 11, element: 'fire', sourceNote: 'Corrected: Al‑Ṣarfah is Fire (not Water).' },
  { index: 12, element: 'fire' },
  { index: 13, element: 'earth' },
  { index: 14, element: 'air' },
  { index: 15, element: 'water' },
  { index: 16, element: 'fire' },
  { index: 17, element: 'earth' },
  { index: 18, element: 'air' },
  { index: 19, element: 'water' },
  { index: 20, element: 'fire' },
  { index: 21, element: 'earth' },
  { index: 22, element: 'air' },
  { index: 23, element: 'water' },
  { index: 24, element: 'fire' },
  { index: 25, element: 'earth' },
  { index: 26, element: 'air' },
  { index: 27, element: 'water' },
];

export function validateManazilElements(mansions: ReadonlyArray<LunarMansion>): {
  ok: boolean;
  problems: string[];
} {
  const problems: string[] = [];

  if (MANAZIL_ELEMENT_REFERENCE.length !== 28) {
    problems.push(`Reference table expected 28 entries, got ${MANAZIL_ELEMENT_REFERENCE.length}`);
  }

  if (mansions.length !== 28) {
    problems.push(`Mansions expected 28 entries, got ${mansions.length}`);
  }

  const refByIndex = new Map<number, ManazilElementReference>();
  for (const r of MANAZIL_ELEMENT_REFERENCE) refByIndex.set(r.index, r);

  for (const m of mansions) {
    const r = refByIndex.get(m.index);
    if (!r) {
      problems.push(`Missing element reference for mansion index ${m.index}`);
      continue;
    }
    if (m.element !== r.element) {
      problems.push(
        `Element mismatch at #${m.index + 1} (${m.nameTransliteration}): dataset=${m.element} reference=${r.element}`
      );
    }
  }

  return { ok: problems.length === 0, problems };
}
