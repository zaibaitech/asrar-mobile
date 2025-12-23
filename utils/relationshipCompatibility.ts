import { PLANETARY_RELATIONSHIPS, PLANETARY_RULERS } from '../constants/compatibility';
import {
    ElementalTemperamentResult,
    PlanetaryCosmicResult,
    RelationshipCompatibility,
    SpiritualDestinyResult
} from '../types/compatibility';

// Utility: modIndex implementation
const modIndex = (value: number, mod: number): number => {
  const result = value % mod;
  return result === 0 ? mod : result;
};

// ============================================================================
// 1️⃣ SPIRITUAL-DESTINY METHOD (Mod-9)
// ============================================================================

export function calculateSpiritualDestiny(
  abjadTotal1: number,
  abjadTotal2: number
): SpiritualDestinyResult {
  
  // Formula: (Total1 + Total2 + 7) mod 9
  const sum = abjadTotal1 + abjadTotal2 + 7;
  const remainder = sum % 9 === 0 ? 9 : sum % 9; // Treat 0 as 9
  
  // Score mapping based on classical interpretations
  // Updated January 2025 based on consultation with Asrār master
  const scoreMap: Record<number, { score: number; quality: SpiritualDestinyResult['quality']; qualityArabic: string; qualityFrench: string }> = {
    1: { score: 65, quality: 'moderate', qualityArabic: 'متوسط', qualityFrench: 'Modéré' },
    2: { score: 70, quality: 'good', qualityArabic: 'جيد', qualityFrench: 'Bon' },
    3: { score: 40, quality: 'challenging', qualityArabic: 'العداوة', qualityFrench: 'Difficile' }, // FIXED: Represents friction/enmity
    4: { score: 70, quality: 'good', qualityArabic: 'جيد', qualityFrench: 'Bon' },
    5: { score: 60, quality: 'moderate', qualityArabic: 'متوسط', qualityFrench: 'Modéré' },
    6: { score: 55, quality: 'challenging', qualityArabic: 'تحدي', qualityFrench: 'Difficile' },
    7: { score: 95, quality: 'excellent', qualityArabic: 'ممتاز', qualityFrench: 'Excellent' }, // BEST MATCH
    8: { score: 90, quality: 'excellent', qualityArabic: 'ممتاز جداً', qualityFrench: 'Très excellent' }, // BEST MATCH
    9: { score: 45, quality: 'challenging', qualityArabic: 'الإنتهاء', qualityFrench: 'Difficile' } // FIXED: Cycle ending
  };
  
  const result = scoreMap[remainder];
  
  // Descriptions based on remainder
  const descriptions: Record<number, { en: string; fr: string; ar: string }> = {
    1: {
      en: 'New beginnings and fresh energy. This pairing initiates new chapters together.',
      fr: 'Nouveaux départs et énergie fraîche. Ce duo initie de nouveaux chapitres ensemble.',
      ar: 'بدايات جديدة وطاقة متجددة. هذا الزوج يبدأ فصولاً جديدة معاً.'
    },
    2: {
      en: 'Balance and duality. Both individuals complement each other through cooperation.',
      fr: 'Équilibre et dualité. Les deux individus se complètent par la coopération.',
      ar: 'توازن وثنائية. كلا الطرفين يكمل الآخر من خلال التعاون.'
    },
    3: {
      en: 'Friction and discord. This pairing faces fundamental differences that require careful navigation.',
      fr: 'Friction et discorde. Ce duo fait face à des différences fondamentales nécessitant une navigation prudente.',
      ar: 'احتكاك وخلاف. هذا الزوج يواجه اختلافات أساسية تتطلب تعاملاً حذراً.'
    },
    4: {
      en: 'Stability and structure. A grounded partnership built on solid foundations.',
      fr: 'Stabilité et structure. Un partenariat ancré construit sur des bases solides.',
      ar: 'استقرار وبنية. شراكة متأصلة مبنية على أسس صلبة.'
    },
    5: {
      en: 'Dynamic change and adaptability. This pairing thrives on variety and movement.',
      fr: 'Changement dynamique et adaptabilité. Ce duo prospère dans la variété et le mouvement.',
      ar: 'تغيير ديناميكي وقابلية للتكيف. هذا الزوج يزدهر بالتنوع والحركة.'
    },
    6: {
      en: 'Responsibility and service. May require effort but builds strong commitment.',
      fr: 'Responsabilité et service. Peut nécessiter des efforts mais renforce l\'engagement.',
      ar: 'مسؤولية وخدمة. قد يتطلب جهداً لكن يبني التزاماً قوياً.'
    },
    7: {
      en: 'Spiritual harmony and wisdom. An ideal match with deep understanding.',
      fr: 'Harmonie spirituelle et sagesse. Un match idéal avec une compréhension profonde.',
      ar: 'انسجام روحاني وحكمة. توافق مثالي مع فهم عميق.'
    },
    8: {
      en: 'Abundance and manifestation. This pair has strong potential for achievement.',
      fr: 'Abondance et manifestation. Ce couple a un fort potentiel de réussite.',
      ar: 'وفرة وتجسيد. هذا الثنائي لديه إمكانات قوية للإنجاز.'
    },
    9: {
      en: 'Cycle ending and completion. This connection may represent a karmic conclusion or natural closure.',
      fr: 'Fin de cycle et achèvement. Cette connexion peut représenter une conclusion karmique ou une clôture naturelle.',
      ar: 'نهاية دورة وإتمام. هذا الارتباط قد يمثل خاتمة كارمية أو إغلاقاً طبيعياً.'
    }
  };
  
  const desc = descriptions[remainder];
  const colors = {
    excellent: 'green',
    good: 'blue',
    moderate: 'yellow',
    challenging: 'orange'
  };
  
  return {
    method: 'spiritual-destiny',
    methodArabic: 'الطريقة الروحانية',
    remainder,
    score: result.score,
    quality: result.quality,
    qualityArabic: result.qualityArabic,
    qualityFrench: result.qualityFrench,
    description: desc.en,
    descriptionFrench: desc.fr,
    descriptionArabic: desc.ar,
    color: colors[result.quality]
  };
}

