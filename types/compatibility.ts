// Note: planetary types not needed for basic compatibility
// import { ElementAlignment, TimeWindow } from './planetary';

// Compatibility calculation modes
export type CompatibilityMode = 'transit' | 'relationship';

// The calculation methods
export type CompatibilityMethod = 'spiritual-destiny' | 'elemental-temperament' | 'planetary-cosmic' | 'daily-interaction';

// Spiritual-Destiny results (Mod-9)
export interface SpiritualDestinyResult {
  method: 'spiritual-destiny';
  methodArabic: 'الطريقة الروحانية';
  remainder: number; // 1-9
  score: number; // 0-100
  quality: 'excellent' | 'good' | 'moderate' | 'challenging';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Elemental-Temperament results (Mod-4)
export interface ElementalTemperamentResult {
  method: 'elemental-temperament';
  methodArabic: 'طريقة الطبائع الأربع';
  remainder: number; // 1-4
  sharedElement: 'fire' | 'water' | 'air' | 'earth';
  sharedElementArabic: string;
  sharedElementFrench: string;
  score: number; // 0-100
  quality: 'harmonious' | 'complementary' | 'balanced' | 'dynamic';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Planetary-Cosmic results
export interface PlanetaryCosmicResult {
  method: 'planetary-cosmic';
  methodArabic: 'الطريقة الكوكبية';
  person1Planet: {
    name: string;
    nameArabic: string;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  person2Planet: {
    name: string;
    nameArabic: string;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  relationship: 'friendly' | 'neutral' | 'opposing';
  relationshipArabic: string;
  relationshipFrench: string;
  score: number; // 0-100
  quality: 'excellent' | 'good' | 'moderate' | 'challenging';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Daily Interaction results (Letter-Counting)
export interface DailyInteractionResult {
  method: 'daily-interaction';
  methodArabic: 'التفاعل اليومي';
  person1Distribution: {
    fire: number;
    air: number;
    water: number;
    earth: number;
  };
  person2Distribution: {
    fire: number;
    air: number;
    water: number;
    earth: number;
  };
  person1Dominant: 'fire' | 'air' | 'water' | 'earth';
  person2Dominant: 'fire' | 'air' | 'water' | 'earth';
  person1DominantArabic: string;
  person2DominantArabic: string;
  person1DominantFrench: string;
  person2DominantFrench: string;
  interactionType: 'harmonious' | 'complementary' | 'challenging' | 'neutral';
  interactionTypeArabic: string;
  interactionTypeFrench: string;
  score: number; // 0-100
  quality: 'excellent' | 'good' | 'moderate' | 'challenging';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

// Combined relationship compatibility result
export interface RelationshipCompatibility {
  mode: 'relationship';
  person1: {
    name: string;
    arabicName: string;
    abjadTotal: number;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  person2: {
    name: string;
    arabicName: string;
    abjadTotal: number;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  methods: {
    spiritualDestiny: SpiritualDestinyResult;
    elementalTemperament: ElementalTemperamentResult;
    planetaryCosmic: PlanetaryCosmicResult;
    dailyInteraction: DailyInteractionResult;
  };
  overallScore: number; // Average of 3 methods, 0-100
  overallQuality: 'excellent' | 'very-good' | 'good' | 'moderate' | 'challenging';
  overallQualityArabic: string;
  overallQualityFrench: string;
  summary: string;
  summaryFrench: string;
  summaryArabic: string;
  recommendations: string[];
  recommendationsFrench: string[];
  recommendationsArabic: string[];
}

// ============================================================================
// FOUR-LAYER COMPATIBILITY SYSTEM (Traditional West African Method)
// ============================================================================

// Analysis mode: quick (names only) or complete (names + mothers)
export type FourLayerAnalysisMode = 'quick' | 'complete';

// Single layer result
export interface CompatibilityLayerResult {
  layerNumber: 1 | 2 | 3 | 4;
  layerType: 'daily-life' | 'emotional-foundation' | 'cross-dynamic-a' | 'cross-dynamic-b';
  element1: 'fire' | 'water' | 'air' | 'earth';
  element2: 'fire' | 'water' | 'air' | 'earth';
  pairingKey: string; // e.g., "fire-water"
  percentage: number; // 0-100
  emoji: string;
  label: string;
  labelFrench: string;
  description: string;
  descriptionFrench: string;
  dailyLife?: string;
  dailyLifeFrench?: string;
  challenge?: string;
  challengeFrench?: string;
  tip?: string;
  tipFrench?: string;
}

// Dual temperament for a single person
export interface DualTemperament {
  innerElement: 'fire' | 'water' | 'air' | 'earth'; // From their name
  cosmicElement: 'fire' | 'water' | 'air' | 'earth'; // From mother's name
  innerElementArabic: string;
  cosmicElementArabic: string;
  innerElementFrench: string;
  cosmicElementFrench: string;
  integrationType: 'aligned' | 'complementary' | 'contrasting';
  integrationLabel: string;
  integrationLabelFrench: string;
  integrationMeaning: string;
  integrationMeaningFrench: string;
  integrationChallenge?: string;
  integrationChallengeFrench?: string;
  integrationAdvice?: string;
  integrationAdviceFrench?: string;
}

// Calculation transparency data
export interface CalculationBreakdown {
  personName: string;
  arabicName: string;
  letterBreakdown: string; // e.g., "م(40) + ح(8) + م(40) + د(4)"
  totalValue: number;
  quotient: number;
  remainder: number;
  element: 'fire' | 'water' | 'air' | 'earth';
  elementArabic: string;
}

// Four-layer compatibility result
export interface FourLayerCompatibility {
  mode: 'four-layer';
  analysisMode: FourLayerAnalysisMode;
  
  // Person data
  person1: {
    name: string;
    arabicName: string;
    abjadTotal: number;
    innerElement: 'fire' | 'water' | 'air' | 'earth';
    motherName?: string;
    motherArabicName?: string;
    motherAbjadTotal?: number;
    cosmicElement?: 'fire' | 'water' | 'air' | 'earth';
    dualTemperament?: DualTemperament;
    calculationBreakdown: CalculationBreakdown;
    motherCalculationBreakdown?: CalculationBreakdown;
  };
  
  person2: {
    name: string;
    arabicName: string;
    abjadTotal: number;
    innerElement: 'fire' | 'water' | 'air' | 'earth';
    motherName?: string;
    motherArabicName?: string;
    motherAbjadTotal?: number;
    cosmicElement?: 'fire' | 'water' | 'air' | 'earth';
    dualTemperament?: DualTemperament;
    calculationBreakdown: CalculationBreakdown;
    motherCalculationBreakdown?: CalculationBreakdown;
  };
  
  // Layer results
  layers: {
    layer1?: CompatibilityLayerResult; // Daily Life (inner + inner)
    layer2?: CompatibilityLayerResult; // Emotional Foundation (cosmic + cosmic)
    layer3?: CompatibilityLayerResult; // Person 1 effect on Person 2 (inner1 + cosmic2)
    layer4?: CompatibilityLayerResult; // Person 2 effect on Person 1 (inner2 + cosmic1)
  };
  
  // Overall scores
  overallScore: number; // Weighted: L1(30%) + L2(40%) + L3(15%) + L4(15%)
  overallQuality: 'excellent' | 'very-good' | 'good' | 'challenging' | 'difficult';
  overallQualityArabic: string;
  overallQualityFrench: string;
  accuracyPercentage: string; // "70-75%" or "90-95%"
  
  // Summary and recommendations
  summary: string;
  summaryFrench: string;
  summaryArabic: string;
  
  strengths: string[];
  strengthsFrench: string[];
  strengthsArabic: string[];
  
  challenges: string[];
  challengesFrench: string[];
  challengesArabic: string[];
  
  practices: string[];
  practicesFrench: string[];
  practicesArabic: string[];
  
  dhikrRecommendations: string[];
  dhikrRecommendationsFrench: string[];
  dhikrRecommendationsArabic: string[];
}

// Transit compatibility (existing, but updated)
export interface TransitCompatibility {
  mode: 'transit';
  user: {
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  currentHour: {
    planet: string;
    planetArabic: string;
    element: 'fire' | 'water' | 'air' | 'earth';
  };
  alignment: any; // Placeholder - define ElementAlignment if needed
  timeWindow: any; // Placeholder - define TimeWindow if needed
}
