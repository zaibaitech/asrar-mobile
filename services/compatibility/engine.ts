/**
 * Asrār Compatibility Engine - Core Calculation Logic
 * All compatibility calculations derive from Spiritual Destiny output
 * NEVER override or replace destiny values - only compare resonances
 */

import {
    analyzeRelationshipCompatibility,
    getElementFromAbjadTotal
} from '../../utils/relationshipCompatibility';
import { NameDestinyResult } from '../ilm-huruf/core';
import {
    CompatibilityEvaluation,
    ElementalRelationship,
    ModeOfAction,
    PersonPersonCompatibility,
    PlanetaryResonance,
    SpiritualDestinyData,
    ZahirBatinInteraction
} from './types';

// ============================================================================
// HELPER: Extract Spiritual Destiny Data from NameDestinyResult
// ============================================================================

export function extractSpiritualDestiny(
  nameDestiny: NameDestinyResult,
  personName: string
): SpiritualDestinyData {
  // Determine Zāhir/Bāṭin orientation based on element
  const zahirBatin = determineZahirBatin(nameDestiny.element.en.toLowerCase() as any);
  
  return {
    element: nameDestiny.element.en.toLowerCase() as 'fire' | 'water' | 'air' | 'earth',
    planet: nameDestiny.burj.planet,
    zahirBatin,
    saghir: nameDestiny.saghir,
    kabir: nameDestiny.totalKabir || nameDestiny.personKabir,
    burj: {
      en: nameDestiny.burj.en,
      ar: nameDestiny.burj.ar
    }
  };
}

function determineZahirBatin(element: 'fire' | 'water' | 'air' | 'earth'): 'zahir' | 'batin' | 'balanced' {
  // Fire & Air are Zāhir (manifest/outward)
  // Water & Earth are Bāṭin (hidden/inward)
  if (element === 'fire' || element === 'air') {
    return 'zahir';
  } else if (element === 'water' || element === 'earth') {
    return 'batin';
  }
  return 'balanced';
}

// ============================================================================
// ELEMENTAL RELATIONSHIP ANALYSIS
// ============================================================================

export function analyzeElementalRelationship(
  element1: 'fire' | 'water' | 'air' | 'earth',
  element2: 'fire' | 'water' | 'air' | 'earth'
): { type: ElementalRelationship; explanation: { en: string; ar: string } } {
  
  // Classical elemental relationships
  const relationships: Record<string, ElementalRelationship> = {
    // Same element
    'fire-fire': 'supportive',
    'water-water': 'supportive',
    'air-air': 'supportive',
    'earth-earth': 'supportive',
    
    // Supportive pairs (traditional)
    'fire-air': 'supportive',   // Air feeds Fire
    'air-fire': 'supportive',
    'water-earth': 'supportive', // Water nourishes Earth
    'earth-water': 'supportive',
    
    // Opposing pairs
    'fire-water': 'opposing',   // Fire evaporates Water
    'water-fire': 'opposing',
    'air-earth': 'opposing',    // Air disperses Earth
    'earth-air': 'opposing',
    
    // Transformative pairs
    'fire-earth': 'transformative', // Fire hardens Earth
    'earth-fire': 'transformative',
    'water-air': 'transformative',  // Water evaporates to Air
    'air-water': 'transformative'
  };
  
  const key = `${element1}-${element2}`;
  const relationship = relationships[key] || 'neutral';
  
  const explanations = getElementalExplanation(element1, element2, relationship);
  
  return {
    type: relationship,
    explanation: explanations
  };
}