// ============================================================================
// 2️⃣ ELEMENTAL-TEMPERAMENT METHOD (Mod-4)
// ============================================================================

export function calculateElementalTemperament(
  abjadTotal1: number,
  abjadTotal2: number
): ElementalTemperamentResult {
  
  // Formula: (Total1 + Total2) mod 4
  const sum = abjadTotal1 + abjadTotal2;
  const remainder = sum % 4 === 0 ? 4 : sum % 4; // Treat 0 as 4
  
  // Map remainder to elements (MAGHRIBI SYSTEM: 1=Fire, 2=Earth, 3=Air, 4=Water)
  const elementMap: Record<number, { 
    element: 'fire' | 'water' | 'air' | 'earth';
    elementArabic: string;
    elementFrench: string;
    score: number;
    quality: ElementalTemperamentResult['quality'];
    qualityArabic: string;
    qualityFrench: string;
  }> = {
    1: {
      element: 'fire',
      elementArabic: 'نار',
      elementFrench: 'feu',
      score: 85,
      quality: 'dynamic',
      qualityArabic: 'ديناميكي',
      qualityFrench: 'Dynamique'
    },
    2: {
      element: 'earth',
      elementArabic: 'تراب',
      elementFrench: 'terre',
      score: 90,
      quality: 'complementary',
      qualityArabic: 'تكميلي',
      qualityFrench: 'Complémentaire'
    },
    3: {
      element: 'air',
      elementArabic: 'هواء',
      elementFrench: 'air',
      score: 75,
      quality: 'balanced',
      qualityArabic: 'متوازن',
      qualityFrench: 'Équilibré'
    },
    4: {
      element: 'water',
      elementArabic: 'ماء',
      elementFrench: 'eau',
      score: 80,
      quality: 'harmonious',
      qualityArabic: 'متناغم',
      qualityFrench: 'Harmonieux'
    }
  };
  
  const result = elementMap[remainder];
  
  // Descriptions based on shared element
  const descriptions: Record<typeof result.element, { en: string; fr: string; ar: string }> = {
    fire: {
      en: 'Passionate and energetic chemistry. Both partners bring enthusiasm and drive.',
      fr: 'Chimie passionnée et énergique. Les deux partenaires apportent enthousiasme et dynamisme.',
      ar: 'كيمياء عاطفية ونشطة. كلا الشريكين يجلبان الحماس والدافع.'
    },
    water: {
      en: 'Emotional depth and intuitive connection. A nurturing and empathetic bond.',
      fr: 'Profondeur émotionnelle et connexion intuitive. Un lien nourricier et empathique.',
      ar: 'عمق عاطفي واتصال حدسي. رابطة راعية ومتعاطفة.'
    },
    air: {
      en: 'Intellectual stimulation and clear communication. Mental compatibility is strong.',
      fr: 'Stimulation intellectuelle et communication claire. La compatibilité mentale est forte.',
      ar: 'تحفيز فكري وتواصل واضح. التوافق العقلي قوي.'
    },
    earth: {
      en: 'Practical stability and reliable support. A grounded, lasting partnership.',
      fr: 'Stabilité pratique et soutien fiable. Un partenariat ancré et durable.',
      ar: 'استقرار عملي ودعم موثوق. شراكة متأصلة ودائمة.'
    }
  };
  
  const desc = descriptions[result.element];
  const colors = {
    fire: 'red',
    water: 'blue',
    air: 'cyan',
    earth: 'green'
  };
  
  return {
    method: 'elemental-temperament',
    methodArabic: 'طريقة الطبائع الأربع',
    remainder,
    sharedElement: result.element,
    sharedElementArabic: result.elementArabic,
    sharedElementFrench: result.elementFrench,
    score: result.score,
    quality: result.quality,
    qualityArabic: result.qualityArabic,
    qualityFrench: result.qualityFrench,
    description: desc.en,
    descriptionFrench: desc.fr,
    descriptionArabic: desc.ar,
    color: colors[result.element]
  };
}

// ============================================================================
// 3️⃣ PLANETARY-COSMIC METHOD
// ============================================================================

