import {
    CalculationBreakdown,
    CompatibilityLayerResult,
    DualTemperament,
    FourLayerAnalysisMode,
    FourLayerCompatibility
} from '../types/compatibility';
import { getElementFromAbjadTotal } from './relationshipCompatibility';

// Helper: Calculate Abjad value from Arabic text
function calculateAbjadValue(text: string, abjadMap: Record<string, number>): number {
  const normalized = text.replace(/[ًٌٍَُِّْ\s]/g, '');
  return [...normalized].reduce((sum, char) => sum + (abjadMap[char] || 0), 0);
}

// ============================================================================
// ELEMENT PAIRING COMPATIBILITY SCORES
// ============================================================================

const ELEMENT_PAIRING_SCORES: Record<string, number> = {
  // Perfect harmony (same element)
  'fire-fire': 95,
  'air-air': 100,
  'water-water': 100,
  'earth-earth': 100,
  
  // Excellent compatibility (complementary)
  'fire-air': 85,
  'air-fire': 85,
  'water-earth': 85,
  'earth-water': 85,
  
  // Good compatibility (workable)
  'air-water': 70,
  'water-air': 70,
  'air-earth': 50,
  'earth-air': 50,
  'fire-earth': 65,
  'earth-fire': 65,
  
  // Challenging compatibility (requires work)
  'fire-water': 45,
  'water-fire': 45
};

// ============================================================================
// GET PAIRING KEY (alphabetically sorted for consistency)
// ============================================================================

function getPairingKey(element1: string, element2: string): string {
  const elements = [element1, element2].sort();
  return `${elements[0]}-${elements[1]}`;
}

// ============================================================================
// GET ELEMENT SCORE
// ============================================================================

function getElementPairingScore(
  element1: 'fire' | 'water' | 'air' | 'earth',
  element2: 'fire' | 'water' | 'air' | 'earth'
): number {
  const key = `${element1}-${element2}`;
  return ELEMENT_PAIRING_SCORES[key] || 50; // Default to moderate if not found
}

// ============================================================================
// CALCULATE LAYER RESULT
// ============================================================================

