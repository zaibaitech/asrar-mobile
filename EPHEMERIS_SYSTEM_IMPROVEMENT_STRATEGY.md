# EPHEMERIS SYSTEM IMPROVEMENT STRATEGY

**Date:** January 27, 2026  
**Context:** Following audit of MOMENT_ALIGNMENT_AUDIT_REPORT.md and ephemeris accuracy verification  
**Goal:** Build authoritative, verifiable planetary position system  

---

## CURRENT STATE → DESIRED STATE

### Current Implementation

```
EphemerisService.ts
├─ Attempts JPL Horizons API (network-dependent)
├─ Falls back to EphemerisDataCache (sparse, inaccurate)
├─ Falls back to generateSyntheticPositions() (mathematical approximation)
└─ Result: Unreliable, varying accuracy

EphemerisDataCache.ts
├─ Only 4 data points for all of January 2026 (Jan 1, 2, 3, 25)
├─ Uses simple linear interpolation (inaccurate for planets)
├─ No retrograde flags
├─ No dignity/condition data
└─ Result: Significant errors for dates without exact cache entries
```

**Problem:** System has 3 fallback layers, each with accuracy issues.

### Desired Implementation

```
EphemerisService.ts (Enhanced)
├─ JPL Horizons API (network with smart caching)
├─ Comprehensive embedded cache (covers all of 2026-2027)
├─ Fallback to mathematical model (if data unavailable)
└─ Result: Reliable, high-accuracy positions

EphemerisDataCache.ts (Authoritative)
├─ Daily positions for all of 2026-2027
├─ Verified against multiple sources
├─ Includes retrograde status
├─ Includes planetary dignity/condition
├─ Includes aspect tracking
└─ Result: Accurate, complete, verifiable

PlanetaryConditionModule.ts (NEW)
├─ Planetary dignity assessment
├─ Aspect calculations
├─ Retrograde detection
├─ Combustion/beams detection
├─ Speed analysis
└─ Result: Authentic medieval astrological analysis
```

**Benefit:** Consistent high-accuracy system with multiple validation layers.

---

## PHASE 1: COMPLETE EPHEMERIS CACHE (Current)

### Objective
Build a comprehensive, verified ephemeris database covering all of 2026-2027.

### Why This First
- **Quick win:** Fixes immediate accuracy issues
- **Foundational:** Required for other modules
- **Verifiable:** Can be validated against authoritative sources
- **Offline capable:** App works without internet

### Implementation

#### Step 1A: Fill Gaps for January 2026

**Status:** ✅ DONE (Jan 26-28 added)

**Still needed:** Jan 4-24, 29-31

```typescript
// Add these to EPHEMERIS_2026_JAN:
'2026-01-04' through '2026-01-31'
```

Data points needed: 28 more days (we have 3 done)

#### Step 1B: Extend to Full Year 2026

Add daily positions for:
- February 2026 (28 days)
- March 2026 (31 days)
- ... through December 2026 (31 days)

**Total days needed:** 365 - 3 existing = 362 new entries

#### Step 1C: Add 2027 (Next Year)

**Total days needed:** 365 more entries

#### Step 1D: Add Retrograde Flags

Extend PlanetPosition type:

```typescript
interface PlanetPosition {
  planet: PlanetId;
  longitude: number;
  sign: number;
  signDegree: number;
  
  // NEW FIELDS:
  retrograde?: boolean;           // Is planet retrograde?
  retrogradeFromDate?: string;    // When retrograde started
  retrogradeUntilDate?: string;   // When retrograde ends
  speed?: number;                  // Degrees per day
}
```

Critical retrograde periods for 2026:

```
Mercury Retrograde:
- Jan 8-28, 2026
- Apr 26-May 17, 2026
- Aug 25-Sep 16, 2026
- Dec 13-Jan 2, 2027

Venus Retrograde:
- None in 2026 (Venus retrograde is rare: ~243 days every 19 months)

Mars Retrograde:
- None in 2026 (Mars retrograde every 2 years: next is Oct-Dec 2028)

Jupiter Retrograde:
- Jun 20-Nov 5, 2026

Saturn Retrograde:
- Jun 6-Oct 18, 2026
```