function getElementalExplanation(
  el1: string,
  el2: string,
  rel: ElementalRelationship
): { en: string; ar: string } {
  
  const key = `${el1}-${el2}`;
  
  const explanationMap: Record<string, { en: string; ar: string }> = {
    'fire-fire': {
      en: 'Shared passionate energy creates mutual understanding and dynamic momentum.',
      ar: 'الطاقة العاطفية المشتركة تخلق فهماً متبادلاً وزخماً ديناميكياً.'
    },
    'fire-air': {
      en: 'Air feeds Fire, creating an energizing and uplifting dynamic where ideas flourish.',
      ar: 'الهواء يغذي النار، مما يخلق ديناميكية منشطة ومُرتفعة حيث تزدهر الأفكار.'
    },
    'fire-water': {
      en: 'Fire and Water oppose - passion meets depth. Requires conscious balance to avoid steam.',
      ar: 'النار والماء متعارضان - العاطفة تلتقي بالعمق. يتطلب توازناً واعياً لتجنب البخار.'
    },
    'fire-earth': {
      en: 'Fire tempers Earth, transforming and hardening. This dynamic pushes toward refinement.',
      ar: 'النار تُصلّب التراب، محولة ومُقَسِّية. هذه الديناميكية تدفع نحو التنقية.'
    },
    'water-water': {
      en: 'Deep emotional resonance and intuitive understanding flow naturally between both.',
      ar: 'الرنين العاطفي العميق والفهم الحدسي يتدفقان بشكل طبيعي بين كلاهما.'
    },
    'water-earth': {
      en: 'Water nourishes Earth, creating fertile ground for stability and growth.',
      ar: 'الماء يُغذي التراب، مُنشئاً أرضاً خصبة للاستقرار والنمو.'
    },
    'water-air': {
      en: 'Water evaporates into Air - transformation through sublimation. Requires patience.',
      ar: 'الماء يتبخر إلى هواء - تحول من خلال التسامي. يتطلب صبراً.'
    },
    'water-fire': {
      en: 'Water and Fire oppose - depth meets intensity. Balance needed to prevent extinguishing.',
      ar: 'الماء والنار متعارضان - العمق يلتقي بالشدة. التوازن مطلوب لمنع الإطفاء.'
    },
    'air-air': {
      en: 'Shared intellectual energy creates mental stimulation and freedom of expression.',
      ar: 'الطاقة الفكرية المشتركة تخلق تحفيزاً ذهنياً وحرية في التعبير.'
    },
    'air-fire': {
      en: 'Air feeds Fire, energizing and elevating. Ideas and action unite powerfully.',
      ar: 'الهواء يُغذي النار، منشطاً ومُرتفعاً. الأفكار والعمل يتحدان بقوة.'
    },
    'air-water': {
      en: 'Air disperses Water - thoughts meet emotions. Transformation requires integration.',
      ar: 'الهواء يُبعثر الماء - الأفكار تلتقي بالعواطف. التحول يتطلب تكاملاً.'
    },
    'air-earth': {
      en: 'Air and Earth oppose - lightness meets density. Grounding needed for harmony.',
      ar: 'الهواء والتراب متعارضان - الخفة تلتقي بالكثافة. التأريض مطلوب للانسجام.'
    },
    'earth-earth': {
      en: 'Shared grounding creates stability, reliability, and enduring foundations.',
      ar: 'التأريض المشترك يخلق استقراراً وموثوقية وأساسات دائمة.'
    },
    'earth-water': {
      en: 'Earth is nourished by Water, creating stability enriched by emotional depth.',
      ar: 'التراب يُغذَّى بالماء، مُنشئاً استقراراً مُثرى بالعمق العاطفي.'
    },
    'earth-fire': {
      en: 'Earth is hardened by Fire - transformation through testing. Growth through challenge.',
      ar: 'التراب يُقسَّى بالنار - تحول من خلال الاختبار. نمو من خلال التحدي.'
    },
    'earth-air': {
      en: 'Earth and Air oppose - stability meets movement. Integration creates balance.',
      ar: 'التراب والهواء متعارضان - الاستقرار يلتقي بالحركة. التكامل يخلق التوازن.'
    }
  };
  
  return explanationMap[key] || {
    en: 'Elements interact in a neutral manner, neither strongly supporting nor opposing.',
    ar: 'العناصر تتفاعل بطريقة محايدة، لا تدعم ولا تعارض بقوة.'
  };
}

// ============================================================================
// ZĀHIR-BĀṬIN INTERACTION ANALYSIS
// ============================================================================

