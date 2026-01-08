/**
 * Manual Test Script for Divine Timing AI Guidance
 * =================================================
 * Tests locale-aware AI response generation
 */

// Set up __DEV__ global for testing
(global as any).__DEV__ = true;

import type { AdvancedGuidanceInput } from './services/AdvancedDivineTimingGuidanceService';
import { generateAdvancedDivineTimingGuidance } from './services/AdvancedDivineTimingGuidanceService';

async function testDivineTimingAI() {
  console.log('🧪 Testing Divine Timing AI Guidance with French locale...\n');

  const mockInput: AdvancedGuidanceInput = {
    userProfile: {
      nameAr: 'المستخدم',
      nameLatin: 'Test User',
      mode: 'simple' as any,
      timezone: 'UTC',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any,
    intention: 'start',
    userAbjad: {
      kabir: 786,
      saghir: 3,
      hadad: 1,
      dominantElement: 'fire',
    },
    divineTimingResult: {
      timingQuality: 'favorable',
      cycleState: 'initiation',
      elementalTone: 'fire',
      guidanceLevel: 'act',
      shortMessage: 'Favorable for new beginnings',
    },
    questionText: 'Quel est le meilleur moment pour commencer mon projet?',
    category: 'work_career',
    timeHorizon: 'this_week',
    urgency: 'high',
    locale: 'fr',
  };

  try {
    console.log('📝 Input:', {
      question: mockInput.questionText,
      locale: mockInput.locale,
      category: mockInput.category,
    });
    console.log('\n⏳ Generating AI guidance...\n');

    const result = await generateAdvancedDivineTimingGuidance(mockInput);

    console.log('✅ SUCCESS! Guidance generated:\n');
    console.log('Generated At:', result.generatedAt);
    console.log('\n📊 Contextual Insight:');
    console.log(result.contextualInsight);
    console.log('\n🕌 Spiritual Alignment:');
    console.log(result.spiritualAlignment);
    console.log('\n📋 Steps:');
    result.personalizedSteps?.forEach((step, i) => {
      console.log(`${i + 1}. ${step.step}`);
      console.log(`   Timing: ${step.timing}`);
      console.log(`   Reasoning: ${step.reasoning}`);
    });
    console.log('\n⏰ Timing Window:');
    console.log(result.timingWindow);
    console.log('\n✨ Abjad Wisdom:');
    console.log(result.abjadWisdom);

    // Verify it's in French
    const allText = [
      result.contextualInsight,
      result.spiritualAlignment?.zahirAlignment,
      result.spiritualAlignment?.batinAlignment,
      result.spiritualAlignment?.recommendation,
      result.timingWindow?.bestTime,
      result.abjadWisdom,
    ].filter(Boolean).join(' ');
    
    const hasEnglishMarkers = allText.match(/\b(the|and|you|your|is|are|this)\b/i);
    const hasFrenchMarkers = allText.match(/\b(le|la|les|et|vous|votre|est|sont|ce|cette)\b/i);

    console.log('\n🔍 Language Detection:');
    console.log('  English markers found:', !!hasEnglishMarkers);
    console.log('  French markers found:', !!hasFrenchMarkers);

    if (hasFrenchMarkers && !hasEnglishMarkers) {
      console.log('\n✨ PASS: Response is in French! 🎉');
    } else if (hasEnglishMarkers) {
      console.log('\n⚠️  WARNING: Response contains English text');
    } else {
      console.log('\n❓ UNCLEAR: Could not detect language clearly');
    }

  } catch (error) {
    console.error('❌ FAILED:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testDivineTimingAI().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