#### Step 1E: Data Sources

Use these verified sources in order of preference:

1. **JPL Horizons API** (Most authoritative)
   - NASA/JPL official astronomical data
   - Accuracy: ±0.01°
   - Coverage: Any date
   - Cost: Free
   - Endpoint: https://ssd.jpl.nasa.gov/api/horizons.api

2. **Swiss Ephemeris** (Professional standard)
   - Used by professional astrologers
   - Accuracy: ±0.01°
   - Coverage: Full year
   - Tool: astro.com (free calculator)

3. **Astrodienst Tables** (Verifiable)
   - Free online ephemeris
   - Accuracy: ±0.1°
   - Coverage: Full year
   - Source: astro.com

4. **Cafe Astrology** (Cross-verification)
   - Free online calculator
   - Accuracy: ±0.5°
   - Coverage: Full year

### Validation Process

For each date added to cache:

```
1. Get positions from JPL Horizons API
2. Get positions from Astrodienst calculator
3. Compare both (must be within ±0.5°)
4. If discrepancy > 0.5°: investigate why
5. Use Horizons as authoritative
6. Cross-check with Cafe Astrology
7. Document source and timestamp
8. Add retrograde flags from authoritative source
9. Update cache
10. Commit with verification message
```

### Estimated Effort

- **Data collection:** 2-4 hours (can be automated via API)
- **Validation:** 2-3 hours (spot-checking key dates)
- **Implementation:** 1-2 hours (updating data structure)
- **Total:** 5-9 hours

---

## PHASE 2: PLANETARY CONDITION MODULE (Next)

### Objective
Analyze planetary dignity, aspects, and condition—essential for authentic timing.

### Why After Phase 1
- Requires accurate positions (Phase 1 provides)
- Builds on extended ephemeris cache (Phase 1 delivers)
- Enables Gap 1 fix from MOMENT_ALIGNMENT_AUDIT_REPORT

### Implementation

#### New Module: PlanetaryConditionService.ts

