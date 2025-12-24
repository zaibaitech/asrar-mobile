/**
 * Name Destiny Calculator Tests
 * Mobile Implementation - Expo Go 54
 */

import { buildDestiny, digitalRoot, modIndex, calculateAbjadValue } from '../services/nameDestinyCalculator';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjadMaps';

describe('Name Destiny Calculator', () => {
  describe('digitalRoot', () => {
    it('calculates digital root correctly for single digit', () => {
      expect(digitalRoot(5)).toBe(5);
    });

    it('calculates digital root correctly for two digits', () => {
      expect(digitalRoot(38)).toBe(2); // 3 + 8 = 11, 1 + 1 = 2
    });

    it('calculates digital root correctly for large numbers', () => {
      expect(digitalRoot(456)).toBe(6); // 4 + 5 + 6 = 15, 1 + 5 = 6
    });
  });

  describe('modIndex', () => {
    it('returns correct index for values within range', () => {
      expect(modIndex(3, 12)).toBe(3);
    });

    it('wraps correctly for values exceeding range', () => {
      expect(modIndex(13, 12)).toBe(1);
      expect(modIndex(25, 12)).toBe(1);
    });

    it('handles edge cases', () => {
      expect(modIndex(12, 12)).toBe(12);
      expect(modIndex(24, 12)).toBe(12);
    });
  });

  describe('calculateAbjadValue', () => {
    it('calculates correct value for محمد (Muhammad)', () => {
      const result = calculateAbjadValue('محمد', ABJAD_MAGHRIBI);
      expect(result).toBe(92); // م(40) + ح(8) + م(40) + د(4) = 92
    });

    it('calculates correct value for علي (Ali)', () => {
      const result = calculateAbjadValue('علي', ABJAD_MAGHRIBI);
      expect(result).toBe(110); // ع(70) + ل(30) + ي(10) = 110
    });

    it('handles different abjad systems', () => {
      const maghribi = calculateAbjadValue('محمد', ABJAD_MAGHRIBI);
      const mashriqi = calculateAbjadValue('محمد', ABJAD_MASHRIQI);
      expect(maghribi).toBe(mashriqi); // Same for these letters
    });

    it('ignores non-Arabic characters', () => {
      const result = calculateAbjadValue('محمد123', ABJAD_MAGHRIBI);
      expect(result).toBe(92); // Numbers ignored
    });
  });

  describe('buildDestiny', () => {
    it('calculates complete destiny for single name', () => {
      const result = buildDestiny('محمد');
      
      expect(result.personName).toBe('محمد');
      expect(result.personKabir).toBe(92);
      expect(result.motherKabir).toBe(0);
      expect(result.totalKabir).toBe(92);
      expect(result.saghir).toBeDefined();
      expect(result.element).toBeDefined();
      expect(result.burj).toBeDefined();
      expect(result.hour).toBeDefined();
    });

    it('includes mother name in calculation', () => {
      const withMother = buildDestiny('علي', 'فاطمة');
      const withoutMother = buildDestiny('علي');
      
      expect(withMother.totalKabir).toBeGreaterThan(withoutMother.totalKabir);
      expect(withMother.motherKabir).toBeGreaterThan(0);
    });

    it('generates valid element (1-4)', () => {
      const result = buildDestiny('محمد');
      
      expect(result.element).toHaveProperty('en');
      expect(result.element).toHaveProperty('ar');
      expect(result.element).toHaveProperty('fr');
      expect(['Fire', 'Earth', 'Air', 'Water']).toContain(result.element.en);
    });

    it('generates valid burj (1-12)', () => {
      const result = buildDestiny('محمد');
      
      expect(result.burj).toHaveProperty('en');
      expect(result.burj).toHaveProperty('ar');
      expect(result.burj).toHaveProperty('planet');
    });

    it('includes timestamp', () => {
      const result = buildDestiny('محمد');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('number');
    });

    it('respects abjad system selection', () => {
      const maghribi = buildDestiny('محمد', undefined, ABJAD_MAGHRIBI);
      const mashriqi = buildDestiny('محمد', undefined, ABJAD_MASHRIQI);
      
      expect(maghribi.abjadSystem).toBe('maghribi');
      expect(mashriqi.abjadSystem).toBe('mashriqi');
    });

    it('calculates consistent results for same input', () => {
      const result1 = buildDestiny('محمد', 'فاطمة');
      const result2 = buildDestiny('محمد', 'فاطمة');
      
      expect(result1.personKabir).toBe(result2.personKabir);
      expect(result1.motherKabir).toBe(result2.motherKabir);
      expect(result1.totalKabir).toBe(result2.totalKabir);
      expect(result1.saghir).toBe(result2.saghir);
    });
  });
});