export function calculatePlanetaryCosmic(
  abjadTotal1: number,
  abjadTotal2: number
): PlanetaryCosmicResult {
  
  // Assign ruling planets based on mod 7
  const planet1Index = abjadTotal1 % 7;
  const planet2Index = abjadTotal2 % 7;
  
  const planet1 = PLANETARY_RULERS[planet1Index as keyof typeof PLANETARY_RULERS];
  const planet2 = PLANETARY_RULERS[planet2Index as keyof typeof PLANETARY_RULERS];
  
  // Determine relationship between planets
  let relationship: 'friendly' | 'neutral' | 'opposing';
  let relationshipArabic: string;
  let relationshipFrench: string;
  let score: number;
  let quality: PlanetaryCosmicResult['quality'];
  let qualityArabic: string;
  let qualityFrench: string;
  
  const planetRelations = PLANETARY_RELATIONSHIPS[planet1.name];
  
  if (planet1.name === planet2.name) {
    relationship = 'friendly';
    relationshipArabic = 'صديق';
    relationshipFrench = 'Amical';
    score = 100;
    quality = 'excellent';
    qualityArabic = 'ممتاز';
    qualityFrench = 'Excellent';
  } else if (planetRelations.friendly.includes(planet2.name)) {
    relationship = 'friendly';
    relationshipArabic = 'صديق';
    relationshipFrench = 'Amical';
    score = 85;
    quality = 'excellent';
    qualityArabic = 'ممتاز';
    qualityFrench = 'Excellent';
  } else if (planetRelations.neutral.includes(planet2.name)) {
    relationship = 'neutral';
    relationshipArabic = 'محايد';
    relationshipFrench = 'Neutre';
    score = 65;
    quality = 'good';
    qualityArabic = 'جيد';
    qualityFrench = 'Bon';
  } else {
    relationship = 'opposing';
    relationshipArabic = 'متعارض';
    relationshipFrench = 'Opposé';
    score = 45;
    quality = 'challenging';
    qualityArabic = 'تحدي';
    qualityFrench = 'Difficile';
  }
  
  // Generate descriptions
  const descriptions: Record<typeof relationship, { en: string; fr: string; ar: string }> = {
    friendly: {
      en: `${planet1.name} and ${planet2.name} are harmonious celestial allies. Their cosmic energies flow smoothly together.`,
      fr: `${planet1.name} et ${planet2.name} sont des alliés célestes harmonieux. Leurs énergies cosmiques s'harmonisent parfaitement.`,
      ar: `${planet1.nameArabic} و ${planet2.nameArabic} حلفاء سماويون متناغمون. طاقاتهم الكونية تتدفق بسلاسة معاً.`
    },
    neutral: {
      en: `${planet1.name} and ${planet2.name} maintain balanced cosmic positions. Requires conscious effort for alignment.`,
      fr: `${planet1.name} et ${planet2.name} maintiennent des positions cosmiques équilibrées. Nécessite un effort conscient pour l'alignement.`,
      ar: `${planet1.nameArabic} و ${planet2.nameArabic} يحافظان على مواقع كونية متوازنة. يتطلب جهداً واعياً للتوافق.`
    },
    opposing: {
      en: `${planet1.name} and ${planet2.name} have challenging cosmic aspects. Growth comes through navigating differences.`,
      fr: `${planet1.name} et ${planet2.name} ont des aspects cosmiques difficiles. La croissance vient en naviguant les différences.`,
      ar: `${planet1.nameArabic} و ${planet2.nameArabic} لديهما جوانب كونية صعبة. النمو يأتي من خلال التعامل مع الاختلافات.`
    }
  };
  
  const desc = descriptions[relationship];
  const colors = {
    excellent: 'green',
    good: 'blue',
    moderate: 'yellow',
    challenging: 'orange'
  };
  
  return {
    method: 'planetary-cosmic',
    methodArabic: 'الطريقة الكوكبية',
    person1Planet: planet1,
    person2Planet: planet2,
    relationship,
    relationshipArabic,
    relationshipFrench,
    score,
    quality,
    qualityArabic,
    qualityFrench,
    description: desc.en,
    descriptionFrench: desc.fr,
    descriptionArabic: desc.ar,
    color: colors[quality]
  };
}

// ============================================================================
// COMBINED RELATIONSHIP COMPATIBILITY ANALYSIS
// ============================================================================

