/**
 * Travel (Safar) election rules config.
 * Ported verbatim (ids, points, maxPoints, conditions, EN/FR copy) from
 * asrar.app's src/lib/ikhtiyarat/elections/travel.ts. `detail_ar` on every
 * rule is a NEW field — DRAFT translations, needs native/scholarly review
 * before shipping (the source only ships detail_en/detail_fr).
 *
 * Classical electional-astrology considerations for starting a journey,
 * following the same shape as marriage.ts: Moon condition dominates (it
 * is the universal significator of the matter and of the traveler),
 * Mercury governs travel plans/documents, hard aspects to the malefics
 * (Mars, Saturn) warn of danger or delay en route, and the Moon's sign
 * modality (movable/fixed/mutable) and lunar mansion (a travel-specific
 * table, manazilTravel.ts — NOT the marriage one) add further texture.
 *
 * IMPORTANT DIFFERENCES FROM MARRIAGE (do not "fix" these — they are
 * genuine, deliberate content differences in the source, not omissions):
 *  - Travel's void-of-course hard-fail is a simpler INSTANTANEOUS check
 *    (ctx.applyingAspects.length === 0), NOT marriage's forward-scan
 *    isMoonVoidOfCourse().
 *  - Travel has only 3 hard-fails (no muḥāq, no eclipse-proximity).
 *  - Travel's Saturn/Mars hard-aspect check excludes conjunction (square/
 *    opposition only) and has no explicit orb<=6 filter of its own.
 *  - Different favorable-hour planets: Jupiter/Moon/Mercury (vs.
 *    marriage's Venus/Moon/Jupiter).
 *  - A separate, non-shared lunar mansion table (manazilTravel.ts).
 *  - Different civil hours: 6-22 (vs. marriage's 8-22).
 *
 * Score-neutral Sunnah/fiqh badges for travel timing (bukūr, Thursday,
 * Friday caution) live in travelBadges.ts, not here — they never affect
 * the score.
 */

import { ElectionRulesConfig, Rule, RuleContext, RuleResult, TierInfo } from '../types';
import { ZodiacSign } from '../ephemeris';
import { isInFall, isInDetriment } from '../dignitiesLite';
import { computeMaxAchievable } from '../engine';
import { getMansionNumberFromLongitude } from '../manzilFavorability';
import { getMansionTravelFavorability } from '../manazilTravel';
import { getSeparation } from '../aspects';

// SCHOLAR-REVIEW: modality (movable/fixed/mutable) classification, per
// Sahl ibn Bishr's Kitāb al-Ikhtiyārāt on journeys — movable (cardinal)
// signs favor swift movement and travel; fixed signs incline to delay
// and being detained; mutable signs are neutral for this purpose.
const MOVABLE_SIGNS: ZodiacSign[] = ['aries', 'cancer', 'libra', 'capricorn'];
const FIXED_SIGNS: ZodiacSign[] = ['taurus', 'leo', 'scorpio', 'aquarius'];

/** Civil-hours band for the "early departure" (bukūr) bonus — configurable, not tied to real sunrise. */
const BUKUR_START_HOUR = 5;
const BUKUR_END_HOUR = 10;

function rule(
  id: string,
  label: { en: string; fr: string; ar: string },
  fn: (ctx: RuleContext) => Omit<RuleResult, 'id' | 'label_en' | 'label_fr' | 'label_ar'> | null,
  opts?: { maxPoints?: number; exclusiveGroup?: string },
): Rule {
  return {
    id,
    label,
    maxPoints: opts?.maxPoints,
    exclusiveGroup: opts?.exclusiveGroup,
    evaluate(ctx) {
      const r = fn(ctx);
      if (!r) return null;
      return { id, label_en: label.en, label_fr: label.fr, label_ar: label.ar, ...r };
    },
  };
}

// ============================================================================
// HARD FAILS
// ============================================================================

