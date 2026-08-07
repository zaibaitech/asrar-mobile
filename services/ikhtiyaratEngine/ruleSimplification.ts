/**
 * Plain-language translations of every rule's technical detail text, for
 * users with no astrology background. Consumed only by RuleRow.tsx when
 * the Simple/Detailed toggle is set to Simple — the technical
 * detail_en/detail_fr/detail_ar strings in each elections/*.ts config are
 * untouched and remain the default ("Detailed") view.
 *
 * Ported from asrar.app's src/lib/ikhtiyarat/ruleSimplification.ts,
 * currently only covering marriage/travel (the source also has entries
 * for business/medical/home/education — not yet ported here, tracked as
 * a follow-up). `ar` on every entry is a NEW field — DRAFT translations,
 * needs native/scholarly review before shipping (the source only ships
 * en/fr for this file).
 *
 * Deliberately keyed by rule id + status rather than re-parsing the
 * dynamic numeric detail text (degrees, signs, orbs) — most rules only
 * have 2-4 meaningfully distinct outcomes, and a beginner doesn't need
 * "orb 6.4°," they need "the Moon and Saturn are in a tense position
 * right now." If a rule's id has no entry here (e.g. every business/
 * medical/home/education rule right now), RuleRow safely falls back to
 * the technical detail text even in Simple mode — this is the designed
 * fallback path, not a bug.
 */

import { RuleResult } from './types';
import { UiLang } from './copy';

export type SimplifiedTone = 'good' | 'caution' | 'neutral';

interface SimplifiedEntry {
  points?: number;
  tone: SimplifiedTone;
  en: string;
  fr: string;
  ar: string;
}