```typescript
/**
 * Planetary Condition Analysis
 * ===========================
 * Evaluates strength/weakness of planets for timing decisions
 * 
 * Classical framework:
 * - Dignity: Is planet in strong or weak sign?
 * - Aspects: Are other planets supporting or afflicting?
 * - Retrograde: Is energy internalized or blocked?
 * - Speed: Is planet strong or weak in its motion?
 * - Combustion: Is planet weakened by Sun's proximity?
 */

interface PlanetaryCondition {
  planet: Planet;
  
  // Essential Dignity (domicile, exaltation, detriment, fall, peregrine)
  dignity: {
    type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'peregrine';
    score: number;                    // -3 (fall) to +3 (domicile/exaltation)
    strength: 'excellent' | 'strong' | 'moderate' | 'weak' | 'corrupted';
  };
  
  // Relative Strength (above/below angle, speed, etc.)
  strength: {
    retrograde: boolean;
    combusted: boolean;                // Within 8° of Sun
    underBeams: boolean;               // Within 17° of Sun
    speed: 'very-fast' | 'fast' | 'average' | 'slow' | 'stationary';
    angularDegrees: number;            // Distance to nearest angle (0-45°)
  };
  
  // Aspects to other planets
  majorAspects: Array<{
    planet: Planet;
    aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
    orb: number;                       // How exact? (0-10°)
    applying: boolean;                 // Getting tighter or separating?
    benefic: boolean;                  // Supportive (trine, sextile) or challenging (square, opposition)?
  }>;
  
  // Overall assessment
  overallScore: number;                // -100 (very weak) to +100 (very strong)
  ruling: 'corrupted' | 'weak' | 'moderate' | 'strong' | 'excellent';
  guidance: string;                    // "Mars in Aries (domicile), direct, sextile Venus - strong!"
}

// DIGNITY TABLES (Classical)
const RULERSHIP: Record<Planet, ZodiacSign[]> = {
  'sun': ['Leo'],
  'moon': ['Cancer'],
  'mercury': ['Gemini', 'Virgo'],
  'venus': ['Taurus', 'Libra'],
  'mars': ['Aries', 'Scorpio'],
  'jupiter': ['Sagittarius', 'Pisces'],
  'saturn': ['Capricorn', 'Aquarius'],
};

const EXALTATION: Record<Planet, ZodiacSign> = {
  'sun': 'Aries',      // Exalted at 19°
  'moon': 'Taurus',    // Exalted at 3°
  'mercury': 'Virgo',  // Exalted at 15°
  'venus': 'Pisces',   // Exalted at 27°
  'mars': 'Capricorn', // Exalted at 28°
  'jupiter': 'Cancer', // Exalted at 15°
  'saturn': 'Libra',   // Exalted at 21°
};

async function analyzePlanetaryCondition(
  planet: Planet,
  moment: CurrentMoment,
  allPlanets: PlanetPositions
): Promise<PlanetaryCondition> {
  // 1. Determine planetary position and sign
  const position = allPlanets[planet];
  const zodiacSign = getZodiacSignFromDegree(position.longitude);
  
  // 2. Assess essential dignity
  const dignityType = calculateDignity(planet, zodiacSign);
  const dignityScore = getDignityScore(dignityType);
  
  // 3. Check for combustion/beams
  const sunPos = allPlanets.sun;
  const distToSun = getEclipticDistance(position.longitude, sunPos.longitude);
  
  // 4. Calculate aspects to other planets
  const aspects = calculateAspects(planet, allPlanets);
  
  // 5. Assess motion (retrograde, speed)
  const motion = assessMotion(planet, position, moment);
  
  // 6. Synthesize overall condition
  const overallScore = synthesizeCondition(dignityScore, motion, aspects);
  
  return {
    planet,
    dignity: { type: dignityType, score: dignityScore, strength: mapScore(dignityScore) },
    strength: { ...motion, underBeams: distToSun < 17, combusted: distToSun < 8 },
    majorAspects: aspects,
    overallScore,
    ruling: mapScoreToRuling(overallScore),
    guidance: generateGuidance(planet, dignityType, motion, aspects),
  };
}
```

#### Classical Dignity Values

```
Domicile:    +3   (Planet in its own sign)
Exaltation:  +3   (Planet highly energized)
Triplicity:  +1   (Planet in fire/earth/air/water sign)
Term:        +1   (Planet in its term)
Face:        +1   (Planet in its decan/face)
Detriment:   -3   (Planet opposite its domicile)
Fall:        -3   (Planet opposite its exaltation)
Peregrine:    0   (No dignity)

Total possible: -9 (triply debilitated) to +9 (triply exalted)
```

#### Aspect Orbs (Traditional)

```
Conjunction:  8°  (Same degree)
Sextile:      8°  (60° apart)
Square:       8°  (90° apart)
Trine:        8°  (120° apart)
Opposition:   8°  (180° apart)
```

### Key Relationships to Implement

#### Planetary Friendships/Enmities
```typescript
const CLASSICAL_RELATIONSHIPS: Record<Planet, { friends: Planet[], enemies: Planet[] }> = {
  'sun': { friends: ['moon', 'mars', 'jupiter'], enemies: ['saturn'] },
  'moon': { friends: ['sun', 'jupiter'], enemies: ['saturn'] },
  'mercury': { friends: ['sun', 'venus'], enemies: ['mars', 'saturn'] },
  'venus': { friends: ['mercury', 'saturn'], enemies: ['mars'] },
  'mars': { friends: ['sun', 'jupiter'], enemies: ['mercury', 'venus', 'saturn'] },
  'jupiter': { friends: ['sun', 'moon', 'mars'], enemies: [] },
  'saturn': { friends: ['venus', 'mercury'], enemies: ['sun', 'moon', 'mars', 'jupiter'] },
};
```

