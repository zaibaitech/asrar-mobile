/**
 * Buruj (Zodiac) Constants and Calculations
 * Stub file for hadad-core compatibility
 */

export interface BurjCalculation {
  burj: number;
  name: string;
}

export function calculateBurj(value: number): BurjCalculation {
  // Simple modulo to get burj (1-12)
  const burjNumber = ((value - 1) % 12) + 1;
  const burjNames = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  return {
    burj: burjNumber,
    name: burjNames[burjNumber - 1]
  };
}
