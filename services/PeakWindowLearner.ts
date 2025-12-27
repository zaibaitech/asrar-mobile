/**
 * Peak Window Learner Service
 * ============================
 * Phase 7: Learn user's optimal timing windows from check-in patterns
 * 
 * Purpose: Analyze check-in outcomes, energy levels, and timing to identify
 * when the user experiences best results.
 * 
 * Method:
 * - Weight recent check-ins more heavily (exponential decay)
 * - Good outcomes boost segment score, bad outcomes lower it
 * - Energy levels contribute to segment preference
 * - Normalize to 0-1 range for use in harmony computation
 * 
 * Privacy: All learning happens locally, no data sent anywhere
 */

import {
    CheckInRecord,
    OutcomeRating,
    TimeSegment,
    UserTimingProfile
} from '@/types/divine-timing-personal';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Half-life for outcome weighting (in days)
 * Recent check-ins have higher weight
 */
const OUTCOME_HALF_LIFE_DAYS = 14;

/**
 * Minimum check-ins per segment for reliable score
 */
const MIN_CHECKINS_FOR_LEARNING = 3;

/**
 * Outcome score values
 */
const OUTCOME_SCORES = {
  good: 2.0,
  neutral: 0.5,
  bad: -2.0,
  none: 0.0, // No outcome recorded yet
};

/**
 * Energy contribution weight (0-1 scale)
 */
const ENERGY_WEIGHT = 0.01; // Energy contributes 0-1 points

// ============================================================================
// MAIN LEARNING FUNCTION
// ============================================================================

/**
 * Update peak window model based on check-in history
 * 
 * @param profile - Current user timing profile
 * @param checkins - All check-in records
 * @returns Updated profile with new peak window model
 */
export function updatePeakWindowModel(
  profile: UserTimingProfile,
  checkins: CheckInRecord[]
): UserTimingProfile {
  // Initialize segment scores
  const segmentScores: Record<TimeSegment, number> = {
    preDawn: 0,
    morning: 0,
    midday: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };
  
  const segmentCounts: Record<TimeSegment, number> = {
    preDawn: 0,
    morning: 0,
    midday: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };
  
  const now = Date.now();
  
  // Analyze each check-in
  for (const checkin of checkins) {
    const segment = checkin.timeSegment;
    const age = (now - checkin.createdAt) / (1000 * 60 * 60 * 24); // days
    
    // Calculate time decay weight (exponential)
    const timeWeight = Math.exp(-age * Math.log(2) / OUTCOME_HALF_LIFE_DAYS);
    
    // Get outcome score
    let outcomeScore = OUTCOME_SCORES.none;
    if (checkin.outcome) {
      outcomeScore = OUTCOME_SCORES[checkin.outcome];
    }
    
    // Get energy contribution (0-100 → 0-1)
    const energyContribution = (checkin.energy / 100) * ENERGY_WEIGHT;
    
    // Combined weighted score
    const weightedScore = (outcomeScore + energyContribution) * timeWeight;
    
    segmentScores[segment] += weightedScore;
    segmentCounts[segment] += timeWeight; // Weighted count
  }
  
  // Normalize scores to 0-1 range
  const normalizedScores: Record<TimeSegment, number> = {
    preDawn: 0.5,
    morning: 0.5,
    midday: 0.5,
    afternoon: 0.5,
    evening: 0.5,
    night: 0.5,
  };
  
  // Find min/max for normalization
  let minScore = 0;
  let maxScore = 0;
  
  for (const segment of Object.keys(segmentScores) as TimeSegment[]) {
    if (segmentCounts[segment] >= MIN_CHECKINS_FOR_LEARNING) {
      const avgScore = segmentScores[segment] / segmentCounts[segment];
      minScore = Math.min(minScore, avgScore);
      maxScore = Math.max(maxScore, avgScore);
    }
  }
  
  // Normalize
  const range = maxScore - minScore;
  
  for (const segment of Object.keys(segmentScores) as TimeSegment[]) {
    if (segmentCounts[segment] >= MIN_CHECKINS_FOR_LEARNING) {
      const avgScore = segmentScores[segment] / segmentCounts[segment];
      
      if (range > 0) {
        // Map to 0-1 range
        normalizedScores[segment] = (avgScore - minScore) / range;
      } else {
        // All segments equal, keep at 0.5
        normalizedScores[segment] = 0.5;
      }
    }
    // else: keep default 0.5
  }
  
  // Calculate total sample size
  const totalSampleSize = checkins.length;
  
  // Return updated profile
  return {
    ...profile,
    updatedAt: now,
    peakWindowModel: {
      segmentScores: normalizedScores,
      updatedAt: now,
      sampleSize: totalSampleSize,
    },
    historyStats: {
      totalCheckins: totalSampleSize,
      lastCheckinAt: checkins.length > 0 ? 
        Math.max(...checkins.map(c => c.createdAt)) : 
        profile.historyStats.lastCheckinAt,
      firstCheckinAt: checkins.length > 0 ? 
        Math.min(...checkins.map(c => c.createdAt)) : 
        profile.historyStats.firstCheckinAt,
    },
  };
}