These already exist in AsrariyaTimingEngine and should be kept.

### Estimated Effort

- **Research classical tables:** 2-3 hours
- **Implement dignity calculation:** 2-3 hours
- **Implement aspect detection:** 2-3 hours
- **Implement motion analysis:** 1-2 hours
- **Integration with Moment Alignment:** 2-3 hours
- **Testing and validation:** 3-4 hours
- **Total:** 12-18 hours

---

## PHASE 3: ENHANCE MOMENT ALIGNMENT

### Objective
Integrate planetary conditions to fix Gap 1 from MOMENT_ALIGNMENT_AUDIT_REPORT.

### Changes to AsrariyaTimingEngine.ts

#### Add Cosmic Quality Layer

```typescript
interface CosmicQualityAnalysis extends LayerAnalysisResult {
  hourRuler: {
    planet: Planet;
    condition: PlanetaryCondition;  // NEW: From Phase 2
    qualityScore: number;           // 0-100
  };
  
  moonState: {
    phase: MoonPhase;
    lunarDay: number;
    prohibition: null | 'voidOfCourse' | 'eclipse' | 'extremePhase';
  };
  
  prohibitions: Array<{
    type: string;
    severity: 'absolute' | 'strong' | 'moderate';
    affectedPractices: PracticeType[];
  }>;
  
  overallScore: number;             // 0-100
  ruling: 'baraka' | 'neutral' | 'makruh' | 'forbidden';
}

// Add to ASRARIYA_ENGINE_CONFIG:
const ENHANCED_CONFIG = {
  cosmicQualityWeight: 0.25,        // NEW LAYER
  moonPhaseWeight: 0.20,            // ELEVATED from 0.05
  elementWeight: 0.20,              // Reduced from 0.30
  planetaryWeight: 0.20,            // Reduced from 0.30
  manazilWeight: 0.10,              // Reduced from 0.20
  practiceWeight: 0.05,             // Reduced from 0.20
};
```

#### Update Scoring Logic

```typescript
async function getAsrariyaTiming(
  moment: CurrentMoment,
  userProfile: UserProfile,
  practiceIntent: PracticeIntent
): Promise<TimingGuidance> {
  const allPlanets = await getPlanetPositions(moment.date);
  
  // Layer 1: NEW - Cosmic Quality (objective)
  const cosmicQuality = await analyzeCosmicQuality(moment, allPlanets);
  
  // OVERRIDE CHECK: If cosmic is forbidden, stop here
  if (cosmicQuality.ruling === 'forbidden') {
    return {
      finalRuling: 'haram',
      guidance: "This moment has absolute prohibitions. Wait for next window.",
      ...
    };
  }
  
  // Layer 2: Personal Resonance (subjective)
  const personalResonance = analyzePersonalResonance(moment, userProfile, allPlanets);
  
  // Layer 3: Practice Suitability (contextual)
  const practiceSuitability = analyzePracticeSuitability(practiceIntent, allPlanets);
  
  // Layer 4: Moon Phase (primary timer)
  const moonAnalysis = analyzeMoonPhase(moment, practiceIntent);
  
  // Synthesis with NEW hierarchy:
  if (cosmicQuality.ruling === 'forbidden') {
    return forbiddenRuling();
  }
  if (cosmicQuality.ruling === 'baraka' && personalResonance.score > 80) {
    return recommendedRuling();
  }
  // ... etc with hierarchy
  
  return synthesizeFinalGuidance(cosmicQuality, personalResonance, practiceSuitability);
}
```

### Estimated Effort

- **Add cosmic quality function:** 3-4 hours
- **Implement override logic:** 1-2 hours
- **Update scoring weights:** 1 hour
- **Generate new guidance format:** 2-3 hours
- **Testing and validation:** 3-4 hours
- **Total:** 10-14 hours