const moonVoidOfCourse = rule(
  'travel-moon-void-of-course',
  { en: 'Moon Void of Course (Khāliya al-Sayr)', fr: 'Lune vide de course', ar: 'خالية السير' },
  (ctx) => {
    const voc = ctx.applyingAspects.length === 0;
    return {
      status: voc ? 'hardfail' : 'pass',
      points: 0,
      detail_en: voc
        ? 'Moon has no applying aspect before leaving its current sign — void of course, nothing "comes of" a journey begun now.'
        : 'Moon has at least one applying aspect — not void of course.',
      detail_fr: voc
        ? "La Lune n'a aucun aspect en application avant de quitter son signe — vide de course, un voyage commencé maintenant n'aboutira à rien de concret."
        : "La Lune a au moins un aspect en application — pas vide de course.",
      detail_ar: voc
        ? 'لا يطبّق القمر أي جانب قبل مغادرة برجه — خالية السير، لن يُثمر سفر يبدأ الآن.'
        : 'يطبّق القمر جانباً واحداً على الأقل — ليست خالية السير.',
    };
  },
);

const moonMaleficHardAspect = rule(
  'travel-moon-malefic-hard-aspect',
  { en: 'Moon Applying to Saturn/Mars (Hard Aspect)', fr: 'Lune appliquant à Saturne/Mars (aspect dur)', ar: 'تطبيق القمر بزحل أو المريخ' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => (a.planet === 'Saturn' || a.planet === 'Mars') && (a.aspect === 'square' || a.aspect === 'opposition'),
    );
    const aspectAr: Record<string, string> = { square: 'التربيع', opposition: 'التقابل' };
    const planetAr: Record<string, string> = { Saturn: 'زحل', Mars: 'المريخ' };
    return {
      status: hit ? 'hardfail' : 'pass',
      points: 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — traditionally warns of danger, delay, or mishap en route.`
        : 'Moon is not applying to a hard aspect with Saturn or Mars.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'square' ? 'carré' : 'opposition'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — avertit traditionnellement d'un danger, d'un retard ou d'un incident en chemin.`
        : "La Lune n'applique pas d'aspect dur à Saturne ou Mars.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${planetAr[hit.planet] ?? hit.planet}، بعد ${hit.orb.toFixed(1)}° — ينذر تقليدياً بخطر أو تأخير أو مكروه في الطريق.`
        : 'لا يطبّق القمر جانباً قاسياً مع زحل أو المريخ.',
    };
  },
);

const moonCombust = rule(
  'travel-moon-combust',
  { en: 'Moon Combust (Muḥtaraq)', fr: 'Lune combuste (Muḥtaraq)', ar: 'احتراق القمر' },
  (ctx) => {
    const combust = ctx.moonSunSeparation <= 8.5;
    const sep = ctx.moonSunSeparation.toFixed(1);
    return {
      status: combust ? 'hardfail' : 'pass',
      points: 0,
      detail_en: combust
        ? `Moon is ${sep}° from the Sun — combust (muḥtaraq); the traveler's own significator is weakened.`
        : `Moon is ${sep}° from the Sun — not combust.`,
      detail_fr: combust
        ? `La Lune est à ${sep}° du Soleil — combuste (muḥtaraq) ; le significateur du voyageur est affaibli.`
        : `La Lune est à ${sep}° du Soleil — non combuste.`,
      detail_ar: combust
        ? `القمر على بعد ${sep}° من الشمس — محترق؛ ضعف دليل المسافر نفسه.`
        : `القمر على بعد ${sep}° من الشمس — غير محترق.`,
    };
  },
);

// ============================================================================
// PENALTIES / BONUSES
// ============================================================================

