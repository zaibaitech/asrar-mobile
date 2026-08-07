/**
 * Home / Construction (laying a foundation, starting building work, or
 * moving into a new residence) election rules config.
 * Ported verbatim (ids, points, maxPoints, conditions, EN/FR copy) from
 * asrar.app's src/lib/ikhtiyarat/elections/home.ts. `detail_ar` on every
 * rule is a NEW field — DRAFT translations, needs native/scholarly
 * review before shipping (the source only ships detail_en/detail_fr).
 *
 * Classical significators, per William Lilly's Christian Astrology (Book
 * I) and Guido Bonatti's 4th-house elections chapter (translated by
 * Benjamin Dykes) — both treat this as a 4th-house matter with Saturn as
 * its natural/classical significator (Saturn governs land, foundations,
 * and permanence), and both cite the same core principle: fixed signs
 * (Taurus, Leo, Scorpio, Aquarius) show stability and are preferred for
 * foundations/buildings meant to endure, the mirror image of travel.ts's
 * own modality rule where fixed signs are instead a caution (delay).
 * Saturn's own essential dignity matters here more directly than in any
 * other election in this feature, since Saturn is the significator of
 * the matter itself, not merely a malefic to avoid afflicting the Moon.
 */

import { ElectionRulesConfig, Rule, RuleContext, RuleResult, TierInfo } from '../types';
import { ZodiacSign } from '../ephemeris';
import { isInFall, isInDetriment } from '../dignitiesLite';
import { computeMaxAchievable } from '../engine';
import { getSeparation } from '../aspects';

// SCHOLAR-REVIEW: modality classification for foundations/buildings, per
// William Lilly's Christian Astrology Book I — fixed (Taurus, Leo,
// Scorpio, Aquarius) signs show stability and are preferred so "the
// thing shall continue"; movable/cardinal signs incline the opposite way
// here (impermanence) — the reverse of travel.ts's own modality rule.
const FIXED_SIGNS: ZodiacSign[] = ['taurus', 'leo', 'scorpio', 'aquarius'];
const MOVABLE_SIGNS: ZodiacSign[] = ['aries', 'cancer', 'libra', 'capricorn'];

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
  'home-moon-void-of-course',
  { en: 'Moon Void of Course (Khāliya al-Sayr)', fr: 'Lune vide de course', ar: 'خالية السير' },
  (ctx) => {
    const voc = ctx.applyingAspects.length === 0;
    return {
      status: voc ? 'hardfail' : 'pass',
      points: 0,
      detail_en: voc
        ? 'Moon has no applying aspect before leaving its current sign — void of course, work begun now tends to come to nothing.'
        : 'Moon has at least one applying aspect — not void of course.',
      detail_fr: voc
        ? "La Lune n'a aucun aspect en application avant de quitter son signe — vide de course, un ouvrage commencé maintenant tend à n'aboutir à rien."
        : "La Lune a au moins un aspect en application — pas vide de course.",
      detail_ar: voc
        ? 'لا يطبّق القمر أي جانب قبل مغادرة برجه — خالية السير، عمل يبدأ الآن يميل إلى عدم الاكتمال.'
        : 'يطبّق القمر جانباً واحداً على الأقل — ليست خالية السير.',
    };
  },
);

const moonCombust = rule(
  'home-moon-combust',
  { en: 'Moon Combust (Muḥtaraq)', fr: 'Lune combuste (Muḥtaraq)', ar: 'احتراق القمر' },
  (ctx) => {
    const combust = ctx.moonSunSeparation <= 8.5;
    const sep = ctx.moonSunSeparation.toFixed(1);
    return {
      status: combust ? 'hardfail' : 'pass',
      points: 0,
      detail_en: combust
        ? `Moon is ${sep}° from the Sun — combust (muḥtaraq); the matter's own significator is weakened.`
        : `Moon is ${sep}° from the Sun — not combust.`,
      detail_fr: combust
        ? `La Lune est à ${sep}° du Soleil — combuste (muḥtaraq) ; le significateur de l'affaire elle-même est affaibli.`
        : `La Lune est à ${sep}° du Soleil — non combuste.`,
      detail_ar: combust
        ? `القمر على بعد ${sep}° من الشمس — محترق؛ ضعف دليل الأمر نفسه.`
        : `القمر على بعد ${sep}° من الشمس — غير محترق.`,
    };
  },
);

