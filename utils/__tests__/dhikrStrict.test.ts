import { ABJAD_MAGHRIBI } from '../../constants/abjad-maps';
import { calculateAbjadTotal } from '../abjad-calculations';
import { dhikrStrict } from '../text-normalize';

describe('dhikrStrict', () => {
  const cases: Array<{ input: string; expected: string }> = [
    { input: 'اللَّطيف', expected: 'لطيف' },
    { input: 'يا لطيف', expected: 'لطيف' },
    { input: 'يا اللطيف', expected: 'لطيف' },
  ];

  cases.forEach(({ input, expected }) => {
    it(`cleans "${input}" to "${expected}" and totals 129`, () => {
      const cleaned = dhikrStrict(input);
      expect(cleaned).toBe(expected);

      const kabir = calculateAbjadTotal(cleaned, ABJAD_MAGHRIBI);
      expect(kabir).toBe(129);
    });
  });
});
