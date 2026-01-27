import type { DailyPlanetaryAnalysis } from '@/services/DailyPlanetaryAnalysisService';
import { calculateDailyPlanetaryScore, getDailyScoreBreakdown } from '@/services/DailyPlanetaryAnalysisService';

describe('DailyPlanetaryAnalysisService - Weighted Calculation', () => {
  const mockAnalysis: DailyPlanetaryAnalysis = {
    dayRulingPlanet: 'Mars',
    date: new Date('2026-01-27'),
    planets: {
      Sun: {
        longitude: 337,
        latitude: 0,
        finalPower: 50,
        speed: 1,
        retrograde: false,
        house: 1,
        zodiacSign: 'Capricorn',
      },
      Moon: {
        longitude: 180,
        latitude: 5,
        finalPower: 80,
        speed: 13,
        retrograde: false,
        house: 7,
        zodiacSign: 'Libra',
      },
      Mars: {
        longitude: 45,
        latitude: 1,
        finalPower: 60,
        speed: 0.5,
        retrograde: false,
        house: 2,
        zodiacSign: 'Aquarius',
      },
      Mercury: {
        longitude: 320,
        latitude: 0,
        finalPower: 45,
        speed: 1,
        retrograde: false,
        house: 1,
        zodiacSign: 'Capricorn',
      },
      Venus: {
        longitude: 350,
        latitude: 0,
        finalPower: 55,
        speed: 1,
        retrograde: false,
        house: 1,
        zodiacSign: 'Capricorn',
      },
      Jupiter: {
        longitude: 100,
        latitude: 1,
        finalPower: 70,
        speed: 0.1,
        retrograde: false,
        house: 4,
        zodiacSign: 'Gemini',
      },
      Saturn: {
        longitude: 200,
        latitude: 2,
        finalPower: 40,
        speed: 0.03,
        retrograde: false,
        house: 8,
        zodiacSign: 'Libra',
      },
    },
    dayElement: 'fire',
  } as any;

  test('should calculate weighted score correctly', () => {
    // Mars: 60 × 0.5 = 30
    // Moon: 80 × 0.3 = 24
    // Others: (50 + 45 + 55 + 70) / 4 = 55 × 0.2 = 11
    // Total: 30 + 24 + 11 = 65
    
    const score = calculateDailyPlanetaryScore(mockAnalysis, new Date('2026-01-27'));
    expect(score).toBeCloseTo(65, -1); // Approximately 65
  });

  test('should provide correct breakdown', () => {
    const breakdown = getDailyScoreBreakdown(mockAnalysis, new Date('2026-01-27'));
    
    expect(breakdown.dayRuler).toBe('Mars');
    expect(breakdown.dayRulerPower).toBe(60);
    expect(breakdown.dayRulerContribution).toBe(30); // 60 × 0.5
    expect(breakdown.moonPower).toBe(80);
    expect(breakdown.moonContribution).toBe(24); // 80 × 0.3
  });

  test('should exclude weak planets from others calculation', () => {
    const analysisWithWeak = {
      ...mockAnalysis,
      planets: {
        ...mockAnalysis.planets,
        Saturn: {
          ...mockAnalysis.planets.Saturn,
          finalPower: 25, // Below 30 threshold
        },
      },
    } as any;

    const breakdown = getDailyScoreBreakdown(analysisWithWeak);
    
    // Others should be (50 + 45 + 55 + 70) / 4 = 55 (Saturn excluded)
    expect(breakdown.othersPower).toBe(55);
  });
});
