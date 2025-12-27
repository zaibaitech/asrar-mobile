/**
 * Divine Timing Service Tests
 * ============================
 * Test suite for Divine Timing calculations
 */

import { computeDivineTiming } from '@/services/DivineTimingService';
import { DivineTimingInput } from '@/types/divine-timing';

describe('Divine Timing Service', () => {
  describe('computeDivineTiming', () => {
    it('should return favorable timing for aligned elements and action cycle', () => {
      const input: DivineTimingInput = {
        userAbjadResult: {
          kabir: 786,
          saghir: 3,
          hadad: 1, // initiation
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 0, // Sunday (fire day)
          date: '2025-12-26',
        },
        userIntentionCategory: 'start',
      };

      const result = computeDivineTiming(input);

      expect(result.timingQuality).toBe('favorable');
      expect(result.cycleState).toBe('initiation');
      expect(result.elementalTone).toBe('fire');
      expect(result.guidanceLevel).toBe('act');
      expect(result.shortMessage).toBeTruthy();
    });

    it('should return delicate timing for opposed elements', () => {
      const input: DivineTimingInput = {
        userAbjadResult: {
          kabir: 100,
          saghir: 1,
          hadad: 0, // completion
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 1, // Monday (water day)
          date: '2025-12-26',
        },
        userIntentionCategory: 'travel',
      };

      const result = computeDivineTiming(input);

      expect(result.timingQuality).toBe('delicate');
      expect(result.cycleState).toBe('completion / closure');
      expect(result.elementalTone).toBe('water');
      expect(result.guidanceLevel).toBe('observe');
    });

    it('should return neutral timing for mixed conditions', () => {
      const input: DivineTimingInput = {
        userAbjadResult: {
          kabir: 50,
          saghir: 5,
          hadad: 2, // growth
          dominantElement: 'air',
        },
        currentDate: {
          dayOfWeek: 6, // Saturday (earth day)
          date: '2025-12-26',
        },
        userIntentionCategory: 'study',
      };

      const result = computeDivineTiming(input);

      expect(result.timingQuality).toBe('neutral');
      expect(result.cycleState).toBe('growth / expansion');
      expect(result.elementalTone).toBe('earth');
      expect(['slow', 'observe']).toContain(result.guidanceLevel);
    });

    it('should be deterministic - same input returns same output', () => {
      const input: DivineTimingInput = {
        userAbjadResult: {
          kabir: 786,
          saghir: 3,
          hadad: 2,
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 3,
          date: '2025-12-26',
        },
        userIntentionCategory: 'communication',
      };

      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(computeDivineTiming(input));
      }

      // All results should be identical
      const first = results[0];
      for (const result of results) {
        expect(result.timingQuality).toBe(first.timingQuality);
        expect(result.cycleState).toBe(first.cycleState);
        expect(result.elementalTone).toBe(first.elementalTone);
        expect(result.guidanceLevel).toBe(first.guidanceLevel);
        expect(result.shortMessage).toBe(first.shortMessage);
      }
    });

    it('should handle all hadad values correctly', () => {
      const baseInput: DivineTimingInput = {
        userAbjadResult: {
          kabir: 0, // will be modified
          saghir: 0,
          hadad: 0, // will be modified
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 0,
          date: '2025-12-26',
        },
        userIntentionCategory: 'custom',
      };

      const expectedCycles = [
        'completion / closure',
        'initiation',
        'growth / expansion',
        'review / restraint',
      ];

      for (let hadad = 0; hadad < 4; hadad++) {
        const input = {
          ...baseInput,
          userAbjadResult: { ...baseInput.userAbjadResult, hadad },
        };
        const result = computeDivineTiming(input);
        expect(result.cycleState).toBe(expectedCycles[hadad]);
      }
    });

    it('should handle all days of week correctly', () => {
      const baseInput: DivineTimingInput = {
        userAbjadResult: {
          kabir: 100,
          saghir: 1,
          hadad: 2,
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 0, // will be modified
          date: '2025-12-26',
        },
        userIntentionCategory: 'custom',
      };

      const expectedElements = ['fire', 'water', 'fire', 'air', 'air', 'water', 'earth'];

      for (let day = 0; day < 7; day++) {
        const input = {
          ...baseInput,
          currentDate: { ...baseInput.currentDate, dayOfWeek: day },
        };
        const result = computeDivineTiming(input);
        expect(result.elementalTone).toBe(expectedElements[day]);
      }
    });

    it('should never use predictive or authoritative language', () => {
      const input: DivineTimingInput = {
        userAbjadResult: {
          kabir: 786,
          saghir: 3,
          hadad: 1,
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 0,
          date: '2025-12-26',
        },
        userIntentionCategory: 'start',
      };

      const result = computeDivineTiming(input);

      // Check for forbidden words
      const forbidden = ['will', 'shall', 'must', 'definitely', 'certainly', 'guaranteed', 'fate', 'destiny'];
      const message = result.shortMessage.toLowerCase();

      for (const word of forbidden) {
        expect(message).not.toContain(word);
      }

      // Check for reflective language
      const reflective = ['may', 'could', 'suggest', 'invite', 'favor', 'appear', 'consider'];
      const hasReflectiveLanguage = reflective.some(word => message.includes(word));
      expect(hasReflectiveLanguage).toBe(true);
    });

    it('should include debug context when requested', () => {
      const input: DivineTimingInput = {
        userAbjadResult: {
          kabir: 786,
          saghir: 3,
          hadad: 2,
          dominantElement: 'fire',
        },
        currentDate: {
          dayOfWeek: 3,
          date: '2025-12-26',
        },
        userIntentionCategory: 'communication',
      };

      const result = computeDivineTiming(input);

      expect(result.context).toBeDefined();
      expect(result.context?.hadad).toBe(2);
      expect(result.context?.dominantElement).toBe('fire');
      expect(result.context?.dayElement).toBe('air');
      expect(result.context?.intentionCategory).toBe('communication');
    });
  });
});
