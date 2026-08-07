/**
 * Business/Contracts (al-Bayʿ wa-l-Shirāʾ — buying, selling, signing
 * contracts, partnerships) election rules config.
 * Ported verbatim (ids, points, maxPoints, conditions, EN/FR copy) from
 * asrar.app's src/lib/ikhtiyarat/elections/business.ts. `detail_ar` on
 * every rule is a NEW field — DRAFT translations, needs native/scholarly
 * review before shipping (the source only ships detail_en/detail_fr).
 *
 * Classical significators, per Sahl ibn Bishr's Kitāb al-Ikhtiyārāt and
 * Bonatti's Liber Astronomiae (Book on Elections) — both devote sections
 * to buying/selling/partnership/lending that share the same core logic:
 * Mercury governs commerce, negotiation, and contracts and must be
 * strong and unafflicted; the Moon (universal significator of the
 * matter) should be increasing in light and applying to a benefic;
 * Jupiter is the classical significator of profit/gain. Mercury
 * retrograde and Moon void of course are the two most commonly cited
 * cautions against signing anything in both sources — "don't sign
 * contracts under Mercury retrograde" is genuinely classical, not
 * modern folk astrology.
 *
 * This engine has no house/Ascendant system (see engine.ts — every rule
 * here and in marriage.ts/travel.ts is planet-condition-based only), so
 * the classical 2nd-house (money) and 7th-house (the other party)
 * significations are represented here only insofar as they map onto
 * planetary significators (Jupiter for gain, Mercury for the deal
 * itself) — not as literal house placements. This is a genuine
 * simplification relative to the full classical method and should be
 * understood as such rather than a complete house-based election.
 */

import { ElectionRulesConfig, Rule, RuleContext, RuleResult, TierInfo } from '../types';
import { isInFall, isInDetriment } from '../dignitiesLite';
import { computeMaxAchievable } from '../engine';
import { getSeparation } from '../aspects';

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

const mercuryRetrogradeHardFail = rule(
  'business-mercury-retrograde',
  { en: 'Mercury Retrograde (Contracts)', fr: 'Mercure rétrograde (contrats)', ar: 'عطارد في الرجوع' },
  (ctx) => {
    const retro = ctx.positions.Mercury.isRetrograde;
    return {
      status: retro ? 'hardfail' : 'pass',
      points: 0,
      detail_en: retro
        ? 'Mercury is retrograde — the single most-cited classical caution against signing contracts, starting negotiations, or finalizing a sale.'
        : 'Mercury is direct.',
      detail_fr: retro
        ? "Mercure est rétrograde — la mise en garde classique la plus citée contre la signature de contrats, l'ouverture de négociations, ou la conclusion d'une vente."
        : 'Mercure est direct.',
      detail_ar: retro
        ? 'عطارد راجع — التحذير الكلاسيكي الأكثر ذكراً ضد توقيع العقود أو بدء المفاوضات أو إتمام البيع.'
        : 'عطارد مستقيم.',
    };
  },
);

const moonVoidOfCourse = rule(
  'business-moon-void-of-course',
  { en: 'Moon Void of Course (Khāliya al-Sayr)', fr: 'Lune vide de course', ar: 'خالية السير' },
  (ctx) => {
    const voc = ctx.applyingAspects.length === 0;
    return {
      status: voc ? 'hardfail' : 'pass',
      points: 0,
      detail_en: voc
        ? 'Moon has no applying aspect before leaving its current sign — void of course, nothing "comes of" a deal begun now.'
        : 'Moon has at least one applying aspect — not void of course.',
      detail_fr: voc
        ? "La Lune n'a aucun aspect en application avant de quitter son signe — vide de course, une affaire commencée maintenant n'aboutira à rien de concret."
        : "La Lune a au moins un aspect en application — pas vide de course.",
      detail_ar: voc
        ? 'لا يطبّق القمر أي جانب قبل مغادرة برجه — خالية السير، لن تُثمر صفقة تبدأ الآن.'
        : 'يطبّق القمر جانباً واحداً على الأقل — ليست خالية السير.',
    };
  },
);

