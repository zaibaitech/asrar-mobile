/**
 * App-wide Abjad system: Maghribi by default, Mashriqi when the user switches,
 * every calculation follows the choice, and the choice persists.
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
// EphemerisService pulls in a native module (netinfo) Jest can't parse; letter
// totals don't use it.
jest.mock('../../services/EphemerisService', () => ({
  getPlanetPositions: jest.fn(),
  getPlanetPositionsPrecise: jest.fn(),
}));

import * as fs from 'fs';
import * as path from 'path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ABJAD_MAGHRIBI,
  ABJAD_MASHRIQI,
  DEFAULT_ABJAD_SYSTEM,
  abjadSystemOfMap,
  getAbjadMap,
  getActiveAbjadMap,
  getActiveAbjadSystem,
  resolveAbjadSystem,
  setActiveAbjadSystem,
  storedMashriqiValueForSystem,
  subscribeAbjadSystem,
  sumAbjad,
} from '../abjad-maps';
import {
  ABJAD_SYSTEM_STORAGE_KEY,
  hydrateAbjadSystem,
  setAbjadSystemPreference,
} from '../../services/AbjadSystemPreference';
import { calculateHadadKabir } from '../../utils/coreCalculations';
import { quickKabir } from '../../utils/abjad-unified-pipeline';
import { buildDestiny as buildNameDestiny } from '../../features/name-destiny/services/nameDestinyCalculator';
import { computeDivineResonance } from '../../features/name-destiny/services/divineResonance';
import { ABJAD_MASHRIQI as FEATURE_MASHRIQI } from '../../features/name-destiny/constants/abjadMaps';
import { ABJAD_MASHRIQI as CONTEXT_MASHRIQI } from '../../contexts/AbjadContext';
import { analyzeNameDestiny, buildDestiny as buildIlmDestiny } from '../../services/ilm-huruf/core';
import { calculateAbjadValue } from '../../services/ilm-huruf/abjad-calculator';
import { calculateIstikhara } from '../../services/istikhara/calculations';
import { recalculateIstikharaData } from '../../hooks/useIstikhara';
import {
  DIVINE_NAMES_COMPATIBILITY,
  getAllCompatibilityDivineNames,
  getNormalizedAbjadValue,
} from '../../services/compatibility/divineNamesData';
import { calculatePersonDivineNameCompatibility } from '../../services/compatibility/divineNameCompatibility';
import { DIVINE_NAMES, findDivineNamesByValue, getDivineNameByNumber, getDivineNamesForSystem } from '../../data/divine-names';
import { DIVINE_NAMES_PLANETARY, getDivineNamesPlanetary } from '../../data/divine-names-planetary';
import { ASMA_LIST, getAsmaList, ABJAD as HADAD_ABJAD } from '../../utils/hadad-core';
import { ABJAD as SUMMARY_ABJAD, getAsmaList as getSummaryAsmaList } from '../../components/hadad-summary/hadad-core';
import { computeNameInsights } from '../../services/InsightAdapters';
import { getUserAbjadResultFromProfile } from '../../services/UserAbjadService';
import { calculateManazilPersonalFromNames } from '../../services/ProfileDerivationService';

const ROOT = path.join(__dirname, '..', '..');
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

afterEach(() => setActiveAbjadSystem('maghribi'));

describe('helpers and default', () => {
  it('defaults to Maghribi', () => {
    expect(DEFAULT_ABJAD_SYSTEM).toBe('maghribi');
    expect(getActiveAbjadSystem()).toBe('maghribi');
    expect(getActiveAbjadMap()).toBe(ABJAD_MAGHRIBI);
    expect(resolveAbjadSystem(undefined)).toBe('maghribi');
    expect(resolveAbjadSystem('nonsense')).toBe('maghribi');
    expect(resolveAbjadSystem('Mashriqi')).toBe('mashriqi');
    expect(getAbjadMap('mashriqi')).toBe(ABJAD_MASHRIQI);
    expect(abjadSystemOfMap(ABJAD_MASHRIQI)).toBe('mashriqi');
    expect(abjadSystemOfMap(ABJAD_MAGHRIBI)).toBe('maghribi');
  });

  it('every copy of the tables is the one shared table', () => {
    expect(FEATURE_MASHRIQI).toBe(ABJAD_MASHRIQI);
    expect(CONTEXT_MASHRIQI).toBe(ABJAD_MASHRIQI);
    expect(HADAD_ABJAD).toBe(ABJAD_MAGHRIBI);
    expect(SUMMARY_ABJAD).toBe(ABJAD_MAGHRIBI);
  });

  it('notifies subscribers on a switch', () => {
    const seen: string[] = [];
    const off = subscribeAbjadSystem(() => seen.push(getActiveAbjadSystem()));
    setActiveAbjadSystem('mashriqi');
    setActiveAbjadSystem('mashriqi');
    setActiveAbjadSystem('maghribi');
    off();
    setActiveAbjadSystem('mashriqi');
    expect(seen).toEqual(['mashriqi', 'maghribi']);
  });
});

describe('persistence', () => {
  const memoryStorage = () => {
    const data = new Map<string, string>();
    return {
      data,
      getItem: async (k: string) => data.get(k) ?? null,
      setItem: async (k: string, v: string) => {
        data.set(k, v);
      },
    };
  };

  it('nothing saved -> Maghribi', async () => {
    const storage = memoryStorage();
    setActiveAbjadSystem('mashriqi');
    await expect(hydrateAbjadSystem(storage, true)).resolves.toBe('maghribi');
    expect(getActiveAbjadSystem()).toBe('maghribi');
  });

  it('saves the choice and restores it on the next launch', async () => {
    const storage = memoryStorage();
    await setAbjadSystemPreference('mashriqi', storage);
    expect(storage.data.get(ABJAD_SYSTEM_STORAGE_KEY)).toBe('mashriqi');
    setActiveAbjadSystem('maghribi'); // "restart"
    await expect(hydrateAbjadSystem(storage, true)).resolves.toBe('mashriqi');
    expect(getActiveAbjadMap()).toBe(ABJAD_MASHRIQI);
  });

  it('uses AsyncStorage by default and survives storage errors', async () => {
    await setAbjadSystemPreference('mashriqi');
    await expect(AsyncStorage.getItem(ABJAD_SYSTEM_STORAGE_KEY)).resolves.toBe('mashriqi');
    const broken = { getItem: async () => { throw new Error('x'); }, setItem: async () => { throw new Error('x'); } };
    await expect(setAbjadSystemPreference('maghribi', broken)).resolves.toBeUndefined();
    expect(getActiveAbjadSystem()).toBe('maghribi');
    await expect(hydrateAbjadSystem(broken, true)).resolves.toBe('maghribi');
    // An unknown saved value falls back to Maghribi.
    await AsyncStorage.setItem(ABJAD_SYSTEM_STORAGE_KEY, 'garbage');
    await expect(hydrateAbjadSystem(AsyncStorage, true)).resolves.toBe('maghribi');
  });
});

describe('switching updates every tool', () => {
  // يوسف: Maghribi 396 (س=300), Mashriqi 156 (س=60); حسن 358 / 118.
  const both = <T,>(fn: () => T): [T, T] => {
    setActiveAbjadSystem('maghribi');
    const a = fn();
    setActiveAbjadSystem('mashriqi');
    const b = fn();
    setActiveAbjadSystem('maghribi');
    return [a, b];
  };

  it('core letter totals (hadad kabir, unified pipeline, ilm al-huruf abjad)', () => {
    expect(both(() => calculateHadadKabir('يوسف'))).toEqual([396, 156]);
    expect(both(() => quickKabir('يوسف'))).toEqual([396, 156]);
    expect(both(() => calculateAbjadValue('حسن'))).toEqual([358, 118]);
    expect(both(() => sumAbjad('مُحَمَّد'))).toEqual([92, 92]);
  });

  it('Name Destiny (buildDestiny + divine resonance)', () => {
    const [m, e] = both(() => buildNameDestiny('يوسف', 'حسن'));
    expect([m.totalKabir, e.totalKabir]).toEqual([754, 274]);
    expect([m.abjadSystem, e.abjadSystem]).toEqual(['maghribi', 'mashriqi']);
    expect(both(() => computeDivineResonance('يوسف').total)).toEqual([396, 156]);
  });

  it('ilm al-huruf destiny', () => {
    const [m, e] = both(() => buildIlmDestiny('يوسف'));
    expect(m).not.toEqual(e);
    const [a, b] = both(() => JSON.stringify(analyzeNameDestiny('يوسف')));
    expect(a).not.toBe(b);
  });

  it('burj from name + mother (istikhara)', () => {
    const [m, e] = both(() => calculateIstikhara('يوسف', 'حسن'));
    expect([m.personTotal, m.motherTotal, m.combinedTotal]).toEqual([396, 358, 754]);
    expect([e.personTotal, e.motherTotal, e.combinedTotal]).toEqual([156, 118, 274]);
    const re = recalculateIstikharaData('يوسف', 'حسن', 'mashriqi');
    expect(re.combinedTotal).toBe(274);
    expect(re.abjadSystem).toBe('mashriqi');
  });

  it('compatibility: divine-name values and person ↔ divine name', () => {
    const sabur = (list: { number: number; abjadValue: number }[]) => list.find((n) => n.number === 99)!.abjadValue;
    // الصبور without ال: ص+ب+و+ر = Maghribi 268, Mashriqi 298
    expect(both(() => sabur(getAllCompatibilityDivineNames()))).toEqual([268, 298]);
    expect(sabur(DIVINE_NAMES_COMPATIBILITY)).toBe(268);
    expect(both(() => getNormalizedAbjadValue('الصبور'))).toEqual([268, 298]);
    const [m, e] = both(() => {
      const table = getActiveAbjadMap();
      const name = getAllCompatibilityDivineNames(table).find((n) => n.number === 99)!;
      return calculatePersonDivineNameCompatibility('Yusuf', 'يوسف', buildIlmDestiny('يوسف', undefined, table), name, table);
    });
    expect(JSON.stringify(m)).not.toBe(JSON.stringify(e));
  });

  it('person ↔ person compatibility (name method)', async () => {
    const { calculatePersonPersonCompatibilityMixed } = require('../../services/compatibility/engine');
    const run = () =>
      calculatePersonPersonCompatibilityMixed(
        { inputMethod: 'name', name: 'Yusuf', arabicName: 'يوسف' },
        { inputMethod: 'name', name: 'Hasan', arabicName: 'حسن' }
      );
    setActiveAbjadSystem('maghribi');
    const m = await run();
    setActiveAbjadSystem('mashriqi');
    const e = await run();
    expect(JSON.stringify(m)).not.toBe(JSON.stringify(e));
  });

  it('99 Names data: Mashriqi reproduces the stored values, Maghribi changes only the six letters', () => {
    const mash = getDivineNamesForSystem(ABJAD_MASHRIQI);
    expect(mash.map((n) => n.abjadValue)).toEqual(DIVINE_NAMES.map((n) => n.abjadValue));
    const magh = getDivineNamesForSystem(ABJAD_MAGHRIBI);
    const changed = magh.filter((n, i) => n.abjadValue !== DIVINE_NAMES[i].abjadValue).map((n) => n.number);
    const sixLetters = /[صضسظغش]/;
    expect(changed).toEqual(DIVINE_NAMES.filter((n) => sixLetters.test(n.arabic)).map((n) => n.number).filter((num) => {
      const n = DIVINE_NAMES.find((x) => x.number === num)!;
      return storedMashriqiValueForSystem(n.abjadValue, n.arabic, ABJAD_MAGHRIBI) !== n.abjadValue;
    }));
    expect(changed.length).toBeGreaterThan(10);
    // الصبور (99): ال + ص ب و ر
    expect(both(() => getDivineNameByNumber(99)!.abjadValue)).toEqual([329 - 30, 329]);
    expect(both(() => findDivineNamesByValue(299).some((n) => n.number === 99))).toEqual([true, false]);
  });

  it('planetary Names and dhikr list follow the system', () => {
    expect(getDivineNamesPlanetary(ABJAD_MASHRIQI)).toEqual(DIVINE_NAMES_PLANETARY);
    const sabur = (l: typeof DIVINE_NAMES_PLANETARY) => l.find((n) => n.number === 99)!;
    expect(both(() => sabur(getDivineNamesPlanetary()).abjadValue)).toEqual([268, 298]);
    expect(sabur(getDivineNamesPlanetary(ABJAD_MAGHRIBI)).reduction).toBe(7); // 268 -> 16 -> 7
    expect(getAsmaList(ABJAD_MASHRIQI)).toEqual(ASMA_LIST);
    const asmaSabur = (l: typeof ASMA_LIST) => l.find((n) => n.transliteration === 'Yā Ṣabūr')!;
    expect(both(() => asmaSabur(getAsmaList()).abjad)).toEqual([268, 298]);
    expect(asmaSabur(getAsmaList(ABJAD_MAGHRIBI)).counts).toEqual([268, 500]);
    expect(both(() => getSummaryAsmaList().find((n) => n.transliteration === 'Yā Ṣabūr')!.abjad)).toEqual([268, 298]);
  });

  it('calculator engine and name insights', async () => {
    const { EnhancedCalculatorEngine } = require('../../services/EnhancedCalculatorEngine');
    const m = await EnhancedCalculatorEngine.calculate({ type: 'name', arabicInput: 'يوسف', system: 'maghribi' });
    const e = await EnhancedCalculatorEngine.calculate({ type: 'name', arabicInput: 'يوسف', system: 'mashriqi' });
    expect([m.core.kabir, e.core.kabir]).toEqual([396, 156]);
    const core = { kabir: 53, saghir: 2, hadadMod4: 3, burj: '', element: 'fire', sirr: 0, wusta: 0, kamal: 0, bast: 0 } as any;
    const analytics = { letterFreq: {}, elementPercents: {}, dominantElement: 'fire', weakElement: null, balanceScore: 0 } as any;
    const [a, b] = both(() => computeNameInsights(core, analytics).divineNameConnection.map((n) => n.value));
    expect(a).toEqual(findDivineNamesByValue(53, 50, ABJAD_MAGHRIBI).slice(0, 3).map((n) => n.abjadValue));
    expect(b).toEqual(findDivineNamesByValue(53, 50, ABJAD_MASHRIQI).slice(0, 3).map((n) => n.abjadValue));
    expect(b).not.toEqual(a);
  });

  it('profile-based tools (user abjad, personal manzil)', () => {
    const profile = { nameAr: 'يوسف', motherName: 'حسن' } as any;
    expect(both(() => getUserAbjadResultFromProfile(profile)!.kabir)).toEqual([754, 274]);
    const [m, e] = both(() => calculateManazilPersonalFromNames('يوسف', 'حسن'));
    expect(m).not.toBe(e);
  });
});

describe('inventory guards', () => {
  it('no other Abjad table in the app source', () => {
    const dirs = ['app', 'components', 'constants', 'contexts', 'data', 'features', 'hooks', 'services', 'utils', 'scripts'];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
        const rel = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== '__tests__' && entry.name !== 'node_modules') walk(rel);
        } else if (/\.(ts|tsx)$/.test(entry.name) && rel !== path.join('constants', 'abjad-maps.ts')) {
          if (/['"]?غ['"]?\s*:\s*(900|1000)\b/.test(fs.readFileSync(path.join(ROOT, rel), 'utf8'))) offenders.push(rel);
        }
      }
    };
    dirs.forEach(walk);
    expect(offenders).toEqual([]);
  });

  it('every calculator screen shows the shared selector and uses the app-wide system', () => {
    for (const rel of [
      'components/calculator/CalculatorInput.tsx',
      'app/(tabs)/name-destiny/form.tsx',
      'app/name-destiny/form.tsx',
      'features/name-destiny/screens/HomeScreen.tsx',
      'app/(tabs)/who-am-i.tsx',
      'app/(tabs)/compatibility.tsx',
    ]) {
      expect(read(rel)).toMatch(/<AbjadSystemSelector\b/);
    }
    expect(read('app/calculator.tsx')).toMatch(/useAbjadSystem\(\)/);
    expect(read('app/calculator.tsx')).not.toMatch(/useState<'maghribi' \| 'mashriqi'>/);
    expect(read('features/name-destiny/contexts/AbjadContext.tsx')).toMatch(/useAbjadSystem\(\)/);
    expect(read('app/_layout.tsx')).toMatch(/hydrateAbjadSystem\(\)/);
    expect(read('contexts/ProfileContext.tsx')).toMatch(/subscribeAbjadSystem\(/);
  });

  it('the note is translated in EN/FR/AR', () => {
    const { translations } = require('../translations');
    expect(translations.en.calculator.abjad.systemNote).toBe('Maghribi (North & West Africa) · Mashriqi (Middle East & Asia)');
    expect(translations.fr.calculator.abjad.systemNote).toMatch(/Afrique du Nord/);
    expect(translations.ar.calculator.abjad.systemNote).toMatch(/المغربي/);
  });
});