function calculateLayerResult(
  layerNumber: 1 | 2 | 3 | 4,
  layerType: 'daily-life' | 'emotional-foundation' | 'cross-dynamic-a' | 'cross-dynamic-b',
  element1: 'fire' | 'water' | 'air' | 'earth',
  element2: 'fire' | 'water' | 'air' | 'earth'
): CompatibilityLayerResult {
  
  const pairingKey = getPairingKey(element1, element2);
  const percentage = getElementPairingScore(element1, element2);
  
  // Element emojis
  const elementEmojis: Record<string, string> = {
    fire: '🔥',
    air: '💨',
    water: '💧',
    earth: '🌍'
  };
  
  // Element names in French
  const elementNamesFr: Record<string, string> = {
    fire: 'Feu',
    air: 'Air',
    water: 'Eau',
    earth: 'Terre'
  };
  
  const emoji = `${elementEmojis[element1]}${elementEmojis[element2]}`;
  
  // Labels based on pairing (will be detailed in translations)
  const pairingLabels: Record<string, { en: string; fr: string }> = {
    'fire-fire': { en: 'Fire + Fire: The Power Couple', fr: 'Feu + Feu : Le Couple Puissant' },
    'fire-air': { en: 'Fire + Air: The Visionary Duo', fr: 'Feu + Air : Le Duo Visionnaire' },
    'fire-water': { en: 'Fire + Water: Steam & Transformation', fr: 'Feu + Eau : Vapeur et Transformation' },
    'fire-earth': { en: 'Fire + Earth: Vision Meets Foundation', fr: 'Feu + Terre : La Vision Rencontre la Fondation' },
    'air-air': { en: 'Air + Air: The Intellectual Partnership', fr: 'Air + Air : Le Partenariat Intellectuel' },
    'air-water': { en: 'Air + Water: Mind Meets Heart', fr: 'Air + Eau : L\'Esprit Rencontre le Cœur' },
    'air-earth': { en: 'Air + Earth: Ideas Take Root', fr: 'Air + Terre : Les Idées Prennent Racine' },
    'water-water': { en: 'Water + Water: The Deep Connection', fr: 'Eau + Eau : La Connexion Profonde' },
    'water-earth': { en: 'Water + Earth: Nurturing Growth', fr: 'Eau + Terre : Croissance Nourricière' },
    'earth-earth': { en: 'Earth + Earth: The Solid Foundation', fr: 'Terre + Terre : La Fondation Solide' }
  };
  
  const labels = pairingLabels[pairingKey] || { en: 'Unknown Pairing', fr: 'Jumelage Inconnu' };
  
  // DETAILED ELEMENT PAIRING DESCRIPTIONS
  const pairingDetails: Record<string, {
    description: string;
    descriptionFrench: string;
    dailyLife?: string;
    dailyLifeFrench?: string;
    challenge?: string;
    challengeFrench?: string;
    tip?: string;
    tipFrench?: string;
  }> = {
    'fire-fire': {
      description: 'Intense, passionate, and fast-moving. You both bring bold energy and drive to the relationship.',
      descriptionFrench: 'Intense, passionné et rapide. Vous apportez tous les deux une énergie audacieuse et de la détermination à la relation.',
      dailyLife: 'Daily life together feels electric and exciting. Lots of action, adventure, and spontaneity.',
      dailyLifeFrench: 'La vie quotidienne ensemble semble électrique et excitante. Beaucoup d\'action, d\'aventure et de spontanéité.',
      challenge: 'May compete or burn out without rest. Both want to lead.',
      challengeFrench: 'Peut rivaliser ou s\'épuiser sans repos. Tous les deux veulent diriger.',
      tip: 'Schedule calm time together. Practice listening, not just doing.',
      tipFrench: 'Planifiez du temps calme ensemble. Pratiquez l\'écoute, pas seulement l\'action.'
    },
    'fire-air': {
      description: 'Fire sparks Air\'s ideas into action. Creative, energizing, and full of possibilities.',
      descriptionFrench: 'Le Feu transforme les idées de l\'Air en action. Créatif, énergisant et plein de possibilités.',
      dailyLife: 'You inspire each other constantly. Conversations lead to projects. Ideas become reality.',
      dailyLifeFrench: 'Vous vous inspirez constamment. Les conversations mènent à des projets. Les idées deviennent réalité.',
      challenge: 'May overlook emotional depth and practical details. All vision, little grounding.',
      challengeFrench: 'Peut négliger la profondeur émotionnelle et les détails pratiques. Toute vision, peu d\'ancrage.',
      tip: 'Weekly check-ins: \'How are you feeling?\' not just \'What are you doing?\'',
      tipFrench: 'Bilans hebdomadaires : \'Comment te sens-tu ?\' pas seulement \'Que fais-tu ?\''
    },
    'fire-water': {
      description: 'Passion meets depth. This creates either steam (transformation) or evaporation (conflict).',
      descriptionFrench: 'La passion rencontre la profondeur. Cela crée soit de la vapeur (transformation) soit de l\'évaporation (conflit).',
      dailyLife: 'Your approaches to life are opposite. Fire acts fast; Water needs time to feel. This creates friction in daily decisions.',
      dailyLifeFrench: 'Vos approches de la vie sont opposées. Le Feu agit vite ; l\'Eau a besoin de temps pour ressentir. Cela crée des frictions dans les décisions quotidiennes.',
      challenge: 'Fire may overwhelm Water. Water may withdraw from Fire. Communication styles clash.',
      challengeFrench: 'Le Feu peut submerger l\'Eau. L\'Eau peut se retirer du Feu. Les styles de communication s\'affrontent.',
      tip: 'Fire: Practice active listening and patience. Water: Express needs clearly and directly.',
      tipFrench: 'Feu : Pratiquez l\'écoute active et la patience. Eau : Exprimez vos besoins clairement et directement.'
    },
    'fire-earth': {
      description: 'Fire brings vision and excitement; Earth brings execution and stability. Complementary but at different paces.',
      descriptionFrench: 'Le Feu apporte vision et excitation ; la Terre apporte exécution et stabilité. Complémentaire mais à des rythmes différents.',
      dailyLife: 'Fire wants to start new things constantly; Earth prefers to finish what\'s begun. This creates planning tension but also balance.',
      dailyLifeFrench: 'Le Feu veut constamment commencer de nouvelles choses ; la Terre préfère finir ce qui est commencé. Cela crée une tension de planification mais aussi de l\'équilibre.',
      challenge: 'Different paces: Fire rushes, Earth takes time. May feel like you\'re pulling in opposite directions.',
      challengeFrench: 'Rythmes différents : Le Feu se précipite, la Terre prend son temps. Peut sembler tirer dans des directions opposées.',
      tip: 'Combine planning sessions (Earth) with spontaneous adventures (Fire). Honor both approaches.',
      tipFrench: 'Combinez des sessions de planification (Terre) avec des aventures spontanées (Feu). Honorez les deux approches.'
    },
    'air-air': {
      description: 'Endless conversations, shared curiosity, and mental stimulation. You understand how each other thinks.',
      descriptionFrench: 'Conversations infinies, curiosité partagée et stimulation mentale. Vous comprenez comment l\'autre pense.',
      dailyLife: 'You can talk for hours. Every experience becomes a discussion. Learning and exploring together is natural.',
      dailyLifeFrench: 'Vous pouvez parler pendant des heures. Chaque expérience devient une discussion. Apprendre et explorer ensemble est naturel.',
      challenge: 'May overthink or avoid emotional vulnerability. All head, not enough heart.',
      challengeFrench: 'Peut trop réfléchir ou éviter la vulnérabilité émotionnelle. Tout dans la tête, pas assez dans le cœur.',
      tip: 'Set \'no-analysis\' zones. Practice feeling without discussing. Touch more, talk less sometimes.',
      tipFrench: 'Créez des \'zones sans analyse\'. Pratiquez le ressenti sans discussion. Touchez plus, parlez moins parfois.'
    },
    'air-water': {
      description: 'Air gives words to Water\'s feelings. Water adds depth to Air\'s ideas. Beautiful when balanced.',
      descriptionFrench: 'L\'Air donne des mots aux sentiments de l\'Eau. L\'Eau ajoute de la profondeur aux idées de l\'Air. Magnifique quand équilibré.',
      dailyLife: 'Air helps Water express emotions clearly. Water reminds Air that feelings matter as much as thoughts.',
      dailyLifeFrench: 'L\'Air aide l\'Eau à exprimer les émotions clairement. L\'Eau rappelle à l\'Air que les sentiments comptent autant que les pensées.',
      challenge: 'Air may rationalize feelings; Water may feel misunderstood when emotions are analyzed.',
      challengeFrench: 'L\'Air peut rationaliser les sentiments ; l\'Eau peut se sentir incomprise lorsque les émotions sont analysées.',
      tip: 'Air: Write love letters, use your words for emotion. Water: Share dreams aloud. Trust Air to listen.',
      tipFrench: 'Air : Écrivez des lettres d\'amour, utilisez vos mots pour l\'émotion. Eau : Partagez vos rêves à voix haute. Faites confiance à l\'Air pour écouter.'
    },
    'air-earth': {
      description: 'Air dreams, Earth builds. Opposite approaches that can complement or clash.',
      descriptionFrench: 'L\'Air rêve, la Terre construit. Des approches opposées qui peuvent se compléter ou s\'affronter.',
      dailyLife: 'Air wants to explore possibilities; Earth wants to commit to one path. This creates daily decision-making friction.',
      dailyLifeFrench: 'L\'Air veut explorer les possibilités ; la Terre veut s\'engager dans une voie. Cela crée des frictions décisionnelles quotidiennes.',
      challenge: 'Air may seem scattered to Earth; Earth may seem rigid to Air. Different values around structure.',
      challengeFrench: 'L\'Air peut sembler dispersé pour la Terre ; la Terre peut sembler rigide pour l\'Air. Valeurs différentes autour de la structure.',
      tip: 'Create vision boards together (Air), then assign tasks and timelines (Earth). Meet in the middle.',
      tipFrench: 'Créez des tableaux de vision ensemble (Air), puis assignez des tâches et des échéances (Terre). Trouvez un terrain d\'entente.'
    },
    'water-water': {
      description: 'Intuitive understanding. You feel each other\'s emotions without words. Natural empathy flows between you.',
      descriptionFrench: 'Compréhension intuitive. Vous ressentez les émotions de l\'autre sans mots. L\'empathie naturelle circule entre vous.',
      dailyLife: 'A look says everything. You nurture each other instinctively. Emotional safety comes naturally.',
      dailyLifeFrench: 'Un regard dit tout. Vous vous nourrissez instinctivement. La sécurité émotionnelle vient naturellement.',
      challenge: 'May drown in emotions together. Can become isolated from the outside world. Need Air\'s perspective.',
      challengeFrench: 'Peut se noyer dans les émotions ensemble. Peut devenir isolé du monde extérieur. Besoin de la perspective de l\'Air.',
      tip: 'Journal together, then discuss what you wrote. Bring emotions into words. Connect with others too.',
      tipFrench: 'Écrivez dans un journal ensemble, puis discutez de ce que vous avez écrit. Mettez les émotions en mots. Connectez-vous aussi avec les autres.'
    },
    'water-earth': {
      description: 'Natural harmony. Water nourishes Earth, Earth holds Water. Like a garden—growth happens organically.',
      descriptionFrench: 'Harmonie naturelle. L\'Eau nourrit la Terre, la Terre retient l\'Eau. Comme un jardin—la croissance se produit naturellement.',
      dailyLife: 'You support each other\'s growth effortlessly. Water brings feelings, Earth brings stability. Balanced and peaceful.',
      dailyLifeFrench: 'Vous soutenez la croissance de l\'autre sans effort. L\'Eau apporte les sentiments, la Terre apporte la stabilité. Équilibré et paisible.',
      challenge: 'May avoid conflict or become stagnant. Too comfortable can mean no growth challenges.',
      challengeFrench: 'Peut éviter les conflits ou devenir stagnant. Trop confortable peut signifier aucun défi de croissance.',
      tip: 'Cook together, garden, create with your hands. Embrace gentle change. Try new things monthly.',
      tipFrench: 'Cuisinez ensemble, jardinez, créez avec vos mains. Embrassez le changement doux. Essayez de nouvelles choses mensuellement.'
    },
    'earth-earth': {
      description: 'Rock-solid stability. Loyalty, consistency, and shared practical goals. You build together brick by brick.',
      descriptionFrench: 'Stabilité inébranlable. Loyauté, cohérence et objectifs pratiques partagés. Vous construisez ensemble brique par brique.',
      dailyLife: 'Reliable routines, shared responsibilities, and steady progress. You know what to expect from each other.',
      dailyLifeFrench: 'Routines fiables, responsabilités partagées et progrès constants. Vous savez à quoi vous attendre de l\'autre.',
      challenge: 'May resist change or become too routine. Both can be stubborn. Life feels safe but may lack spontaneity.',
      challengeFrench: 'Peut résister au changement ou devenir trop routinier. Tous deux peuvent être têtus. La vie semble sûre mais peut manquer de spontanéité.',
      tip: 'Schedule monthly \'new experiences.\' Break routines together intentionally. Invite Air and Fire energy.',
      tipFrench: 'Planifiez des \'nouvelles expériences\' mensuelles. Brisez les routines ensemble intentionnellement. Invitez l\'énergie de l\'Air et du Feu.'
    }
  };
  
  const details = pairingDetails[pairingKey] || {
    description: `${elementNamesFr[element1]} and ${elementNamesFr[element2]} interaction`,
    descriptionFrench: `Interaction ${elementNamesFr[element1]} et ${elementNamesFr[element2]}`
  };
  
  return {
    layerNumber,
    layerType,
    element1,
    element2,
    pairingKey,
    percentage,
    emoji,
    label: labels.en,
    labelFrench: labels.fr,
    description: details.description,
    descriptionFrench: details.descriptionFrench,
    dailyLife: details.dailyLife,
    dailyLifeFrench: details.dailyLifeFrench,
    challenge: details.challenge,
    challengeFrench: details.challengeFrench,
    tip: details.tip,
    tipFrench: details.tipFrench
  };
}