const moonModality = rule(
  'travel-moon-modality',
  { en: 'Moon Sign Modality (Movable/Fixed)', fr: 'Modalité du signe lunaire (cardinal/fixe)', ar: 'طبيعة برج القمر (منقلب أو ثابت)' },
  (ctx) => {
    const sign = ctx.positions.Moon.sign;
    if (MOVABLE_SIGNS.includes(sign)) {
      return {
        status: 'bonus',
        points: 12,
        detail_en: `Moon in ${sign} — a movable sign (burj munqalib); movable signs favor journeys and swift movement. [SCHOLAR-REVIEW]`,
        detail_fr: `Lune en ${sign} — un signe mobile (burj munqalib) ; les signes mobiles favorisent les voyages et les déplacements rapides. [À VÉRIFIER PAR UN SAVANT]`,
        detail_ar: `القمر في ${sign} — برج منقلب؛ الأبراج المنقلبة تدعم السفر والحركة السريعة. [يحتاج مراجعة علمية]`,
      };
    }
    if (FIXED_SIGNS.includes(sign)) {
      return {
        status: 'penalty',
        points: -8,
        detail_en: `Moon in ${sign} — a fixed sign; fixed signs incline to delay and being detained. [SCHOLAR-REVIEW]`,
        detail_fr: `Lune en ${sign} — un signe fixe ; les signes fixes inclinent au retard et à la rétention. [À VÉRIFIER PAR UN SAVANT]`,
        detail_ar: `القمر في ${sign} — برج ثابت؛ الأبراج الثابتة تميل إلى التأخير والاحتباس. [يحتاج مراجعة علمية]`,
      };
    }
    return {
      status: 'pass',
      points: 0,
      detail_en: `Moon in ${sign} — a mutable sign, neutral for travel timing.`,
      detail_fr: `Lune en ${sign} — un signe mutable, neutre pour le choix du moment de voyage.`,
      detail_ar: `القمر في ${sign} — برج ذو طبيعة مزدوجة، محايد لتوقيت السفر.`,
    };
  },
  { maxPoints: 12 },
);

const mercuryRetrograde = rule(
  'travel-mercury-retrograde',
  { en: 'Mercury Retrograde (Travel Plans/Documents)', fr: 'Mercure rétrograde (plans/documents de voyage)', ar: 'عطارد في الرجوع' },
  (ctx) => ctx.positions.Mercury.isRetrograde
    ? { status: 'penalty', points: -8, detail_en: 'Mercury is retrograde — increased risk of itinerary changes, lost documents, or miscommunication.', detail_fr: "Mercure est rétrograde — risque accru de changements d'itinéraire, de documents perdus ou de malentendus.", detail_ar: 'عطارد راجع — خطر متزايد لتغييرات في المسار أو ضياع وثائق أو سوء تفاهم.' }
    : { status: 'pass', points: 0, detail_en: 'Mercury is direct.', detail_fr: 'Mercure est direct.', detail_ar: 'عطارد مستقيم.' },
);

const moonWaxingIncreasingLight = rule(
  'travel-moon-waxing',
  { en: 'Moon Waxing, Increasing in Light', fr: 'Lune croissante, en augmentation de lumière', ar: 'القمر في الزيادة' },
  (ctx) => {
    const waxing = ctx.moonPhaseDirection === 'waxing';
    return {
      status: waxing ? 'bonus' : 'pass',
      points: waxing ? 8 : 0,
      detail_en: waxing
        ? `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waxing, growing in light; favorable for setting out and making progress.`
        : `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waning.`,
      detail_fr: waxing
        ? `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — croissante, en augmentation de lumière ; favorable pour partir et progresser.`
        : `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — décroissante.`,
      detail_ar: waxing
        ? `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في الزيادة؛ موافق للانطلاق والتقدم.`
        : `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في النقصان.`,
    };
  },
  { maxPoints: 8 },
);

const moonApplyingToBenefic = rule(
  'travel-moon-applying-to-benefic',
  { en: 'Moon Applying to Venus or Jupiter', fr: 'Lune appliquant à Vénus ou Jupiter', ar: 'تطبيق القمر بالزهرة أو المشتري' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => (a.planet === 'Venus' || a.planet === 'Jupiter') && (a.aspect === 'trine' || a.aspect === 'sextile' || a.aspect === 'conjunction'),
    );
    const aspectAr: Record<string, string> = { trine: 'التثليث', sextile: 'التسديس', conjunction: 'الاقتران' };
    return {
      status: hit ? 'bonus' : 'pass',
      points: hit ? 10 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — a smooth, well-supported journey.`
        : 'Moon is not applying to a favorable aspect with Venus or Jupiter.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — un voyage fluide et bien soutenu.`
        : "La Lune n'applique pas d'aspect favorable à Vénus ou Jupiter.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${hit.planet}، بعد ${hit.orb.toFixed(1)}° — سفر سلس ومدعوم.`
        : 'لا يطبّق القمر جانباً موافقاً مع الزهرة أو المشتري.',
    };
  },
  { maxPoints: 10 },
);