/**
 * Get recent outcomes for a specific segment
 * Used for harmony computation
 * 
 * @param checkins - All check-ins
 * @param segment - Time segment to analyze
 * @param maxAge - Maximum age in days (default 30)
 * @returns Array of outcome ratings
 */
export function getRecentOutcomesForSegment(
  checkins: CheckInRecord[],
  segment: TimeSegment,
  maxAge: number = 30
): OutcomeRating[] {
  const cutoffTime = Date.now() - maxAge * 24 * 60 * 60 * 1000;
  
  return checkins
    .filter(c => 
      c.timeSegment === segment && 
      c.createdAt >= cutoffTime && 
      c.outcome !== undefined
    )
    .map(c => c.outcome!)
    .slice(-10); // Last 10 outcomes max
}

/**
 * Get segment statistics for analytics/insights
 */
export function getSegmentStatistics(
  checkins: CheckInRecord[],
  segment: TimeSegment
): {
  count: number;
  avgEnergy: number;
  avgHarmony: number;
  outcomeDistribution: Record<OutcomeRating | 'none', number>;
  successRate: number;
} {
  const segmentCheckins = checkins.filter(c => c.timeSegment === segment);
  
  if (segmentCheckins.length === 0) {
    return {
      count: 0,
      avgEnergy: 0,
      avgHarmony: 0,
      outcomeDistribution: { good: 0, neutral: 0, bad: 0, none: 0 },
      successRate: 0,
    };
  }
  
  const totalEnergy = segmentCheckins.reduce((sum, c) => sum + c.energy, 0);
  const totalHarmony = segmentCheckins.reduce((sum, c) => sum + (c.harmonyScore || 50), 0);
  
  const outcomeDistribution: Record<string, number> = {
    good: 0,
    neutral: 0,
    bad: 0,
    none: 0,
  };
  
  for (const checkin of segmentCheckins) {
    if (checkin.outcome) {
      outcomeDistribution[checkin.outcome]++;
    } else {
      outcomeDistribution.none++;
    }
  }
  
  const totalOutcomes = outcomeDistribution.good + outcomeDistribution.neutral + outcomeDistribution.bad;
  const successRate = totalOutcomes > 0 ? 
    (outcomeDistribution.good / totalOutcomes) * 100 : 
    0;
  
  return {
    count: segmentCheckins.length,
    avgEnergy: totalEnergy / segmentCheckins.length,
    avgHarmony: totalHarmony / segmentCheckins.length,
    outcomeDistribution: outcomeDistribution as Record<OutcomeRating | 'none', number>,
    successRate,
  };
}

/**
 * Get intention statistics
 */