const moonMaleficHardAspect = rule(
  'home-moon-malefic-hard-aspect',
  { en: 'Moon Applying to Mars (Hard Aspect)', fr: 'Lune appliquant à Mars (aspect dur)', ar: 'تطبيق القمر بالمريخ' },
  (ctx) => {
    // Saturn is excluded from this hard-aspect caution, unlike every other
    // election in this feature — here Saturn is the matter's own
    // significator (see saturnDignified below), not an external malefic.
    const hit = ctx.applyingAspects.find(
      a => a.planet === 'Mars' && (a.aspect === 'square' || a.aspect === 'opposition'),
    );
    const aspectAr: Record<string, string> = { square: 'التربيع', opposition: 'التقابل' };
    return {
      status: hit ? 'hardfail' : 'pass',
      points: 0,
      detail_en: hit
        ? `Moon applying to a ${hit.aspect} with Mars, orb ${hit.orb.toFixed(1)}° — traditionally warns of accident, damage, or fire risk during construction.`
        : 'Moon is not applying to a hard aspect with Mars.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'square' ? 'carré' : 'opposition'} avec Mars, orbe ${hit.orb.toFixed(1)}° — avertit traditionnellement d'un accident, de dommages, ou d'un risque d'incendie pendant la construction.`
        : "La Lune n'applique pas d'aspect dur à Mars.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع المريخ، بعد ${hit.orb.toFixed(1)}° — ينذر تقليدياً بحادث أو ضرر أو خطر حريق أثناء البناء.`
        : 'لا يطبّق القمر جانباً قاسياً مع المريخ.',
    };
  },
);

// ============================================================================
// PENALTIES / BONUSES
// ============================================================================

const moonModality = rule(
  'home-moon-modality',
  { en: 'Moon Sign Modality (Fixed/Movable)', fr: 'Modalité du signe lunaire (fixe/mobile)', ar: 'طبيعة برج القمر (ثابت أو منقلب)' },
  (ctx) => {
    const sign = ctx.positions.Moon.sign;
    if (FIXED_SIGNS.includes(sign)) {
      return {
        status: 'bonus',
        points: 12,
        detail_en: `Moon in ${sign} — a fixed sign (burj thābit); fixed signs show stability, favoring a foundation or building meant to endure. [SCHOLAR-REVIEW]`,
        detail_fr: `Lune en ${sign} — un signe fixe (burj thābit) ; les signes fixes montrent la stabilité, favorables à une fondation ou une construction destinée à durer. [À VÉRIFIER PAR UN SAVANT]`,
        detail_ar: `القمر في ${sign} — برج ثابت؛ الأبراج الثابتة تُظهر الاستقرار، موافقة لأساس أو بناء يُراد له الدوام. [يحتاج مراجعة علمية]`,
      };
    }
    if (MOVABLE_SIGNS.includes(sign)) {
      return {
        status: 'penalty',
        points: -8,
        detail_en: `Moon in ${sign} — a movable sign; movable signs incline to impermanence, the opposite of what a foundation calls for. [SCHOLAR-REVIEW]`,
        detail_fr: `Lune en ${sign} — un signe mobile ; les signes mobiles inclinent à l'impermanence, l'inverse de ce qu'exige une fondation. [À VÉRIFIER PAR UN SAVANT]`,
        detail_ar: `القمر في ${sign} — برج منقلب؛ الأبراج المنقلبة تميل إلى عدم الثبات، عكس ما يتطلبه الأساس. [يحتاج مراجعة علمية]`,
      };
    }
    return {
      status: 'pass',
      points: 0,
      detail_en: `Moon in ${sign} — a mutable sign, neutral for this purpose.`,
      detail_fr: `Lune en ${sign} — un signe mutable, neutre pour cet usage.`,
      detail_ar: `القمر في ${sign} — برج ذو طبيعة مزدوجة، محايد لهذا الغرض.`,
    };
  },
  { maxPoints: 12 },
);

const moonWaxingIncreasingLight = rule(
  'home-moon-waxing',
  { en: 'Moon Waxing, Increasing in Light', fr: 'Lune croissante, en augmentation de lumière', ar: 'القمر في الزيادة' },
  (ctx) => {
    const waxing = ctx.moonPhaseDirection === 'waxing';
    return {
      status: waxing ? 'bonus' : 'pass',
      points: waxing ? 8 : 0,
      detail_en: waxing
        ? `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waxing, growing in light; favorable for building and growing a household.`
        : `Moon elongation ${ctx.moonElongation.toFixed(1)}° — waning.`,
      detail_fr: waxing
        ? `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — croissante, en augmentation de lumière ; favorable pour bâtir et faire grandir un foyer.`
        : `Élongation lunaire ${ctx.moonElongation.toFixed(1)}° — décroissante.`,
      detail_ar: waxing
        ? `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في الزيادة؛ موافق للبناء وتنمية الأسرة.`
        : `إبعاد القمر ${ctx.moonElongation.toFixed(1)}° — في النقصان.`,
    };
  },
  { maxPoints: 8 },
);