export function analyzeRelationshipCompatibility(
  person1Name: string,
  person1Arabic: string,
  person1AbjadTotal: number,
  person1Element: 'fire' | 'water' | 'air' | 'earth',
  person2Name: string,
  person2Arabic: string,
  person2AbjadTotal: number,
  person2Element: 'fire' | 'water' | 'air' | 'earth'
): RelationshipCompatibility {
  
  // Calculate using all four methods
  const spiritualDestiny = calculateSpiritualDestiny(person1AbjadTotal, person2AbjadTotal);
  const elementalTemperament = calculateElementalTemperament(person1AbjadTotal, person2AbjadTotal);
  const planetaryCosmic = calculatePlanetaryCosmic(person1AbjadTotal, person2AbjadTotal);
  const dailyInteraction = analyzeDailyInteraction(person1Arabic, person2Arabic);
  
  // Calculate overall score (weighted average)
  // Spiritual-Destiny: 30%, Elemental-Temperament: 25%, Planetary-Cosmic: 25%, Daily-Interaction: 20%
  const overallScore = Math.round(
    (spiritualDestiny.score * 0.30) + 
    (elementalTemperament.score * 0.25) + 
    (planetaryCosmic.score * 0.25) +
    (dailyInteraction.score * 0.20)
  );
  
  // Determine overall quality
  let overallQuality: RelationshipCompatibility['overallQuality'];
  let overallQualityArabic: string;
  let overallQualityFrench: string;
  
  if (overallScore >= 85) {
    overallQuality = 'excellent';
    overallQualityArabic = 'ممتاز';
    overallQualityFrench = 'EXCELLENT';
  } else if (overallScore >= 75) {
    overallQuality = 'very-good';
    overallQualityArabic = 'جيد جداً';
    overallQualityFrench = 'TRÈS BON';
  } else if (overallScore >= 65) {
    overallQuality = 'good';
    overallQualityArabic = 'جيد';
    overallQualityFrench = 'BON';
  } else if (overallScore >= 50) {
    overallQuality = 'moderate';
    overallQualityArabic = 'متوسط';
    overallQualityFrench = 'MODÉRÉ';
  } else {
    overallQuality = 'challenging';
    overallQualityArabic = 'تحدي';
    overallQualityFrench = 'DIFFICILE';
  }
  
  // Generate summary
  const summaries: Record<typeof overallQuality, { en: string; fr: string; ar: string }> = {
    'excellent': {
      en: `${person1Name} and ${person2Name} share exceptional compatibility across spiritual, elemental, and cosmic dimensions. This pairing has strong potential for harmony and mutual growth.`,
      fr: `${person1Name} et ${person2Name} partagent une compatibilité exceptionnelle à travers les dimensions spirituelle, élémentaire et cosmique. Ce duo a un fort potentiel d'harmonie et de croissance mutuelle.`,
      ar: `${person1Name} و ${person2Name} يتشاركان توافقاً استثنائياً عبر الأبعاد الروحانية والعنصرية والكونية. هذا الثنائي لديه إمكانات قوية للانسجام والنمو المتبادل.`
    },
    'very-good': {
      en: `${person1Name} and ${person2Name} demonstrate strong compatibility with excellent alignment in most areas. Minor differences can be easily harmonized.`,
      fr: `${person1Name} et ${person2Name} démontrent une forte compatibilité avec un excellent alignement dans la plupart des domaines. Les différences mineures peuvent être facilement harmonisées.`,
      ar: `${person1Name} و ${person2Name} يظهران توافقاً قوياً مع انسجام ممتاز في معظم المجالات. الاختلافات البسيطة يمكن تنسيقها بسهولة.`
    },
    'good': {
      en: `${person1Name} and ${person2Name} have good compatibility with balanced energies. With understanding and effort, this connection can flourish.`,
      fr: `${person1Name} et ${person2Name} ont une bonne compatibilité avec des énergies équilibrées. Avec compréhension et effort, cette connexion peut s'épanouir.`,
      ar: `${person1Name} و ${person2Name} لديهما توافق جيد مع طاقات متوازنة. مع الفهم والجهد، يمكن أن تزدهر هذه العلاقة.`
    },
    'moderate': {
      en: `${person1Name} and ${person2Name} show moderate compatibility with both strengths and challenges. Conscious communication is key to success.`,
      fr: `${person1Name} et ${person2Name} montrent une compatibilité modérée avec des forces et des défis. La communication consciente est la clé du succès.`,
      ar: `${person1Name} و ${person2Name} يظهران توافقاً متوسطاً مع نقاط قوة وتحديات. التواصل الواعي هو مفتاح النجاح.`
    },
    'challenging': {
      en: `${person1Name} and ${person2Name} face notable differences that require patience and mutual respect. Growth comes through embracing complementary perspectives.`,
      fr: `${person1Name} et ${person2Name} font face à des différences notables qui nécessitent patience et respect mutuel. La croissance vient en embrassant des perspectives complémentaires.`,
      ar: `${person1Name} و ${person2Name} يواجهان اختلافات ملحوظة تتطلب الصبر والاحترام المتبادل. النمو يأتي من خلال تبني وجهات نظر تكميلية.`
    }
  };
  
  const summary = summaries[overallQuality];
  
  // Generate recommendations based on scores
  const recommendations: string[] = [];
  const recommendationsFrench: string[] = [];
  const recommendationsArabic: string[] = [];
  
  // Element names in French
  const elementNamesFr: Record<string, string> = {
    fire: 'feu',
    air: 'air',
    water: 'eau',
    earth: 'terre'
  };
  
  // Dominant Element Pair Reflections (based on the two dominant elements)
  const dominantPairReflections: Record<string, { en: string; fr: string; ar: string }> = {
    'fire-fire': {
      en: 'Your Fire–Fire combination creates intense passion and drive. Channel this energy into shared goals to avoid burnout.',
      fr: 'Votre combinaison Feu–Feu crée une passion et un dynamisme intenses. Canalisez cette énergie vers des objectifs communs pour éviter l\'épuisement.',
      ar: 'مزيج النار والنار يخلق شغفاً ودافعاً مكثفاً. وجها هذه الطاقة نحو أهداف مشتركة لتجنب الإرهاق.'
    },
    'fire-air': {
      en: 'Your Fire–Air mix ignites creativity and inspiration. Balance spontaneity with thoughtful planning.',
      fr: 'Votre mélange Feu–Air enflamme la créativité et l\'inspiration. Équilibrez spontanéité et planification réfléchie.',
      ar: 'مزيج النار والهواء يشعل الإبداع والإلهام. وازنا بين العفوية والتخطيط المدروس.'
    },
    'fire-water': {
      en: 'Your Fire–Water mix creates transformation through emotion and passion. Allow emotions to cool before major decisions.',
      fr: 'Votre mélange Feu–Eau crée une transformation par l\'émotion et la passion. Laissez les émotions se calmer avant les décisions importantes.',
      ar: 'مزيج النار والماء يخلق التحول من خلال العاطفة والشغف. اسمحا للعواطف أن تهدأ قبل القرارات الكبرى.'
    },
    'fire-earth': {
      en: 'Your Fire–Earth combination blends passion with practicality. Let vision meet execution for powerful results.',
      fr: 'Votre combinaison Feu–Terre mêle passion et pragmatisme. Laissez la vision rencontrer l\'exécution pour des résultats puissants.',
      ar: 'مزيج النار والأرض يمزج الشغف بالواقعية. دعوا الرؤية تلتقي بالتنفيذ لنتائج قوية.'
    },
    'air-air': {
      en: 'Your Air–Air pairing enhances intellectual synergy. Ground ideas in action to manifest your shared visions.',
      fr: 'Votre duo Air–Air renforce la synergie intellectuelle. Ancrez les idées dans l\'action pour manifester vos visions partagées.',
      ar: 'زوج الهواء والهواء يعزز التآزر الفكري. رسخا الأفكار في العمل لتجسيد رؤاكما المشتركة.'
    },
    'air-water': {
      en: 'Your Air–Water blend merges intellect with intuition. Trust both logic and feelings in decision-making.',
      fr: 'Votre mélange Air–Eau fusionne intellect et intuition. Faites confiance à la fois à la logique et aux sentiments dans les décisions.',
      ar: 'مزيج الهواء والماء يدمج العقل مع الحدس. ثقا في كل من المنطق والمشاعر في اتخاذ القرارات.'
    },
    'air-earth': {
      en: 'Your Air–Earth combination balances ideas with implementation. Communicate clearly while building tangible foundations.',
      fr: 'Votre combinaison Air–Terre équilibre les idées avec la mise en œuvre. Communiquez clairement tout en construisant des fondations tangibles.',
      ar: 'مزيج الهواء والأرض يوازن الأفكار مع التنفيذ. تواصلا بوضوح أثناء بناء أسس ملموسة.'
    },
    'water-water': {
      en: 'Your Water–Water connection deepens emotional bonds. Create boundaries to prevent emotional overwhelm.',
      fr: 'Votre connexion Eau–Eau approfondit les liens émotionnels. Créez des limites pour prévenir le débordement émotionnel.',
      ar: 'اتصال الماء والماء يعمق الروابط العاطفية. أنشئا حدوداً لمنع الطغيان العاطفي.'
    },
    'water-earth': {
      en: 'Your Water–Earth pairing nurtures growth and stability. Combine emotional depth with practical care.',
      fr: 'Votre duo Eau–Terre nourrit la croissance et la stabilité. Combinez profondeur émotionnelle et soin pratique.',
      ar: 'زوج الماء والأرض يرعى النمو والاستقرار. اجمعا بين العمق العاطفي والرعاية العملية.'
    },
    'earth-earth': {
      en: 'Your Earth–Earth foundation builds lasting security. Embrace flexibility to keep the relationship dynamic.',
      fr: 'Votre fondation Terre–Terre construit une sécurité durable. Embrassez la flexibilité pour garder la relation dynamique.',
      ar: 'أساس الأرض والأرض يبني أماناً دائماً. احتضنا المرونة للحفاظ على ديناميكية العلاقة.'
    }
  };
  
  // Get the dominant element pair key
  const getPairKey = (el1: string, el2: string): string => {
    const elements = [el1, el2].sort();
    return `${elements[0]}-${elements[1]}`;
  };
  
  // Add dominant pair reflection first (using Daily Interaction letter-counting, not Mod-4)
  const pairKey = getPairKey(dailyInteraction.person1Dominant, dailyInteraction.person2Dominant);
  const pairReflection = dominantPairReflections[pairKey];
  if (pairReflection) {
    recommendations.unshift(pairReflection.en);
    recommendationsFrench.unshift(pairReflection.fr);
    recommendationsArabic.unshift(pairReflection.ar);
  }
  
  // Spiritual-Destiny recommendations
  if (spiritualDestiny.score >= 85) {
    recommendations.push('Your spiritual alignment is exceptional. Continue deepening your shared understanding through meditation or reflection together.');
    recommendationsFrench.push('Votre alignement spirituel est exceptionnel. Continuez à approfondir votre compréhension mutuelle par la méditation ou la réflexion ensemble.');
    recommendationsArabic.push('توافقكما الروحاني استثنائي. استمرا في تعميق فهمكما المشترك من خلال التأمل أو التفكير معاً.');
  } else if (spiritualDestiny.score < 60) {
    recommendations.push('Your spiritual paths may differ. Respect each other\'s journey and find common ground in shared values.');
    recommendationsFrench.push('Vos chemins spirituels peuvent différer. Respectez le parcours de chacun et trouvez un terrain d\'entente dans les valeurs partagées.');
    recommendationsArabic.push('مساراتكما الروحانية قد تختلف. احترما رحلة كل منكما وابحثا عن أرضية مشتركة في القيم المشتركة.');
  }
  
  // Elemental-Temperament recommendations
  if (elementalTemperament.sharedElement === 'fire' || elementalTemperament.sharedElement === 'air') {
    recommendations.push(`Your ${elementalTemperament.sharedElement} energy creates dynamic interaction. Channel this into creative projects or shared adventures.`);
    recommendationsFrench.push(`Votre énergie ${elementNamesFr[elementalTemperament.sharedElement]} crée une interaction dynamique. Canalisez cela vers des projets créatifs ou des aventures partagées.`);
    recommendationsArabic.push(`طاقة ${elementalTemperament.sharedElementArabic} تخلق تفاعلاً ديناميكياً. وجها هذا نحو مشاريع إبداعية أو مغامرات مشتركة.`);
  } else {
    recommendations.push(`Your ${elementalTemperament.sharedElement} connection provides stability. Build a strong foundation through consistent routines.`);
    recommendationsFrench.push(`Votre connexion ${elementNamesFr[elementalTemperament.sharedElement]} offre de la stabilité. Construisez une base solide grâce à des routines cohérentes.`);
    recommendationsArabic.push(`اتصال ${elementalTemperament.sharedElementArabic} يوفر الاستقرار. ابنيا أساساً قوياً من خلال روتين ثابت.`);
  }
  
  // Planetary-Cosmic recommendations
  if (planetaryCosmic.relationship === 'friendly') {
    recommendations.push(`${planetaryCosmic.person1Planet.name} and ${planetaryCosmic.person2Planet.name} support each other naturally. Trust your intuitive connection.`);
    recommendationsFrench.push(`${planetaryCosmic.person1Planet.name} et ${planetaryCosmic.person2Planet.name} se soutiennent naturellement. Faites confiance à votre connexion intuitive.`);
    recommendationsArabic.push(`${planetaryCosmic.person1Planet.nameArabic} و ${planetaryCosmic.person2Planet.nameArabic} يدعمان بعضهما بشكل طبيعي. ثقا في اتصالكما الحدسي.`);
  } else if (planetaryCosmic.relationship === 'opposing') {
    recommendations.push(`${planetaryCosmic.person1Planet.name} and ${planetaryCosmic.person2Planet.name} create tension. Use this as an opportunity to learn from different perspectives.`);
    recommendationsFrench.push(`${planetaryCosmic.person1Planet.name} et ${planetaryCosmic.person2Planet.name} créent une tension. Utilisez cela comme une opportunité d'apprendre de perspectives différentes.`);
    recommendationsArabic.push(`${planetaryCosmic.person1Planet.nameArabic} و ${planetaryCosmic.person2Planet.nameArabic} يخلقان توتراً. استخدما هذا كفرصة للتعلم من وجهات نظر مختلفة.`);
  }
  
  // Daily Interaction recommendations based on elemental blend
  if (dailyInteraction.interactionType === 'harmonious') {
    recommendations.push(`Your ${dailyInteraction.person1Dominant} energy harmonizes beautifully in daily life. Celebrate your natural understanding.`);
    recommendationsFrench.push(`Votre énergie ${dailyInteraction.person1DominantFrench} s'harmonise magnifiquement au quotidien. Célébrez votre compréhension naturelle.`);
    recommendationsArabic.push(`طاقة ${dailyInteraction.person1DominantArabic} تتناغم بشكل جميل في الحياة اليومية. احتفلا بفهمكما الطبيعي.`);
  } else if (dailyInteraction.interactionType === 'challenging') {
    recommendations.push(`${dailyInteraction.person1Dominant} and ${dailyInteraction.person2Dominant} energies require conscious balance in daily routines. Create space for both styles.`);
    recommendationsFrench.push(`Les énergies ${dailyInteraction.person1DominantFrench} et ${dailyInteraction.person2DominantFrench} nécessitent un équilibre conscient dans les routines quotidiennes. Créez de l'espace pour les deux styles.`);
    recommendationsArabic.push(`طاقات ${dailyInteraction.person1DominantArabic} و ${dailyInteraction.person2DominantArabic} تتطلب توازناً واعياً في الروتين اليومي. أنشئا مساحة لكلا الأسلوبين.`);
  }
  
  // Universal recommendation
  recommendations.push('Practice patience, kindness, and open communication to nurture your connection.');
  recommendationsFrench.push('Pratiquez la patience, la gentillesse et la communication ouverte pour nourrir votre connexion.');
  recommendationsArabic.push('مارسا الصبر واللطف والتواصل المفتوح لرعاية علاقتكما.');
  
  return {
    mode: 'relationship',
    person1: {
      name: person1Name,
      arabicName: person1Arabic,
      abjadTotal: person1AbjadTotal,
      element: person1Element
    },
    person2: {
      name: person2Name,
      arabicName: person2Arabic,
      abjadTotal: person2AbjadTotal,
      element: person2Element
    },
    methods: {
      spiritualDestiny,
      elementalTemperament,
      planetaryCosmic,
      dailyInteraction
    },
    overallScore,
    overallQuality,
    overallQualityArabic,
    overallQualityFrench,
    summary: summary.en,
    summaryFrench: summary.fr,
    summaryArabic: summary.ar,
    recommendations,
    recommendationsFrench,
    recommendationsArabic
  };
}

