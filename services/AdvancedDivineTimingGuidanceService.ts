/**
 * Advanced Divine Timing Guidance Service
 * ========================================
 * AI-powered contextual guidance using full spiritual profile and timing analysis
 * 
 * Integrates:
 * - User's Abjad spiritual profile (Ẓāhir + Bāṭin)
 * - Current Moment Alignment (planetary hour)
 * - Daily Guidance (daily planetary ruler)
 * - Divine Timing intention
 * - Advanced harmony score
 */

import { DivineTimingResult, IntentionCategory, UserAbjadResult } from '@/types/divine-timing';
import {
    GuidanceCategory,
    GuidanceResponse,
    TimeHorizon,
    UrgencyLevel
} from '@/types/divine-timing-guidance';
import type { UserProfile } from '@/types/user-profile';
import { getAdvancedDivineTimingAnalysis, IntentionTimingAnalysis } from './AdvancedDivineTimingService';

/**
 * Enhanced guidance input with timing context
 */
export interface AdvancedGuidanceInput {
  questionText: string;
  category: GuidanceCategory;
  timeHorizon: TimeHorizon;
  urgency: UrgencyLevel;
  divineTimingResult: DivineTimingResult;
  userProfile?: UserProfile;
  userAbjad: UserAbjadResult;
  intention: IntentionCategory;
  advancedAnalysis?: IntentionTimingAnalysis;
}

/**
 * Enhanced guidance response with AI insights
 */
export interface AdvancedGuidanceResponse extends GuidanceResponse {
  // Enhanced fields
  contextualInsight: string;
  spiritualAlignment: {
    zahirAlignment: string; // Based on moment alignment
    batinAlignment: string; // Based on daily guidance
    harmonyScore: number;   // 0-100
    recommendation: string; // AI recommendation
  };
  personalizedSteps: Array<{
    step: string;
    timing: string;
    reasoning: string;
  }>;
  timingWindow: {
    bestTime: string;
    nextOptimal: string;
    avoid: string;
  };
  abjadWisdom: string; // Personalized based on name numerology
  generatedAt: string;
}

/**
 * Generate contextual insight based on full timing analysis
 */
