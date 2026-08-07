/**
 * Medical Treatment (al-Ṭibb — starting treatment, surgery, bloodletting)
 * election rules config.
 * Ported verbatim (ids, points, maxPoints, conditions, EN/FR copy) from
 * asrar.app's src/lib/ikhtiyarat/elections/medical.ts. `detail_ar` on
 * every rule is a NEW field — DRAFT translations, needs native/scholarly/
 * medical-term review before shipping (the source only ships
 * detail_en/detail_fr).
 *
 * Classical medical-electional astrology (melothesia / "Zodiac Man",
 * documented from Hellenistic and Islamic sources through to European
 * almanacs, e.g. Sahl ibn Bishr's and Bonatti's elections chapters) is
 * built on the Moon as the primary significator of the body and of the
 * matter itself, with two further significators layered on: Mercury
 * (diagnosis, the physician, correct assessment of the condition) and
 * Jupiter (the classical "greater benefic," associated with recovery and
 * the vital force). This mirrors marriage.ts/travel.ts/business.ts's
 * shape exactly — Moon condition dominates, a secondary planet governs
 * the specific domain, no house/Ascendant system (see engine.ts).
 *
 * The single most-repeated rule across sources is body-part-specific:
 * avoid operating on/drawing blood from the body part ruled by the sign
 * the Moon currently occupies (zodiacMan.ts). This engine has no
 * per-request "target body part" input (ElectionInput is shared,
 * election-agnostic — see types.ts), so that rule cannot be scored here;
 * it is surfaced as score-neutral informational UI instead, via
 * medicalBadges.ts, exactly as travelBadges.ts keeps Sunnah/fiqh content
 * out of the scored rule set.
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

const moonVoidOfCourse = rule(
  'medical-moon-void-of-course',
  { en: 'Moon Void of Course (Khāliya al-Sayr)', fr: 'Lune vide de course', ar: 'خالية السير' },
  (ctx) => {
    const voc = ctx.applyingAspects.length === 0;
    return {
      status: voc ? 'hardfail' : 'pass',
      points: 0,
      detail_en: voc
        ? 'Moon has no applying aspect before leaving its current sign — void of course, treatment begun now tends to come to nothing.'
        : 'Moon has at least one applying aspect — not void of course.',
      detail_fr: voc
        ? "La Lune n'a aucun aspect en application avant de quitter son signe — vide de course, un traitement commencé maintenant tend à n'aboutir à rien."
        : "La Lune a au moins un aspect en application — pas vide de course.",
      detail_ar: voc
        ? 'لا يطبّق القمر أي جانب قبل مغادرة برجه — خالية السير، علاج يبدأ الآن يميل إلى عدم النجاح.'
        : 'يطبّق القمر جانباً واحداً على الأقل — ليست خالية السير.',
    };
  },
);

const moonCombust = rule(
  'medical-moon-combust',
  { en: 'Moon Combust (Muḥtaraq)', fr: 'Lune combuste (Muḥtaraq)', ar: 'احتراق القمر' },
  (ctx) => {
    const combust = ctx.moonSunSeparation <= 8.5;
    const sep = ctx.moonSunSeparation.toFixed(1);
    return {
      status: combust ? 'hardfail' : 'pass',
      points: 0,
      detail_en: combust
        ? `Moon is ${sep}° from the Sun — combust (muḥtaraq); the patient's own significator and the body's vital force are weakened.`
        : `Moon is ${sep}° from the Sun — not combust.`,
      detail_fr: combust
        ? `La Lune est à ${sep}° du Soleil — combuste (muḥtaraq) ; le significateur du patient et la force vitale du corps sont affaiblis.`
        : `La Lune est à ${sep}° du Soleil — non combuste.`,
      detail_ar: combust
        ? `القمر على بعد ${sep}° من الشمس — محترق؛ ضعف دليل المريض والقوة الحيوية للجسد.`
        : `القمر على بعد ${sep}° من الشمس — غير محترق.`,
    };
  },
);

const moonMaleficHardAspect = rule(
  'medical-moon-malefic-hard-aspect',
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
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — traditionally warns of complication, poor healing, or a worsened condition.`
        : 'Moon is not applying to a hard aspect with Saturn or Mars.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'square' ? 'carré' : 'opposition'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — avertit traditionnellement d'une complication, d'une mauvaise cicatrisation, ou d'une aggravation.`
        : "La Lune n'applique pas d'aspect dur à Saturne ou Mars.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${planetAr[hit.planet] ?? hit.planet}، بعد ${hit.orb.toFixed(1)}° — ينذر تقليدياً بمضاعفات أو ضعف الشفاء أو تدهور الحالة.`
        : 'لا يطبّق القمر جانباً قاسياً مع زحل أو المريخ.',
    };
  },
);

// ============================================================================
// PENALTIES / BONUSES
// ============================================================================

// SCHOLAR-REVIEW: the waxing/waning distinction for medical timing is
// widely attested but sources differ on which procedures pair with which
// half of the cycle. This rule scores only the safer, more consistently-
// cited half of the claim — waxing favors treatments meant to build up/
// strengthen the body — and treats waning as neutral.
const moonWaxingForBuildingUp = rule(
  'medical-moon-waxing',
  { en: 'Moon Waxing, Increasing in Light', fr: 'Lune croissante, en augmentation de lumière', ar: 'القمر في الزيادة' },
  (ctx) => {
    const waxing = ctx.moonPhaseDirection === 'waxing';
    return {
      status: waxing ? 'bonus' : 'pass',
      points: waxing ? 10 : 0,
      detail_en: waxing
        ? `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waxing, growing in light; classically favorable for treatments meant to build up or strengthen the body. [SCHOLAR-REVIEW]`
        : `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waning.`,
      detail_fr: waxing
        ? `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — croissante, en augmentation de lumière ; classiquement favorable pour les traitements destinés à fortifier le corps. [À VÉRIFIER PAR UN SAVANT]`
        : `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — décroissante.`,
      detail_ar: waxing
        ? `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في الزيادة؛ موافق تقليدياً للعلاجات الهادفة لتقوية الجسد. [يحتاج مراجعة علمية]`
        : `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في النقصان.`,
    };
  },
  { maxPoints: 10 },
);

const moonApplyingToBenefic = rule(
  'medical-moon-applying-to-benefic',
  { en: 'Moon Applying to Venus or Jupiter', fr: 'Lune appliquant à Vénus ou Jupiter', ar: 'تطبيق القمر بالزهرة أو المشتري' },
  (ctx) => {
    const hit = ctx.applyingAspects.find(
      a => (a.planet === 'Venus' || a.planet === 'Jupiter') && (a.aspect === 'trine' || a.aspect === 'sextile' || a.aspect === 'conjunction'),
    );
    const aspectAr: Record<string, string> = { trine: 'التثليث', sextile: 'التسديس', conjunction: 'الاقتران' };
    return {
      status: hit ? 'bonus' : 'pass',
      points: hit ? 12 : 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — a smooth course of treatment and recovery.`
        : 'Moon is not applying to a favorable aspect with Venus or Jupiter.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — un traitement et un rétablissement fluides.`
        : "La Lune n'applique pas d'aspect favorable à Vénus ou Jupiter.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${hit.planet}، بعد ${hit.orb.toFixed(1)}° — علاج وتعافٍ سلس.`
        : 'لا يطبّق القمر جانباً موافقاً مع الزهرة أو المشتري.',
    };
  },
  { maxPoints: 12 },
);

const jupiterDignified = rule(
  'medical-jupiter-dignified',
  { en: 'Jupiter Free of Fall/Detriment', fr: 'Jupiter hors chute/exil', ar: 'المشتري خارج الهبوط والضرر' },
  (ctx) => {
    const pos = ctx.positions.Jupiter;
    const afflicted = isInFall('Jupiter', pos.sign) || isInDetriment('Jupiter', pos.sign);
    return {
      status: afflicted ? 'pass' : 'bonus',
      points: afflicted ? 0 : 8,
      detail_en: afflicted
        ? `Jupiter is in ${pos.sign} — in fall or detriment; the classical significator of recovery and vital force is weakened.`
        : `Jupiter is in ${pos.sign} — free of fall or detriment, supporting recovery.`,
      detail_fr: afflicted
        ? `Jupiter est en ${pos.sign} — en chute ou en exil ; le significateur classique du rétablissement et de la force vitale est affaibli.`
        : `Jupiter est en ${pos.sign} — hors chute et exil, favorable au rétablissement.`,
      detail_ar: afflicted
        ? `المشتري في ${pos.sign} — في هبوط أو ضرر؛ ضعف الدليل الكلاسيكي على الشفاء والقوة الحيوية.`
        : `المشتري في ${pos.sign} — خارج الهبوط والضرر، داعم للشفاء.`,
    };
  },
  { maxPoints: 8 },
);

const mercuryFreeOfAffliction = rule(
  'medical-mercury-free-of-affliction',
  { en: 'Mercury Free of Fall/Detriment (Diagnosis)', fr: 'Mercure hors chute/exil (diagnostic)', ar: 'عطارد خارج الهبوط والضرر (التشخيص)' },
  (ctx) => {
    const pos = ctx.positions.Mercury;
    const afflicted = isInFall('Mercury', pos.sign) || isInDetriment('Mercury', pos.sign);
    return {
      status: afflicted ? 'pass' : 'bonus',
      points: afflicted ? 0 : 4,
      detail_en: afflicted
        ? `Mercury is in ${pos.sign} — in fall or detriment; the significator of diagnosis and the physician's assessment is weakened.`
        : `Mercury is in ${pos.sign} — free of fall or detriment, supporting a clear diagnosis.`,
      detail_fr: afflicted
        ? `Mercure est en ${pos.sign} — en chute ou en exil ; le significateur du diagnostic et de l'évaluation du médecin est affaibli.`
        : `Mercure est en ${pos.sign} — hors chute et exil, favorable à un diagnostic clair.`,
      detail_ar: afflicted
        ? `عطارد في ${pos.sign} — في هبوط أو ضرر؛ ضعف دليل التشخيص وتقييم الطبيب.`
        : `عطارد في ${pos.sign} — خارج الهبوط والضرر، داعم لتشخيص واضح.`,
    };
  },
  { maxPoints: 4 },
);

const mercuryRetrograde = rule(
  'medical-mercury-retrograde',
  { en: 'Mercury Retrograde (Diagnosis)', fr: 'Mercure rétrograde (diagnostic)', ar: 'عطارد في الرجوع' },
  (ctx) => ctx.positions.Mercury.isRetrograde
    ? { status: 'penalty', points: -6, detail_en: 'Mercury is retrograde — increased risk of a delayed, incomplete, or revised diagnosis.', detail_fr: 'Mercure est rétrograde — risque accru de diagnostic retardé, incomplet ou révisé.', detail_ar: 'عطارد راجع — خطر متزايد لتشخيص متأخر أو ناقص أو يحتاج مراجعة.' }
    : { status: 'pass', points: 0, detail_en: 'Mercury is direct.', detail_fr: 'Mercure est direct.', detail_ar: 'عطارد مستقيم.' },
);

// Mirrors marriage.ts's makePlanetaryHourBonus / travel.ts's
// makeTravelPlanetaryHourBonus / business.ts's makeBusinessPlanetaryHourBonus:
// a factory closing over strictHourRuler at config-build time. Medical's
// favorable-hour planets are the Moon (the patient/body itself) and
// Jupiter (recovery/vital force).
function makeMedicalPlanetaryHourBonus(strict: boolean): Rule {
  return rule(
    'medical-planetary-hour',
    { en: 'Favorable Planetary Hour', fr: 'Heure planétaire favorable', ar: 'الساعة الفلكية الموافقة' },
    (ctx) => {
      const planet = ctx.planetaryHourPlanet;
      const favorable = planet === 'Moon' || planet === 'Jupiter';
      const planetFr: Record<string, string> = { Moon: 'la Lune', Jupiter: 'Jupiter' };
      const planetAr: Record<string, string> = { Moon: 'القمر', Jupiter: 'المشتري' };

      if (!favorable) {
        return { status: 'pass', points: 0, detail_en: 'This window is not in a Moon or Jupiter hour.', detail_fr: "Cette fenêtre ne se situe pas dans une heure de la Lune ou de Jupiter.", detail_ar: 'هذه الفترة ليست في ساعة القمر أو المشتري.' };
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
  'medical-day-of-week',
  { en: 'Day of the Week', fr: 'Jour de la semaine', ar: 'يوم الأسبوع' },
  (ctx) => {
    // Monday (Moon, the patient/body itself) and Thursday (Jupiter,
    // recovery/vital force) are the classical days most consistently
    // associated with this election's two core significators.
    if (ctx.dayOfWeek === 1) {
      return { status: 'bonus', points: 5, detail_en: 'Monday (day of the Moon) — favorable, as the Moon is the primary significator of the body.', detail_fr: 'Lundi (jour de la Lune) — favorable, la Lune étant le significateur principal du corps.', detail_ar: 'الاثنين (يوم القمر) — موافق، لأن القمر هو الدليل الرئيسي على الجسد.' };
    }
    if (ctx.dayOfWeek === 4) {
      return { status: 'bonus', points: 5, detail_en: 'Thursday (day of Jupiter) — favorable for recovery and vital force.', detail_fr: 'Jeudi (jour de Jupiter) — favorable au rétablissement et à la force vitale.', detail_ar: 'الخميس (يوم المشتري) — موافق للشفاء والقوة الحيوية.' };
    }
    return { status: 'pass', points: 0, detail_en: 'Not a day classically associated with favorable medical timing.', detail_fr: "Jour non associé de manière classique à un moment favorable pour un traitement.", detail_ar: 'يوم غير مرتبط تقليدياً بتوقيت علاجي موافق.' };
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

export const MEDICAL_ACCEPTABLE_THRESHOLD = 40;

function scoreToTier(score: number, hasHardFail: boolean): TierInfo {
  if (hasHardFail || score < 20) return TIERS.find(t => t.tier === 'avoid')!;
  if (score >= 80) return TIERS.find(t => t.tier === 'excellent')!;
  if (score >= 60) return TIERS.find(t => t.tier === 'good')!;
  if (score >= MEDICAL_ACCEPTABLE_THRESHOLD) return TIERS.find(t => t.tier === 'acceptable')!;
  return TIERS.find(t => t.tier === 'weak')!;
}

/**
 * Builds the medical election config. A function rather than a bare
 * object because makeMedicalPlanetaryHourBonus needs to close over
 * strictHourRuler at construction time.
 */
function buildMedicalElectionConfig(strictHourRuler: boolean): ElectionRulesConfig {
  const rules = [
    moonVoidOfCourse,
    moonCombust,
    moonMaleficHardAspect,
    moonWaxingForBuildingUp,
    moonApplyingToBenefic,
    jupiterDignified,
    mercuryFreeOfAffliction,
    mercuryRetrograde,
    makeMedicalPlanetaryHourBonus(strictHourRuler),
    dayOfWeekBonus,
  ];
  return {
    electionType: 'medical',
    rules,
    tiers: TIERS,
    scoreToTier,
    civilHoursRange: { startHour: 8, endHour: 20 },
    strictHourRuler,
    maxAchievable: () => computeMaxAchievable(rules),
  };
}

export const medicalElectionConfig: ElectionRulesConfig = buildMedicalElectionConfig(false);

/** SCHOLAR-REVIEW variant with strictHourRuler enabled — parallels marriage/travel/business's strict-hour-ruler configs; not wired into the UI. */
export const medicalElectionConfigStrictHourRuler: ElectionRulesConfig = buildMedicalElectionConfig(true);