// ============================================================================
// HELPER: Determine Element from Abjad Total
// ============================================================================

export function getElementFromAbjadTotal(abjadTotal: number): 'fire' | 'water' | 'air' | 'earth' {
  // Use Hadath (mod 4) to determine element - MAGHRIBI SYSTEM
  // CRITICAL: Use modIndex to handle remainder 0 → 4 case
  // 1 = Fire, 2 = Earth, 3 = Air, 4 = Water
  const hadathIndex = modIndex(abjadTotal, 4);
  
  // 1-indexed map (1-4, NEVER 0)
  const elementMap: Record<number, 'fire' | 'water' | 'air' | 'earth'> = {
    1: 'fire',   // نار (Fire)
    2: 'earth',  // تراب (Earth)
    3: 'air',    // هواء (Air)
    4: 'water'   // ماء (Water)
  };
  
  return elementMap[hadathIndex];
}

// ============================================================================
// HELPER: Letter-to-Element Distribution (Classical Method)
// ============================================================================

// MAGHRIBI SYSTEM - Authentic West/North African tradition (7 letters per element)
const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  // 🔥 Fire (Nār/نار) - Hot & Dry - 7 letters
  'ا': 'fire', 'ه': 'fire', 'ط': 'fire', 'م': 'fire', 'ف': 'fire', 'ش': 'fire', 'ذ': 'fire',
  // 💨 Air (Hawā'/هواء) - Hot & Moist - 7 letters
  'ب': 'air', 'و': 'air', 'ي': 'air', 'ن': 'air', 'ض': 'air', 'ظ': 'air', 'غ': 'air',
  // 💧 Water (Mā'/ماء) - Cold & Moist - 7 letters
  'ج': 'water', 'ز': 'water', 'ك': 'water', 'س': 'water', 'ق': 'water', 'ث': 'water', 'خ': 'water',
  // 🌍 Earth (Turāb/تراب) - Cold & Dry - 7 letters
  'د': 'earth', 'ح': 'earth', 'ل': 'earth', 'ع': 'earth', 'ر': 'earth', 'ص': 'earth', 'ت': 'earth',
  // Special forms
  'ة': 'earth' // Tā' marbūṭa (feminine ending) = same as ت
};

