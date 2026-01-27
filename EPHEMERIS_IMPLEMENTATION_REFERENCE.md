# EPHEMERIS IMPLEMENTATION REFERENCE

**Purpose:** Quick reference for developers implementing ephemeris improvements  
**Audience:** Backend/frontend developers  
**Status:** Active guidance document  

---

## QUICK REFERENCE: POSITION ACCURACY

### Current (Post-Fix) Accuracy Status

```
Date Range:     Jan 26-28, 2026
Accuracy:       ±0.5° (verified against JPL Horizons)
Coverage:       7 data points for January (was 4)
Gaps Remain:    Jan 4-24, 29-31 (26 days missing)

Target:
Accuracy:       ±0.1° (for all of 2026-2027)
Coverage:       730 days (all of 2026-2027)
Gaps:           None
```

### Position Verification Checklist

When adding new ephemeris dates, verify:

```javascript
// 1. Data collection
const position = getFromJPLHorizons(date, planet);  // Authority
const altPos = getFromAstrodienst(date, planet);    // Cross-check

// 2. Validation (must pass ALL)
✓ Position within ±0.5° between sources
✓ Sign correct (0-11 range, no overflow)
✓ Degree within 0-30 for signDegree
✓ Longitude within 0-360 for full longitude
✓ Retrograde flag matches authoritative source
✓ Not interpolated or estimated

// 3. Quality gates
✓ Date is exact (no rounding)
✓ Time is UTC standardized
✓ Planet is in correct ephemeris
✓ Position makes orbital sense (not jumping)
```

---

## ZODIAC SIGN NUMBERING

The app uses two indexing systems. Be consistent:

### System 1: Zero-Indexed (0-11)
```
0  = Aries      (0°-30°)
1  = Taurus     (30°-60°)
2  = Gemini     (60°-90°)
3  = Cancer     (90°-120°)
4  = Leo        (120°-150°)
5  = Virgo      (150°-180°)
6  = Libra      (180°-210°)
7  = Scorpio    (210°-240°)
8  = Sagittarius(240°-270°)
9  = Capricorn  (270°-300°)
10 = Aquarius   (300°-330°) ← Most Jan 2026 planets here
11 = Pisces     (330°-360°)
```

### System 2: One-Indexed (1-12)
```
Same as above but 1-12 instead of 0-11
(Used in some astrological contexts)
```

**Critical:** The app uses **0-11 indexing** in code but may display 1-12 to users.

### Degree Conversion Examples

```
5° Aquarius   = sign 10, signDegree 5°   = longitude 305°
6° 20' Aqua   = sign 10, signDegree 6.33 = longitude 306.33°
28° Pisces    = sign 11, signDegree 28°  = longitude 358°
11° Aquarius  = sign 10, signDegree 11°  = longitude 311°

Formula:
longitude = (sign * 30) + signDegree
signDegree = longitude % 30
sign = floor(longitude / 30)
```

---

## RETROGRADE PERIODS 2026

Critical for timing analysis. Add `retrograde: true` for these dates:

### Mercury Retrograde (Fastest, Most Frequent)
```
Period 1: Jan 8 - Jan 28, 2026
Period 2: Apr 26 - May 17, 2026
Period 3: Aug 25 - Sep 16, 2026
Period 4: Dec 13, 2026 - Jan 2, 2027
```

**Add retrograde flag to ephemeris cache for all dates in these ranges.**

### Jupiter Retrograde (Slow, Long)
```
Period: Jun 20 - Nov 5, 2026 (137 days)
```

**Jupiter in Cancer retrograde** during summer/fall 2026.

### Saturn Retrograde
```
Period: Jun 6 - Oct 18, 2026 (135 days)
```

### Venus & Mars Retrograde
```
Venus: None in 2026 (retrograde very rare)
Mars:  None in 2026 (retrograde every 2+ years, next Oct-Dec 2028)
```

---

## DATA STRUCTURE: PlanetPosition

Current definition:

```typescript
interface PlanetPosition {
  planet: PlanetId;           // 'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'
  longitude: number;          // 0-360° ecliptic
  sign: number;               // 0-11 (Aries-Pisces)
  signDegree: number;         // 0-30° within sign
  
  // NEW FIELDS (To be added):
  retrograde?: boolean;       // Is planet moving backwards?
  speed?: number;             // Degrees/day (optional, for future use)
  accuracy?: 'ephemeris' | 'interpolated' | 'synthetic'; // Data source flag
}
```

**To-Do:** Add retrograde field and deprecate synthetic positions for 2026+.

---

## DATA STRUCTURE: PlanetPositions

```typescript
interface PlanetPositions {
  timestamp: number;          // Unix milliseconds
  dateISO: string;            // 'YYYY-MM-DD'
  planets: Record<PlanetId, PlanetPosition>;
  source: 'ephemeris' | 'synthetic' | 'interpolated';
  expiresAt: number;          // Cache expiration time
}
```