// ============================================================================
// CALCULATE DUAL TEMPERAMENT
// ============================================================================

function calculateDualTemperament(
  innerElement: 'fire' | 'water' | 'air' | 'earth',
  cosmicElement: 'fire' | 'water' | 'air' | 'earth'
): DualTemperament {
  
  // Element names in Arabic
  const elementArabic: Record<string, string> = {
    fire: 'نار',
    water: 'ماء',
    air: 'هواء',
    earth: 'تراب'
  };
  
  // Element names in French
  const elementFrench: Record<string, string> = {
    fire: 'Feu',
    water: 'Eau',
    air: 'Air',
    earth: 'Terre'
  };
  
  // Determine integration type
  let integrationType: 'aligned' | 'complementary' | 'contrasting';
  let integrationLabel: string;
  let integrationLabelFrench: string;
  let integrationMeaning: string;
  let integrationMeaningFrench: string;
  
  if (innerElement === cosmicElement) {
    // Same element = Aligned
    integrationType = 'aligned';
    integrationLabel = 'Fully Aligned';
    integrationLabelFrench = 'Pleinement Aligné';
    integrationMeaning = 'You are authentically who you appear to be. What people see matches what you feel inside. This creates strong, consistent energy.';
    integrationMeaningFrench = 'Vous êtes authentiquement qui vous semblez être. Ce que les gens voient correspond à ce que vous ressentez à l\'intérieur. Cela crée une énergie forte et cohérente.';
  } else if (
    (innerElement === 'fire' && cosmicElement === 'air') ||
    (innerElement === 'air' && cosmicElement === 'fire') ||
    (innerElement === 'water' && cosmicElement === 'earth') ||
    (innerElement === 'earth' && cosmicElement === 'water')
  ) {
    // Complementary
    integrationType = 'complementary';
    integrationLabel = 'Naturally Balanced';
    integrationLabelFrench = 'Naturellement Équilibré';
    integrationMeaning = 'Your inner and cosmic sides support each other. You have access to multiple energies that work together harmoniously.';
    integrationMeaningFrench = 'Vos côtés intérieurs et cosmiques se soutiennent mutuellement. Vous avez accès à plusieurs énergies qui fonctionnent ensemble harmonieusement.';
  } else {
    // Contrasting
    integrationType = 'contrasting';
    integrationLabel = 'Internal Complexity';
    integrationLabelFrench = 'Complexité Interne';
    integrationMeaning = 'There\'s a gap between how you show up and what you need emotionally. Others may not see your full depth. You may feel misunderstood.';
    integrationMeaningFrench = 'Il y a un écart entre comment vous vous présentez et ce dont vous avez besoin émotionnellement. Les autres peuvent ne pas voir toute votre profondeur. Vous pouvez vous sentir incompris.';
  }
  
  return {
    innerElement,
    cosmicElement,
    innerElementArabic: elementArabic[innerElement],
    cosmicElementArabic: elementArabic[cosmicElement],
    innerElementFrench: elementFrench[innerElement],
    cosmicElementFrench: elementFrench[cosmicElement],
    integrationType,
    integrationLabel,
    integrationLabelFrench,
    integrationMeaning,
    integrationMeaningFrench
  };
}