export interface ElementDistribution {
  fire: number;
  air: number;
  water: number;
  earth: number;
}

/**
 * Calculate elemental distribution by counting letters
 * Returns percentage of each element in the name
 */
export function calculateLetterElementDistribution(arabicText: string): ElementDistribution {
  const normalized = arabicText.replace(/[ًٌٍَُِّْ\s]/g, '');
  const letters = [...normalized];
  const total = letters.length;
  
  const counts = { fire: 0, air: 0, water: 0, earth: 0 };
  
  letters.forEach(letter => {
    const element = LETTER_ELEMENTS[letter];
    if (element) {
      counts[element]++;
    }
  });
  
  return {
    fire: total > 0 ? Math.round((counts.fire / total) * 100) : 0,
    air: total > 0 ? Math.round((counts.air / total) * 100) : 0,
    water: total > 0 ? Math.round((counts.water / total) * 100) : 0,
    earth: total > 0 ? Math.round((counts.earth / total) * 100) : 0
  };
}

/**
 * Get dominant element from distribution
 */
export function getDominantElement(dist: ElementDistribution): 'fire' | 'air' | 'water' | 'earth' {
  const elements = ['fire', 'air', 'water', 'earth'] as const;
  let maxElement: 'fire' | 'air' | 'water' | 'earth' = 'fire';
  let maxValue = 0;
  
  elements.forEach(element => {
    if (dist[element] > maxValue) {
      maxValue = dist[element];
      maxElement = element;
    }
  });
  
  return maxElement;
}