---

## ADDING NEW EPHEMERIS DATES

### Step-by-Step Process

#### 1. Get Data from JPL Horizons

```bash
# Via API:
curl "https://ssd.jpl.nasa.gov/api/horizons.api?COMMAND='10'&FORMAT='JSON'&EPHEM_TYPE='VECTORS'&START_TIME='2026-01-04'&STOP_TIME='2026-01-04'&STEP_SIZE='1d'"

# Or manually: https://ssd.jpl.nasa.gov/horizons/
# Select:
# - Target: Sun (body 10)
# - Observer: Earth center (geocentric)
# - Start date: 2026-01-04
# - Stop date: 2026-01-04
# - Step size: 1 day
# - Format: compact with ecliptic longitude
```

#### 2. Parse Output

JPL Horizons returns ecliptic longitude. Extract:
```
Date: 2026-Jan-04 00:00:00
Mercury ecliptic longitude: 302.47°
→ sign: floor(302.47 / 30) = 10 (Aquarius)
→ signDegree: 302.47 % 30 = 2.47°
```

#### 3. Cross-Check with Astrodienst

- Visit https://www.astro.com/cgi/chart.cgi
- Set date to 2026-01-04 00:00 UTC
- Get Mercury position
- Must match JPL within ±0.3°

#### 4. Add to Cache

```typescript
EPHEMERIS_2026_JAN['2026-01-04'] = {
  sun: { planet: 'sun', longitude: 283.9, sign: 9, signDegree: 13.9 },
  moon: { planet: 'moon', longitude: 251.5, sign: 8, signDegree: 11.5 },
  mercury: { planet: 'mercury', longitude: 302.5, sign: 10, signDegree: 2.5 },
  // ... rest of planets
};
```

#### 5. Commit with Verification

```bash
git commit -m "Add ephemeris data for Jan 4, 2026 (verified against JPL Horizons)"
```

---

## COMMON MISTAKES TO AVOID

### ❌ Mistake 1: Interpolation Over Large Gaps
```typescript
// DON'T DO THIS:
const beforeDate = '2026-01-25';
const afterDate = '2026-02-14';  // 20-day gap!
interpolate(before, after);      // Moon error ~260°!

// DO THIS:
// Add daily entries between dates
for (let d = 25; d <= 31; d++) {
  ephemeris[`2026-01-${d}`] = getFromJPLHorizons(...);
}
```

### ❌ Mistake 2: Forgetting Sign Boundary
```typescript
// DON'T:
longitude: 30.5  // Off-by-one for Taurus boundary
sign: 0          // Should be 1

// DO:
longitude: 30.5
sign: 1          // Taurus (30°-60°)
```

### ❌ Mistake 3: Retrograde Ignored
```typescript
// DON'T:
'mercury': { longitude: 295.2, sign: 9, signDegree: 25.2 }

// DO (if in Jan 8-28 retrograde period):
'mercury': { 
  longitude: 295.2, 
  sign: 9, 
  signDegree: 25.2,
  retrograde: true  // ← Critical flag!
}
```

### ❌ Mistake 4: UTC Time Confusion
```typescript
// DON'T:
const date = new Date('2026-01-27 12:08');  // Local time!

// DO:
const date = new Date('2026-01-27T12:08:00Z');  // UTC
const dateISO = date.toISOString().split('T')[0];  // '2026-01-27'
```

### ❌ Mistake 5: Source Not Documented
```typescript
// DON'T:
EPHEMERIS_2026_JAN['2026-01-27'] = { ... };

// DO:
// Verified: JPL Horizons 2026-01-27 00:00 UTC
// Cross-check: Astrodienst ✓ (±0.1°), Cafe Astrology ✓
EPHEMERIS_2026_JAN['2026-01-27'] = { ... };
```

---

## INTEGRATION CHECKLIST

When adding new ephemeris features, update these files:

### 1. Type Definitions
```typescript
// src/types/divine-timing-personal.ts
interface PlanetPosition {
  // ... add new fields
}

interface PlanetaryCondition {  // NEW TYPE
  // ... if implementing Phase 2
}
```

### 2. Data Cache
```typescript
// services/EphemerisDataCache.ts
EPHEMERIS_2026_JAN = {
  // Add new dates
}

// Add new function:
export function getPlanetaryCondition(...) { ... }
```

### 3. Service Layer
```typescript
// services/EphemerisService.ts
export async function getPlanetPositions(...) {
  // Update logic if needed
}

export async function getCosmicQuality(...) {  // NEW if Phase 3
  // Implement cosmic quality analysis
}
```

### 4. UI Components
```typescript
// components/PlanetTransit.tsx
// Update display if new fields added
display(position.retrograde)  // NEW
```