// ============================================================================
// CREATE CALCULATION BREAKDOWN
// ============================================================================

function createCalculationBreakdown(
  name: string,
  arabicName: string,
  abjadMap: Record<string, number>
): CalculationBreakdown {
  
  const totalValue = calculateAbjadValue(arabicName, abjadMap);
  const remainder = totalValue % 4; // Display only - actual element uses modIndex
  const quotient = Math.floor(totalValue / 4);
  const element = getElementFromAbjadTotal(totalValue); // Uses modIndex internally
  
  const elementArabic: Record<string, string> = {
    fire: 'نار',
    water: 'ماء',
    air: 'هواء',
    earth: 'تراب'
  };
  
  // For letter breakdown, we'd need to parse the Arabic name
  // This is a simplified version
  const letterBreakdown = `${arabicName} = ${totalValue}`;
  
  return {
    personName: name,
    arabicName,
    letterBreakdown,
    totalValue,
    quotient,
    remainder,
    element,
    elementArabic: elementArabic[element]
  };
}

// ============================================================================
// GENERATE PERSONALIZED RECOMMENDATIONS
// ============================================================================

interface Recommendations {
  strengths: string[];
  strengthsFrench: string[];
  strengthsArabic: string[];
  challenges: string[];
  challengesFrench: string[];
  challengesArabic: string[];
  practices: string[];
  practicesFrench: string[];
  practicesArabic: string[];
  dhikr: string[];
  dhikrFrench: string[];
  dhikrArabic: string[];
}