/**
 * Analyze day-to-day compatibility based on letter-counting
 * Classical method for determining interaction dynamics
 */
export interface DailyInteractionResult {
  method: 'daily-interaction';
  methodArabic: 'التفاعل اليومي';
  person1Distribution: ElementDistribution;
  person2Distribution: ElementDistribution;
  person1Dominant: 'fire' | 'air' | 'water' | 'earth';
  person2Dominant: 'fire' | 'air' | 'water' | 'earth';
  person1DominantArabic: string;
  person2DominantArabic: string;
  person1DominantFrench: string;
  person2DominantFrench: string;
  interactionType: 'harmonious' | 'complementary' | 'challenging' | 'neutral';
  interactionTypeArabic: string;
  interactionTypeFrench: string;
  score: number;
  quality: 'excellent' | 'good' | 'moderate' | 'challenging';
  qualityArabic: string;
  qualityFrench: string;
  description: string;
  descriptionFrench: string;
  descriptionArabic: string;
  color: string;
}

export function analyzeDailyInteraction(
  person1Arabic: string,
  person2Arabic: string
): DailyInteractionResult {
  
  const dist1 = calculateLetterElementDistribution(person1Arabic);
  const dist2 = calculateLetterElementDistribution(person2Arabic);
  
  const dom1 = getDominantElement(dist1);
  const dom2 = getDominantElement(dist2);
  
  // Element names in different languages
  const elementNames = {
    fire: { ar: 'نار', fr: 'Feu' },
    air: { ar: 'هواء', fr: 'Air' },
    water: { ar: 'ماء', fr: 'Eau' },
    earth: { ar: 'تراب', fr: 'Terre' }
  };
  
  // Determine interaction type and score
  let interactionType: DailyInteractionResult['interactionType'];
  let interactionTypeArabic: string;
  let interactionTypeFrench: string;
  let score: number;
  let quality: DailyInteractionResult['quality'];
  let qualityArabic: string;
  let qualityFrench: string;
  
  // Same element = Harmonious
  if (dom1 === dom2) {
    interactionType = 'harmonious';
    interactionTypeArabic = 'متناغم';
    interactionTypeFrench = 'Harmonieux';
    score = 85;
    quality = 'excellent';
    qualityArabic = 'ممتاز';
    qualityFrench = 'Excellent';
  }
  // Complementary pairs
  else if (
    (dom1 === 'fire' && dom2 === 'air') || (dom1 === 'air' && dom2 === 'fire') ||
    (dom1 === 'earth' && dom2 === 'water') || (dom1 === 'water' && dom2 === 'earth')
  ) {
    interactionType = 'complementary';
    interactionTypeArabic = 'تكميلي';
    interactionTypeFrench = 'Complémentaire';
    score = 75;
    quality = 'good';
    qualityArabic = 'جيد';
    qualityFrench = 'Bon';
  }
  // Challenging pairs (opposing)
  else if (
    (dom1 === 'fire' && dom2 === 'water') || (dom1 === 'water' && dom2 === 'fire') ||
    (dom1 === 'air' && dom2 === 'earth') || (dom1 === 'earth' && dom2 === 'air')
  ) {
    interactionType = 'challenging';
    interactionTypeArabic = 'صعب';
    interactionTypeFrench = 'Difficile';
    score = 50;
    quality = 'challenging';
    qualityArabic = 'تحدي';
    qualityFrench = 'Difficile';
  }
  // Neutral
  else {
    interactionType = 'neutral';
    interactionTypeArabic = 'محايد';
    interactionTypeFrench = 'Neutre';
    score = 65;
    quality = 'moderate';
    qualityArabic = 'متوسط';
    qualityFrench = 'Modéré';
  }
  
  // Generate descriptions based on combination
  const descriptions: Record<string, { en: string; fr: string; ar: string }> = {
    'fire-fire': {
      en: 'Both partners share Fire energy. Expect passion, enthusiasm, and dynamic action in daily life. May need to manage intensity.',
      fr: 'Les deux partenaires partagent l\'énergie du Feu. Attendez-vous à la passion, l\'enthousiasme et l\'action dynamique au quotidien. Peut nécessiter de gérer l\'intensité.',
      ar: 'كلا الشريكين يشتركان في طاقة النار. توقع الشغف والحماس والعمل الديناميكي في الحياة اليومية. قد يحتاج لإدارة الحدة.'
    },
    'air-air': {
      en: 'Both partners share Air energy. Daily interactions focus on communication, ideas, and mental stimulation. Keep conversations grounded.',
      fr: 'Les deux partenaires partagent l\'énergie de l\'Air. Les interactions quotidiennes se concentrent sur la communication, les idées et la stimulation mentale. Gardez les conversations ancrées.',
      ar: 'كلا الشريكين يشتركان في طاقة الهواء. التفاعلات اليومية تركز على التواصل والأفكار والتحفيز الذهني. حافظ على المحادثات متجذرة.'
    },
    'water-water': {
      en: 'Both partners share Water energy. Emotional depth and intuition guide daily life. Create healthy boundaries to avoid emotional overwhelm.',
      fr: 'Les deux partenaires partagent l\'énergie de l\'Eau. La profondeur émotionnelle et l\'intuition guident la vie quotidienne. Créez des limites saines pour éviter la surcharge émotionnelle.',
      ar: 'كلا الشريكين يشتركان في طاقة الماء. العمق العاطفي والحدس يوجهان الحياة اليومية. أنشئ حدوداً صحية لتجنب الطغيان العاطفي.'
    },
    'earth-earth': {
      en: 'Both partners share Earth energy. Daily life is practical, stable, and grounded. Remember to embrace spontaneity and change.',
      fr: 'Les deux partenaires partagent l\'énergie de la Terre. La vie quotidienne est pratique, stable et ancrée. N\'oubliez pas d\'embrasser la spontanéité et le changement.',
      ar: 'كلا الشريكين يشتركان في طاقة الأرض. الحياة اليومية عملية ومستقرة ومتجذرة. تذكر احتضان العفوية والتغيير.'
    },
    'fire-air': {
      en: 'Fire and Air energies fuel each other. Daily interactions are stimulating, creative, and full of movement. Channel this energy constructively.',
      fr: 'Les énergies du Feu et de l\'Air s\'alimentent mutuellement. Les interactions quotidiennes sont stimulantes, créatives et pleines de mouvement. Canalisez cette énergie de manière constructive.',
      ar: 'طاقات النار والهواء تغذي بعضها. التفاعلات اليومية محفزة وإبداعية ومليئة بالحركة. وجه هذه الطاقة بشكل بناء.'
    },
    'earth-water': {
      en: 'Earth and Water blend for growth and nurturing. Daily life balances practicality with emotional care. A naturally supportive combination.',
      fr: 'La Terre et l\'Eau se mélangent pour la croissance et le soin. La vie quotidienne équilibre praticité et attention émotionnelle. Une combinaison naturellement soutenante.',
      ar: 'الأرض والماء يمتزجان للنمو والرعاية. الحياة اليومية توازن بين العملية والرعاية العاطفية. مزيج داعم بشكل طبيعي.'
    },
    'fire-water': {
      en: 'Fire and Water create steam and tension. Daily interactions may alternate between passion and cooling. Requires patience and understanding.',
      fr: 'Le Feu et l\'Eau créent vapeur et tension. Les interactions quotidiennes peuvent alterner entre passion et refroidissement. Nécessite patience et compréhension.',
      ar: 'النار والماء يخلقان بخاراً وتوتراً. التفاعلات اليومية قد تتناوب بين الشغف والتبريد. تتطلب الصبر والفهم.'
    },
    'air-earth': {
      en: 'Air and Earth represent ideas meeting practicality. Daily life requires balancing vision with execution. Communication is key.',
      fr: 'L\'Air et la Terre représentent les idées rencontrant la praticité. La vie quotidienne nécessite d\'équilibrer vision et exécution. La communication est essentielle.',
      ar: 'الهواء والأرض يمثلان الأفكار تلتقي بالواقعية. الحياة اليومية تتطلب موازنة الرؤية مع التنفيذ. التواصل هو المفتاح.'
    },
    'fire-earth': {
      en: 'Fire and Earth combine action with stability. Daily interactions balance passion with practicality. Respect each other\'s pace.',
      fr: 'Le Feu et la Terre combinent action et stabilité. Les interactions quotidiennes équilibrent passion et praticité. Respectez le rythme de chacun.',
      ar: 'النار والأرض تجمع العمل مع الاستقرار. التفاعلات اليومية توازن الشغف مع الواقعية. احترم وتيرة كل منكما.'
    },
    'air-water': {
      en: 'Air and Water blend logic with emotion. Daily life requires honoring both intellect and feelings. Find balance between thinking and feeling.',
      fr: 'L\'Air et l\'Eau mélangent logique et émotion. La vie quotidienne nécessite d\'honorer à la fois l\'intellect et les sentiments. Trouvez l\'équilibre entre penser et ressentir.',
      ar: 'الهواء والماء يمزجان المنطق مع العاطفة. الحياة اليومية تتطلب تكريم العقل والمشاعر. اعثر على التوازن بين التفكير والشعور.'
    }
  };
  
  const pairKey = [dom1, dom2].sort().join('-');
  const desc = descriptions[pairKey] || descriptions[`${dom1}-${dom2}`] || {
    en: `${dom1.charAt(0).toUpperCase() + dom1.slice(1)} and ${dom2.charAt(0).toUpperCase() + dom2.slice(1)} interaction. This unique combination brings together different elemental energies in daily life.`,
    fr: `Interaction ${elementNames[dom1].fr} et ${elementNames[dom2].fr}. Cette combinaison unique rassemble différentes énergies élémentaires dans la vie quotidienne.`,
    ar: `تفاعل ${elementNames[dom1].ar} و ${elementNames[dom2].ar}. هذا المزيج الفريد يجمع طاقات عنصرية مختلفة في الحياة اليومية.`
  };
  
  const colors = {
    excellent: 'green',
    good: 'blue',
    moderate: 'yellow',
    challenging: 'orange'
  };
  
  return {
    method: 'daily-interaction',
    methodArabic: 'التفاعل اليومي',
    person1Distribution: dist1,
    person2Distribution: dist2,
    person1Dominant: dom1,
    person2Dominant: dom2,
    person1DominantArabic: elementNames[dom1].ar,
    person2DominantArabic: elementNames[dom2].ar,
    person1DominantFrench: elementNames[dom1].fr,
    person2DominantFrench: elementNames[dom2].fr,
    interactionType,
    interactionTypeArabic,
    interactionTypeFrench,
    score,
    quality,
    qualityArabic,
    qualityFrench,
    description: desc.en,
    descriptionFrench: desc.fr,
    descriptionArabic: desc.ar,
    color: colors[quality]
  };
}