const mercuryCombust = rule(
  'business-mercury-combust',
  { en: 'Mercury Combust', fr: 'Mercure combuste', ar: 'احتراق عطارد' },
  (ctx) => {
    const sep = getSeparation(ctx.positions.Mercury, ctx.positions.Sun);
    const sepStr = sep.toFixed(1);
    const combust = sep <= 8.5;
    return {
      status: combust ? 'hardfail' : 'pass',
      points: 0,
      detail_en: combust
        ? `Mercury is ${sepStr}° from the Sun — combust; the significator of the deal itself is weakened/obscured.`
        : `Mercury is ${sepStr}° from the Sun — not combust.`,
      detail_fr: combust
        ? `Mercure est à ${sepStr}° du Soleil — combuste ; le significateur de l'affaire elle-même est affaibli/obscurci.`
        : `Mercure est à ${sepStr}° du Soleil — non combuste.`,
      detail_ar: combust
        ? `عطارد على بعد ${sepStr}° من الشمس — محترق؛ ضعف دليل الصفقة نفسها.`
        : `عطارد على بعد ${sepStr}° من الشمس — غير محترق.`,
    };
  },
);

// ============================================================================
// PENALTIES / BONUSES
// ============================================================================

const moonMaleficHardAspect = rule(
  'business-moon-malefic-hard-aspect',
  { en: 'Moon Applying to Saturn/Mars (Hard Aspect)', fr: 'Lune appliquant à Saturne/Mars (aspect dur)', ar: 'تطبيق القمر بزحل أو المريخ' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => (a.planet === 'Saturn' || a.planet === 'Mars') && (a.aspect === 'square' || a.aspect === 'opposition'),
    );
    const aspectAr: Record<string, string> = { square: 'التربيع', opposition: 'التقابل' };
    const planetAr: Record<string, string> = { Saturn: 'زحل', Mars: 'المريخ' };
    return {
      status: hit ? 'penalty' : 'pass',
      points: hit ? -10 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — warns of dispute, loss, or a deal turning sour.`
        : 'Moon is not applying to a hard aspect with Saturn or Mars.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'square' ? 'carré' : 'opposition'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — avertit d'un litige, d'une perte, ou d'une affaire qui tourne mal.`
        : "La Lune n'applique pas d'aspect dur à Saturne ou Mars.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${planetAr[hit.planet] ?? hit.planet}، بعد ${hit.orb.toFixed(1)}° — ينذر بنزاع أو خسارة أو تعثر الصفقة.`
        : 'لا يطبّق القمر جانباً قاسياً مع زحل أو المريخ.',
    };
  },
);

const moonWaxingIncreasingLight = rule(
  'business-moon-waxing',
  { en: 'Moon Waxing, Increasing in Light', fr: 'Lune croissante, en augmentation de lumière', ar: 'القمر في الزيادة' },
  (ctx) => {
    const waxing = ctx.moonPhaseDirection === 'waxing';
    return {
      status: waxing ? 'bonus' : 'pass',
      points: waxing ? 10 : 0,
      detail_en: waxing
        ? `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waxing, growing in light; favorable for starting and growing an undertaking.`
        : `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waning.`,
      detail_fr: waxing
        ? `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — croissante, en augmentation de lumière ; favorable pour commencer et développer une entreprise.`
        : `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — décroissante.`,
      detail_ar: waxing
        ? `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في الزيادة؛ موافق لبدء وتنمية المشروع.`
        : `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في النقصان.`,
    };
  },
  { maxPoints: 10 },
);

const moonApplyingToJupiter = rule(
  'business-moon-applying-to-jupiter',
  { en: 'Moon Applying to Jupiter (Gain)', fr: 'Lune appliquant à Jupiter (gain)', ar: 'تطبيق القمر بالمشتري (الربح)' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => a.planet === 'Jupiter' && (a.aspect === 'trine' || a.aspect === 'sextile' || a.aspect === 'conjunction'),
    );
    const aspectAr: Record<string, string> = { trine: 'التثليث', sextile: 'التسديس', conjunction: 'الاقتران' };
    return {
      status: hit ? 'bonus' : 'pass',
      points: hit ? 12 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with Jupiter, orb ${hit.orb.toFixed(1)}° — Jupiter is the classical significator of profit and gain.`
        : 'Moon is not applying to a favorable aspect with Jupiter.',
      detail_fr: hit
        ? `Lune en application de ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec Jupiter, orbe ${hit.orb.toFixed(1)}° — Jupiter est le significateur classique du profit et du gain.`
        : "La Lune n'applique aucun aspect favorable à Jupiter.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع المشتري، بعد ${hit.orb.toFixed(1)}° — المشتري هو الدليل الكلاسيكي على الربح والمكسب.`
        : 'لا يطبّق القمر جانباً موافقاً مع المشتري.',
    };
  },
  { maxPoints: 12 },
);