### 5. Tests
```typescript
// tests/ephemeris.test.ts
test('Jan 27 positions are accurate', () => {
  const pos = getPlanetPositions('2026-01-27');
  expect(pos.mercury.longitude).toBeCloseTo(339, 0.5);
});
```

---

## DEBUGGING POSITION ERRORS

If positions seem wrong:

### Check 1: Verify Source Data
```javascript
// Confirm JPL says:
date: 2026-01-27 00:00 UTC
mercury: 339.2° ecliptic
→ sign 11 (Aquarius), degree 9.2°

// Does cache match?
cache['2026-01-27'].mercury.longitude === 339.2 ✓
cache['2026-01-27'].mercury.sign === 11 ✓
```

### Check 2: Verify Sign Calculation
```javascript
longitude = 339.2
sign = floor(339.2 / 30) = 11 ✓ (Aquarius)
signDegree = 339.2 % 30 = 9.2 ✓
```

### Check 3: Verify Interpolation (if used)
```javascript
// Don't interpolate over >5 days
// Errors compound: 2° * 5 days = 10° error
```

### Check 4: Verify Display
```javascript
// UI shows: "Mercury 9° Aquarius"
// Correct?
- Sign 11 = Aquarius ✓
- Degree 9.2 rounded to 9 ✓
```

### Check 5: Test Against Known Good
```javascript
// Use astro.com as visual confirmation
// Open: https://www.astro.com/cgi/chart.cgi
// Set: 2026-01-27 00:00:00 UTC
// Compare Mercury position: should match cache
```

---

## PERFORMANCE CONSIDERATIONS

### Caching Strategy

```typescript
// Cache key should include timezone to avoid recomputation
const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${hourKey}_${timezone}`;

// TTL: 24 hours (positions stable for daily use)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Precise positions (5-min buckets) need shorter TTL
const PRECISE_CACHE_TTL_MS = 6 * 60 * 1000;
```

### API Call Optimization

```javascript
// Batch requests to JPL when fetching multiple dates
const startDate = '2026-01-04';
const stopDate = '2026-01-31';
// Single API call for entire month

// Result: ~1 request vs 28 requests
```

### Storage Impact

```javascript
// One PlanetPosition object: ~200 bytes
// One full PlanetPositions object: ~1.5 KB
// 365 days of 2026: ~550 KB (minified)
// Acceptable for AsyncStorage (limit: 5MB+ typical)
```

---

## RELEASE CHECKLIST

Before deploying ephemeris changes:

```
PRE-RELEASE
☐ All positions verified ±0.5° against JPL Horizons
☐ Retrograde flags checked for all relevant dates
☐ Unit tests pass (accuracy validation)
☐ No interpolated data used for current date
☐ All cache keys properly versioned
☐ Backward compatibility maintained
☐ Documentation updated
☐ No breaking API changes

DEPLOYMENT
☐ Data migration tested (if changing schema)
☐ Cache invalidation strategy confirmed
☐ Fallback data available (synthetic positions)
☐ Error handling for missing data
☐ Monitoring for position accuracy

POST-DEPLOYMENT
☐ Check user reports of wrong positions
☐ Monitor cache hit rate (expect >90%)
☐ Verify timing recommendations improved
☐ Track accuracy metrics
```

---

## REFERENCE TABLES

### Classical Planetary Rulership

```
Planet    | Domicile Signs           | Exaltation
----------|--------------------------|----------
Sun       | Leo                      | Aries
Moon      | Cancer                   | Taurus
Mercury   | Gemini, Virgo            | Virgo
Venus     | Taurus, Libra            | Pisces
Mars      | Aries, Scorpio           | Capricorn
Jupiter   | Sagittarius, Pisces      | Cancer
Saturn    | Capricorn, Aquarius      | Libra
```

### Planetary Friendship (Classical)

```
Sun:     friendly → Moon, Mars, Jupiter        | enemy → Saturn
Moon:    friendly → Sun, Jupiter               | enemy → Saturn
Mercury: friendly → Sun, Venus                 | enemy → Mars, Saturn
Venus:   friendly → Mercury, Saturn            | enemy → Mars
Mars:    friendly → Sun, Jupiter               | enemy → Mercury, Venus, Saturn
Jupiter: friendly → Sun, Moon, Mars            | enemy → None
Saturn:  friendly → Venus, Mercury             | enemy → Sun, Moon, Mars, Jupiter
```

---

## NEXT MILESTONE

**Target:** Complete ephemeris cache for all of 2026 by Feb 15, 2026

```
Current:  7 data points (Jan 1, 2, 3, 26, 27, 28, 25)
Needed:   365 data points (all of 2026)
Gap:      358 data points

Effort:   ~40-60 hours
Method:   JPL Horizons API batch queries + Astrodienst verification
```

---

**Questions?** See [EPHEMERIS_SYSTEM_IMPROVEMENT_STRATEGY.md](EPHEMERIS_SYSTEM_IMPROVEMENT_STRATEGY.md) for implementation roadmap.
