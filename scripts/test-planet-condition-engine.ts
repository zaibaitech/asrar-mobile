// Use require() to keep this script compatible with ts-node defaults in this repo.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { evaluatePlanetCondition } = require('../src/lib/astro/planetConditionEngine') as {
  evaluatePlanetCondition: (args: {
    planet: 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn';
    sign:
      | 'Aries'
      | 'Taurus'
      | 'Gemini'
      | 'Cancer'
      | 'Leo'
      | 'Virgo'
      | 'Libra'
      | 'Scorpio'
      | 'Sagittarius'
      | 'Capricorn'
      | 'Aquarius'
      | 'Pisces';
    degree: number;
  }) => {
    dignity: string;
    status: string;
    score: number;
    reasons: string[];
  };
};

type Case = {
  name: string;
  input: Parameters<typeof evaluatePlanetCondition>[0];
  expect: {
    dignity?: string;
    status?: string;
    scoreMin?: number;
    reasonsIncludes?: string[];
  };
};

const cases: Case[] = [
  {
    name: 'Sun in Libra => Fall => Avoid',
    input: { planet: 'Sun', sign: 'Libra', degree: 10 },
    expect: { dignity: 'Fall', status: 'Avoid' },
  },
  {
    name: 'Sun in Aries 19° => Exaltation peak => Favorable',
    input: { planet: 'Sun', sign: 'Aries', degree: 19 },
    expect: {
      dignity: 'Exaltation',
      status: 'Favorable',
      scoreMin: 6,
      reasonsIncludes: ['DEGREE_EXALTATION_PEAK_NEAR'],
    },
  },
  {
    name: 'Moon in Scorpio => Fall => Avoid',
    input: { planet: 'Moon', sign: 'Scorpio', degree: 12 },
    expect: { dignity: 'Fall', status: 'Avoid' },
  },
  {
    name: 'Venus in Pisces 27° => Exaltation peak => Favorable',
    input: { planet: 'Venus', sign: 'Pisces', degree: 27 },
    expect: {
      dignity: 'Exaltation',
      status: 'Favorable',
      scoreMin: 6,
      reasonsIncludes: ['DEGREE_EXALTATION_PEAK_NEAR'],
    },
  },
  {
    name: 'Mercury in Pisces => Fall => Avoid',
    input: { planet: 'Mercury', sign: 'Pisces', degree: 5 },
    expect: { dignity: 'Fall', status: 'Avoid' },
  },
  {
    name: 'Saturn in Libra 21° => Exaltation peak => Favorable',
    input: { planet: 'Saturn', sign: 'Libra', degree: 21 },
    expect: {
      dignity: 'Exaltation',
      status: 'Favorable',
      scoreMin: 6,
      reasonsIncludes: ['DEGREE_EXALTATION_PEAK_NEAR'],
    },
  },
  {
    name: 'Critical degree penalty triggers at 29°',
    input: { planet: 'Sun', sign: 'Leo', degree: 29 },
    expect: { reasonsIncludes: ['DEGREE_CRITICAL_TRANSITION'] },
  },
  {
    name: 'Critical degree penalty triggers below 1°',
    input: { planet: 'Sun', sign: 'Leo', degree: 0.5 },
    expect: { reasonsIncludes: ['DEGREE_CRITICAL_TRANSITION'] },
  },
];

function assert(condition: any, message: string) {
  if (!condition) throw new Error(message);
}

let passed = 0;
for (const c of cases) {
  const out = evaluatePlanetCondition(c.input);

  if (c.expect.dignity) {
    assert(out.dignity === c.expect.dignity, `${c.name}: dignity expected ${c.expect.dignity} got ${out.dignity}`);
  }
  if (c.expect.status) {
    assert(out.status === c.expect.status, `${c.name}: status expected ${c.expect.status} got ${out.status}`);
  }
  if (typeof c.expect.scoreMin === 'number') {
    assert(out.score >= c.expect.scoreMin, `${c.name}: score expected >= ${c.expect.scoreMin} got ${out.score}`);
  }
  if (c.expect.reasonsIncludes) {
    for (const key of c.expect.reasonsIncludes) {
      assert(out.reasons.includes(key as any), `${c.name}: reasons missing ${key} (got ${out.reasons.join(', ')})`);
    }
  }

  passed += 1;
}

console.log(`planetConditionEngine: ${passed}/${cases.length} cases passed`);