export function analyzeZahirBatinInteraction(
  zahirBatin1: 'zahir' | 'batin' | 'balanced',
  zahirBatin2: 'zahir' | 'batin' | 'balanced'
): { type: ZahirBatinInteraction; explanation: { en: string; ar: string } } {
  
  if (zahirBatin1 === zahirBatin2) {
    return {
      type: 'dominance',
      explanation: {
        en: 'Both share the same orientation - either outward expression or inward depth dominates the dynamic.',
        ar: 'كلاهما يشتركان في نفس التوجه - إما التعبير الخارجي أو العمق الداخلي يهيمن على الديناميكية.'
      }
    };
  }
  
  if (zahirBatin1 === 'balanced' || zahirBatin2 === 'balanced') {
    return {
      type: 'balance',
      explanation: {
        en: 'One brings balance, harmonizing outward and inward tendencies equally.',
        ar: 'أحدهما يجلب التوازن، منسجماً بين النزعات الخارجية والداخلية بالتساوي.'
      }
    };
  }
  
  // One zahir, one batin
  return {
    type: 'reflection',
    explanation: {
      en: 'Mirror dynamics - one expresses outwardly (ẓāhir) while the other reflects inwardly (bāṭin). Complementary depth.',
      ar: 'ديناميكيات المرآة - أحدهما يعبّر خارجياً (ظاهر) بينما الآخر يعكس داخلياً (باطن). عمق تكاملي.'
    }
  };
}

// ============================================================================
// PLANETARY RESONANCE ANALYSIS
// ============================================================================

export function analyzePlanetaryResonance(
  planet1: string,
  planet2: string
): { type: PlanetaryResonance; explanation: { en: string; ar: string } } {
  
  // Classical planetary relationships
  const harmonious = [
    'Sun-Jupiter', 'Jupiter-Sun',
    'Moon-Venus', 'Venus-Moon',
    'Mercury-Jupiter', 'Jupiter-Mercury',
    'Venus-Jupiter', 'Jupiter-Venus',
    'Sun-Mars', 'Mars-Sun'
  ];
  
  const tense = [
    'Saturn-Mars', 'Mars-Saturn',
    'Saturn-Sun', 'Sun-Saturn',
    'Mars-Venus', 'Venus-Mars'
  ];
  
  const key = `${planet1}-${planet2}`;
  
  if (planet1 === planet2) {
    return {
      type: 'harmonious',
      explanation: {
        en: `Both ruled by ${planet1}, creating unified planetary energy and shared rhythms.`,
        ar: `كلاهما محكوم من ${planet1}، مُنشئاً طاقة كوكبية موحدة وإيقاعات مشتركة.`
      }
    };
  }
  
  if (harmonious.includes(key)) {
    return {
      type: 'harmonious',
      explanation: {
        en: `${planet1} and ${planet2} work harmoniously together, creating supportive planetary currents.`,
        ar: `${planet1} و${planet2} يعملان بانسجام معاً، مُنشئَين تيارات كوكبية داعمة.`
      }
    };
  }
  
  if (tense.includes(key)) {
    return {
      type: 'tense',
      explanation: {
        en: `${planet1} and ${planet2} create planetary tension - challenges that strengthen through friction.`,
        ar: `${planet1} و${planet2} يخلقان توتراً كوكبياً - تحديات تُقوّي من خلال الاحتكاك.`
      }
    };
  }
  
  return {
    type: 'developmental',
    explanation: {
      en: `${planet1} and ${planet2} create developmental tension - growth through planetary dialogue.`,
      ar: `${planet1} و${planet2} يخلقان توتراً تطويرياً - نمو من خلال الحوار الكوكبي.`
    }
  };
}

// ============================================================================
// MODE OF ACTION DETERMINATION
// ============================================================================

export function determineModeOfAction(
  element: 'fire' | 'water' | 'air' | 'earth'
): { type: ModeOfAction; explanation: { en: string; ar: string } } {
  
  const modes: Record<string, { type: ModeOfAction; explanation: { en: string; ar: string } }> = {
    fire: {
      type: 'fast',
      explanation: {
        en: 'Fire element brings swift manifestation - results appear quickly and intensely.',
        ar: 'عنصر النار يجلب ظهوراً سريعاً - النتائج تظهر بسرعة وبشدة.'
      }
    },
    air: {
      type: 'fast',
      explanation: {
        en: 'Air element facilitates rapid movement - changes occur swiftly through communication.',
        ar: 'عنصر الهواء يُسهّل الحركة السريعة - التغييرات تحدث بسرعة من خلال التواصل.'
      }
    },
    earth: {
      type: 'gradual',
      explanation: {
        en: 'Earth element builds steadily - manifestation unfolds gradually with lasting foundations.',
        ar: 'عنصر التراب يبني بثبات - الظهور يتكشف تدريجياً مع أساسات دائمة.'
      }
    },
    water: {
      type: 'hidden',
      explanation: {
        en: 'Water element works subtly - effects are inward and hidden, revealed in time.',
        ar: 'عنصر الماء يعمل بشكل خفي - التأثيرات داخلية ومخفية، تُكشف مع الوقت.'
      }
    }
  };
  
  return modes[element];
}