const moonApplyingToVenus = rule(
  'business-moon-applying-to-venus',
  { en: 'Moon Applying to Venus (Smooth Dealing)', fr: 'Lune appliquant à Vénus (échange harmonieux)', ar: 'تطبيق القمر بالزهرة (تعامل سلس)' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => a.planet === 'Venus' && (a.aspect === 'trine' || a.aspect === 'sextile' || a.aspect === 'conjunction'),
    );
    const aspectAr: Record<string, string> = { trine: 'التثليث', sextile: 'التسديس', conjunction: 'الاقتران' };
    return {
      status: hit ? 'bonus' : 'pass',
      points: hit ? 6 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with Venus, orb ${hit.orb.toFixed(1)}° — favorable for amicable dealing between the parties.`
        : 'Moon is not applying to a favorable aspect with Venus.',
      detail_fr: hit
        ? `Lune en application de ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec Vénus, orbe ${hit.orb.toFixed(1)}° — favorable pour des échanges cordiaux entre les parties.`
        : "La Lune n'applique aucun aspect favorable à Vénus.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع الزهرة، بعد ${hit.orb.toFixed(1)}° — موافق لتعامل ودّي بين الطرفين.`
        : 'لا يطبّق القمر جانباً موافقاً مع الزهرة.',
    };
  },
  { maxPoints: 6 },
);

// Mercury dignity, mirroring marriage.ts's venusDignified pattern exactly:
// direct sign-table lookups rather than net-dignity-score functions.
const mercuryDignified = rule(
  'business-mercury-dignified',
  { en: 'Mercury Dignified', fr: 'Mercure dignifié', ar: 'عطارد في شرف' },
  (ctx) => {
    const sign = ctx.positions.Mercury.sign;
    const signAr: Record<string, string> = { gemini: 'الجوزاء', virgo: 'العذراء' };
    if (sign === 'gemini' || sign === 'virgo') {
      return {
        status: 'bonus',
        points: 10,
        detail_en: `Mercury in ${sign} — domicile; strong for negotiation, paperwork, and the terms of the deal.`,
        detail_fr: `Mercure en ${sign} — domicile ; favorable pour la négociation, les documents, et les termes de l'accord.`,
        detail_ar: `عطارد في ${signAr[sign] ?? sign} — بيت؛ قوي للتفاوض والأوراق وشروط الصفقة.`,
      };
    }
    return { status: 'pass', points: 0, detail_en: 'Mercury has no domicile bonus in this sign.', detail_fr: "Mercure ne bénéficie d'aucun domicile dans ce signe.", detail_ar: 'لا يحظى عطارد ببيته في هذا البرج.' };
  },
  { maxPoints: 10 },
);

const mercuryFreeOfAffliction = rule(
  'business-mercury-free-of-affliction',
  { en: 'Mercury Free of Fall/Detriment', fr: 'Mercure hors chute/exil', ar: 'عطارد خارج الهبوط والضرر' },
  (ctx) => {
    const pos = ctx.positions.Mercury;
    const afflicted = isInFall('Mercury', pos.sign) || isInDetriment('Mercury', pos.sign);
    return {
      status: afflicted ? 'pass' : 'bonus',
      points: afflicted ? 0 : 4,
      detail_en: afflicted
        ? `Mercury is in ${pos.sign} — in fall or detriment.`
        : `Mercury is in ${pos.sign} — free of fall or detriment.`,
      detail_fr: afflicted
        ? `Mercure est en ${pos.sign} — en chute ou en exil.`
        : `Mercure est en ${pos.sign} — hors chute et exil.`,
      detail_ar: afflicted
        ? `عطارد في ${pos.sign} — في هبوط أو ضرر.`
        : `عطارد في ${pos.sign} — خارج الهبوط والضرر.`,
    };
  },
  { maxPoints: 4 },
);

