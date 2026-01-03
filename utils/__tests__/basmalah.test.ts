/**
 * Basmalah Utilities Test Suite
 * Tests for Mushaf-compliant Basmalah detection and stripping
 */

import {
    shouldDisplayBasmalah,
    shouldStripBasmalah,
    startsWithBasmalah,
    stripLeadingBasmalah
} from '../basmalah';

describe('Basmalah Utilities - Mushaf Compliance', () => {
  describe('startsWithBasmalah', () => {
    it('should detect Basmalah with full tashkīl', () => {
      const text = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الْحَمْدُ لِلَّهِ';
      expect(startsWithBasmalah(text)).toBe(true);
    });

    it('should detect Basmalah without tashkīl', () => {
      const text = 'بسم الله الرحمن الرحيم الحمد لله';
      expect(startsWithBasmalah(text)).toBe(true);
    });

    it('should detect Basmalah with BOM and RTL marks', () => {
      const text = '﻿\u200Fبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
      expect(startsWithBasmalah(text)).toBe(true);
    });

    it('should NOT detect when text starts with other content', () => {
      expect(startsWithBasmalah('الْحَمْدُ لِلَّهِ')).toBe(false);
      expect(startsWithBasmalah('الم')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(startsWithBasmalah('')).toBe(false);
      // @ts-ignore - testing null case
      expect(startsWithBasmalah(null)).toBe(false);
      expect(startsWithBasmalah('   ')).toBe(false);
    });
  });

  describe('stripLeadingBasmalah - COMPLETE stripping', () => {
    it('should strip FULL Basmalah from Surah 2:1', () => {
      const text = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الم';
      const stripped = stripLeadingBasmalah(text);
      
      expect(stripped).toBe('الم');
      expect(stripped).not.toContain('بسم');
      expect(stripped).not.toContain('الرحمن');
      expect(stripped).not.toContain('الرحيم');
    });

    it('should strip FULL Basmalah with all diacritics', () => {
      const text = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الْحَمْدُ لِلَّهِ';
      const stripped = stripLeadingBasmalah(text);
      
      expect(stripped).toBe('الْحَمْدُ لِلَّهِ');
      expect(stripped).not.toContain('الرحمن');
      expect(stripped).not.toContain('الرحيم');
    });

    it('should preserve diacritics in remaining text', () => {
      const text = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ';
      const stripped = stripLeadingBasmalah(text);
      
      expect(stripped).toContain('قُلْ');
      expect(stripped).toContain('أَحَدٌ');
    });

    it('should return empty for Basmalah-only text', () => {
      const text = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
      expect(stripLeadingBasmalah(text)).toBe('');
    });

    it('should return original when no Basmalah present', () => {
      const text = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
      expect(stripLeadingBasmalah(text)).toBe(text);
    });
  });

  describe('shouldStripBasmalah - Special cases', () => {
    it('should strip from Ayah 1 of most surahs', () => {
      expect(shouldStripBasmalah(1, 1)).toBe(true);
      expect(shouldStripBasmalah(2, 1)).toBe(true);
      expect(shouldStripBasmalah(112, 1)).toBe(true);
    });

    it('should NOT strip from Surah 9', () => {
      expect(shouldStripBasmalah(9, 1)).toBe(false);
    });

    it('should NOT strip from Surah 27:30 (contains Basmalah in verse)', () => {
      expect(shouldStripBasmalah(27, 30)).toBe(false);
    });

    it('should NOT strip from Ayah 2+', () => {
      expect(shouldStripBasmalah(1, 2)).toBe(false);
      expect(shouldStripBasmalah(2, 5)).toBe(false);
    });
  });

  describe('Mushaf compliance scenarios', () => {
    test('Surah 2:1 should display as "الم" only', () => {
      const apiText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الم';
      
      expect(shouldDisplayBasmalah(2)).toBe(true); // Show header
      expect(shouldStripBasmalah(2, 1)).toBe(true); // Strip from ayah
      
      const display = stripLeadingBasmalah(apiText);
      expect(display).toBe('الم');
      expect(display).not.toContain('الرحمن');
      expect(display).not.toContain('الرحيم');
    });

    test('Surah 9:1 should have no Basmalah', () => {
      expect(shouldDisplayBasmalah(9)).toBe(false);
      expect(shouldStripBasmalah(9, 1)).toBe(false);
    });

    test('Surah 27:30 should preserve internal Basmalah', () => {
      const text = 'إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
      
      expect(shouldStripBasmalah(27, 30)).toBe(false);
      expect(stripLeadingBasmalah(text)).toBe(text);
      expect(text).toContain('بِسْمِ');
    });
  });

  describe('Bug prevention tests', () => {
    it('should NOT leave partial Basmalah like "الرحمن الرحيم"', () => {
      const cases = [
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الم',
        'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الْحَمْدُ',
        '﻿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ',
      ];
      
      cases.forEach(text => {
        const stripped = stripLeadingBasmalah(text);
        expect(stripped).not.toContain('الرحمن');
        expect(stripped).not.toContain('الرحيم');
        expect(stripped).not.toContain('بسم');
      });
    });
  });
});