// ============================================================================
// GENERATE GUIDANCE SUMMARY
// ============================================================================

export function generateGuidanceSummary(
  elementalRel: ElementalRelationship,
  zahirBatinInt: ZahirBatinInteraction,
  planetaryRes: PlanetaryResonance,
  element1: 'fire' | 'water' | 'air' | 'earth',
  element2: 'fire' | 'water' | 'air' | 'earth'
): {
  whatFlowsEasily: { en: string; ar: string };
  whatRequiresPatience: { en: string; ar: string };
  whatToAvoidForcing: { en: string; ar: string };
} {
  
  // What flows easily
  let flowsEasily = { en: '', ar: '' };
  if (elementalRel === 'supportive') {
    flowsEasily = {
      en: 'Natural harmony and mutual support flow effortlessly in this resonance.',
      ar: 'الانسجام الطبيعي والدعم المتبادل يتدفقان بسهولة في هذا الرنين.'
    };
  } else if (planetaryRes === 'harmonious') {
    flowsEasily = {
      en: 'Planetary alignment creates smooth currents for shared endeavors.',
      ar: 'التوافق الكوكبي يخلق تيارات سلسة للمساعي المشتركة.'
    };
  } else {
    flowsEasily = {
      en: 'Shared understanding in specific areas where elements align.',
      ar: 'فهم مشترك في مجالات محددة حيث تتوافق العناصر.'
    };
  }
  
  // What requires patience
  let requiresPatience = { en: '', ar: '' };
  if (elementalRel === 'opposing' || elementalRel === 'transformative') {
    requiresPatience = {
      en: 'Elemental tensions require conscious navigation and patience to integrate differences.',
      ar: 'التوترات العنصرية تتطلب ملاحة واعية وصبراً لدمج الاختلافات.'
    };
  } else if (planetaryRes === 'tense') {
    requiresPatience = {
      en: 'Planetary friction creates growth opportunities through patient understanding.',
      ar: 'الاحتكاك الكوكبي يخلق فرص نمو من خلال الفهم الصبور.'
    };
  } else {
    requiresPatience = {
      en: 'Deep integration of different rhythms and orientations.',
      ar: 'التكامل العميق للإيقاعات والتوجهات المختلفة.'
    };
  }
  
  // What to avoid forcing
  let avoidForcing = { en: '', ar: '' };
  if (element1 === 'earth' || element2 === 'earth') {
    avoidForcing = {
      en: 'Avoid rushing what naturally builds slowly - Earth\'s wisdom is in gradual unfolding.',
      ar: 'تجنب التسرع فيما يبني بشكل طبيعي ببطء - حكمة التراب في التكشف التدريجي.'
    };
  } else if (element1 === 'water' || element2 === 'water') {
    avoidForcing = {
      en: 'Avoid forcing what works subtly - Water\'s power is in gentle persistence.',
      ar: 'تجنب إجبار ما يعمل بشكل خفي - قوة الماء في المثابرة اللطيفة.'
    };
  } else {
    avoidForcing = {
      en: 'Avoid imposing will over natural flow - trust the taqdīr (divine measure).',
      ar: 'تجنب فرض الإرادة على التدفق الطبيعي - ثق في التقدير الإلهي.'
    };
  }
  
  return {
    whatFlowsEasily: flowsEasily,
    whatRequiresPatience: requiresPatience,
    whatToAvoidForcing: avoidForcing
  };
}

// ============================================================================
// CALCULATE RESONANCE SCORE (FOR VISUALIZATION ONLY)
// ============================================================================