export function getIntentionStatistics(
  checkins: CheckInRecord[]
): Map<string, {
  count: number;
  successRate: number;
  avgHarmony: number;
  bestSegments: TimeSegment[];
}> {
  const stats = new Map<string, {
    count: number;
    good: number;
    total: number;
    harmonySum: number;
    segmentCounts: Record<TimeSegment, number>;
    segmentSuccess: Record<TimeSegment, number>;
  }>();
  
  // Collect data
  for (const checkin of checkins) {
    const intention = checkin.intentionKey;
    
    if (!stats.has(intention)) {
      stats.set(intention, {
        count: 0,
        good: 0,
        total: 0,
        harmonySum: 0,
        segmentCounts: {
          preDawn: 0,
          morning: 0,
          midday: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        },
        segmentSuccess: {
          preDawn: 0,
          morning: 0,
          midday: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        },
      });
    }
    
    const stat = stats.get(intention)!;
    stat.count++;
    stat.harmonySum += checkin.harmonyScore || 50;
    stat.segmentCounts[checkin.timeSegment]++;
    
    if (checkin.outcome) {
      stat.total++;
      if (checkin.outcome === 'good') {
        stat.good++;
        stat.segmentSuccess[checkin.timeSegment]++;
      }
    }
  }
  
  // Convert to final format
  const results = new Map<string, {
    count: number;
    successRate: number;
    avgHarmony: number;
    bestSegments: TimeSegment[];
  }>();
  
  for (const [intention, stat] of stats.entries()) {
    const successRate = stat.total > 0 ? (stat.good / stat.total) * 100 : 0;
    const avgHarmony = stat.harmonySum / stat.count;
    
    // Find best segments (highest success rate)
    const segmentSuccessRates = Object.entries(stat.segmentCounts)
      .map(([segment, count]) => ({
        segment: segment as TimeSegment,
        rate: count > 0 ? (stat.segmentSuccess[segment as TimeSegment] / count) : 0,
      }))
      .sort((a, b) => b.rate - a.rate);
    
    const bestSegments = segmentSuccessRates
      .slice(0, 3)
      .filter(s => s.rate > 0)
      .map(s => s.segment);
    
    results.set(intention, {
      count: stat.count,
      successRate,
      avgHarmony,
      bestSegments,
    });
  }
  
  return results;
}

/**
 * Calculate harmony trend over time
 */
export function calculateHarmonyTrend(
  checkins: CheckInRecord[],
  periodDays: number = 30
): {
  direction: 'improving' | 'stable' | 'declining';
  changePercent: number;
} {
  if (checkins.length < 4) {
    return { direction: 'stable', changePercent: 0 };
  }
  
  const now = Date.now();
  const cutoffTime = now - periodDays * 24 * 60 * 60 * 1000;
  
  const recentCheckins = checkins
    .filter(c => c.createdAt >= cutoffTime && c.harmonyScore !== undefined)
    .sort((a, b) => a.createdAt - b.createdAt);
  
  if (recentCheckins.length < 4) {
    return { direction: 'stable', changePercent: 0 };
  }
  
  // Compare first half vs second half
  const midpoint = Math.floor(recentCheckins.length / 2);
  const firstHalf = recentCheckins.slice(0, midpoint);
  const secondHalf = recentCheckins.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((sum, c) => sum + (c.harmonyScore || 50), 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, c) => sum + (c.harmonyScore || 50), 0) / secondHalf.length;
  
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  let direction: 'improving' | 'stable' | 'declining';
  if (changePercent > 5) {
    direction = 'improving';
  } else if (changePercent < -5) {
    direction = 'declining';
  } else {
    direction = 'stable';
  }
  
  return { direction, changePercent: Math.round(changePercent) };
}

/**
 * Get recommendations based on analysis
 */
export function getRecommendations(
  checkins: CheckInRecord[],
  profile: UserTimingProfile
): string[] {
  const recommendations: string[] = [];
  
  // Not enough data
  if (checkins.length < 7) {
    recommendations.push('Continue daily check-ins to build personalized insights');
    return recommendations;
  }
  
  // Find best segment
  const bestSegment = (Object.entries(profile.peakWindowModel.segmentScores) as [TimeSegment, number][])
    .sort(([, a], [, b]) => b - a)[0];
  
  if (bestSegment[1] > 0.7) {
    recommendations.push(`Your ${bestSegment[0]} window shows strong potential`);
  }
  
  // Check for low-outcome segments
  const segments = Object.keys(profile.peakWindowModel.segmentScores) as TimeSegment[];
  for (const segment of segments) {
    const stats = getSegmentStatistics(checkins, segment);
    if (stats.count >= 5 && stats.successRate < 30) {
      recommendations.push(`Consider reflection over action during ${segment}`);
    }
  }
  
  // Check harmony trend
  const trend = calculateHarmonyTrend(checkins);
  if (trend.direction === 'improving') {
    recommendations.push('Your harmony alignment is improving—keep the momentum');
  }
  
  // Intention-specific
  const intentionStats = getIntentionStatistics(checkins);
  for (const [intention, stats] of intentionStats.entries()) {
    if (stats.count >= 5 && stats.successRate > 70 && stats.bestSegments.length > 0) {
      recommendations.push(`Best time for ${intention}: ${stats.bestSegments[0]}`);
    }
  }
  
  // Limit to 3-5 recommendations
  return recommendations.slice(0, 5);
}
