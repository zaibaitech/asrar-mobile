/**
 * Advanced Divine Timing Service
 * ================================
 * Premium feature that integrates all timing components:
 * - Moment Alignment (hourly)
 * - Daily Guidance (daily)
 * - Today's Blessing (planetary info)
 * - Intention-specific analysis
 * - Multi-day outlook
 * - Optimal timing recommendations
 * 
 * This is the comprehensive timing analysis tool.
 */

import {
    type DivineTimingResult,
    type IntentionCategory,
    type UserAbjadResult
} from '@/types/divine-timing';
import { UserProfile } from '@/types/user-profile';
import { getDailyGuidance, type DailyGuidance } from './DailyGuidanceService';
import { getCurrentPlanetaryHour, getTodayBlessing, type DayBlessing, type Planet } from './DayBlessingService';
import { computeDivineTiming } from './DivineTimingService';
import { getMomentAlignment, type Element, type MomentAlignment } from './MomentAlignmentService';

// ============================================================================
// TYPES
// ============================================================================

export interface TimingWindow {
  startTime: Date;
  endTime: Date;
  planet: Planet;
  element: Element;
  quality: 'optimal' | 'good' | 'neutral' | 'challenging';
  score: number; // 0-100
  alignmentStatus: 'ACT' | 'MAINTAIN' | 'HOLD';
  reason: string;
}

export interface DayAnalysis {
  date: Date;
  dayOfWeek: string;
  planetaryRuler: Planet;
  dayElement: Element;
  userAlignment: 'harmonious' | 'complementary' | 'neutral' | 'transformative';
  overallScore: number; // 0-100
  bestHours: TimingWindow[];
  worstHours: TimingWindow[];
}

export interface IntentionTimingAnalysis {
  intention: IntentionCategory;
  currentMoment: {
    hourlyAlignment: MomentAlignment;
    dailyGuidance: DailyGuidance;
    planetaryHour: ReturnType<typeof getCurrentPlanetaryHour>;
    blessing: DayBlessing;
  };
  divineTimingResult: DivineTimingResult;
  harmonyScore: number; // 0-100 - how well everything aligns
  recommendation: 'act_now' | 'wait_for_better_time' | 'proceed_with_caution' | 'highly_favorable';
  bestTimingInNext24Hours?: TimingWindow;
  next7DaysOutlook: DayAnalysis[];
  optimalDaysInNext30: Date[];
  practicalSteps: string[];
}

// ============================================================================
// HARMONY SCORE CALCULATION
// ============================================================================

/**
 * Calculate overall harmony score based on all timing factors
 */
function calculateHarmonyScore(
  momentAlignment: MomentAlignment,
  dailyGuidance: DailyGuidance,
  divineResult: DivineTimingResult,
  intention: IntentionCategory
): number {
  let score = 50; // Start at neutral
  
  // Moment Alignment contribution (30 points)
  if (momentAlignment.status === 'ACT') {
    score += 30;
  } else if (momentAlignment.status === 'MAINTAIN') {
    score += 15;
  } else {
    score -= 10;
  }
  
  // Daily Guidance contribution (30 points)
  if (dailyGuidance.timingQuality === 'favorable') {
    score += 30;
  } else if (dailyGuidance.timingQuality === 'neutral') {
    score += 10;
  } else if (dailyGuidance.timingQuality === 'delicate') {
    score -= 10;
  }
  
  // Divine Timing Quality contribution (40 points)
  const qualityScores = {
    'favorable': 40,
    'moderately favorable': 25,
    'neutral': 10,
    'delicate': -10,
    'transformative': 0,
  };
  score += qualityScores[divineResult.timingQuality] || 0;
  
  // Clamp between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get recommendation based on harmony score and other factors
 */
function getRecommendation(
  harmonyScore: number,
  momentStatus: 'ACT' | 'MAINTAIN' | 'HOLD',
  timingQuality: string
): 'act_now' | 'wait_for_better_time' | 'proceed_with_caution' | 'highly_favorable' {
  if (harmonyScore >= 85 && momentStatus === 'ACT') {
    return 'highly_favorable';
  } else if (harmonyScore >= 65 && momentStatus !== 'HOLD') {
    return 'act_now';
  } else if (harmonyScore >= 40) {
    return 'proceed_with_caution';
  } else {
    return 'wait_for_better_time';
  }
}

// ============================================================================
// FUTURE TIMELINE ANALYSIS
// ============================================================================

/**
 * Analyze the next N days for optimal timing
 */
async function analyzeNext7Days(
  profile: UserProfile | undefined,
  intention: IntentionCategory
): Promise<DayAnalysis[]> {
  const analyses: DayAnalysis[] = [];
  const now = new Date();
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const planetsByDay: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const elementsByDay: Element[] = ['fire', 'water', 'fire', 'air', 'air', 'earth', 'earth'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    date.setHours(12, 0, 0, 0); // Noon
    
    const dayOfWeek = date.getDay();
    const planetaryRuler = planetsByDay[dayOfWeek];
    const dayElement = elementsByDay[dayOfWeek];
    
    // Get alignment for this day
    const dailyGuidance = await getDailyGuidance(profile);
    
    // Determine alignment quality
    let userAlignment: 'harmonious' | 'complementary' | 'neutral' | 'transformative' = 'neutral';
    let overallScore = 50;
    
    if (dailyGuidance.relationship === 'harmonious') {
      userAlignment = 'harmonious';
      overallScore = 85;
    } else if (dailyGuidance.relationship === 'complementary') {
      userAlignment = 'complementary';
      overallScore = 70;
    } else if (dailyGuidance.relationship === 'transformative') {
      userAlignment = 'transformative';
      overallScore = 40;
    }
    
    // Get best hours (simplified - would need full planetary hour calc)
    const bestHours: TimingWindow[] = [];
    const worstHours: TimingWindow[] = [];
    
    analyses.push({
      date,
      dayOfWeek: dayNames[dayOfWeek],
      planetaryRuler,
      dayElement,
      userAlignment,
      overallScore,
      bestHours,
      worstHours,
    });
  }
  
  return analyses;
}

/**
 * Find optimal days in next 30 days
 */
function findOptimalDaysInNext30(
  next7Days: DayAnalysis[]
): Date[] {
  // For now, return top 3 days from next 7
  // In full implementation, would analyze all 30 days
  return next7Days
    .filter(day => day.overallScore >= 70)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3)
    .map(day => day.date);
}