// Mirrors marriage.ts's makePlanetaryHourBonus / travel.ts's
// makeTravelPlanetaryHourBonus: a factory closing over strictHourRuler at
// config-build time. Business's favorable-hour planets are Mercury
// (commerce/contracts) and Jupiter (profit/gain).
function makeBusinessPlanetaryHourBonus(strict: boolean): Rule {
  return rule(
    'business-planetary-hour',
    { en: 'Favorable Planetary Hour', fr: 'Heure planétaire favorable', ar: 'الساعة الفلكية الموافقة' },
    (ctx) => {
      const planet = ctx.planetaryHourPlanet;
      const favorable = planet === 'Mercury' || planet === 'Jupiter';
      const planetFr: Record<string, string> = { Mercury: 'Mercure', Jupiter: 'Jupiter' };
      const planetAr: Record<string, string> = { Mercury: 'عطارد', Jupiter: 'المشتري' };

      if (!favorable) {
        return { status: 'pass', points: 0, detail_en: 'This window is not in a Mercury or Jupiter hour.', detail_fr: "Cette fenêtre ne se situe pas dans une heure de Mercure ou de Jupiter.", detail_ar: 'هذه الفترة ليست في ساعة عطارد أو المشتري.' };
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

const dayOfWeekBonus = rule(
  'business-day-of-week',
  { en: 'Day of the Week', fr: 'Jour de la semaine', ar: 'يوم الأسبوع' },
  (ctx) => {
    // Wednesday (Mercury, commerce/contracts) and Thursday (Jupiter,
    // profit/gain) are the classical days most associated with favorable
    // business dealings, matching the same two significators this
    // election is built around.
    if (ctx.dayOfWeek === 3) {
      return { status: 'bonus', points: 5, detail_en: 'Wednesday (day of Mercury) — favorable for negotiation and contracts.', detail_fr: 'Mercredi (jour de Mercure) — favorable à la négociation et aux contrats.', detail_ar: 'الأربعاء (يوم عطارد) — موافق للتفاوض والعقود.' };
    }
    if (ctx.dayOfWeek === 4) {
      return { status: 'bonus', points: 5, detail_en: 'Thursday (day of Jupiter) — favorable for profit and gain.', detail_fr: 'Jeudi (jour de Jupiter) — favorable au profit et au gain.', detail_ar: 'الخميس (يوم المشتري) — موافق للربح والمكسب.' };
    }
    return { status: 'pass', points: 0, detail_en: 'Not a day classically associated with favorable business dealings.', detail_fr: "Jour non associé de manière classique à des affaires favorables.", detail_ar: 'يوم غير مرتبط تقليدياً بصفقات موافقة.' };
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

export const BUSINESS_ACCEPTABLE_THRESHOLD = 40;

function scoreToTier(score: number, hasHardFail: boolean): TierInfo {
  if (hasHardFail || score < 20) return TIERS.find(t => t.tier === 'avoid')!;
  if (score >= 80) return TIERS.find(t => t.tier === 'excellent')!;
  if (score >= 60) return TIERS.find(t => t.tier === 'good')!;
  if (score >= BUSINESS_ACCEPTABLE_THRESHOLD) return TIERS.find(t => t.tier === 'acceptable')!;
  return TIERS.find(t => t.tier === 'weak')!;
}

/**
 * Builds the business election config. A function rather than a bare
 * object because makeBusinessPlanetaryHourBonus needs to close over
 * strictHourRuler at construction time.
 */
function buildBusinessElectionConfig(strictHourRuler: boolean): ElectionRulesConfig {
  const rules = [
    mercuryRetrogradeHardFail,
    moonVoidOfCourse,
    mercuryCombust,
    moonMaleficHardAspect,
    moonWaxingIncreasingLight,
    moonApplyingToJupiter,
    moonApplyingToVenus,
    mercuryDignified,
    mercuryFreeOfAffliction,
    makeBusinessPlanetaryHourBonus(strictHourRuler),
    dayOfWeekBonus,
  ];
  return {
    electionType: 'business',
    rules,
    tiers: TIERS,
    scoreToTier,
    civilHoursRange: { startHour: 8, endHour: 20 },
    strictHourRuler,
    maxAchievable: () => computeMaxAchievable(rules),
  };
}

export const businessElectionConfig: ElectionRulesConfig = buildBusinessElectionConfig(false);

/** SCHOLAR-REVIEW variant with strictHourRuler enabled — parallels marriage/travel's strict-hour-ruler configs; not wired into the UI. */
export const businessElectionConfigStrictHourRuler: ElectionRulesConfig = buildBusinessElectionConfig(true);