function generateRecommendations(
  person1Name: string,
  person2Name: string,
  layers: {
    layer1?: CompatibilityLayerResult;
    layer2?: CompatibilityLayerResult;
    layer3?: CompatibilityLayerResult;
    layer4?: CompatibilityLayerResult;
  },
  analysisMode: FourLayerAnalysisMode,
  person1InnerElement: string,
  person2InnerElement: string,
  person1CosmicElement?: string,
  person2CosmicElement?: string
): Recommendations {
  
  const strengths: string[] = [];
  const strengthsFrench: string[] = [];
  const strengthsArabic: string[] = [];
  const challenges: string[] = [];
  const challengesFrench: string[] = [];
  const challengesArabic: string[] = [];
  const practices: string[] = [];
  const practicesFrench: string[] = [];
  const practicesArabic: string[] = [];
  const dhikr: string[] = [];
  const dhikrFrench: string[] = [];
  const dhikrArabic: string[] = [];
  
  // STRENGTHS based on highest scoring layer
  if (layers.layer2 && layers.layer2.percentage >= 70) {
    strengths.push(`Strong Emotional Foundation (${layers.layer2.percentage}%): Your mothers' energies create natural harmony. You feel "at home" with each other emotionally, which provides a stable base for the relationship.`);
    strengthsFrench.push(`Fondation Émotionnelle Solide (${layers.layer2.percentage}%) : Les énergies de vos mères créent une harmonie naturelle. Vous vous sentez "chez vous" émotionnellement l'un avec l'autre, ce qui fournit une base stable pour la relation.`);
    strengthsArabic.push(`أساس عاطفي قوي (${layers.layer2.percentage}٪): طاقات أمهاتكما تخلق انسجاماً طبيعياً. تشعران "بالراحة" مع بعضكما عاطفياً، مما يوفر قاعدة مستقرة للعلاقة.`);
  }
  
  if (layers.layer1 && layers.layer1.percentage >= 75) {
    strengths.push(`Natural Daily Compatibility (${layers.layer1.percentage}%): Your conscious personalities align well. Communication feels easy and you "get" each other's thought processes without much explanation.`);
    strengthsFrench.push(`Compatibilité Quotidienne Naturelle (${layers.layer1.percentage}%) : Vos personnalités conscientes s'alignent bien. La communication est facile et vous "comprenez" les processus de pensée de l'autre sans beaucoup d'explications.`);
    strengthsArabic.push(`توافق يومي طبيعي (${layers.layer1.percentage}٪): شخصياتكما الواعية متوافقة جيداً. التواصل يبدو سهلاً و"تفهمان" عمليات تفكير بعضكما دون الحاجة لكثير من الشرح.`);
  }
  
  // CHALLENGES based on lowest scoring layers
  if (layers.layer1 && layers.layer1.percentage < 65) {
    const el1 = person1InnerElement.charAt(0).toUpperCase() + person1InnerElement.slice(1);
    const el2 = person2InnerElement.charAt(0).toUpperCase() + person2InnerElement.slice(1);
    
    challenges.push(`Surface Dynamic: ${el1} + ${el2} (${layers.layer1.percentage}%) - Your daily interaction styles differ. ${person1Name}'s ${el1} approach may clash with ${person2Name}'s ${el2} style in routine decisions.`);
    challengesFrench.push(`Dynamique de Surface : ${el1} + ${el2} (${layers.layer1.percentage}%) - Vos styles d'interaction quotidiens diffèrent. L'approche ${el1} de ${person1Name} peut entrer en conflit avec le style ${el2} de ${person2Name} dans les décisions routinières.`);
    challengesArabic.push(`الديناميكية السطحية: ${el1} + ${el2} (${layers.layer1.percentage}٪) - أساليب تفاعلكما اليومية مختلفة. نهج ${el1} لـ${person1Name} قد يتعارض مع أسلوب ${el2} لـ${person2Name} في القرارات الروتينية.`);
  }
  
  if (layers.layer2 && layers.layer2.percentage < 60) {
    challenges.push(`Emotional Foundation (${layers.layer2.percentage}%) - Your inherited emotional patterns differ. What feels "natural" to one may seem foreign to the other. This requires conscious emotional education between you.`);
    challengesFrench.push(`Fondation Émotionnelle (${layers.layer2.percentage}%) - Vos patterns émotionnels hérités diffèrent. Ce qui semble "naturel" à l'un peut sembler étranger à l'autre. Cela nécessite une éducation émotionnelle consciente entre vous.`);
    challengesArabic.push(`الأساس العاطفي (${layers.layer2.percentage}٪) - أنماطكما العاطفية الموروثة مختلفة. ما يبدو "طبيعياً" لأحدكما قد يبدو غريباً للآخر. هذا يتطلب تثقيفاً عاطفياً واعياً بينكما.`);
  }
  
  // SPECIFIC PRACTICES based on element combinations
  const dailyPair = `${person1InnerElement}-${person2InnerElement}`;
  
  if (dailyPair.includes('fire') && dailyPair.includes('earth')) {
    practices.push(`Cook slow meals together - teaches Fire patience, gives Earth quality time`);
    practices.push(`Evening walks after work - Fire burns energy, Earth processes the day`);
    practices.push(`Create a "soft space" for hard conversations - neutral zone for both temperaments`);
    
    practicesFrench.push(`Cuisinez des repas lents ensemble - enseigne la patience au Feu, donne du temps de qualité à la Terre`);
    practicesFrench.push(`Promenades en soirée après le travail - le Feu brûle l'énergie, la Terre traite la journée`);
    practicesFrench.push(`Créez un "espace doux" pour les conversations difficiles - zone neutre pour les deux tempéraments`);
    
    practicesArabic.push(`اطبخا وجبات بطيئة معاً - يعلم النار الصبر، ويمنح الأرض وقتاً جيداً`);
    practicesArabic.push(`مشي مسائي بعد العمل - النار تحرق الطاقة، والأرض تعالج اليوم`);
    practicesArabic.push(`أنشئا "مساحة لطيفة" للمحادثات الصعبة - منطقة محايدة لكلا المزاجين`);
  }
  
  if (dailyPair.includes('fire') && dailyPair.includes('water')) {
    practices.push(`Practice the "pause" - Fire: count to 10 before reacting; Water: express needs clearly`);
    practices.push(`Alternate decision-making - Fire chooses adventures, Water chooses restoration`);
    practices.push(`Monthly check-ins - structured time to discuss emotions without defensiveness`);
    
    practicesFrench.push(`Pratiquez la "pause" - Feu : comptez jusqu'à 10 avant de réagir ; Eau : exprimez les besoins clairement`);
    practicesFrench.push(`Alternez la prise de décision - le Feu choisit les aventures, l'Eau choisit la restauration`);
    practicesFrench.push(`Bilans mensuels - temps structuré pour discuter des émotions sans défensive`);
    
    practicesArabic.push(`مارسا "التوقف المؤقت" - النار: عد إلى 10 قبل الرد؛ الماء: عبر عن الاحتياجات بوضوح`);
    practicesArabic.push(`تناوبا في اتخاذ القرارات - النار تختار المغامرات، والماء يختار التجديد`);
    practicesArabic.push(`جلسات شهرية - وقت منظم لمناقشة المشاعر دون دفاعية`);
  }
  
  if (dailyPair.includes('air') && dailyPair.includes('water')) {
    practices.push(`Journal together - Air analyzes, Water feels, both learn from the other's lens`);
    practices.push(`Create "thinking time" and "feeling time" - honor both processing styles`);
    practices.push(`Teach each other - Air shares logic, Water shares intuition`);
    
    practicesFrench.push(`Tenez un journal ensemble - l'Air analyse, l'Eau ressent, les deux apprennent de la perspective de l'autre`);
    practicesFrench.push(`Créez "temps de réflexion" et "temps de ressenti" - honorez les deux styles de traitement`);
    practicesFrench.push(`Enseignez-vous mutuellement - l'Air partage la logique, l'Eau partage l'intuition`);
    
    practicesArabic.push(`احتفظا بمذكرات معاً - الهواء يحلل، والماء يشعر، وكلاهما يتعلم من عدسة الآخر`);
    practicesArabic.push(`أنشئا "وقت تفكير" و"وقت شعور" - احترما كلا أسلوبي المعالجة`);
    practicesArabic.push(`علما بعضكما - الهواء يشارك المنطق، والماء يشارك الحدس`);
  }
  
  if (dailyPair.includes('air') && dailyPair.includes('earth')) {
    practices.push(`Build together - Air designs, Earth executes, celebrate both contributions`);
    practices.push(`Weekly planning sessions - Air's vision + Earth's timeline = manifestation`);
    practices.push(`Practice embodiment - Air: try yoga/tai chi; Earth: try brainstorming sessions`);
    
    practicesFrench.push(`Construisez ensemble - l'Air conçoit, la Terre exécute, célébrez les deux contributions`);
    practicesFrench.push(`Sessions de planification hebdomadaires - la vision de l'Air + le calendrier de la Terre = manifestation`);
    practicesFrench.push(`Pratiquez l'incarnation - Air : essayez le yoga/tai chi ; Terre : essayez des séances de brainstorming`);
    
    practicesArabic.push(`ابنيا معاً - الهواء يصمم، والأرض تنفذ، احتفلا بكلا المساهمتين`);
    practicesArabic.push(`جلسات تخطيط أسبوعية - رؤية الهواء + جدول الأرض الزمني = التجسيد`);
    practicesArabic.push(`مارسا التجسيد - الهواء: جرب اليوغا/تاي تشي؛ الأرض: جرب جلسات العصف الذهني`);
  }
  
  // DHIKR RECOMMENDATIONS based on elements
  const elementMap: Record<string, { name: string; arabic: string; transliteration: string; benefit: string; benefitFr: string; benefitAr: string }> = {
    fire: {
      name: 'Al-Laṭīf',
      arabic: 'يا لطيف',
      transliteration: 'Yā Laṭīf',
      benefit: 'The Subtle One - Cools intensity, brings gentleness',
      benefitFr: 'Le Subtil - Refroidit l\'intensité, apporte la douceur',
      benefitAr: 'اللطيف - يبرد الحدة، يجلب اللطف'
    },
    water: {
      name: 'Al-Qawiyy',
      arabic: 'يا قوي',
      transliteration: 'Yā Qawiyy',
      benefit: 'The All-Strong - Builds boundaries, strengthens resolve',
      benefitFr: 'Le Tout-Puissant - Construit des limites, renforce la détermination',
      benefitAr: 'القوي - يبني الحدود، يقوي العزيمة'
    },
    air: {
      name: 'Al-Ḥakīm',
      arabic: 'يا حكيم',
      transliteration: 'Yā Ḥakīm',
      benefit: 'The All-Wise - Grounds ideas, brings practical wisdom',
      benefitFr: 'Le Très Sage - Ancre les idées, apporte une sagesse pratique',
      benefitAr: 'الحكيم - يرسخ الأفكار، يجلب الحكمة العملية'
    },
    earth: {
      name: 'Al-Fattāḥ',
      arabic: 'يا فتاح',
      transliteration: 'Yā Fattāḥ',
      benefit: 'The Opener - Releases rigidity, invites flow',
      benefitFr: 'L\'Ouvreur - Libère la rigidité, invite le flux',
      benefitAr: 'الفتاح - يطلق الصلابة، يدعو التدفق'
    }
  };
  
  const person1Dhikr = elementMap[person1InnerElement];
  const person2Dhikr = elementMap[person2InnerElement];
  
  if (person1Dhikr) {
    dhikr.push(`For ${person1Name} (${person1InnerElement.toUpperCase()}): ${person1Dhikr.transliteration} (${person1Dhikr.arabic}) - ${person1Dhikr.benefit}`);
    dhikrFrench.push(`Pour ${person1Name} (${person1InnerElement.toUpperCase()}) : ${person1Dhikr.transliteration} (${person1Dhikr.arabic}) - ${person1Dhikr.benefitFr}`);
    dhikrArabic.push(`لـ ${person1Name} (${person1InnerElement.toUpperCase()}): ${person1Dhikr.transliteration} (${person1Dhikr.arabic}) - ${person1Dhikr.benefitAr}`);
  }
  
  if (person2Dhikr && person2Dhikr.name !== person1Dhikr?.name) {
    dhikr.push(`For ${person2Name} (${person2InnerElement.toUpperCase()}): ${person2Dhikr.transliteration} (${person2Dhikr.arabic}) - ${person2Dhikr.benefit}`);
    dhikrFrench.push(`Pour ${person2Name} (${person2InnerElement.toUpperCase()}) : ${person2Dhikr.transliteration} (${person2Dhikr.arabic}) - ${person2Dhikr.benefitFr}`);
    dhikrArabic.push(`لـ ${person2Name} (${person2InnerElement.toUpperCase()}): ${person2Dhikr.transliteration} (${person2Dhikr.arabic}) - ${person2Dhikr.benefitAr}`);
  }
  
  // Universal dhikr for the relationship
  dhikr.push(`Together: Yā Wadūd (يا ودود) - The Most Loving - Cultivates love and affection between hearts`);
  dhikrFrench.push(`Ensemble : Yā Wadūd (يا ودود) - Le Plus Aimant - Cultive l'amour et l'affection entre les cœurs`);
  dhikrArabic.push(`معاً: يا ودود - الودود - يزرع المحبة والمودة بين القلوب`);
  
  return {
    strengths,
    strengthsFrench,
    strengthsArabic,
    challenges,
    challengesFrench,
    challengesArabic,
    practices,
    practicesFrench,
    practicesArabic,
    dhikr,
    dhikrFrench,
    dhikrArabic
  };
}