---

## PHASE 4: ADD MOON PHASE INTELLIGENCE

### Objective
Elevate Moon phase from modifier to primary timing layer.

### Implementation

```typescript
interface MoonPhaseIntelligence extends LayerAnalysisResult {
  phase: {
    name: 'new' | 'waxing-crescent' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'waning-crescent';
    lunarDay: number;  // 1-30
    illumination: number; // 0-100%
  };
  
  energies: {
    manifestation: number;     // Waxing power (0-100)
    completion: number;        // Full power (0-100)
    release: number;           // Waning power (0-100)
    reflection: number;        // Dark moon power (0-100)
  };
  
  prohibitions: Array<{
    type: 'voidOfCourse' | 'eclipse' | 'extremePhase' | 'combust';
    affectsCategory: PracticeCategory;
    severity: 'absolute' | 'strong';
  }>;
  
  practiceAlignment: Record<PracticeType, {
    match: 'ideal' | 'favorable' | 'neutral' | 'challenging' | 'prohibited';
    reason: string;
    modifier: number;  // -50 to +30
  }>;
}

// PRACTICE-MOON RELATIONSHIPS
const MOON_PRACTICE_MAP: Record<PracticeType, {
  bestPhase: 'waxing' | 'waning' | 'full' | 'dark' | 'any';
  lunarDayRange?: [number, number];  // Days 1-30
  effect: string;
}> = {
  'wird-obligatory': { bestPhase: 'any', effect: 'Daily regardless of moon' },
  'manifestation-work': { bestPhase: 'waxing', lunarDayRange: [1, 14], effect: 'Building energy' },
  'protection-ruqyah': { bestPhase: 'waxing', lunarDayRange: [8, 15], effect: 'Strong protective energy' },
  'cleansing-banishing': { bestPhase: 'waning', lunarDayRange: [15, 30], effect: 'Releasing energy' },
  'tawbah-repentance': { bestPhase: 'dark', lunarDayRange: [27, 30], effect: 'Deep introspection' },
  'healing-work': { bestPhase: 'waxing', lunarDayRange: [7, 15], effect: 'Restorative energy' },
  // ... etc
};

// VOID-OF-COURSE DETECTION
function isVoidOfCourse(moonPosition: PlanetPosition, planetPositions: PlanetPositions): boolean {
  // Moon in void of course = no major aspects to any planet before leaving its sign
  const moonLongitude = moonPosition.longitude;
  const moonSign = Math.floor(moonLongitude / 30);
  const moonDegreeInSign = moonLongitude % 30;
  const moonDegreesToNextSign = 30 - moonDegreeInSign;
  
  // Check if Moon will aspect any planet before leaving sign
  // If not, it's void of course
  return !hasSignificantAspectBeforeLeavingSign(moonPosition, planetPositions);
}

// ECLIPSE DETECTION
function hasEclipseProhibition(moment: Date, lunarDay: number): boolean {
  // Lunar eclipses: Full moon in specific zodiacal degrees (lunar nodes)
  // Solar eclipses: New moon in specific zodiacal degrees
  
  // For 2026:
  const solarEclipses = [
    { date: '2026-01-29', sign: 'Aquarius' },
    { date: '2026-07-23', sign: 'Leo' },
  ];
  
  const lunarEclipses = [
    { date: '2026-01-14', sign: 'Cancer' },
    { date: '2026-07-08', sign: 'Capricorn' },
    { date: '2026-12-31', sign: 'Gemini' },
  ];
  
  // If moment is within eclipse date ±3 days, flag as prohibited
  return checkEclipseProximity(moment, solarEclipses, lunarEclipses);
}
```

### Estimated Effort

- **Implement moon phase calculation:** 1-2 hours
- **Create practice-moon relationship map:** 2-3 hours
- **Implement void-of-course detection:** 2-3 hours
- **Implement eclipse detection:** 1-2 hours
- **Integrate into scoring:** 1-2 hours
- **Testing:** 2-3 hours
- **Total:** 9-15 hours