/** Keyed by rule id -> list of possible outcomes, matched by exact points value first, then by status-based fallback. */
const SIMPLIFICATIONS: Record<string, SimplifiedEntry[]> = {
  // ===== MARRIAGE =====
  'dark-moon': [
    { tone: 'caution', points: 0, en: 'The Moon is in its darkest phase right before a new moon — traditionally a time to wait, not begin.', fr: 'La Lune est dans sa phase la plus sombre juste avant une nouvelle lune — traditionnellement un moment pour attendre, pas pour commencer.', ar: 'القمر في أشد مراحله ظلاماً قبيل القمر الجديد — تقليدياً وقت للانتظار، لا للبدء.' },
  ],
  'moon-combust': [
    { tone: 'caution', points: 0, en: 'The Moon is too close to the Sun right now and appears "hidden" — this weakens its influence.', fr: 'La Lune est actuellement trop proche du Soleil et semble "cachée" — cela affaiblit son influence.', ar: 'القمر قريب جداً من الشمس الآن ويبدو "مخفياً" — هذا يضعف تأثيره.' },
  ],
  'moon-void-of-course': [
    { tone: 'caution', points: 0, en: 'The Moon isn\'t forming any meaningful connection with another planet right now — traditionally, things begun in this state tend to fizzle out.', fr: "La Lune ne forme actuellement aucune connexion significative avec une autre planète — traditionnellement, ce qui commence dans cet état a tendance à ne pas aboutir.", ar: 'لا يشكّل القمر أي ارتباط ذي معنى مع كوكب آخر الآن — تقليدياً، ما يبدأ في هذه الحالة يميل إلى عدم الاكتمال.' },
  ],
  'moon-malefic-hard-aspect': [
    { tone: 'caution', points: 0, en: 'The Moon is in a tense position with Saturn or Mars right now — a traditional warning sign for this kind of start.', fr: "La Lune est actuellement dans une position tendue avec Saturne ou Mars — un signe d'avertissement traditionnel pour ce type de commencement.", ar: 'القمر في وضع متوتر مع زحل أو المريخ الآن — علامة تحذير تقليدية لهذا النوع من البدايات.' },
  ],
  'eclipse-proximity': [
    { tone: 'caution', points: 0, en: 'A solar or lunar eclipse is happening within a day of this date — traditionally treated as an unsettled period to avoid for major beginnings.', fr: "Une éclipse solaire ou lunaire a lieu à moins d'un jour de cette date — traditionnellement considérée comme une période instable à éviter pour les grands commencements.", ar: 'يقع كسوف شمسي أو خسوف قمري خلال يوم من هذا التاريخ — تُعامل تقليدياً كفترة غير مستقرة يُجتنب فيها البدء بأمور مهمة.' },
  ],
  'under-the-beams': [
    { tone: 'caution', points: -15, en: 'The Moon is close enough to the Sun to be dimmed, though not fully hidden — a mild weakening.', fr: "La Lune est suffisamment proche du Soleil pour être atténuée, sans être totalement cachée — un affaiblissement léger.", ar: 'القمر قريب بما يكفي من الشمس ليخفت، دون أن يختفي تماماً — ضعف خفيف.' },
  ],
  'moon-waning': [
    { tone: 'caution', points: -20, en: 'The Moon is shrinking in light right now (waning) — traditionally less favorable for starting something new.', fr: "La Lune décroît actuellement en lumière — traditionnellement moins favorable pour commencer quelque chose de nouveau.", ar: 'يتناقص ضوء القمر الآن — تقليدياً أقل مواتاة لبدء أمر جديد.' },
  ],
  'via-combusta': [
    { tone: 'caution', points: -15, en: 'The Moon is passing through a stretch of the zodiac traditionally considered turbulent (the "burning path").', fr: 'La Lune traverse actuellement une portion du zodiaque traditionnellement considérée comme turbulente (la « voie brûlante »).', ar: 'يمر القمر بمنطقة من دائرة البروج تُعتبر تقليدياً مضطربة ("الطريقة المحترقة").' },
  ],
  'moon-fall-detriment': [
    { tone: 'caution', points: -10, en: "The Moon is in a sign where it traditionally expresses its qualities less comfortably.", fr: "La Lune se trouve dans un signe où elle exprime traditionnellement ses qualités avec moins d'aisance.", ar: 'القمر في برج يُعبّر فيه تقليدياً عن صفاته بأقل ارتياح.' },
  ],
  'venus-combust': [
    { tone: 'caution', points: -10, en: 'Venus — the planet of love and harmony — is too close to the Sun right now and appears "hidden," weakening its supportive influence.', fr: "Vénus — la planète de l'amour et de l'harmonie — est actuellement trop proche du Soleil et semble « cachée », ce qui affaiblit son influence bienveillante.", ar: 'الزهرة — كوكب الحب والانسجام — قريبة جداً من الشمس الآن وتبدو "مخفية"، ما يضعف تأثيرها الداعم.' },
  ],
  'venus-retrograde': [
    { tone: 'caution', points: -15, en: 'Venus appears to be moving backward right now — traditionally a caution for matters of love and relationships.', fr: "Vénus semble actuellement se déplacer à rebours — traditionnellement une prudence pour les affaires de cœur et les relations.", ar: 'تبدو الزهرة وكأنها تتحرك للخلف الآن — تحذير تقليدي في أمور الحب والعلاقات.' },
  ],
  'venus-fall-detriment': [
    { tone: 'caution', points: -8, en: 'Venus is in a sign where it traditionally expresses its qualities less comfortably.', fr: "Vénus se trouve dans un signe où elle exprime traditionnellement ses qualités avec moins d'aisance.", ar: 'الزهرة في برج تُعبّر فيه تقليدياً عن صفاتها بأقل ارتياح.' },
  ],
  'mercury-retrograde': [
    { tone: 'caution', points: -5, en: 'Mercury appears to be moving backward right now — a mild caution specifically for the paperwork/contract side of things.', fr: "Mercure semble actuellement se déplacer à rebours — une prudence légère spécifiquement pour la partie contrat/formalités.", ar: 'يبدو عطارد وكأنه يتحرك للخلف الآن — تحذير خفيف يخص الجانب الورقي/التعاقدي تحديداً.' },
  ],
  'moon-separating-benefics': [
    { tone: 'neutral', points: -5, en: "The Moon isn't currently connecting with either of the two traditionally supportive planets (Venus or Jupiter).", fr: "La Lune ne se connecte actuellement à aucune des deux planètes traditionnellement bienveillantes (Vénus ou Jupiter).", ar: 'لا يرتبط القمر حالياً بأي من الكوكبين السعيدين تقليدياً (الزهرة أو المشتري).' },
  ],
  'moon-waxing-clear': [
    { tone: 'good', points: 20, en: 'The Moon is growing in light and clear of the Sun\'s glare right now — one of the most favorable classical signs for a fresh start.', fr: "La Lune croît actuellement en lumière et est dégagée de l'éclat du Soleil — l'un des signes classiques les plus favorables pour un nouveau départ.", ar: 'ينمو ضوء القمر الآن وهو خارج توهج الشمس — من أكثر العلامات الكلاسيكية مواتاة لبداية جديدة.' },
  ],
  'moon-dignity': [
    { tone: 'good', points: 12, en: 'The Moon is in a sign it traditionally feels very at home in.', fr: 'La Lune se trouve dans un signe où elle se sent traditionnellement très à son aise.', ar: 'القمر في برج يشعر فيه تقليدياً بارتياح كبير.' },
    { tone: 'good', points: 15, en: 'The Moon is in the sign of its greatest traditional strength.', fr: 'La Lune se trouve dans le signe de sa plus grande force traditionnelle.', ar: 'القمر في برج أعظم قوته التقليدية.' },
    { tone: 'good', points: 8, en: 'The Moon is in a sign that gives it a mild traditional boost here.', fr: 'La Lune se trouve dans un signe qui lui donne ici un léger avantage traditionnel.', ar: 'القمر في برج يمنحه دعماً تقليدياً خفيفاً هنا.' },
  ],
  'moon-applying-benefic': [
    { tone: 'good', points: 12, en: 'The Moon is forming a supportive connection with Venus, the planet of love and harmony, right now.', fr: "La Lune forme actuellement une connexion favorable avec Vénus, la planète de l'amour et de l'harmonie.", ar: 'يشكّل القمر ارتباطاً داعماً مع الزهرة، كوكب الحب والانسجام، الآن.' },
    { tone: 'good', points: 10, en: 'The Moon is forming a supportive connection with Jupiter, the planet of growth and good fortune, right now.', fr: 'La Lune forme actuellement une connexion favorable avec Jupiter, la planète de la croissance et de la bonne fortune.', ar: 'يشكّل القمر ارتباطاً داعماً مع المشتري، كوكب النمو والحظ الطيب، الآن.' },
  ],
  'venus-dignified': [
    { tone: 'good', points: 8, en: 'Venus is in a sign it traditionally feels very at home in.', fr: 'Vénus se trouve dans un signe où elle se sent traditionnellement très à son aise.', ar: 'الزهرة في برج تشعر فيه تقليدياً بارتياح كبير.' },
    { tone: 'good', points: 10, en: 'Venus is in the sign of its greatest traditional strength.', fr: 'Vénus se trouve dans le signe de sa plus grande force traditionnelle.', ar: 'الزهرة في برج أعظم قوتها التقليدية.' },
  ],
  'day-of-week': [
    { tone: 'good', points: 10, en: 'This falls on Friday — the day most recommended in Islamic tradition for this occasion.', fr: 'Ceci tombe un vendredi — le jour le plus recommandé dans la tradition islamique pour cette occasion.', ar: 'هذا يوافق الجمعة — أكثر الأيام استحباباً في التقليد الإسلامي لهذه المناسبة.' },
    { tone: 'good', points: 8, en: 'This falls on Thursday, a day traditionally seen as favorable.', fr: 'Ceci tombe un jeudi, un jour traditionnellement considéré comme favorable.', ar: 'هذا يوافق الخميس، يوم يُعتبر تقليدياً مواتياً.' },
    { tone: 'good', points: 6, en: 'This falls on Monday, a day traditionally seen as mildly favorable.', fr: 'Ceci tombe un lundi, un jour traditionnellement considéré comme légèrement favorable.', ar: 'هذا يوافق الاثنين، يوم يُعتبر تقليدياً مواتياً بشكل خفيف.' },
  ],
  'planetary-hour': [
    { tone: 'good', points: 6, en: 'This specific time window aligns with a planetary hour traditionally seen as supportive.', fr: 'Ce créneau horaire précis coïncide avec une heure planétaire traditionnellement considérée comme favorable.', ar: 'تتوافق هذه الفترة الزمنية مع ساعة فلكية تُعتبر تقليدياً داعمة.' },
  ],
  'lunar-mansion': [
    { tone: 'good', points: 6, en: 'The Moon is passing through a lunar "station" traditionally considered favorable for this occasion.', fr: 'La Lune traverse actuellement une « station » lunaire traditionnellement considérée comme favorable pour cette occasion.', ar: 'يمر القمر بـ"منزلة" قمرية تُعتبر تقليدياً موافقة لهذه المناسبة.' },
    { tone: 'caution', points: -6, en: 'The Moon is passing through a lunar "station" traditionally considered less favorable for this occasion.', fr: 'La Lune traverse actuellement une « station » lunaire traditionnellement considérée comme moins favorable pour cette occasion.', ar: 'يمر القمر بـ"منزلة" قمرية تُعتبر تقليدياً أقل موافقة لهذه المناسبة.' },
  ],

  // ===== TRAVEL =====
  'travel-moon-void-of-course': [
    { tone: 'caution', points: 0, en: "The Moon isn't forming any meaningful connection right now — traditionally, a journey begun in this state tends to come to nothing.", fr: "La Lune ne forme actuellement aucune connexion significative — traditionnellement, un voyage commencé dans cet état tend à n'aboutir à rien.", ar: 'لا يشكّل القمر أي ارتباط ذي معنى الآن — تقليدياً، السفر الذي يبدأ في هذه الحالة يميل إلى عدم النجاح.' },
  ],
  'travel-moon-malefic-hard-aspect': [
    { tone: 'caution', points: 0, en: 'The Moon is in a tense position with Saturn or Mars right now — a traditional warning of danger or delay en route.', fr: "La Lune est actuellement dans une position tendue avec Saturne ou Mars — un avertissement traditionnel de danger ou de retard en chemin.", ar: 'القمر في وضع متوتر مع زحل أو المريخ الآن — تحذير تقليدي من خطر أو تأخير في الطريق.' },
  ],
  'travel-moon-combust': [
    { tone: 'caution', points: 0, en: 'The Moon is too close to the Sun right now and appears "hidden" — this weakens the traveler\'s own influence in the chart.', fr: 'La Lune est actuellement trop proche du Soleil et semble « cachée » — cela affaiblit l\'influence du voyageur lui-même dans le ciel.', ar: 'القمر قريب جداً من الشمس الآن ويبدو "مخفياً" — هذا يضعف تأثير المسافر نفسه.' },
  ],
  'travel-moon-modality': [
    { tone: 'good', points: 12, en: 'The Moon is in a sign associated with quick movement — traditionally favorable for setting out.', fr: 'La Lune se trouve dans un signe associé au mouvement rapide — traditionnellement favorable pour partir.', ar: 'القمر في برج مرتبط بالحركة السريعة — تقليدياً مواتٍ للانطلاق.' },
    { tone: 'caution', points: -8, en: 'The Moon is in a sign associated with staying put — traditionally a caution for travel, suggesting possible delay.', fr: 'La Lune se trouve dans un signe associé à l\'immobilité — traditionnellement une prudence pour le voyage, suggérant un retard possible.', ar: 'القمر في برج مرتبط بالثبات — تحذير تقليدي للسفر، يشير إلى تأخير محتمل.' },
  ],
  'travel-mercury-retrograde': [
    { tone: 'caution', points: -8, en: 'Mercury appears to be moving backward right now — traditionally linked to itinerary changes, lost documents, or mix-ups.', fr: "Mercure semble actuellement se déplacer à rebours — traditionnellement associé à des changements d'itinéraire, des documents perdus, ou des malentendus.", ar: 'يبدو عطارد وكأنه يتحرك للخلف الآن — مرتبط تقليدياً بتغييرات في المسار أو ضياع وثائق أو سوء تفاهم.' },
  ],
  'travel-moon-waxing': [
    { tone: 'good', points: 8, en: 'The Moon is growing in light right now — traditionally favorable for setting out and making progress.', fr: 'La Lune croît actuellement en lumière — traditionnellement favorable pour partir et progresser.', ar: 'ينمو ضوء القمر الآن — تقليدياً مواتٍ للانطلاق والتقدم.' },
  ],
  'travel-moon-applying-to-benefic': [
    { tone: 'good', points: 10, en: 'The Moon is forming a supportive connection with Venus or Jupiter right now — a sign of a smooth, well-supported journey.', fr: 'La Lune forme actuellement une connexion favorable avec Vénus ou Jupiter — un signe de voyage fluide et bien soutenu.', ar: 'يشكّل القمر ارتباطاً داعماً مع الزهرة أو المشتري الآن — علامة سفر سلس ومدعوم.' },
  ],
  'travel-planetary-hour': [
    { tone: 'good', points: 6, en: 'This specific time window aligns with a planetary hour traditionally seen as supportive for travel.', fr: 'Ce créneau horaire précis coïncide avec une heure planétaire traditionnellement considérée comme favorable au voyage.', ar: 'تتوافق هذه الفترة الزمنية مع ساعة فلكية تُعتبر تقليدياً داعمة للسفر.' },
  ],
  'travel-sunnah-bukur': [
    { tone: 'good', points: 8, en: 'This is an early-morning departure — the Prophet ﷺ asked Allah to bless the early mornings of his ummah.', fr: 'Ceci est un départ matinal — le Prophète ﷺ a demandé à Allah de bénir les matins de son ummah.', ar: 'هذا انطلاق مبكر — دعا النبي ﷺ الله أن يبارك في بكور أمته.' },
  ],
  'travel-lunar-mansion': [
    { tone: 'good', points: 6, en: 'The Moon is passing through a lunar "station" traditionally considered favorable for travel.', fr: 'La Lune traverse actuellement une « station » lunaire traditionnellement considérée comme favorable au voyage.', ar: 'يمر القمر بـ"منزلة" قمرية تُعتبر تقليدياً موافقة للسفر.' },
    { tone: 'caution', points: -6, en: 'The Moon is passing through a lunar "station" traditionally considered less favorable for travel.', fr: 'La Lune traverse actuellement une « station » lunaire traditionnellement considérée comme moins favorable au voyage.', ar: 'يمر القمر بـ"منزلة" قمرية تُعتبر تقليدياً أقل موافقة للسفر.' },
  ],
  'travel-mercury-dignified': [
    { tone: 'good', points: 4, en: 'Mercury is in a comfortable position right now, supporting clear plans and communication.', fr: 'Mercure se trouve actuellement dans une position confortable, favorable à des plans clairs et à la communication.', ar: 'عطارد في وضع مريح الآن، يدعم وضوح الخطط والتواصل.' },
  ],
  'travel-day-of-week': [
    { tone: 'good', points: 5, en: 'This falls on Wednesday, a day traditionally linked to travel and communication.', fr: 'Ceci tombe un mercredi, un jour traditionnellement lié au voyage et à la communication.', ar: 'هذا يوافق الأربعاء، يوم مرتبط تقليدياً بالسفر والتواصل.' },
  ],
};

