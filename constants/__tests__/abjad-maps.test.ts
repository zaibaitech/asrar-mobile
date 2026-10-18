/**
 * True Maghribi Abjad values — regression tests.
 *
 * ABJAD_MAGHRIBI must use the true Maghribi values and match the asrar.app
 * web shared table (src/lib/abjad-maps.ts, PR #88) exactly. ABJAD_MASHRIQI is
 * unchanged.
 */

import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../abjad-maps';
import {
  ABJAD_MAGHRIBI as ND_MAGHRIBI,
  ABJAD_MASHRIQI as ND_MASHRIQI,
} from '../../features/name-destiny/constants/abjadMaps';
import { ABJAD_MAGHRIBI as CTX_MAGHRIBI } from '../../contexts/AbjadContext';
import { CalculatorService } from '../../services/CalculatorService';
import { calculateAbjadValue as nameDestinyValue } from '../../features/name-destiny/services/nameDestinyCalculator';
import { calculateAbjadValue as ilmHurufValue, buildDestiny } from '../../services/ilm-huruf/core';

const BASE_LETTERS: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'ع': 70, 'ف': 80,
  'ق': 100, 'ر': 200, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700,
};

const LETTER_FORMS: Record<string, number> = {
  'أ': 1, 'إ': 1, 'آ': 1, 'ؤ': 6, 'ئ': 10, 'ى': 10, 'ة': 5,
};

const MAGHRIBI_SIX = { 'ص': 60, 'ض': 90, 'س': 300, 'ظ': 800, 'غ': 900, 'ش': 1000 };
const MASHRIQI_SIX = { 'س': 60, 'ص': 90, 'ش': 300, 'ض': 800, 'ظ': 900, 'غ': 1000 };

describe('ABJAD_MAGHRIBI — true Maghribi values', () => {
  it('uses ص=60 ض=90 س=300 ظ=800 غ=900 ش=1000', () => {
    for (const [ch, v] of Object.entries(MAGHRIBI_SIX)) {
      expect(ABJAD_MAGHRIBI[ch]).toBe(v);
    }
  });

  it('matches the web shared table exactly (base letters + forms + six letters)', () => {
    expect(ABJAD_MAGHRIBI).toEqual({ ...BASE_LETTERS, ...LETTER_FORMS, ...MAGHRIBI_SIX });
  });

  it('applies the hamza / ى / ة rule; bare ء is not counted', () => {
    for (const [ch, v] of Object.entries(LETTER_FORMS)) {
      expect(ABJAD_MAGHRIBI[ch]).toBe(v);
      expect(ABJAD_MASHRIQI[ch]).toBe(v);
    }
    expect(ABJAD_MAGHRIBI['ء']).toBeUndefined();
  });

  it('is the single table used by name-destiny and AbjadContext', () => {
    expect(ND_MAGHRIBI).toBe(ABJAD_MAGHRIBI);
    expect(CTX_MAGHRIBI).toBe(ABJAD_MAGHRIBI);
  });

  it('gives the Basmala 1026 (Mashriqi 786)', () => {
    const basmala = 'بسم الله الرحمن الرحيم'.replace(/\s/g, '');
    const sum = (map: Record<string, number>) =>
      [...basmala].reduce((s, ch) => s + (map[ch] || 0), 0);
    expect(sum(ABJAD_MAGHRIBI)).toBe(1026);
    expect(sum(ABJAD_MASHRIQI)).toBe(786);
  });
});

describe('ABJAD_MASHRIQI — unchanged', () => {
  it('keeps the Mashriqi values', () => {
    expect(ABJAD_MASHRIQI).toEqual({ ...BASE_LETTERS, ...LETTER_FORMS, ...MASHRIQI_SIX });
    expect(ND_MASHRIQI).toEqual(ABJAD_MASHRIQI);
  });
});

// Same names as asrar.app PR #88
const EXPECTED: Array<[string, number, number]> = [
  // name, Maghribi, Mashriqi
  ['محمد', 92, 92],
  ['فاطمة', 135, 135],
  ['زينب', 69, 69],
  ['عائشة', 1086, 386],
  ['أحمد', 53, 53],
  ['إبراهيم', 259, 259],
  ['آمنة', 96, 96],
  ['مؤمن', 136, 136],
  ['هدى', 19, 19],
  ['صالح', 99, 129],
  ['حسن', 358, 118],
  ['حسين', 368, 128],
  ['يوسف', 396, 156],
];

describe('name totals through the app calculators', () => {
  it.each(EXPECTED)('%s → Maghribi %i / Mashriqi %i', async (name, maghribi, mashriqi) => {
    expect((await CalculatorService.calculate(name, 'maghribi')).kabir).toBe(maghribi);
    expect((await CalculatorService.calculate(name, 'mashriqi')).kabir).toBe(mashriqi);
    expect(nameDestinyValue(name, ND_MAGHRIBI)).toBe(maghribi);
    expect(nameDestinyValue(name, ND_MASHRIQI)).toBe(mashriqi);
    expect(ilmHurufValue(name)).toBe(maghribi);
    // compatibility / burj (buildDestiny with the Maghribi table)
    expect(buildDestiny(name, undefined, ABJAD_MAGHRIBI).totalKabir).toBe(maghribi);
  });
});