---

## IMPLEMENTATION TIMELINE

### Week 1: Foundation
- **Phase 1:** Complete ephemeris cache for January 2026 (5-9 hours)
- **Verification:** Spot-check positions against authoritative sources

### Week 2: Condition Analysis
- **Phase 2:** Build planetary condition module (12-18 hours)
- **Testing:** Validate dignity calculations against classical tables

### Week 3-4: Integration
- **Phase 3:** Enhance Moment Alignment with cosmic quality (10-14 hours)
- **Phase 4:** Add moon phase intelligence (9-15 hours)
- **Overall testing:** Validate complete system

### Estimated Total Effort

```
Phase 1: 5-9 hours     (Completion: Jan 27-29)
Phase 2: 12-18 hours   (Completion: Feb 3-5)
Phase 3: 10-14 hours   (Completion: Feb 10-12)
Phase 4: 9-15 hours    (Completion: Feb 17-19)
Testing: 15-20 hours   (Throughout)
────────────────────
Total: 51-76 hours     (~2 weeks full-time)
```

---

## SUCCESS CRITERIA

### Phase 1 Complete
- ✅ All dates in January 2026 have accurate positions
- ✅ Positions verified against JPL Horizons ±0.5°
- ✅ Retrograde flags present for Mercury, Jupiter, Saturn
- ✅ App shows correct positions on dates tested

### Phase 2 Complete
- ✅ Planetary dignity calculated for all planets
- ✅ Aspects detected and orbs calculated
- ✅ Retrograde/combustion flagged
- ✅ Overall condition score accurate
- ✅ Traditional rulings match classical astrology

### Phase 3 Complete
- ✅ Cosmic quality layer separates objective conditions
- ✅ Override logic prevents bad timing recommendations
- ✅ Moon phase weight increased to 20%
- ✅ "Forbidden" moments properly flagged
- ✅ Output in traditional ruling format (wajib/mustahabb/mubah/makruh/haram)

### Phase 4 Complete
- ✅ Moon phase as primary timer
- ✅ Void-of-course detected
- ✅ Eclipse periods flagged
- ✅ Practice-moon alignment calculated
- ✅ User receives phase-aware guidance

---

## RISK MITIGATION

### Risk: Data Obsolescence
**Mitigation:** Build automated update process with JPL Horizons API for future dates.

### Risk: Accuracy Drift
**Mitigation:** Add unit tests comparing cached data against API results periodically.

### Risk: Breaking Changes
**Mitigation:** New modules added alongside existing code; gradual migration.

### Risk: Performance Impact
**Mitigation:** Phase updates incrementally; cache aggressively; profile performance.

---

## SUCCESS MEASUREMENT

### Accuracy Metrics
```
Before Fix:
- Average position error: 10-15°
- Wrong signs: 40% (Venus, Mars, Jupiter)
- Retrograde detection: 0% (Jupiter not flagged)

After Phase 1-2:
- Average position error: <0.5°
- Wrong signs: 0% (all correct)
- Retrograde detection: 100%

After Phase 3-4:
- Timing recommendations accuracy: 95%+
- User satisfaction: Qualitative feedback
- Guidance authenticity: Match with traditional astrology
```

---

## CONCLUSION

This strategy transforms Asrariya from a system with **40% authentic methodology, 60% aesthetic approximation** to one with **authentic foundation + modern sophistication**.

The key insight: **Separate cosmic truth (objective) from personal resonance (subjective)** and implement hierarchical override logic so that fundamental prohibitions always take precedence.

Implementation order (Phase 1→2→3→4) ensures each layer builds on the previous, with early wins (Phase 1) providing immediate accuracy improvements while later phases add methodology depth.

---

**Next Action:** Begin Phase 1 (complete January ephemeris) → Target completion: Jan 29, 2026