// ============================================================================
// PRACTICAL GUIDANCE GENERATION
// ============================================================================

/**
 * Generate actionable steps based on analysis
 */
function generatePracticalSteps(
  recommendation: string,
  intention: IntentionCategory,
  harmonyScore: number,
  momentStatus: string
): string[] {
  const steps: string[] = [];
  
  if (recommendation === 'highly_favorable') {
    steps.push('✨ Conditions are exceptionally aligned - this is an optimal time to act');
    steps.push(`Make your ${intention === 'start' ? 'decision' : 'move'} within the next 2 hours while alignment is strong`);
    steps.push('Combine with prayer (duʿāʾ) and trust in divine wisdom');
  } else if (recommendation === 'act_now') {
    steps.push('✓ Current timing is favorable for your intention');
    steps.push('Proceed with confidence but remain mindful');
    steps.push('Keep track of how things unfold for future reference');
  } else if (recommendation === 'proceed_with_caution') {
    steps.push('⚠ Timing is mixed - proceed if necessary but with extra care');
    steps.push('Consider waiting for a better window if not urgent');
    steps.push('Increase prayers and istikhārah for guidance');
  } else {
    steps.push('⏸ Consider delaying if possible');
    steps.push('Review the timeline for upcoming optimal windows');
    steps.push('Use this time for planning and preparation');
  }
  
  // Intention-specific advice
  const intentionSteps: Record<IntentionCategory, string> = {
    start: 'Document your decision-making process for future reflection',
    travel: 'Double-check all arrangements and have backup plans',
    communication: 'Prepare your words carefully and choose the right medium',
    relationship: 'Approach with empathy and patience',
    study: 'Create a structured study schedule and quiet environment',
    rest: 'Ensure all obligations are handled before taking time off',
    custom: 'Reflect on your specific situation and seek qualified counsel',
  };
  
  steps.push(intentionSteps[intention]);
  
  return steps;
}

// ============================================================================
// MAIN INTEGRATION FUNCTION
// ============================================================================

/**
 * Generate comprehensive Divine Timing analysis integrating all components
 */
export async function getAdvancedDivineTimingAnalysis(
  profile: UserProfile | undefined,
  intention: IntentionCategory,
  userAbjad: UserAbjadResult
): Promise<IntentionTimingAnalysis> {
  const now = new Date();
  
  // Gather current timing information from all services
  const [momentAlignment, dailyGuidance, planetaryHour, blessing] = await Promise.all([
    getMomentAlignment(profile, now),
    getDailyGuidance(profile),
    Promise.resolve(getCurrentPlanetaryHour(now)),
    Promise.resolve(getTodayBlessing(now)),
  ]);
  
  // Compute Divine Timing result
  const divineResult = computeDivineTiming({
    userAbjadResult: userAbjad,
    currentDate: {
      dayOfWeek: now.getDay(),
      date: now.toISOString().split('T')[0],
    },
    userIntentionCategory: intention,
  });
  
  // Calculate harmony score
  const harmonyScore = calculateHarmonyScore(
    momentAlignment!,
    dailyGuidance,
    divineResult,
    intention
  );
  
  // Get recommendation
  const recommendation = getRecommendation(
    harmonyScore,
    momentAlignment?.status || 'HOLD',
    divineResult.timingQuality
  );
  
  // Analyze next 7 days
  const next7DaysOutlook = await analyzeNext7Days(profile, intention);
  
  // Find optimal days in next 30
  const optimalDaysInNext30 = findOptimalDaysInNext30(next7DaysOutlook);
  
  // Generate practical steps
  const practicalSteps = generatePracticalSteps(
    recommendation,
    intention,
    harmonyScore,
    momentAlignment?.status || 'HOLD'
  );
  
  // Find best timing in next 24 hours (from moment alignment)
  const bestTimingInNext24Hours = momentAlignment?.nextWindows
    ?.filter(w => w.status === 'ACT')
    .slice(0, 1)
    .map(w => ({
      startTime: w.startTime,
      endTime: w.endTime,
      planet: w.planet,
      element: w.element,
      quality: 'optimal' as const,
      score: 90,
      alignmentStatus: 'ACT' as const,
      reason: `${w.planet} hour aligns perfectly with your element`,
    }))[0];
  
  return {
    intention,
    currentMoment: {
      hourlyAlignment: momentAlignment!,
      dailyGuidance,
      planetaryHour,
      blessing,
    },
    divineTimingResult: divineResult,
    harmonyScore,
    recommendation,
    bestTimingInNext24Hours,
    next7DaysOutlook,
    optimalDaysInNext30,
    practicalSteps,
  };
}
