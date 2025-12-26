/**
 * Unit Tests for Arabic Normalization
 * ====================================
 * Validates that normalization produces consistent results across different sources
 */

import {
  DHIKR_TEST_CASES,
  isArabicText,
  isNormalizedArabic,
  normalizeArabic,
  normalizeDhikrName,
  NORMALIZATION_TEST_CASES,
} from '../arabic-normalization';
import { computeAbjadProfile } from '../abjad-unified-pipeline';

describe('Arabic Normalization', () => {
  describe('normalizeArabic()', () => {
    it('should remove all diacritics and tashkīl', () => {
      const input = 'بِسْمِ اللَّهِ';
      const result = normalizeArabic(input);
      expect(result).toBe('بسمالله');
      expect(result).not.toContain('ِ');
      expect(result).not.toContain('ْ');
      expect(result).not.toContain('َّ');
    });

    it('should remove Qur\'anic marks and symbols', () => {
      const input = 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ۝';
      const result = normalizeArabic(input);
      expect(result).not.toContain('۝');
      expect(result).not.toContain('ۡ');
    });

    it('should remove tatweel (kashida)', () => {
      const input = 'اللـــــــه';
      const result = normalizeArabic(input);
      expect(result).toBe('الله');
      expect(result).not.toContain('ـ');
    });

    it('should normalize alif variants to ا', () => {
      const variants = ['أ', 'إ', 'آ', 'ٱ'];
      variants.forEach(variant => {
        const result = normalizeArabic(variant);
        expect(result).toBe('ا');
      });
    });

    it('should normalize ة (tā\' marbūṭa) to ه (hā\')', () => {
      const input = 'رحمة';
      const result = normalizeArabic(input);
      expect(result).toBe('رحمه');
    });

    it('should normalize ى (alif maqṣūra) to ي (yā\')', () => {
      const input = 'موسى';
      const result = normalizeArabic(input);
      expect(result).toBe('موسي');
    });

    it('should remove all whitespace', () => {
      const input = 'بسم الله الرحمن الرحيم';
      const result = normalizeArabic(input);
      expect(result).not.toContain(' ');
      expect(result).toBe('بسماللهالرحمنالرحيم');
    });

    it('should remove punctuation', () => {
      const input = 'السلام، عليكم!';
      const result = normalizeArabic(input);
      expect(result).not.toContain('،');
      expect(result).not.toContain('!');
    });

    it('should remove Arabic and English digits', () => {
      const input = 'آية ١٢٣ verse 456';
      const result = normalizeArabic(input);
      expect(result).not.toMatch(/[0-9]/);
      expect(result).not.toMatch(/[٠-٩]/);
    });

    it('should remove Latin characters', () => {
      const input = 'Bismillah بسم الله';
      const result = normalizeArabic(input);
      expect(result).not.toMatch(/[A-Za-z]/);
      expect(result).toBe('بسمالله');
    });

    it('should handle empty string', () => {
      expect(normalizeArabic('')).toBe('');
      expect(normalizeArabic('   ')).toBe('');
    });
  });

  describe('normalizeArabic() - Test Cases', () => {
    NORMALIZATION_TEST_CASES.forEach(({ input, expected, description }) => {
      it(`should correctly normalize: ${description}`, () => {
        const result = normalizeArabic(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('normalizeDhikrName()', () => {
    it('should strip "ال" definite article', () => {
      const input = 'الرحمن';
      const result = normalizeDhikrName(input);
      expect(result).toBe('رحمن');
    });

    it('should strip "يا" vocative prefix', () => {
      const input = 'يا الرحيم';
      const result = normalizeDhikrName(input);
      expect(result).toBe('رحيم');
    });

    it('should handle both "يا" and "ال"', () => {
      const input = 'يا اللطيف';
      const result = normalizeDhikrName(input);
      expect(result).toBe('لطيف');
    });

    it('should preserve "الله" as special case', () => {
      const input = 'الله';
      const result = normalizeDhikrName(input);
      expect(result).toBe('الله');
    });

    it('should remove diacritics before stripping prefixes', () => {
      const input = 'اللَّطِيف';
      const result = normalizeDhikrName(input);
      expect(result).toBe('لطيف');
      expect(result).not.toContain('َ');
      expect(result).not.toContain('ِ');
    });
  });

  describe('normalizeDhikrName() - Test Cases', () => {
    DHIKR_TEST_CASES.forEach(({ input, expected, description }) => {
      it(`should correctly normalize: ${description}`, () => {
        const result = normalizeDhikrName(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('isArabicText()', () => {
    it('should detect Arabic text', () => {
      expect(isArabicText('السلام عليكم')).toBe(true);
      expect(isArabicText('بسم الله')).toBe(true);
    });

    it('should detect mixed text as Arabic', () => {
      expect(isArabicText('Hello السلام')).toBe(true);
    });

    it('should return false for non-Arabic text', () => {
      expect(isArabicText('Hello World')).toBe(false);
      expect(isArabicText('123456')).toBe(false);
      expect(isArabicText('')).toBe(false);
    });
  });

  describe('isNormalizedArabic()', () => {
    it('should validate normalized text', () => {
      const normalized = normalizeArabic('بِسْمِ اللَّهِ');
      expect(isNormalizedArabic(normalized)).toBe(true);
    });

    it('should reject text with diacritics', () => {
      expect(isNormalizedArabic('بِسْمِ')).toBe(false);
    });

    it('should reject text with spaces', () => {
      expect(isNormalizedArabic('بسم الله')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isNormalizedArabic('')).toBe(false);
    });
  });

  describe('Consistency across sources', () => {
    it('should produce same result from different Qur\'an sources', () => {
      // Same verse from different sources with different tashkīl
      const source1 = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
      const source2 = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ';
      const source3 = 'بسم الله الرحمن الرحيم'; // Without diacritics
      
      const result1 = normalizeArabic(source1);
      const result2 = normalizeArabic(source2);
      const result3 = normalizeArabic(source3);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe('بسماللهالرحمنالرحيم');
    });

    it('should calculate same Kabīr for normalized verses', () => {
      const verse1 = 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ';
      const verse2 = 'قُلْ هُوَ اللَّهُ أَحَدٌ';
      const verse3 = 'قل هو الله احد';
      
      const norm1 = normalizeArabic(verse1);
      const norm2 = normalizeArabic(verse2);
      const norm3 = normalizeArabic(verse3);
      
      const profile1 = computeAbjadProfile(verse1, norm1, 'maghribi', 'quran');
      const profile2 = computeAbjadProfile(verse2, norm2, 'maghribi', 'quran');
      const profile3 = computeAbjadProfile(verse3, norm3, 'maghribi', 'quran');
      
      expect(profile1.core.kabir).toBe(profile2.core.kabir);
      expect(profile2.core.kabir).toBe(profile3.core.kabir);
      expect(profile1.core.saghir).toBe(profile2.core.saghir);
      expect(profile2.core.saghir).toBe(profile3.core.saghir);
    });
  });

  describe('Deterministic calculations', () => {
    it('should always produce same results for same input', () => {
      const text = 'الرحمن الرحيم';
      const runs = 5;
      const results = [];
      
      for (let i = 0; i < runs; i++) {
        const normalized = normalizeArabic(text);
        const profile = computeAbjadProfile(text, normalized, 'maghribi', 'general');
        results.push({
          kabir: profile.core.kabir,
          saghir: profile.core.saghir,
          hadad: profile.core.hadad,
          burj: profile.core.burjName,
        });
      }
      
      // All runs should produce identical results
      results.forEach(result => {
        expect(result.kabir).toBe(results[0].kabir);
        expect(result.saghir).toBe(results[0].saghir);
        expect(result.hadad).toBe(results[0].hadad);
        expect(result.burj).toBe(results[0].burj);
      });
    });
  });

  describe('Real-world Qur\'an verses', () => {
    const testVerses = [
      {
        name: 'Al-Fātiḥa 1:1',
        text: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
        expectedNormalized: 'بسماللهالرحمنالرحيم',
      },
      {
        name: 'Al-Ikhlāṣ 112:1',
        text: 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ',
        expectedNormalized: 'قلهواللهاحد',
      },
      {
        name: 'Al-Falaq 113:1',
        text: 'قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ',
        expectedNormalized: 'قلاعوذبربالفلق',
      },
      {
        name: 'An-Nās 114:1',
        text: 'قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
        expectedNormalized: 'قلاعوذبربالناس',
      },
    ];

    testVerses.forEach(({ name, text, expectedNormalized }) => {
      it(`should correctly normalize ${name}`, () => {
        const result = normalizeArabic(text);
        expect(result).toBe(expectedNormalized);
      });

      it(`should calculate ${name} deterministically`, () => {
        const normalized = normalizeArabic(text);
        const profile1 = computeAbjadProfile(text, normalized, 'maghribi', 'quran');
        const profile2 = computeAbjadProfile(text, normalized, 'maghribi', 'quran');
        
        expect(profile1.core.kabir).toBe(profile2.core.kabir);
        expect(profile1.core.saghir).toBe(profile2.core.saghir);
      });
    });
  });
});