// Mirrors marriage.ts's makePlanetaryHourBonus: a factory closing over the
// strictHourRuler flag at config-build time. Travel's favorable-hour
// planets differ from marriage's (Jupiter/Moon/Mercury here vs.
// Venus/Moon/Jupiter there) — Mercury governs travel plans/communication,
// Jupiter governs safe/long journeys, Moon is the universal significator.
function makeTravelPlanetaryHourBonus(strict: boolean): Rule {
  return rule(
    'travel-planetary-hour',
    { en: 'Favorable Planetary Hour', fr: 'Heure planétaire favorable', ar: 'الساعة الفلكية الموافقة' },
    (ctx) => {
      const planet = ctx.planetaryHourPlanet;
      const favorable = planet === 'Jupiter' || planet === 'Moon' || planet === 'Mercury';
      const planetFr: Record<string, string> = { Jupiter: 'Jupiter', Moon: 'la Lune', Mercury: 'Mercure' };
      const planetAr: Record<string, string> = { Jupiter: 'المشتري', Moon: 'القمر', Mercury: 'عطارد' };

      if (!favorable) {
        return { status: 'pass', points: 0, detail_en: 'This window is not in a Jupiter, Moon, or Mercury hour.', detail_fr: "Cette fenêtre ne se situe pas dans une heure de Jupiter, de la Lune ou de Mercure.", detail_ar: 'هذه الفترة ليست في ساعة المشتري أو القمر أو عطارد.' };
      }

      if (strict) {
        const pos = ctx.positions[planet!];
        const isCombust = getSeparation(pos, ctx.positions.Sun) <= 8.5;
        const isRetro = pos.isRetrograde;
        const isFallOrDetriment = isInFall(planet!, pos.sign) || isInDetriment(planet!, pos.sign);
        if (isCombust || isRetro || isFallOrDetriment) {
          let reason = 'in fall/detriment';
          let reasonFr = 'en chute/exil';
          let reasonAr = 'في هبوط/ضرر';
          if (isCombust) { reason = 'combust'; reasonFr = 'combuste'; reasonAr = 'محترق'; }
          else if (isRetro) { reason = 'retrograde'; reasonFr = 'rétrograde'; reasonAr = 'راجع'; }
          return {
            status: 'pass', points: 0,
            detail_en: `This window is in the planetary hour of ${planet}, but ${planet} is ${reason} — no bonus. [SCHOLAR-REVIEW]`,
            detail_fr: `Cette fenêtre se situe dans l'heure planétaire de ${planetFr[planet!] ?? planet}, mais ${planetFr[planet!] ?? planet} est ${reasonFr} — aucun bonus. [SCHOLAR-REVIEW]`,
            detail_ar: `هذه الفترة في ساعة ${planetAr[planet!] ?? planet}، لكنه ${reasonAr} — لا يوجد بونص. [يحتاج مراجعة علمية]`,
          };
        }
      }

      return { status: 'bonus', points: 6, detail_en: `This window falls in the planetary hour of ${planet}.`, detail_fr: `Cette fenêtre se situe dans l'heure planétaire de ${planetFr[planet!] ?? planet}.`, detail_ar: `هذه الفترة تقع في ساعة ${planetAr[planet!] ?? planet}.` };
    },
    { maxPoints: 6 },
  );
}

const sunnahBukur = rule(
  'travel-sunnah-bukur',
  { en: 'Early Departure (Bukūr)', fr: 'Départ matinal (Bukūr)', ar: 'التبكير في السفر' },
  (ctx) => {
    const inBukurBand = ctx.localHour >= BUKUR_START_HOUR && ctx.localHour < BUKUR_END_HOUR;
    return {
      status: inBukurBand ? 'bonus' : 'pass',
      points: inBukurBand ? 8 : 0,
      detail_en: inBukurBand
        ? 'Early departure — "Allāhumma bārik li-ummatī fī bukūrihā" (O Allah, bless my ummah in its early mornings).'
        : 'This window is not in the early-morning (bukūr) band.',
      detail_fr: inBukurBand
        ? 'Départ matinal — « Allāhumma bārik li-ummatī fī bukūrihā » (Ô Allah, bénis mon ummah dans ses matins).'
        : "Cette fenêtre ne se situe pas dans la tranche matinale (bukūr).",
      detail_ar: inBukurBand
        ? 'التبكير — «اللهم بارك لأمتي في بكورها».'
        : 'هذه الفترة ليست ضمن نطاق التبكير.',
    };
  },
  { maxPoints: 8 },
);

