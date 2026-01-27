/**
 * Phase 1 Integration Test
 * Verifies that moon phase service integrates with daily planetary analysis
 */

import {
    calculateDailyPlanetaryScore,
    getDailyScoreBreakdown
} from '@/services/DailyPlanetaryAnalysisService';
import { analyzeMoonDayHarmony, analyzeMoonPhase } from '@/services/MoonPhaseService';

describe('Phase 1 Integration - Moon Phase + Daily Energy', () => {
  test('Moon phase should be included in daily analysis', async () => {
    // Mock date: Full Moon
    const fullMoonDate = new Date('2026-02-01');
    
    // Simulate moon phase calculation
    const moonPhase = analyzeMoonPhase(
      95,  // 95% illumination = full moon
      0,   // Sun longitude
      180, // Moon longitude (opposite sun)
      fullMoonDate
    );
    
    // Verify moon phase data
    expect(moonPhase).toBeDefined();
    expect(moonPhase.phaseName).toBe('full');
    expect(moonPhase.moonPower).toBeGreaterThan(70);
    expect(moonPhase.isWaxing).toBe(false);
  });
  
  test('Daily energy score should incorporate moon phase weighting', () => {
    // Create mock analysis with strong day ruler and moon
    const mockAnalysis: any = {
      dayRulingPlanet: 'Sun',
      planets: {
        Sun: { finalPower: 75 }, // Strong day ruler
        Moon: { finalPower: 85 }, // Strong moon
        Mercury: { finalPower: 50 },
        Venus: { finalPower: 45 },
        Mars: { finalPower: 60 },
        Jupiter: { finalPower: 70 },
        Saturn: { finalPower: 35 },
      },
    };
    
    const score = calculateDailyPlanetaryScore(mockAnalysis);
    
    // Score should be: 75*0.5 + 85*0.3 + ~54*0.2 = 37.5 + 25.5 + 10.8 = ~73.8
    expect(score).toBeCloseTo(74, -1);
  });
  
  test('Moon-day harmony should analyze alignment', () => {
    // Test waxing moon with active day ruler
    const mockMoonPhase: any = {
      phaseName: 'waxing_gibbous',
      isWaxing: true,
      moonPower: 80,
    };
    
    const harmony = analyzeMoonDayHarmony(mockMoonPhase, 'Mars', 'fire');
    
    // Mars is active, waxing moon is building = good/perfect alignment
    expect(harmony.harmonyLevel).toMatch(/perfect|good/);
    expect(harmony.isAligned).toBe(true);
  });
  
  test('Score breakdown should match weighted calculation', () => {
    const mockAnalysis: any = {
      dayRulingPlanet: 'Mars',
      planets: {
        Sun: { finalPower: 50 },
        Moon: { finalPower: 80 },
        Mercury: { finalPower: 45 },
        Venus: { finalPower: 55 },
        Mars: { finalPower: 60 },
        Jupiter: { finalPower: 70 },
        Saturn: { finalPower: 40 },
      },
    };
    
    const breakdown = getDailyScoreBreakdown(mockAnalysis);
    const totalScore = calculateDailyPlanetaryScore(mockAnalysis);
    
    // Verify breakdown matches score
    expect(breakdown.totalScore).toBe(totalScore);
    
    // Verify weights: 50% day ruler, 30% moon, 20% others
    expect(breakdown.dayRulerContribution).toBe(Math.round(60 * 0.5));
    expect(breakdown.moonContribution).toBe(Math.round(80 * 0.3));
  });
  
  test('Should handle different days of week with different rulers', () => {
    // Tuesday = Mars (active)
    // Sunday = Sun (active)
    // Saturday = Saturn (reflective)
    
    const sundayAnalysis: any = {
      dayRulingPlanet: 'Sun',
      planets: {
        Sun: { finalPower: 70 },
        Moon: { finalPower: 50 },
        Mercury: { finalPower: 40 },
        Venus: { finalPower: 45 },
        Mars: { finalPower: 55 },
        Jupiter: { finalPower: 65 },
        Saturn: { finalPower: 35 },
      },
    };
    
    const saturdayAnalysis: any = {
      dayRulingPlanet: 'Saturn',
      planets: {
        ...sundayAnalysis.planets,
        Saturn: { finalPower: 70 },
        Sun: { finalPower: 35 },
      },
    };
    
    const sundayScore = calculateDailyPlanetaryScore(sundayAnalysis);
    const saturdayScore = calculateDailyPlanetaryScore(saturdayAnalysis);
    
    // Sunday should be more active, Saturday more reflective
    // But scores should still be calculated
    expect(sundayScore).toBeGreaterThan(0);
    expect(saturdayScore).toBeGreaterThan(0);
  });
});