async function generateContextualInsight(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<string> {
  const { questionText, category, userProfile, divineTimingResult, userAbjad } = input;
  const { harmonyScore, recommendation, currentMoment } = analysis;
  const insights: string[] = [];

  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  const element = userProfile?.derived?.element;
  const elementLabel = element ? `${element.charAt(0).toUpperCase()}${element.slice(1)}` : null;
  const momentAlignment = currentMoment.hourlyAlignment;
  const planetaryHour = currentMoment.planetaryHour;
  const dailyGuidance = currentMoment.dailyGuidance;

  const innerTone = userProfile?.motherName ? ` and an inner tone of ${userAbjad.saghir}` : '';
  insights.push(
    `${displayName}, your Abjad resonance carries a total value of ${userAbjad.kabir}${innerTone}.`
  );

  if (elementLabel) {
    insights.push(`Your essence expresses through the ${elementLabel} element.`);
  }

  if (momentAlignment && planetaryHour) {
    const statusDescriptions: Record<'ACT' | 'MAINTAIN' | 'HOLD', string> = {
      ACT: 'a direct invitation to take aligned action',
      MAINTAIN: 'support for steady, mindful progress',
      HOLD: 'a pause that favors preparation over bold moves',
    };
    insights.push(
      `We are within the ${planetaryHour.planet} hour, and your Ẓāhir alignment is ` +
      `${momentAlignment.status}. Expect ${statusDescriptions[momentAlignment.status]}.`
    );
  }

  const guidanceTone = dailyGuidance.timingQuality;
  insights.push(
    `Today's flow is ${guidanceTone}, highlighting ${dailyGuidance.message}`
  );

  if (harmonyScore >= 80) {
    insights.push(
      `Your harmony score of ${harmonyScore}/100 shows exceptional alignment. This window strongly favors committed action.`
    );
  } else if (harmonyScore >= 60) {
    insights.push(
      `With a ${harmonyScore}/100 harmony score, the energies are supportive. Move forward with attentive awareness.`
    );
  } else if (harmonyScore >= 40) {
    insights.push(
      `A harmony score of ${harmonyScore}/100 signals mixed conditions. Progress is possible with deliberate pacing.`
    );
  } else {
    insights.push(
      `The harmony score of ${harmonyScore}/100 suggests notable friction. Patience or deeper preparation may serve you well.`
    );
  }

  const recommendationText = recommendation.replace(/_/g, ' ');
  insights.push(
    `Regarding your question about ${getCategoryDisplayName(category).toLowerCase()}: "${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}", the Divine Timing quality is ${divineTimingResult.timingQuality} and the wisdom suggests you ${recommendationText}.`
  );

  return insights.join(' ');
}

/**
 * Generate spiritual alignment analysis
 */
async function generateSpiritualAlignment(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<AdvancedGuidanceResponse['spiritualAlignment']> {
  const momentAlignment = analysis.currentMoment.hourlyAlignment;
  const dailyGuidance = analysis.currentMoment.dailyGuidance;
  
  // Ẓāhir (outward) alignment based on moment
  let zahirAlignment = '';
  if (momentAlignment) {
    if (momentAlignment.status === 'ACT') {
      zahirAlignment = 'Your outward expression (Ẓāhir) is perfectly aligned with the planetary hour. This is your moment to manifest and take visible action.';
    } else if (momentAlignment.status === 'MAINTAIN') {
      zahirAlignment = 'Your outward expression (Ẓāhir) flows harmoniously with the current hour. Maintain steady progress and consistent effort.';
    } else {
      zahirAlignment = 'Your outward expression (Ẓāhir) faces resistance from the current hour. Focus on internal work and preparation rather than external action.';
    }
  } else {
    zahirAlignment = 'Your outward expression (Ẓāhir) is in transition. Consider both inner reflection and gentle external steps.';
  }
  
  // Bāṭin (inward) alignment based on daily
  let batinAlignment = '';
  const flow = dailyGuidance.timingQuality;
  if (flow === 'favorable') {
    batinAlignment = 'Your inner essence (Bāṭin) is supported by today\'s energies. Trust your intuition and inner guidance throughout this day.';
  } else if (flow === 'neutral') {
    batinAlignment = 'Your inner essence (Bāṭin) experiences balanced energy today. Maintain equilibrium between your inner knowing and outer actions.';
  } else if (flow === 'delicate') {
    batinAlignment = 'Your inner essence (Bāṭin) requires careful attention today. Honor your need for rest, reflection, and gentle self-care.';
  } else {
    batinAlignment = 'Your inner essence (Bāṭin) is undergoing transformation today. Embrace the changes while staying grounded in your core values.';
  }
  
  return {
    zahirAlignment,
    batinAlignment,
    harmonyScore: analysis.harmonyScore,
    recommendation: analysis.recommendation.replace(/_/g, ' '),
  };
}

/**
 * Generate personalized action steps with timing and reasoning
 */
async function generatePersonalizedSteps(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<AdvancedGuidanceResponse['personalizedSteps']> {
  const { category, urgency, timeHorizon, userProfile } = input;
  const { practicalSteps } = analysis;
  const momentAlignment = analysis.currentMoment.hourlyAlignment;
  const planetaryHour = analysis.currentMoment.planetaryHour;
  const next7Days = analysis.next7DaysOutlook || [];
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'you';
  
  const steps: AdvancedGuidanceResponse['personalizedSteps'] = [];
  
  //Convert practical steps to personalized steps with timing
  practicalSteps.forEach((step, index) => {
    let timing = '';
    let reasoning = '';
    
    if (index === 0) {
      // First step - immediate or today
      if (momentAlignment && momentAlignment.status === 'ACT' && urgency !== 'low') {
        const planetName = planetaryHour?.planet ?? 'current';
        timing = 'Within the next 2 hours (current planetary hour is favorable)';
        reasoning = `Your Ẓāhir (${displayName}) is aligned with the ${planetName} hour, creating optimal conditions for immediate action.`;
      } else {
        timing = 'Today, when you feel centered and ready';
        reasoning = `Begin with this foundation step while honoring your current energy state.`;
      }
    } else if (index === 1) {
      // Second step - today or tomorrow
      if (timeHorizon === 'today') {
        timing = 'Later today, after completing the first step';
        reasoning = `Build momentum gradually, allowing each step to inform the next.`;
      } else {
        timing = `Tomorrow or within ${timeHorizon === 'this_week' ? '2-3 days' : 'this week'}`;
        reasoning = `Give yourself time to integrate the first step before advancing.`;
      }
    } else {
      // Subsequent steps - within timeframe
      const bestDays = next7Days.filter((d) => d.overallScore >= 70);
      if (bestDays.length > 0) {
        const topDay = bestDays[0];
        timing = `Best on ${topDay.dayOfWeek} (harmony score: ${topDay.overallScore})`;
        reasoning = `This day offers optimal alignment for deeper engagement with your ${category.replace(/_/g, ' ')} intention.`;
      } else {
        timing = `Within ${timeHorizon === 'this_month' ? 'this month' : 'this week'}`;
        reasoning = `Progress at a sustainable pace that honors both urgency and quality.`;
      }
    }
    
    steps.push({ step, timing, reasoning });
  });
  
  return steps;
}

/**
 * Generate timing window recommendations
 */
async function generateTimingWindow(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<AdvancedGuidanceResponse['timingWindow']> {
  const momentAlignment = analysis.currentMoment.hourlyAlignment;
  const currentHour = analysis.currentMoment.planetaryHour;
  const next7Days = analysis.next7DaysOutlook || [];
  
  // Best time - current or upcoming
  let bestTime = '';
  if (momentAlignment && momentAlignment.status === 'ACT') {
    const planetName = currentHour?.planet ?? 'current';
    bestTime = `Now (current ${planetName} hour) - Perfect alignment for action!`;
  } else {
    // Find next best window
    const bestDays = next7Days.filter((d) => d.overallScore >= 70);
    if (bestDays.length > 0) {
      const topDay = bestDays[0];
      bestTime = `${topDay.dayOfWeek} when conditions are more favorable (harmony: ${topDay.overallScore})`;
    } else {
      bestTime = 'Later this week when conditions improve';
    }
  }
  
  // Next optimal
  const nextOptimal = next7Days
    .filter(d => d.overallScore >= 70)
    .slice(0, 2)
    .map(d => `${d.dayOfWeek} (score: ${d.overallScore})`)
    .join(', ') || 'Monitor daily guidance for emerging opportunities';
  
  // Times to avoid
  let avoid = '';
  const lowDays = next7Days.filter(d => d.overallScore < 40);
  if (lowDays.length > 0) {
    avoid = `Consider extra caution on ${lowDays.map(d => d.dayOfWeek).join(', ')} when harmony scores are lower`;
  } else {
    avoid = (momentAlignment && momentAlignment.status === 'HOLD')
      ? `Avoid forcing outcomes during HOLD periods${currentHour ? ` (current ${currentHour.planet} hour shows misalignment)` : ''}`
      : 'No critical timing conflicts detected';
  }
  
  return { bestTime, nextOptimal, avoid };
}

/**
 * Generate Abjad wisdom based on numerology
 */
function generateAbjadWisdom(
  input: AdvancedGuidanceInput
): string {
  const { userProfile, intention, userAbjad } = input;
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  const element = userProfile?.derived?.element;
  const totalValue = userAbjad.kabir;
  
  // Numerological patterns
  const reducedValue = totalValue.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const finalDigit = reducedValue % 9 || 9;
  
  const wisdomTemplates: Record<number, string> = {
    1: `your Abjad resonates with unity and leadership (${finalDigit}). In matters of ${intention}, trust your ability to initiate and pioneer new paths.`,
    2: `your Abjad carries the energy of partnership and balance (${finalDigit}). For ${intention}, seek harmony and collaborate with trusted allies.`,
    3: `your Abjad vibrates with creativity and expression (${finalDigit}). Approach ${intention} with joyful innovation and authentic communication.`,
    4: `your Abjad embodies stability and structure (${finalDigit}). Ground your ${intention} in practical foundations and methodical progress.`,
    5: `your Abjad flows with change and adaptability (${finalDigit}). Embrace flexibility in your ${intention} while staying true to your core.`,
    6: `your Abjad radiates responsibility and service (${finalDigit}). Let ${intention} be guided by care for others and harmonious outcomes.`,
    7: `your Abjad holds wisdom and introspection (${finalDigit}). In ${intention}, honor both spiritual insight and analytical understanding.`,
    8: `your Abjad channels abundance and manifestation (${finalDigit}). Approach ${intention} with confidence in your ability to create tangible results.`,
    9: `your Abjad completes with compassion and completion (${finalDigit}). Let ${intention} be an act of service to the greater good.`,
  };
  
  const baseWisdom = wisdomTemplates[finalDigit] || wisdomTemplates[1];
  
  // Add element-specific wisdom
  const elementWisdom: Record<'fire' | 'earth' | 'air' | 'water', string> = {
    fire: 'Your Fire essence calls for courage and decisive action.',
    earth: 'Your Earth essence grounds you in patience and practical wisdom.',
    air: 'Your Air essence blesses you with clarity and intellectual discernment.',
    water: 'Your Water essence gifts you with emotional depth and intuitive knowing.',
  };
  
  const elementMessage = element ? elementWisdom[element] ?? '' : '';
  return `${displayName}, ${baseWisdom} ${elementMessage}`.trim();
}

/**
 * Main function: Generate advanced AI-powered guidance
 */
export async function generateAdvancedDivineTimingGuidance(
  input: AdvancedGuidanceInput
): Promise<AdvancedGuidanceResponse> {
  const { userProfile, intention, userAbjad } = input;
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  
  // Get advanced timing analysis
  const advancedAnalysis = input.advancedAnalysis || 
    await getAdvancedDivineTimingAnalysis(userProfile, intention, userAbjad);
  
  // Generate all components (all async now)
  const [contextualInsight, spiritualAlignment, personalizedSteps, timingWindow] = await Promise.all([
    generateContextualInsight(input, advancedAnalysis),
    generateSpiritualAlignment(input, advancedAnalysis),
    generatePersonalizedSteps(input, advancedAnalysis),
    generateTimingWindow(input, advancedAnalysis),
  ]);
  
  const abjadWisdom = generateAbjadWisdom(input);
  
  // Build recommended approach from advanced analysis
  const recommendedApproach = [
    contextualInsight,
    ...advancedAnalysis.practicalSteps.map(step => `• ${step}`),
  ];
  
  // Build watch outs
  const watchOuts = [];
  if (spiritualAlignment.harmonyScore < 40) {
    watchOuts.push('Consider delaying major decisions until harmony improves');
  }
  if (spiritualAlignment.zahirAlignment.includes('resistance')) {
    watchOuts.push('Avoid forcing external outcomes during misaligned hours');
  }
  if (spiritualAlignment.batinAlignment.includes('delicate')) {
    watchOuts.push('Prioritize self-care and emotional balance');
  }
  
  const nextStep = personalizedSteps[0]?.step
    || advancedAnalysis.practicalSteps[0]
    || 'Pause for reflection and prayer before taking action.';
  
  // Base response structure (compatible with existing GuidanceResponse)
  const baseResponse: GuidanceResponse = {
    summaryTitle: `Divine Guidance for ${displayName}`,
    timingSignal: spiritualAlignment.recommendation,
    recommendedApproach,
    watchOuts,
    nextStep,
  };
  
  // Enhanced response with AI insights
  const enhancedResponse: AdvancedGuidanceResponse = {
    ...baseResponse,
    contextualInsight,
    spiritualAlignment,
    personalizedSteps,
    timingWindow,
    abjadWisdom,
    generatedAt: new Date().toISOString(),
  };
  
  return enhancedResponse;
}

/**
 * Helper: Get category display name
 */
function getCategoryDisplayName(category: GuidanceCategory): string {
  const names: Record<GuidanceCategory, string> = {
    study_exam: 'Study & Exams',
    work_career: 'Work & Career',
    money_business: 'Money & Business',
    travel: 'Travel',
    relationships_family: 'Relationships & Family',
    health_wellbeing: 'Health & Wellbeing',
    spiritual_practice: 'Spiritual Practice',
    decisions_general: 'General Decisions',
  };
  return names[category];
}
