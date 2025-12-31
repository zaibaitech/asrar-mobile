/**
 * Tests for Divine Resonance Service
 */

import { ABJAD_MAGHRIBI } from '../constants/abjadMaps';
import { computeDivineResonance, getResonanceExplanation, normalizeArabicForResonance } from '../services/divineResonance';

describe('Divine Resonance Service', () => {
  describe('normalizeArabicForResonance', () => {
    it('should normalize alif variants', () => {
      expect(normalizeArabicForResonance('آمنة')).toBe('امنه');
      expect(normalizeArabicForResonance('أحمد')).toBe('احمد');
      expect(normalizeArabicForResonance('إبراهيم')).toBe('ابراهيم');
    });

    it('should normalize ta marbuta to ha', () => {
      expect(normalizeArabicForResonance('فاطمة')).toBe('فاطمه');
    });

    it('should normalize alif maksura to ya', () => {
      expect(normalizeArabicForResonance('موسى')).toBe('موسي');
    });

    it('should remove tashkeel', () => {
      expect(normalizeArabicForResonance('مُحَمَّد')).toBe('محمد');
    });

    it('should remove spaces and punctuation', () => {
      expect(normalizeArabicForResonance('محمد بن عبد الله')).toBe('محمدبنعبدالله');
    });

    it('should remove tatweel', () => {
      expect(normalizeArabicForResonance('محـــمد')).toBe('محمد');
    });
  });

  describe('computeDivineResonance', () => {
    it('should calculate correct resonance for محمد (total 92, index 8)', () => {
      const result = computeDivineResonance('محمد', ABJAD_MAGHRIBI);
      
      expect(result.normalized).toBe('محمد');
      expect(result.total).toBe(92);
      expect(result.index).toBe(8);
      expect(result.letter).toBe('ح');
      expect(result.divineName).toBe('حكيم');
      expect(result.breakdown).toHaveLength(4);
    });

    it('should handle total < 28 without division', () => {
      const result = computeDivineResonance('علي', ABJAD_MAGHRIBI);
      
      // ع=70, ل=30, ي=10 = 110
      // 110 % 28 = 26
      expect(result.total).toBe(110);
      expect(result.index).toBe(26);
      expect(result.letter).toBe('ض');
      expect(result.divineName).toBe('ضار');
    });

    it('should handle total exactly 28 (maps to index 28)', () => {
      // Need to find a name with total 28
      // Let's construct one: ا(1) + ك(20) + ز(7) = 28
      const result = computeDivineResonance('اكز', ABJAD_MAGHRIBI);
      
      expect(result.total).toBe(28);
      expect(result.index).toBe(28);
      expect(result.letter).toBe('غ');
      expect(result.divineName).toBe('غني');
    });

    it('should handle remainder 0 as index 28', () => {
      // 56 = 28 * 2, remainder 0 should map to index 28
      // ا(1) + ن(50) + ه(5) = 56
      const result = computeDivineResonance('انه', ABJAD_MAGHRIBI);
      
      expect(result.total).toBe(56);
      expect(result.index).toBe(28);
      expect(result.letter).toBe('غ');
      expect(result.divineName).toBe('غني');
    });

    it('should handle total < 28 directly', () => {
      // ك(20) = 20
      const result = computeDivineResonance('ك', ABJAD_MAGHRIBI);
      
      expect(result.total).toBe(20);
      expect(result.index).toBe(20); // Should be 20, not divided
      expect(result.letter).toBe('ر');
      expect(result.divineName).toBe('رحمن');
    });

    it('should handle index 11 (كريم)', () => {
      // Need total of 11 or (28n + 11)
      // د(4) + ز(7) = 11
      const result = computeDivineResonance('دز', ABJAD_MAGHRIBI);
      
      expect(result.total).toBe(11);
      expect(result.index).toBe(11);
      expect(result.letter).toBe('ك');
      expect(result.divineName).toBe('كريم');
    });

    it('should throw error for empty input', () => {
      expect(() => computeDivineResonance('', ABJAD_MAGHRIBI)).toThrow('No valid Arabic letters found in the name');
    });

    it('should throw error for input with no valid Arabic letters', () => {
      expect(() => computeDivineResonance('123 ABC', ABJAD_MAGHRIBI)).toThrow('No valid Arabic letters found in the name');
    });

    it('should handle names with tashkeel', () => {
      const result = computeDivineResonance('مُحَمَّد', ABJAD_MAGHRIBI);
      
      expect(result.normalized).toBe('محمد');
      expect(result.total).toBe(92);
      expect(result.index).toBe(8);
      expect(result.divineName).toBe('حكيم');
    });

    it('should provide letter breakdown', () => {
      const result = computeDivineResonance('محمد', ABJAD_MAGHRIBI);
      
      expect(result.breakdown).toEqual([
        { ch: 'م', value: 40 },
        { ch: 'ح', value: 8 },
        { ch: 'م', value: 40 },
        { ch: 'د', value: 4 },
      ]);
    });
  });

  describe('getResonanceExplanation', () => {
    it('should explain totals less than 28', () => {
      const explanation = getResonanceExplanation(20, 20);
      expect(explanation).toBe('20 < 28 → Index 20');
    });

    it('should explain totals with remainder', () => {
      const explanation = getResonanceExplanation(92, 8);
      expect(explanation).toBe('92 ÷ 28 = 3 remainder 8 → Index 8');
    });

    it('should explain totals with remainder 0 (maps to 28)', () => {
      const explanation = getResonanceExplanation(56, 28);
      expect(explanation).toBe('56 ÷ 28 = 2 remainder 28 → Index 28');
    });
  });

  describe('All 28 Divine Names', () => {
    const testCases = [
      { name: 'ا', total: 1, index: 1, letter: 'ا', divineName: 'الله' },
      { name: 'ب', total: 2, index: 2, letter: 'ب', divineName: 'باقٍ' },
      { name: 'ج', total: 3, index: 3, letter: 'ج', divineName: 'جامع' },
      { name: 'د', total: 4, index: 4, letter: 'د', divineName: 'دائم' },
      { name: 'ه', total: 5, index: 5, letter: 'ه', divineName: 'هادي' },
      { name: 'و', total: 6, index: 6, letter: 'و', divineName: 'ودود' },
      { name: 'ز', total: 7, index: 7, letter: 'ز', divineName: 'زكي' },
      { name: 'ح', total: 8, index: 8, letter: 'ح', divineName: 'حكيم' },
      { name: 'ط', total: 9, index: 9, letter: 'ط', divineName: 'طاهر' },
      { name: 'ي', total: 10, index: 10, letter: 'ي', divineName: 'يقين' },
      { name: 'دز', total: 11, index: 11, letter: 'ك', divineName: 'كريم' },
      { name: 'داز', total: 12, index: 12, letter: 'ل', divineName: 'لطيف' },
      { name: 'دط', total: 13, index: 13, letter: 'م', divineName: 'مؤمن' },
      { name: 'دي', total: 14, index: 14, letter: 'ن', divineName: 'نور' },
      { name: 'زح', total: 15, index: 15, letter: 'س', divineName: 'سلام' },
      { name: 'زط', total: 16, index: 16, letter: 'ع', divineName: 'عليم' },
      { name: 'زي', total: 17, index: 17, letter: 'ف', divineName: 'فرد' },
      { name: 'حي', total: 18, index: 18, letter: 'ص', divineName: 'صبور' },
      { name: 'طي', total: 19, index: 19, letter: 'ق', divineName: 'قادر' },
      { name: 'ك', total: 20, index: 20, letter: 'ر', divineName: 'رحمن' },
      { name: 'كا', total: 21, index: 21, letter: 'ش', divineName: 'شكور' },
      { name: 'كب', total: 22, index: 22, letter: 'ت', divineName: 'تواب' },
      { name: 'كج', total: 23, index: 23, letter: 'ث', divineName: 'ثابت' },
      { name: 'كد', total: 24, index: 24, letter: 'خ', divineName: 'خبير' },
      { name: 'كه', total: 25, index: 25, letter: 'ذ', divineName: 'ذو الجلال والإكرام' },
      { name: 'كو', total: 26, index: 26, letter: 'ض', divineName: 'ضار' },
      { name: 'كز', total: 27, index: 27, letter: 'ظ', divineName: 'ظاهر' },
      { name: 'اكز', total: 28, index: 28, letter: 'غ', divineName: 'غني' },
    ];

    testCases.forEach(({ name, total, index, letter, divineName }) => {
      it(`should map index ${index} to ${divineName}`, () => {
        const result = computeDivineResonance(name, ABJAD_MAGHRIBI);
        expect(result.total).toBe(total);
        expect(result.index).toBe(index);
        expect(result.letter).toBe(letter);
        expect(result.divineName).toBe(divineName);
      });
    });
  });
});