const moonApplyingToBenefic = rule(
  'home-moon-applying-to-benefic',
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
        ? `Moon applying to a ${hit.aspect} with ${hit.planet}, orb ${hit.orb.toFixed(1)}° — a settled, well-supported household.`
        : 'Moon is not applying to a favorable aspect with Venus or Jupiter.',
      detail_fr: hit
        ? `Lune appliquant à un(e) ${hit.aspect === 'trine' ? 'trigone' : hit.aspect === 'sextile' ? 'sextile' : 'conjonction'} avec ${hit.planet}, orbe ${hit.orb.toFixed(1)}° — un foyer stable et bien soutenu.`
        : "La Lune n'applique pas d'aspect favorable à Vénus ou Jupiter.",
      detail_ar: hit
        ? `القمر يطبّق ${aspectAr[hit.aspect] ?? hit.aspect} مع ${hit.planet}، بعد ${hit.orb.toFixed(1)}° — أسرة مستقرة وذات دعم جيد.`
        : 'لا يطبّق القمر جانباً موافقاً مع الزهرة أو المشتري.',
    };
  },
  { maxPoints: 10 },
);

// Saturn is the classical significator of this matter itself (land,
// foundations, permanence), not merely an external malefic, so its own
// essential dignity is scored directly.
const saturnDignified = rule(
  'home-saturn-dignified',
  { en: 'Saturn Dignified (Domicile)', fr: 'Saturne dignifié (domicile)', ar: 'زحل في شرف' },
  (ctx) => {
    const sign = ctx.positions.Saturn.sign;
    if (sign === 'capricorn' || sign === 'aquarius') {
      return {
        status: 'bonus',
        points: 10,
        detail_en: `Saturn in ${sign} — domicile; strong for foundations, land, and permanence, the classical significators of this matter.`,
        detail_fr: `Saturne en ${sign} — domicile ; favorable aux fondations, au terrain, et à la permanence, les significateurs classiques de cette affaire.`,
        detail_ar: `زحل في ${sign} — بيت؛ قوي للأساسات والأرض والدوام، الدلالات الكلاسيكية لهذا الأمر.`,
      };
    }
    return { status: 'pass', points: 0, detail_en: 'Saturn has no domicile bonus in this sign.', detail_fr: "Saturne ne bénéficie d'aucun domicile dans ce signe.", detail_ar: 'لا يحظى زحل ببيته في هذا البرج.' };
  },
  { maxPoints: 10 },
);

const saturnFreeOfAffliction = rule(
  'home-saturn-free-of-affliction',
  { en: 'Saturn Free of Fall/Detriment', fr: 'Saturne hors chute/exil', ar: 'زحل خارج الهبوط والضرر' },
  (ctx) => {
    const pos = ctx.positions.Saturn;
    const afflicted = isInFall('Saturn', pos.sign) || isInDetriment('Saturn', pos.sign);
    return {
      status: afflicted ? 'pass' : 'bonus',
      points: afflicted ? 0 : 4,
      detail_en: afflicted
        ? `Saturn is in ${pos.sign} — in fall or detriment; the significator of the foundation itself is weakened.`
        : `Saturn is in ${pos.sign} — free of fall or detriment.`,
      detail_fr: afflicted
        ? `Saturne est en ${pos.sign} — en chute ou en exil ; le significateur de la fondation elle-même est affaibli.`
        : `Saturne est en ${pos.sign} — hors chute et exil.`,
      detail_ar: afflicted
        ? `زحل في ${pos.sign} — في هبوط أو ضرر؛ ضعف دليل الأساس نفسه.`
        : `زحل في ${pos.sign} — خارج الهبوط والضرر.`,
    };
  },
  { maxPoints: 4 },
);

const saturnRetrograde = rule(
  'home-saturn-retrograde',
  { en: 'Saturn Retrograde', fr: 'Saturne rétrograde', ar: 'زحل في الرجوع' },
  (ctx) => ctx.positions.Saturn.isRetrograde
    ? { status: 'penalty', points: -8, detail_en: 'Saturn is retrograde — increased risk of delays, cost overruns, or rework during construction.', detail_fr: 'Saturne est rétrograde — risque accru de retards, de dépassements de coûts, ou de reprises pendant la construction.', detail_ar: 'زحل راجع — خطر متزايد للتأخيرات أو تجاوز التكاليف أو إعادة العمل أثناء البناء.' }
    : { status: 'pass', points: 0, detail_en: 'Saturn is direct.', detail_fr: 'Saturne est directe.', detail_ar: 'زحل مستقيم.' },
);

