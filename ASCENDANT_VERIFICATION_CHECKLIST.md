# Ascendant Debug Verification Checklist

## Pre-Test Checklist

- [ ] Code changes applied to `/services/BirthProfileService.ts`
- [ ] Enhanced `convertLocalToUTC()` function with debug logging (lines 223-277)
- [ ] Enhanced `dateToJulianDay()` function with debug logging (lines 390-408)
- [ ] Verified `calculateAscendant()` has 7-step debug pipeline (lines 288-378)
- [ ] Added `debugGambiaTestCase()` export function (lines 667-693)
- [ ] Running development build (not production)
- [ ] Browser DevTools available (press F12)

## Test Execution Checklist

### Step 1: Setup
- [ ] Open app (development build)
- [ ] Navigate to Calculator → Birth Profile
- [ ] Ensure location detection is enabled

### Step 2: Input Data
- [ ] Date field: Enter **2026-01-30**
- [ ] Time field: Enter **20:00**
- [ ] Location search: Search **"Serrekunda"** or enter **13.43°N, -16.68°W**
- [ ] Verify timezone shows: **Africa/Banjul (UTC+0)**

### Step 3: Execute Calculation
- [ ] Click **Calculate** button
- [ ] Wait for result to load
- [ ] Open DevTools: Press **F12**

### Step 4: Check Timezone Conversion
- [ ] Look for: `[convertLocalToUTC] Converting local time to UTC`
- [ ] Verify offset: `0.0 hours` (not other value)
- [ ] Result UTC: `2026-01-30T20:00:00.000Z`
- [ ] ✅ Pass: Offset = 0.0 hours

### Step 5: Check Julian Day
- [ ] Look for: `[dateToJulianDay] UTC:`
- [ ] Day fraction: `0.833333` (±0.000001)
- [ ] Calculated JD: `2460732.833333` (±0.001)
- [ ] ✅ Pass: JD within tolerance

### Step 6: Check Ascendant Calculation (7 Steps)

#### Step 1 Check
- [ ] Found: `Step 1 - Julian Day:`
- [ ] Value: `2460732.833333`
- [ ] ✅ Pass: Matches Julian Day from Phase 2

#### Step 2 Check
- [ ] Found: `Step 2 - Time T (Julian centuries):`
- [ ] Value: `0.251382` (±0.000005)
- [ ] ✅ Pass: T within tolerance

#### Step 3 Check
- [ ] Found: `Step 3 - GMST (Greenwich Mean Sidereal Time):`
- [ ] GMST (hours): `~15.25` hours
- [ ] GMST (degrees): `~228.84°` (±0.5°)
- [ ] ✅ Pass: GMST in expected range

#### Step 4 Check
- [ ] Found: `Step 4 - Local Sidereal Time (LST):`
- [ ] Longitude in hours: `-1.1120h` (NEGATIVE for west)
- [ ] LST (degrees): Calculated value
- [ ] ✅ Pass: Longitude is negative

#### Step 5 Check
- [ ] Found: `Step 5 - Obliquity of Ecliptic:`
- [ ] Value: `23.439120°` (±0.0005°)
- [ ] ✅ Pass: Obliquity in range

#### Step 6 Check
- [ ] Found: `Step 6 - Ascendant Calculation:`
- [ ] Numerator: Approximately `-0.573`
- [ ] Denominator: Approximately `0.847`
- [ ] **Critical**: Ascendant (ecliptic longitude): `~144°` (NOT `~228°`)
- [ ] ✅ Pass: Longitude ~144° (Leo range)
- [ ] ❌ Fail: If showing ~228° (Scorpio range)

#### Step 7 Check
- [ ] Found: `Step 7 - Ascendant Sign and Degree:`
- [ ] **CRITICAL**: Sign = `Leo` (NOT `Scorpio`)
- [ ] **CRITICAL**: Degree = `24°` (±1)
- [ ] ✅ **SUCCESS**: Leo 24°
- [ ] ❌ **FAILURE**: If Scorpio or different sign

## Result Verification

### Expected Result ✅ Leo 24°
- [ ] Console shows: `Ascendant = Leo 24°`
- [ ] Birth Profile card displays: Leo Ascendant
- [ ] Degree shown: 24° (or nearby)
- [ ] **Status**: BUG FIXED! 🎉

### Still Wrong ❌ Scorpio 21°
- [ ] Console shows: `Ascendant = Scorpio 21°`
- [ ] Need to debug further
- [ ] Review which step failed (from checklist above)
- [ ] Refer to ASCENDANT_DEBUG_OUTPUT_GUIDE.md

### Different Result ⚠️ (Capricorn, Libra, etc.)
- [ ] Note the sign difference
- [ ] Count zodiac signs off: _____ signs
- [ ] Approximate degrees off: _____ degrees
- [ ] Review ASCENDANT_DEBUG_OUTPUT_GUIDE.md troubleshooting section

## Intermediate Value Comparison

Use this table to spot deviations:

| Value | Expected | Your Test | Status |
|-------|----------|-----------|--------|
| UTC Time | 20:00:00Z | ________ | ☐ |
| TZ Offset | 0.0 hours | ________ | ☐ |
| Julian Day | 2460732.833 | ________ | ☐ |
| Time T | 0.251382 | ________ | ☐ |
| GMST (°) | 228.84 | ________ | ☐ |
| GMST (h) | 15.254 | ________ | ☐ |
| LST (°) | 53.833 | ________ | ☐ |
| Longitude (h) | -1.112 | ________ | ☐ |
| Obliquity | 23.4391 | ________ | ☐ |
| Ascendant (°) | 144.0 | ________ | ☐ |
| Sign | Leo | ________ | ☐ |
| Degree | 24 | ________ | ☐ |

## Pass/Fail Criteria

### ✅ PASS (Bug Fixed)
- [ ] All intermediate values match expected (within tolerance)
- [ ] Final Ascendant = Leo 24°
- [ ] No errors in console
- [ ] Test took ~2 minutes

### ❌ FAIL (Bug Still Present)
- [ ] Final Ascendant = Scorpio 21° (unchanged)
- [ ] One or more intermediate values wrong
- [ ] Error messages in console
- [ ] Needs further debugging

### ⚠️ PARTIAL (Needs Investigation)
- [ ] Result improved but still not Leo 24°
- [ ] Some intermediate values correct
- [ ] Pattern of deviation visible
- [ ] Can narrow down problem area

## Troubleshooting Flowchart

```
START: Calculate Ascendant for Gambia test case
  ↓
Is console showing debug output?
  ├─ NO: Check browser DevTools (F12), make sure __DEV__ mode
  └─ YES: Continue
  ↓
Is timezone offset 0.0 hours?
  ├─ NO: Timezone detection wrong, check Africa/Banjul mapping
  └─ YES: Continue
  ↓
Is Julian Day ~2460732.833?
  ├─ NO: Julian Day calculation wrong, review Meeus algorithm
  └─ YES: Continue
  ↓
Is GMST ~228.84°?
  ├─ NO: GMST formula wrong, verify USNO coefficients
  └─ YES: Continue
  ↓
Is LST longitude negative (-1.112h)?
  ├─ NO: West longitude not handled as negative
  └─ YES: Continue
  ↓
Is Ascendant ~144° (not ~228°)?
  ├─ NO: Spherical trigonometry wrong, check atan2
  └─ YES: Continue
  ↓
Is final result Leo 24°?
  ├─ YES: SUCCESS! Bug is fixed! 🎉
  └─ NO: Check sign conversion, review longitudeToSign()
  ↓
END
```

## Debug Output Template

Copy this and fill in your actual values:

```
=== GAMBIA TEST CASE RESULTS ===

TIMEZONE CONVERSION:
  Input: 2026-01-30 20:00 (local)
  Timezone: _________________
  Offset: _________________ hours
  UTC: _________________

JULIAN DAY:
  JD: _________________
  Day Fraction: _________________

ASCENDANT CALCULATION:
  Step 1 - JD: _________________
  Step 2 - T: _________________
  Step 3 - GMST (°): _________________
  Step 4 - LST (°): _________________
  Step 4 - Long (h): _________________
  Step 5 - Obliquity: _________________
  Step 6 - Numerator: _________________
  Step 6 - Denominator: _________________
  Step 6 - Ascendant (°): _________________

FINAL RESULT:
  Sign: _________________
  Degree: _________________
  
STATUS: ☐ PASS ☐ FAIL ☐ PARTIAL

Notes: _____________________________________________________
```

## After Verification

### If Everything Works ✅
1. [ ] Document that test passed
2. [ ] Note any values that differed from expected (minor variations OK)
3. [ ] Consider removing debug logging if satisfied
4. [ ] Prepare for deployment

### If Something Failed ❌
1. [ ] Note which step showed incorrect value
2. [ ] Create bug report with specific values
3. [ ] Review ASCENDANT_DEBUG_OUTPUT_GUIDE.md for that step
4. [ ] Implement targeted fix
5. [ ] Re-run test

### If Results Are Borderline ⚠️
1. [ ] Check if within acceptable tolerance (see table above)
2. [ ] Run test multiple times (check for consistency)
3. [ ] Small variations in last decimal places are normal
4. [ ] If consistently wrong, needs fixing

---

## Sign Reference

Quick reference for zodiac longitude ranges:

```
Aries:       0° - 30°
Taurus:     30° - 60°
Gemini:     60° - 90°
Cancer:     90° - 120°
Leo:       120° - 150°        ← Expected: 144° (Leo 24°)
Virgo:     150° - 180°
Libra:     180° - 210°
Scorpio:   210° - 240°        ← Current broken: ~228° (Scorpio 21°)
Sagittarius: 240° - 270°
Capricorn:  270° - 300°
Aquarius:   300° - 330°
Pisces:     330° - 360°
```

---

## Performance Notes

- [ ] Test completed in under 5 seconds
- [ ] No lag when clicking Calculate
- [ ] Console logs don't slow down app
- [ ] Debug logging only in __DEV__ mode

---

## Final Sign-Off

**Date of Test**: _____________
**Tester Name**: _____________
**Result**: ☐ PASS ☐ FAIL ☐ PARTIAL
**Issues Found**: _____________________________________________________
**Notes**: _____________________________________________________

---

## Quick Reference Commands

To manually call debug function:
```javascript
// In browser console:
asrar.debugGambiaTestCase()
```

To check specific value:
```javascript
// In browser console:
const d = new Date('2026-01-30T20:00:00Z');
asrar.calculateAscendant(d, 13.437, -16.6812);
```