// ============================================================================
// MAIN: ANALYZE FOUR-LAYER COMPATIBILITY
// ============================================================================

export function analyzeFourLayerCompatibility(
  person1Name: string,
  person1Arabic: string,
  person1MotherArabic: string | undefined,
  person2Name: string,
  person2Arabic: string,
  person2MotherArabic: string | undefined,
  abjadMap: Record<string, number>
): FourLayerCompatibility {
  
  // Determine analysis mode
  const analysisMode: FourLayerAnalysisMode = 
    (person1MotherArabic && person2MotherArabic) 
      ? 'complete' 
      : 'quick';
  
  // Calculate person 1 elements
  const person1AbjadTotal = calculateAbjadValue(person1Arabic, abjadMap);
  const person1InnerElement = getElementFromAbjadTotal(person1AbjadTotal);
  const person1CalculationBreakdown = createCalculationBreakdown(person1Name, person1Arabic, abjadMap);
  
  let person1CosmicElement: 'fire' | 'water' | 'air' | 'earth' | undefined;
  let person1MotherAbjadTotal: number | undefined;
  let person1MotherCalculationBreakdown: CalculationBreakdown | undefined;
  let person1DualTemperament: DualTemperament | undefined;
  
  if (analysisMode === 'complete' && person1MotherArabic) {
    person1MotherAbjadTotal = calculateAbjadValue(person1MotherArabic, abjadMap);
    person1CosmicElement = getElementFromAbjadTotal(person1MotherAbjadTotal);
    person1MotherCalculationBreakdown = createCalculationBreakdown(
      'Mother',
      person1MotherArabic,
      abjadMap
    );
    person1DualTemperament = calculateDualTemperament(person1InnerElement, person1CosmicElement);
  }
  
  // Calculate person 2 elements (if provided)
  let person2AbjadTotal: number = 0;
  let person2InnerElement: 'fire' | 'water' | 'air' | 'earth' = 'fire';
  let person2CalculationBreakdown: CalculationBreakdown;
  let person2CosmicElement: 'fire' | 'water' | 'air' | 'earth' | undefined;
  let person2MotherAbjadTotal: number | undefined;
  let person2MotherCalculationBreakdown: CalculationBreakdown | undefined;
  let person2DualTemperament: DualTemperament | undefined;
  
  if (person2Arabic) {
    person2AbjadTotal = calculateAbjadValue(person2Arabic, abjadMap);
    person2InnerElement = getElementFromAbjadTotal(person2AbjadTotal);
    person2CalculationBreakdown = createCalculationBreakdown(person2Name || 'Person 2', person2Arabic, abjadMap);
    
    if (analysisMode === 'complete' && person2MotherArabic) {
      person2MotherAbjadTotal = calculateAbjadValue(person2MotherArabic, abjadMap);
      person2CosmicElement = getElementFromAbjadTotal(person2MotherAbjadTotal);
      person2MotherCalculationBreakdown = createCalculationBreakdown(
        'Mother',
        person2MotherArabic,
        abjadMap
      );
      person2DualTemperament = calculateDualTemperament(person2InnerElement, person2CosmicElement);
    }
  } else {
    // Default values if person 2 not provided
    person2CalculationBreakdown = {
      personName: 'Person 2',
      arabicName: '',
      letterBreakdown: '',
      totalValue: 0,
      quotient: 0,
      remainder: 0,
      element: 'fire',
      elementArabic: 'نار'
    };
  }
  
  // Calculate layers
  const layers: FourLayerCompatibility['layers'] = {};
  
  // Layer 1: Daily Life (always available)
  if (person2Arabic) {
    layers.layer1 = calculateLayerResult(1, 'daily-life', person1InnerElement, person2InnerElement);
  }
  
  // Layer 2, 3, 4: Only if complete analysis
  if (analysisMode === 'complete' && person1CosmicElement && person2CosmicElement) {
    layers.layer2 = calculateLayerResult(2, 'emotional-foundation', person1CosmicElement, person2CosmicElement);
    layers.layer3 = calculateLayerResult(3, 'cross-dynamic-a', person1InnerElement, person2CosmicElement);
    layers.layer4 = calculateLayerResult(4, 'cross-dynamic-b', person2InnerElement, person1CosmicElement);
  }
  
  // Calculate overall score (weighted)
  let overallScore: number;
  if (analysisMode === 'complete') {
    // L1(30%) + L2(40%) + L3(15%) + L4(15%)
    overallScore = Math.round(
      (layers.layer1?.percentage || 0) * 0.30 +
      (layers.layer2?.percentage || 0) * 0.40 +
      (layers.layer3?.percentage || 0) * 0.15 +
      (layers.layer4?.percentage || 0) * 0.15
    );
  } else {
    // Quick mode: just layer 1
    overallScore = layers.layer1?.percentage || 50;
  }
  
  // Determine quality
  let overallQuality: FourLayerCompatibility['overallQuality'];
  let overallQualityArabic: string;
  let overallQualityFrench: string;
  
  if (overallScore >= 85) {
    overallQuality = 'excellent';
    overallQualityArabic = 'ممتاز';
    overallQualityFrench = 'EXCELLENT';
  } else if (overallScore >= 70) {
    overallQuality = 'very-good';
    overallQualityArabic = 'جيد جداً';
    overallQualityFrench = 'TRÈS BIEN';
  } else if (overallScore >= 55) {
    overallQuality = 'good';
    overallQualityArabic = 'جيد';
    overallQualityFrench = 'BIEN';
  } else if (overallScore >= 40) {
    overallQuality = 'challenging';
    overallQualityArabic = 'تحدي';
    overallQualityFrench = 'DIFFICILE';
  } else {
    overallQuality = 'difficult';
    overallQualityArabic = 'صعب جداً';
    overallQualityFrench = 'TRÈS DIFFICILE';
  }
  
  const accuracyPercentage = analysisMode === 'complete' ? '90-95%' : '70-75%';
  
  // Generate summary (placeholder - will be enhanced with translations)
  const summary = `${person1Name} and ${person2Name || 'Person 2'} have ${overallQuality} compatibility (${overallScore}%).`;
  const summaryFrench = `${person1Name} et ${person2Name || 'Personne 2'} ont une compatibilité ${overallQualityFrench} (${overallScore}%).`;
  const summaryArabic = `${person1Name} و ${person2Name || 'الشخص الثاني'} لديهما توافق ${overallQualityArabic} (${overallScore}%).`;
  
  // Generate personalized recommendations
  const recommendations = generateRecommendations(
    person1Name,
    person2Name || 'Person 2',
    layers,
    analysisMode,
    person1InnerElement,
    person2InnerElement,
    person1CosmicElement,
    person2CosmicElement
  );
  
  return {
    mode: 'four-layer',
    analysisMode,
    person1: {
      name: person1Name,
      arabicName: person1Arabic,
      abjadTotal: person1AbjadTotal,
      innerElement: person1InnerElement,
      motherArabicName: person1MotherArabic,
      motherAbjadTotal: person1MotherAbjadTotal,
      cosmicElement: person1CosmicElement,
      dualTemperament: person1DualTemperament,
      calculationBreakdown: person1CalculationBreakdown,
      motherCalculationBreakdown: person1MotherCalculationBreakdown
    },
    person2: {
      name: person2Name || 'Person 2',
      arabicName: person2Arabic || '',
      abjadTotal: person2AbjadTotal,
      innerElement: person2InnerElement,
      motherArabicName: person2MotherArabic,
      motherAbjadTotal: person2MotherAbjadTotal,
      cosmicElement: person2CosmicElement,
      dualTemperament: person2DualTemperament,
      calculationBreakdown: person2CalculationBreakdown,
      motherCalculationBreakdown: person2MotherCalculationBreakdown
    },
    layers,
    overallScore,
    overallQuality,
    overallQualityArabic,
    overallQualityFrench,
    accuracyPercentage,
    summary,
    summaryFrench,
    summaryArabic,
    strengths: recommendations.strengths,
    strengthsFrench: recommendations.strengthsFrench,
    strengthsArabic: recommendations.strengthsArabic,
    challenges: recommendations.challenges,
    challengesFrench: recommendations.challengesFrench,
    challengesArabic: recommendations.challengesArabic,
    practices: recommendations.practices,
    practicesFrench: recommendations.practicesFrench,
    practicesArabic: recommendations.practicesArabic,
    dhikrRecommendations: recommendations.dhikr,
    dhikrRecommendationsFrench: recommendations.dhikrFrench,
    dhikrRecommendationsArabic: recommendations.dhikrArabic
  };
}