/** Generic "pass" fallback per family of rule id prefixes, used when a rule fired neutrally (status 'pass', points 0) and no more specific entry matches on points. */
const GENERIC_PASS_HINT = {
  tone: 'neutral' as SimplifiedTone,
  en: 'No concern here — this factor looks neutral for this date.',
  fr: 'Rien à signaler ici — ce facteur semble neutre pour cette date.',
  ar: 'لا شيء يستدعي القلق هنا — هذا العامل يبدو محايداً لهذا التاريخ.',
};

/**
 * Returns the plain-language explanation for a fired rule, or null if no
 * simplification exists for this id/points combination — callers should
 * fall back to the technical detail_en/detail_fr/detail_ar in that case.
 */
export function getSimplifiedRuleText(
  rule: RuleResult,
  lang: UiLang
): { tone: SimplifiedTone; text: string } | null {
  const entries = SIMPLIFICATIONS[rule.id];
  if (!entries) return null;

  const exact = entries.find(e => e.points === rule.points);
  if (exact) return { tone: exact.tone, text: lang === 'fr' ? exact.fr : lang === 'ar' ? exact.ar : exact.en };

  if (rule.status === 'pass' && rule.points === 0) {
    return {
      tone: GENERIC_PASS_HINT.tone,
      text: lang === 'fr' ? GENERIC_PASS_HINT.fr : lang === 'ar' ? GENERIC_PASS_HINT.ar : GENERIC_PASS_HINT.en,
    };
  }

  return null;
}