// Mirrors marriage.ts's makePlanetaryHourBonus / travel.ts's
// makeTravelPlanetaryHourBonus / business.ts's makeBusinessPlanetaryHourBonus
// / medical.ts's makeMedicalPlanetaryHourBonus: a factory closing over
// strictHourRuler at config-build time. Home's favorable-hour planets are
// Saturn (foundations/permanence) and Jupiter (a supportive benefic).
function makeHomePlanetaryHourBonus(strict: boolean): Rule {
  return rule(
    'home-planetary-hour',
    { en: 'Favorable Planetary Hour', fr: 'Heure planétaire favorable', ar: 'الساعة الفلكية الموافقة' },
    (ctx) => {
      const planet = ctx.planetaryHourPlanet;
      const favorable = planet === 'Saturn' || planet === 'Jupiter';
      const planetFr: Record<string, string> = { Saturn: 'Saturne', Jupiter: 'Jupiter' };
      const planetAr: Record<string, string> = { Saturn: 'زحل', Jupiter: 'المشتري' };

      if (!favorable) {
        return { status: 'pass', points: 0, detail_en: 'This window is not in a Saturn or Jupiter hour.', detail_fr: "Cette fenêtre ne se situe pas dans une heure de Saturne ou de Jupiter.", detail_ar: 'هذه الفترة ليست في ساعة زحل أو المشتري.' };
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
  'home-day-of-week',
  { en: 'Day of the Week', fr: 'Jour de la semaine', ar: 'يوم الأسبوع' },
  (ctx) => {
    // Saturday (Saturn, foundations/permanence) and Thursday (Jupiter,
    // a supportive benefic) are the classical days most associated with
    // this election's two significators.
    if (ctx.dayOfWeek === 6) {
      return { status: 'bonus', points: 5, detail_en: 'Saturday (day of Saturn) — favorable for foundations and lasting structures.', detail_fr: 'Samedi (jour de Saturne) — favorable aux fondations et aux structures durables.', detail_ar: 'السبت (يوم زحل) — موافق للأساسات والهياكل الدائمة.' };
    }
    if (ctx.dayOfWeek === 4) {
      return { status: 'bonus', points: 5, detail_en: 'Thursday (day of Jupiter) — favorable for a settled, supported household.', detail_fr: 'Jeudi (jour de Jupiter) — favorable à un foyer stable et soutenu.', detail_ar: 'الخميس (يوم المشتري) — موافق لأسرة مستقرة ومدعومة.' };
    }
    return { status: 'pass', points: 0, detail_en: 'Not a day classically associated with favorable building or moving.', detail_fr: "Jour non associé de manière classique à une construction ou un déménagement favorable.", detail_ar: 'يوم غير مرتبط تقليدياً بالبناء أو الانتقال الموافق.' };
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

export const HOME_ACCEPTABLE_THRESHOLD = 40;

function scoreToTier(score: number, hasHardFail: boolean): TierInfo {
  if (hasHardFail || score < 20) return TIERS.find(t => t.tier === 'avoid')!;
  if (score >= 80) return TIERS.find(t => t.tier === 'excellent')!;
  if (score >= 60) return TIERS.find(t => t.tier === 'good')!;
  if (score >= HOME_ACCEPTABLE_THRESHOLD) return TIERS.find(t => t.tier === 'acceptable')!;
  return TIERS.find(t => t.tier === 'weak')!;
}

/**
 * Builds the home election config. A function rather than a bare object
 * because makeHomePlanetaryHourBonus needs to close over strictHourRuler
 * at construction time.
 */
function buildHomeElectionConfig(strictHourRuler: boolean): ElectionRulesConfig {
  const rules = [
    moonVoidOfCourse,
    moonCombust,
    moonMaleficHardAspect,
    moonModality,
    moonWaxingIncreasingLight,
    moonApplyingToBenefic,
    saturnDignified,
    saturnFreeOfAffliction,
    saturnRetrograde,
    makeHomePlanetaryHourBonus(strictHourRuler),
    dayOfWeekBonus,
  ];
  return {
    electionType: 'home',
    rules,
    tiers: TIERS,
    scoreToTier,
    civilHoursRange: { startHour: 8, endHour: 20 },
    strictHourRuler,
    maxAchievable: () => computeMaxAchievable(rules),
  };
}

export const homeElectionConfig: ElectionRulesConfig = buildHomeElectionConfig(false);

/** SCHOLAR-REVIEW variant with strictHourRuler enabled — parallels marriage/travel/business/medical's strict-hour-ruler configs; not wired into the UI. */
export const homeElectionConfigStrictHourRuler: ElectionRulesConfig = buildHomeElectionConfig(true);