export function calculateResonanceScore(
  elementalRel: ElementalRelationship,
  zahirBatinInt: ZahirBatinInteraction,
  planetaryRes: PlanetaryResonance
): number {
  
  let score = 50; // Base neutral
  
  // Elemental contribution (40%)
  if (elementalRel === 'supportive') score += 35;
  else if (elementalRel === 'neutral') score += 15;
  else if (elementalRel === 'transformative') score += 10;
  else if (elementalRel === 'opposing') score -= 10;
  
  // Planetary contribution (30%)
  if (planetaryRes === 'harmonious') score += 25;
  else if (planetaryRes === 'developmental') score += 10;
  else if (planetaryRes === 'tense') score -= 5;
  
  // Zāhir-Bāṭin contribution (30%)
  if (zahirBatinInt === 'reflection') score += 25;
  else if (zahirBatinInt === 'balance') score += 20;
  else if (zahirBatinInt === 'dominance') score += 5;
  
  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// MAIN: BUILD COMPLETE COMPATIBILITY EVALUATION
// ============================================================================

export function buildCompatibilityEvaluation(
  element1: 'fire' | 'water' | 'air' | 'earth',
  element2: 'fire' | 'water' | 'air' | 'earth',
  planet1: string,
  planet2: string,
  zahirBatin1: 'zahir' | 'batin' | 'balanced',
  zahirBatin2: 'zahir' | 'batin' | 'balanced'
): CompatibilityEvaluation {
  
  const elementalRelationship = analyzeElementalRelationship(element1, element2);
  const zahirBatinInteraction = analyzeZahirBatinInteraction(zahirBatin1, zahirBatin2);
  const planetaryResonance = analyzePlanetaryResonance(planet1, planet2);
  const modeOfAction = determineModeOfAction(element1); // Primary element
  
  const guidance = generateGuidanceSummary(
    elementalRelationship.type,
    zahirBatinInteraction.type,
    planetaryResonance.type,
    element1,
    element2
  );
  
  const resonanceScore = calculateResonanceScore(
    elementalRelationship.type,
    zahirBatinInteraction.type,
    planetaryResonance.type
  );
  
  const disclaimer = {
    en: 'This analysis is for spiritual reflection within the traditional sciences of ʿIlm al-Asrār. It does not constitute religious rulings, future predictions, or guarantees of outcomes.',
    ar: 'هذا التحليل للتأمل الروحي ضمن علوم أسرار الحروف التقليدية. لا يُشكّل أحكاماً دينية، تنبؤات مستقبلية، أو ضمانات للنتائج.'
  };
  
  return {
    elementalRelationship,
    zahirBatinInteraction,
    planetaryResonance,
    modeOfAction,
    guidance,
    resonanceScore,
    disclaimer
  };
}

// ============================================================================
// PERSON ↔ PERSON COMPATIBILITY
// ============================================================================

export function calculatePersonPersonCompatibility(
  person1Name: string,
  person1ArabicName: string,
  person1Destiny: NameDestinyResult,
  person2Name: string,
  person2ArabicName: string,
  person2Destiny: NameDestinyResult,
  relationshipContext: 'marriage' | 'friendship' | 'family' | 'work' | 'universal' = 'universal'
): PersonPersonCompatibility {
  
  // Extract spiritual destiny data
  const destiny1 = extractSpiritualDestiny(person1Destiny, person1Name);
  const destiny2 = extractSpiritualDestiny(person2Destiny, person2Name);
  
  // Get elements from Abjad totals
  const person1Element = getElementFromAbjadTotal(destiny1.kabir);
  const person2Element = getElementFromAbjadTotal(destiny2.kabir);
  
  // Use the AUTHENTIC 4-METHOD SYSTEM from relationshipCompatibility.ts
  const relationshipCompatibility = analyzeRelationshipCompatibility(
    person1Name,
    person1ArabicName,
    destiny1.kabir,
    person1Element,
    person2Name,
    person2ArabicName,
    destiny2.kabir,
    person2Element
  );
  
  // Still generate the spiritual evaluation for additional context
  const evaluation = buildCompatibilityEvaluation(
    destiny1.element,
    destiny2.element,
    destiny1.planet,
    destiny2.planet,
    destiny1.zahirBatin,
    destiny2.zahirBatin
  );
  
  return {
    type: 'person-person',
    relationshipContext,
    person1: {
      name: person1Name,
      arabicName: person1ArabicName,
      destiny: destiny1
    },
    person2: {
      name: person2Name,
      arabicName: person2ArabicName,
      destiny: destiny2
    },
    evaluation,
    // Add the authentic 4-method compatibility analysis
    relationshipCompatibility
  };
}
