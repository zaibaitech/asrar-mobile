import type { Planet } from '@/services/PlanetaryHoursService';

export type DailyPracticeStatus = 'nashr' | 'neutral' | 'restricted';

export interface PracticeLine {
  key: string;
  params?: Record<string, string>;
}

export interface SpiritualPracticeGuidance {
  recommendedToday: PracticeLine[];
  betterToWaitFor: PracticeLine[];
}

function dayLabelKeyForPlanet(planet: Planet): 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' {
  const map: Record<Planet, 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = {
    Sun: 'Sunday',
    Moon: 'Monday',
    Mars: 'Tuesday',
    Mercury: 'Wednesday',
    Jupiter: 'Thursday',
    Venus: 'Friday',
    Saturn: 'Saturday',
  };
  return map[planet];
}

function listUnique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function buildSpiritualPracticeGuidance(input: {
  status: DailyPracticeStatus;
  dayRuler: Planet;
  userPlanet?: Planet;
  /** Localized day name resolver. Pass `t('home.dailyGuidanceDetails.days.Sunday')`, etc. */
  dayName: (dayKey: ReturnType<typeof dayLabelKeyForPlanet>) => string;
}): SpiritualPracticeGuidance {
  const { status, dayRuler, userPlanet, dayName } = input;

  const matchesDayCurrent = !!userPlanet && userPlanet === dayRuler;

  const nashrDays: Planet[] = ['Moon', 'Venus', 'Jupiter'];
  const isNashrDayByRuler = nashrDays.includes(dayRuler);
  const isRestrictedByRuler = dayRuler === 'Mars' || dayRuler === 'Saturn';

  const resolvedStatus: DailyPracticeStatus =
    status === 'restricted' || isRestrictedByRuler
      ? 'restricted'
      : status === 'nashr' || isNashrDayByRuler
        ? 'nashr'
        : 'neutral';

  const recommended: PracticeLine[] = [];
  const waitFor: PracticeLine[] = [];

  if (resolvedStatus === 'restricted') {
    recommended.push(
      { key: 'dailyEnergy.spiritualPractice.items.grounding' },
      { key: 'dailyEnergy.spiritualPractice.items.protection' },
      { key: 'dailyEnergy.spiritualPractice.items.repentance' },
      { key: 'dailyEnergy.spiritualPractice.items.discipline' }
    );

    if (matchesDayCurrent) {
      recommended.push({ key: `dailyEnergy.spiritualPractice.matchItems.${dayRuler.toLowerCase()}` });
      recommended.push({ key: 'dailyEnergy.spiritualPractice.items.controlledCaution' });
    } else {
      recommended.push({ key: 'dailyEnergy.spiritualPractice.items.silence' });
    }

    // Avoid: love/attraction/expansion/emotional opening.
    waitFor.push(
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.loveAttraction',
        params: { days: [dayName('Friday'), dayName('Monday')].join(' / ') },
      },
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.expansionBigAsks',
        params: { days: dayName('Thursday') },
      },
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.deepEmotionalOpening',
        params: { days: dayName('Monday') },
      }
    );
  } else if (resolvedStatus === 'nashr') {
    recommended.push(
      { key: 'dailyEnergy.spiritualPractice.items.supportiveDhikr' },
      { key: 'dailyEnergy.spiritualPractice.items.openingDua' },
      { key: 'dailyEnergy.spiritualPractice.items.goodIntention' },
      { key: 'dailyEnergy.spiritualPractice.items.charity' }
    );

    if (matchesDayCurrent) {
      recommended.push({ key: `dailyEnergy.spiritualPractice.matchItems.${dayRuler.toLowerCase()}` });
      recommended.push({ key: 'dailyEnergy.spiritualPractice.items.controlledCaution' });
    } else {
      recommended.push({ key: 'dailyEnergy.spiritualPractice.items.reconciliation' });
    }

    // In open days: discourage harshness and overreach.
    waitFor.push(
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.hardConfrontation',
        params: { days: [dayName('Saturday'), dayName('Tuesday')].join(' / ') },
      },
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.overStrictVows',
        params: { days: dayName('Saturday') },
      }
    );
  } else {
    // Neutral day
    recommended.push(
      { key: 'dailyEnergy.spiritualPractice.items.cleanIntention' },
      { key: 'dailyEnergy.spiritualPractice.items.modestDhikr' },
      { key: 'dailyEnergy.spiritualPractice.items.fulfillDuties' },
      { key: 'dailyEnergy.spiritualPractice.items.shortDua' }
    );

    if (matchesDayCurrent) {
      recommended.push({ key: `dailyEnergy.spiritualPractice.matchItems.${dayRuler.toLowerCase()}` });
      recommended.push({ key: 'dailyEnergy.spiritualPractice.items.controlledCaution' });
    } else {
      recommended.push({ key: 'dailyEnergy.spiritualPractice.items.gratitude' });
    }

    waitFor.push(
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.heavyEmotionalWork',
        params: { days: [dayName('Monday'), dayName('Friday')].join(' / ') },
      },
      {
        key: 'dailyEnergy.spiritualPractice.waitItems.bigExpansion',
        params: { days: dayName('Thursday') },
      }
    );
  }

  const recommendedToday = listUnique(recommended).slice(0, 5);
  const betterToWaitFor = listUnique(waitFor);

  return { recommendedToday, betterToWaitFor };
}
