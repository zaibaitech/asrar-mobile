/**
 * Education / Studies (starting a course of study, an exam, or a period
 * of learning) election rules config.
 * Ported verbatim (ids, points, maxPoints, conditions, EN/FR copy) from
 * asrar.app's src/lib/ikhtiyarat/elections/education.ts. `detail_ar` on
 * every rule is a NEW field — DRAFT translations, needs native/scholarly
 * review before shipping (the source only ships detail_en/detail_fr).
 *
 * Mercury is the significator of the intellect, learning, and study in
 * every classical source consulted for this feature (Sahl ibn Bishr's
 * and Bonatti's elections material, consistent with their treatment of
 * Mercury for business.ts's contracts election) and Jupiter is the
 * classical significator of wisdom and comprehension. "Do not sign a
 * contract or begin serious study under Mercury retrograde" is the one
 * specific, well-attested caution carried over directly from
 * business.ts's own sourcing.
 *
 * NOT claimed here: a specific classical chapter titled "putting a child
 * to school" or an education-specific house/rule set independent of the
 * general Mercury/Jupiter significators above — every rule below is
 * either the same Mercury/Jupiter logic already verified for
 * business.ts, or explicitly tagged SCHOLAR-REVIEW where it extends
 * beyond that base.
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
  'education-mercury-retrograde',
  { en: 'Mercury Retrograde (Study/Comprehension)', fr: 'Mercure rétrograde (études/compréhension)', ar: 'عطارد في الرجوع' },
  (ctx) => {
    const retro = ctx.positions.Mercury.isRetrograde;
    return {
      status: retro ? 'hardfail' : 'pass',
      points: 0,
      detail_en: retro
        ? 'Mercury is retrograde — the same classical caution cited against contracts (business.ts) applies here: avoid starting serious study, an exam, or a new course while Mercury retrogrades.'
        : 'Mercury is direct.',
      detail_fr: retro
        ? "Mercure est rétrograde — la même mise en garde classique citée pour les contrats (business.ts) s'applique ici : éviter de commencer des études sérieuses, un examen, ou un nouveau cours pendant la rétrogradation de Mercure."
        : 'Mercure est direct.',
      detail_ar: retro
        ? 'عطارد راجع — نفس التحذير الكلاسيكي المذكور للعقود ينطبق هنا: تجنب بدء دراسة جادة أو امتحان أو دورة جديدة أثناء رجوع عطارد.'
        : 'عطارد مستقيم.',
    };
  },
);

const moonVoidOfCourse = rule(
  'education-moon-void-of-course',
  { en: 'Moon Void of Course (Khāliya al-Sayr)', fr: 'Lune vide de course', ar: 'خالية السير' },
  (ctx) => {
    const voc = ctx.applyingAspects.length === 0;
    return {
      status: voc ? 'hardfail' : 'pass',
      points: 0,
      detail_en: voc
        ? 'Moon has no applying aspect before leaving its current sign — void of course, study begun now tends to come to nothing.'
        : 'Moon has at least one applying aspect — not void of course.',
      detail_fr: voc
        ? "La Lune n'a aucun aspect en application avant de quitter son signe — vide de course, des études commencées maintenant tendent à n'aboutir à rien."
        : "La Lune a au moins un aspect en application — pas vide de course.",
      detail_ar: voc
        ? 'لا يطبّق القمر أي جانب قبل مغادرة برجه — خالية السير، دراسة تبدأ الآن تميل إلى عدم النجاح.'
        : 'يطبّق القمر جانباً واحداً على الأقل — ليست خالية السير.',
    };
  },
);

const mercuryCombust = rule(
  'education-mercury-combust',
  { en: 'Mercury Combust', fr: 'Mercure combuste', ar: 'احتراق عطارد' },
  (ctx) => {
    const sep = getSeparation(ctx.positions.Mercury, ctx.positions.Sun);
    const sepStr = sep.toFixed(1);
    const combust = sep <= 8.5;
    return {
      status: combust ? 'hardfail' : 'pass',
      points: 0,
      detail_en: combust
        ? `Mercury is ${sepStr}° from the Sun — combust; the significator of the intellect and study itself is weakened/obscured.`
        : `Mercury is ${sepStr}° from the Sun — not combust.`,
      detail_fr: combust
        ? `Mercure est à ${sepStr}° du Soleil — combuste ; le significateur de l'intellect et des études lui-même est affaibli/obscurci.`
        : `Mercure est à ${sepStr}° du Soleil — non combuste.`,
      detail_ar: combust
        ? `عطارد على بعد ${sepStr}° من الشمس — محترق؛ ضعف دليل العقل والدراسة نفسها.`
        : `عطارد على بعد ${sepStr}° من الشمس — غير محترق.`,
    };
  },
);

// ============================================================================
// PENALTIES / BONUSES
// ============================================================================

const moonApplyingToJupiter = rule(
  'education-moon-applying-to-jupiter',
  { en: 'Moon Applying to Jupiter (Wisdom/Comprehension)', fr: 'Lune appliquant à Jupiter (sagesse/compréhension)', ar: 'تطبيق القمر بالمشتري (الحكمة والفهم)' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => a.planet === 'Jupiter' && (a.aspect === 'trine' || a.aspect === 'sextile' || a.aspect === 'conjunction'),
    );
    const aspectAr: Record<string, string> = { trine: 'التثليث', sextile: 'التسديس', conjunction: 'الاقتران' };
    return {
      status: hit ? 'bonus' : 'pass',
      points: hit ? 12 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with Jupiter, orb ${hit.orb.toFixed(1)}° — Jupiter is the classical significator of wisdom and comprehension.`
        : 'Moon is not applying to a favorable aspect with Jupiter.',
      detail_fr: hit
        ? `Lune en application de ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec Jupiter, orbe ${hit.orb.toFixed(1)}° — Jupiter est le significateur classique de la sagesse et de la compréhension.`
        : "La Lune n'applique aucun aspect favorable à Jupiter.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع المشتري، بعد ${hit.orb.toFixed(1)}° — المشتري هو الدليل الكلاسيكي على الحكمة والفهم.`
        : 'لا يطبّق القمر جانباً موافقاً مع المشتري.',
    };
  },
  { maxPoints: 12 },
);

const moonApplyingToMercury = rule(
  'education-moon-applying-to-mercury',
  { en: 'Moon Applying to Mercury (Retention)', fr: 'Lune appliquant à Mercure (rétention)', ar: 'تطبيق القمر بعطارد (الحفظ)' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => a.planet === 'Mercury' && (a.aspect === 'trine' || a.aspect === 'sextile' || a.aspect === 'conjunction'),
    );
    const aspectAr: Record<string, string> = { trine: 'التثليث', sextile: 'التسديس', conjunction: 'الاقتران' };
    return {
      status: hit ? 'bonus' : 'pass',
      points: hit ? 8 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with Mercury, orb ${hit.orb.toFixed(1)}° — favorable for retention and a receptive mind.`
        : 'Moon is not applying to a favorable aspect with Mercury.',
      detail_fr: hit
        ? `Lune en application de ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec Mercure, orbe ${hit.orb.toFixed(1)}° — favorable à la rétention et à un esprit réceptif.`
        : "La Lune n'applique aucun aspect favorable à Mercure.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع عطارد، بعد ${hit.orb.toFixed(1)}° — موافق للحفظ وذهن متقبّل.`
        : 'لا يطبّق القمر جانباً موافقاً مع عطارد.',
    };
  },
  { maxPoints: 8 },
);

const moonMaleficHardAspect = rule(
  'education-moon-malefic-hard-aspect',
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
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — warns of frustration, blocked progress, or discouragement.`
        : 'Moon is not applying to a hard aspect with Saturn or Mars.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'square' ? 'carré' : 'opposition'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — avertit d'une frustration, d'un blocage, ou d'un découragement.`
        : "La Lune n'applique pas d'aspect dur à Saturne ou Mars.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${planetAr[hit.planet] ?? hit.planet}، بعد ${hit.orb.toFixed(1)}° — ينذر بإحباط أو عرقلة أو يأس.`
        : 'لا يطبّق القمر جانباً قاسياً مع زحل أو المريخ.',
    };
  },
);

// Mercury dignity, mirroring business.ts's mercuryDignified pattern
// exactly: direct sign-table lookups rather than net-dignity-score functions.
const mercuryDignified = rule(
  'education-mercury-dignified',
  { en: 'Mercury Dignified', fr: 'Mercure dignifié', ar: 'عطارد في شرف' },
  (ctx) => {
    const sign = ctx.positions.Mercury.sign;
    const signAr: Record<string, string> = { gemini: 'الجوزاء', virgo: 'العذراء' };
    if (sign === 'gemini' || sign === 'virgo') {
      return {
        status: 'bonus',
        points: 10,
        detail_en: `Mercury in ${sign} — domicile; strong for comprehension, memory, and clear thinking.`,
        detail_fr: `Mercure en ${sign} — domicile ; favorable à la compréhension, à la mémoire, et à une pensée claire.`,
        detail_ar: `عطارد في ${signAr[sign] ?? sign} — بيت؛ قوي للفهم والذاكرة والتفكير الواضح.`,
      };
    }
    return { status: 'pass', points: 0, detail_en: 'Mercury has no domicile bonus in this sign.', detail_fr: "Mercure ne bénéficie d'aucun domicile dans ce signe.", detail_ar: 'لا يحظى عطارد ببيته في هذا البرج.' };
  },
  { maxPoints: 10 },
);

const jupiterFreeOfAffliction = rule(
  'education-jupiter-free-of-affliction',
  { en: 'Jupiter Free of Fall/Detriment', fr: 'Jupiter hors chute/exil', ar: 'المشتري خارج الهبوط والضرر' },
  (ctx) => {
    const pos = ctx.positions.Jupiter;
    const afflicted = isInFall('Jupiter', pos.sign) || isInDetriment('Jupiter', pos.sign);
    return {
      status: afflicted ? 'pass' : 'bonus',
      points: afflicted ? 0 : 4,
      detail_en: afflicted
        ? `Jupiter is in ${pos.sign} — in fall or detriment.`
        : `Jupiter is in ${pos.sign} — free of fall or detriment, supporting comprehension and wisdom.`,
      detail_fr: afflicted
        ? `Jupiter est en ${pos.sign} — en chute ou en exil.`
        : `Jupiter est en ${pos.sign} — hors chute et exil, favorable à la compréhension et à la sagesse.`,
      detail_ar: afflicted
        ? `المشتري في ${pos.sign} — في هبوط أو ضرر.`
        : `المشتري في ${pos.sign} — خارج الهبوط والضرر، داعم للفهم والحكمة.`,
    };
  },
  { maxPoints: 4 },
);

// Mirrors marriage.ts's makePlanetaryHourBonus / travel.ts's / business.ts's
// / medical.ts's / home.ts's own equivalents: a factory closing over
// strictHourRuler at config-build time. Education's favorable-hour
// planets are Mercury (the intellect itself) and Jupiter (wisdom).
function makeEducationPlanetaryHourBonus(strict: boolean): Rule {
  return rule(
    'education-planetary-hour',
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
  'education-day-of-week',
  { en: 'Day of the Week', fr: 'Jour de la semaine', ar: 'يوم الأسبوع' },
  (ctx) => {
    // Wednesday (Mercury, the intellect) and Thursday (Jupiter, wisdom)
    // are the classical days most associated with this election's two
    // significators — applied here to learning instead of commerce.
    if (ctx.dayOfWeek === 3) {
      return { status: 'bonus', points: 5, detail_en: 'Wednesday (day of Mercury) — favorable for study and comprehension.', detail_fr: "Mercredi (jour de Mercure) — favorable à l'étude et à la compréhension.", detail_ar: 'الأربعاء (يوم عطارد) — موافق للدراسة والفهم.' };
    }
    if (ctx.dayOfWeek === 4) {
      return { status: 'bonus', points: 5, detail_en: 'Thursday (day of Jupiter) — favorable for wisdom and understanding.', detail_fr: 'Jeudi (jour de Jupiter) — favorable à la sagesse et à la compréhension.', detail_ar: 'الخميس (يوم المشتري) — موافق للحكمة والفهم.' };
    }
    return { status: 'pass', points: 0, detail_en: 'Not a day classically associated with favorable study.', detail_fr: "Jour non associé de manière classique à des études favorables.", detail_ar: 'يوم غير مرتبط تقليدياً بدراسة موافقة.' };
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

export const EDUCATION_ACCEPTABLE_THRESHOLD = 40;

function scoreToTier(score: number, hasHardFail: boolean): TierInfo {
  if (hasHardFail || score < 20) return TIERS.find(t => t.tier === 'avoid')!;
  if (score >= 80) return TIERS.find(t => t.tier === 'excellent')!;
  if (score >= 60) return TIERS.find(t => t.tier === 'good')!;
  if (score >= EDUCATION_ACCEPTABLE_THRESHOLD) return TIERS.find(t => t.tier === 'acceptable')!;
  return TIERS.find(t => t.tier === 'weak')!;
}

/**
 * Builds the education election config. A function rather than a bare
 * object because makeEducationPlanetaryHourBonus needs to close over
 * strictHourRuler at construction time.
 */
function buildEducationElectionConfig(strictHourRuler: boolean): ElectionRulesConfig {
  const rules = [
    mercuryRetrogradeHardFail,
    moonVoidOfCourse,
    mercuryCombust,
    moonApplyingToJupiter,
    moonApplyingToMercury,
    moonMaleficHardAspect,
    mercuryDignified,
    jupiterFreeOfAffliction,
    makeEducationPlanetaryHourBonus(strictHourRuler),
    dayOfWeekBonus,
  ];
  return {
    electionType: 'education',
    rules,
    tiers: TIERS,
    scoreToTier,
    civilHoursRange: { startHour: 8, endHour: 20 },
    strictHourRuler,
    maxAchievable: () => computeMaxAchievable(rules),
  };
}

export const educationElectionConfig: ElectionRulesConfig = buildEducationElectionConfig(false);

/** SCHOLAR-REVIEW variant with strictHourRuler enabled — parallels every other election's strict-hour-ruler config; not wired into the UI. */
export const educationElectionConfigStrictHourRuler: ElectionRulesConfig = buildEducationElectionConfig(true);