const travelManzilBonus = rule(
  'travel-lunar-mansion',
  { en: 'Lunar Mansion (Manzil) for Travel', fr: 'Manoir lunaire (Manzil) pour le voyage', ar: 'منزلة القمر للسفر' },
  (ctx) => {
    const mansionNumber = getMansionNumberFromLongitude(ctx.positions.Moon.longitude);
    const favorability = getMansionTravelFavorability(mansionNumber);
    if (favorability === 'favorable') {
      return {
        status: 'bonus',
        points: 6,
        detail_en: `Moon in lunar mansion ${mansionNumber} — favorable for travel. [SCHOLAR-REVIEW]`,
        detail_fr: `Lune dans le manoir lunaire ${mansionNumber} — favorable au voyage. [À VÉRIFIER PAR UN SAVANT]`,
        detail_ar: `القمر في المنزلة ${mansionNumber} — موافقة للسفر. [يحتاج مراجعة علمية]`,
      };
    }
    if (favorability === 'unfavorable') {
      return {
        status: 'penalty',
        points: -6,
        detail_en: `Moon in lunar mansion ${mansionNumber} — unfavorable for travel. [SCHOLAR-REVIEW]`,
        detail_fr: `Lune dans le manoir lunaire ${mansionNumber} — défavorable au voyage. [À VÉRIFIER PAR UN SAVANT]`,
        detail_ar: `القمر في المنزلة ${mansionNumber} — غير موافقة للسفر. [يحتاج مراجعة علمية]`,
      };
    }
    return {
      status: 'pass',
      points: 0,
      detail_en: `Moon in lunar mansion ${mansionNumber} — neutral for travel.`,
      detail_fr: `Lune dans le manoir lunaire ${mansionNumber} — neutre pour le voyage.`,
      detail_ar: `القمر في المنزلة ${mansionNumber} — محايدة للسفر.`,
    };
  },
  { maxPoints: 6 },
);

const mercuryDignified = rule(
  'travel-mercury-dignified',
  { en: 'Mercury Free of Fall/Detriment', fr: 'Mercure hors chute/exil', ar: 'عطارد خارج الهبوط والضرر' },
  (ctx) => {
    const pos = ctx.positions.Mercury;
    const afflicted = isInFall('Mercury', pos.sign) || isInDetriment('Mercury', pos.sign);
    return {
      status: afflicted ? 'pass' : 'bonus',
      points: afflicted ? 0 : 4,
      detail_en: afflicted
        ? `Mercury is in ${pos.sign} — in fall or detriment.`
        : `Mercury is in ${pos.sign} — free of fall or detriment, good for plans and correspondence.`,
      detail_fr: afflicted
        ? `Mercure est en ${pos.sign} — en chute ou en exil.`
        : `Mercure est en ${pos.sign} — hors chute et exil, favorable aux plans et à la correspondance.`,
      detail_ar: afflicted
        ? `عطارد في ${pos.sign} — في هبوط أو ضرر.`
        : `عطارد في ${pos.sign} — خارج الهبوط والضرر، موافق للخطط والمراسلات.`,
    };
  },
  { maxPoints: 4 },
);

const dayOfWeekBonus = rule(
  'travel-day-of-week',
  { en: 'Day of the Week', fr: 'Jour de la semaine', ar: 'يوم الأسبوع' },
  (ctx) => {
    // Wednesday (Mercury) and Thursday (Jupiter) are the classical days
    // most associated with favorable travel/communication and safe
    // long-distance journeys, respectively. Thursday's label cites the
    // Prophet's ﷺ preference for setting out on journeys that day
    // (Bukhārī) — informational sourcing, not a change to the +5 value.
    if (ctx.dayOfWeek === 3) {
      return { status: 'bonus', points: 5, detail_en: 'Wednesday (day of Mercury) — favorable for travel and communication.', detail_fr: 'Mercredi (jour de Mercure) — favorable au voyage et à la communication.', detail_ar: 'الأربعاء (يوم عطارد) — موافق للسفر والتواصل.' };
    }
    if (ctx.dayOfWeek === 4) {
      return {
        status: 'bonus',
        points: 5,
        detail_en: 'Thursday — the Prophet ﷺ preferred to set out on journeys on Thursday (Bukhārī).',
        detail_fr: 'Jeudi — le Prophète ﷺ préférait partir en voyage le jeudi (Bukhārī).',
        detail_ar: 'الخميس — كان النبي ﷺ يحب أن يخرج في سفره يوم الخميس (البخاري).',
      };
    }
    return { status: 'pass', points: 0, detail_en: 'Not a day classically associated with favorable travel.', detail_fr: "Jour non associé de manière classique à un voyage favorable.", detail_ar: 'يوم غير مرتبط تقليدياً بسفر موافق.' };
  },
  { maxPoints: 5 },
);

// ============================================================================
// TIERS
// ============================================================================

const TIERS: TierInfo[] = [
  { tier: 'excellent', labelEn: 'Excellent', labelFr: 'Excellent', labelAr: 'ممتاز (Mumtāz)', color: '#22C55E' },
  { tier: 'good', labelEn: 'Good', labelFr: 'Bon', labelAr: 'جيد (Jayyid)', color: '#14B8A6' },
  { tier: 'acceptable', labelEn: 'Acceptable', labelFr: 'Acceptable', labelAr: 'مقبول (Maqbūl)', color: '#3B82F6' },
  { tier: 'weak', labelEn: 'Weak', labelFr: 'Faible', labelAr: 'ضعيف (Ḍaʿīf)', color: '#F59E0B' },
  { tier: 'avoid', labelEn: 'Avoid', labelFr: 'À éviter', labelAr: 'اجتناب (Ijtanib)', color: '#EF4444' },
];

export const TRAVEL_ACCEPTABLE_THRESHOLD = 40;

function scoreToTier(score: number, hasHardFail: boolean): TierInfo {
  if (hasHardFail || score < 20) return TIERS.find(t => t.tier === 'avoid')!;
  if (score >= 80) return TIERS.find(t => t.tier === 'excellent')!;
  if (score >= 60) return TIERS.find(t => t.tier === 'good')!;
  if (score >= TRAVEL_ACCEPTABLE_THRESHOLD) return TIERS.find(t => t.tier === 'acceptable')!;
  return TIERS.find(t => t.tier === 'weak')!;
}

/**
 * Builds the travel election config. A function rather than a bare object
 * because makeTravelPlanetaryHourBonus needs to close over strictHourRuler
 * at construction time — same reasoning as marriage.ts's
 * buildMarriageElectionConfig.
 */
function buildTravelElectionConfig(strictHourRuler: boolean): ElectionRulesConfig {
  const rules = [
    moonVoidOfCourse,
    moonMaleficHardAspect,
    moonCombust,
    moonModality,
    mercuryRetrograde,
    moonWaxingIncreasingLight,
    moonApplyingToBenefic,
    makeTravelPlanetaryHourBonus(strictHourRuler),
    sunnahBukur,
    travelManzilBonus,
    mercuryDignified,
    dayOfWeekBonus,
  ];
  return {
    electionType: 'travel',
    rules,
    tiers: TIERS,
    scoreToTier,
    civilHoursRange: { startHour: 6, endHour: 22 },
    strictHourRuler,
    maxAchievable: () => computeMaxAchievable(rules),
  };
}

export const travelElectionConfig: ElectionRulesConfig = buildTravelElectionConfig(false);

/** SCHOLAR-REVIEW variant with strictHourRuler enabled — parallels marriageElectionConfigStrictHourRuler; not wired into the UI. */
export const travelElectionConfigStrictHourRuler: ElectionRulesConfig = buildTravelElectionConfig(true);
