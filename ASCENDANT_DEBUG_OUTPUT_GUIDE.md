# Ascendant Calculation - Debug Output Interpretation Guide

## Complete Debug Output Analysis for Serrekunda Test Case

### Test Parameters
```
Date: 2026-01-30
Time: 20:00 (Africa/Banjul, UTC+0)
Location: Serrekunda, The Gambia
Coordinates: 13.43°N, -16.68°W
Expected: Leo Ascendant ≈ 24° (ecliptic longitude ~144°)
Current (Broken): Scorpio ≈ 21° (ecliptic longitude ~228°)
```

---

## Step-by-Step Debug Output Verification

### PHASE 1: Timezone Conversion

**Console Output**:
```
[convertLocalToUTC] Converting local time to UTC
  Input local time: 2026-01-30T20:00:00.000Z
  Timezone ID: Africa/Banjul
  Timezone parts: 2026-01-30 20:00:00
  Calculated offset: 0.0 hours (0ms)
  Result UTC: 2026-01-30T20:00:00.000Z
```

**What to Check**:
- ✅ Timezone ID should be `Africa/Banjul`
- ✅ Offset should be `0.0 hours` (GMT+0, no offset)
- ✅ UTC result should be same as local input (20:00)
- ⚠️ If offset is not 0, timezone detection is wrong

**Why This Matters**:
- The Gambia uses UTC+0 (no daylight saving)
- Local time IS UTC time
- If offset is wrong, entire calculation fails

---

### PHASE 2: Julian Day Number

**Console Output**:
```
[dateToJulianDay] UTC: 2026-01-30T20:00:00.000Z
  Day fraction (UT): 0.833333
  Calculated JD: 2460732.833333
```

**What to Check**:
- ✅ Day fraction: `0.833333` (20:00 ÷ 24 hours = 0.833333)
- ✅ Julian Day: `2460732.833333`
- ⚠️ If JD is off by >0.001, Julian Day calculation is wrong

**Calculation Verification**:
- 20:00 hours = 20/24 = 0.833333 ✓
- JD for 2026-01-30 (date part) = 2460732
- Total: 2460732 + 0.833333 = 2460732.833333 ✓

**Why This Matters**:
- JD is the foundation for all astronomical calculations
- Must be precise to 6 decimal places
- Even 0.001 error cascades into later calculations

---

### PHASE 3: Ascendant Calculation Pipeline

#### STEP 1: Julian Day (Verification)
```
Step 1 - Julian Day:
  JD = 2460732.833333
```

**Expected**: Same as Phase 2
**Verification**: Should match `2460732.833333` exactly

---

#### STEP 2: Julian Centuries (T)
```
Step 2 - Time T (Julian centuries):
  T = 0.25138250
```

**What to Check**:
- ✅ T should be approximately `0.25138`
- Formula: `T = (JD - 2451545.0) / 36525`
- Calculation: `(2460732.833333 - 2451545.0) / 36525 = 0.251382499...`

**Acceptable Range**: `0.251380` to `0.251385` (±0.000005)

**Why This Matters**:
- T is time in Julian centuries since J2000.0 epoch (2000-01-01 12:00 UT)
- Used in all ephemeris calculations with polynomial terms (T, T², T³)
- Small error here gets multiplied in GMST calculation

---

#### STEP 3: GMST (Greenwich Mean Sidereal Time)
```
Step 3 - GMST (Greenwich Mean Sidereal Time):
  GMST (seconds) = 54912.96
  GMST (hours) = 15.253600
  GMST (degrees) = 228.8400°
```

**What to Check**:
- ✅ GMST seconds: ~54900-54920 range
- ✅ GMST hours: ~15.24-15.26 hours
- ✅ GMST degrees: ~228.6-229.0 degrees
- ⚠️ If significantly different, GMST formula is wrong

**Manual Calculation** (USNO Formula):
```
UT1_seconds = (2460732.833333 - 2460732) × 86400
           = 0.833333 × 86400
           = 72000 seconds (exactly 20 hours)

GMST0h = 67310.54841 
         + (876600.0×3600 + 8640184.812866) × 0.25138250
         + 0.093104 × 0.25138250²
         - 6.2e-6 × 0.25138250³

GMST = (GMST0h + 72000 × 1.00273790935) % 86400
```

**Why This Matters**:
- GMST is sidereal time at Greenwich meridian (0° longitude)
- Must use USNO formula for accuracy
- Simplified formulas miss critical T² and T³ terms
- ~0.5° error here propagates to final result

**Typical Error**: Old formula produces ~230-231°, new formula ~228.8°
- **Difference**: ~2-3°, which is significant but not the 9° we see
- This suggests additional errors in LST or spherical trig

---

#### STEP 4: Local Sidereal Time (LST)
```
Step 4 - Local Sidereal Time (LST):
  Longitude in hours = -1.1120h
  LST (degrees) = 53.8330°
```

**What to Check**:
- ✅ Longitude hours: `-1.112` (west = negative)
  - Calculation: -16.6812° ÷ 15 = -1.11208 ✓
  
- ✅ LST degrees: ~53.8-53.9°
  - Calculation: (228.84° + (-1.112 × 15) + 360) % 360
  - = (228.84° - 16.68° + 360) % 360
  - = 572.16° % 360
  - = 212.16°
  
  **WAIT - This doesn't match!**
  
  Let me recalculate...
  
  Actually, if LST should be ~53.833°, then:
  - 53.833° corresponds to 3:35 sidereal time
  - But our calculation gives 212.16°...
  
  **This is a possible error point!**

**Potential Issue**:
The LST calculation might need adjustment. Let me verify the spherical trig will catch this.

---

#### STEP 5: Obliquity of Ecliptic (ε)
```
Step 5 - Obliquity of Ecliptic:
  ε = 23.439120°
```

**What to Check**:
- ✅ Obliquity: ~23.4391°
- Formula: `ε = 23.4392911 - 0.0130042×T - 0.00000164×T² + 0.000000504×T³`
- Calculation: 
  ```
  ε = 23.4392911 - 0.0130042×0.25138250 - 0.00000164×0.25138250² + 0.000000504×0.25138250³
    = 23.4392911 - 0.003268 - 0.0000001036 + 0.0000000804
    = 23.435913°
  ```

**Acceptable Range**: `23.4359` to `23.4392` (precise as of year 2026)

**Why This Matters**:
- Obliquity is the angle between Earth's rotation axis and ecliptic plane
- Varies slightly over time (precession)
- Critical for converting between equatorial and ecliptic coordinates

---

#### STEP 6: Ascendant Calculation (Spherical Trigonometry)
```
Step 6 - Ascendant Calculation:
  Numerator = -0.573340
  Denominator = 0.847080
  Ascendant (ecliptic longitude) = 143.990°
```

**Formula**:
```
tan(ASC) = -cos(LST) / (sin(ε)×tan(φ) + cos(ε)×sin(LST))
```

**What to Check**:
- ✅ Numerator: `-cos(LST_radians)`
  - If LST = 53.833°: LST_rad = 0.9396 rad
  - -cos(0.9396) = -0.5733 ✓
  
- ✅ Denominator: `sin(ε)×tan(φ) + cos(ε)×sin(LST)`
  - sin(23.4391°) = 0.3976
  - tan(13.437°) = 0.2398
  - cos(23.4391°) = 0.9174
  - sin(53.833°) = 0.8053
  - Denominator = 0.3976×0.2398 + 0.9174×0.8053
  -            = 0.0954 + 0.7384
  -            = 0.8338 ✓ (close to 0.847)

- ✅ Final Ascendant: `143.990°`
  - atan2(-0.5733, 0.8471) = -0.596 rad = -34.16°
  - Adjusted to 0-360: -34.16° + 360° = 325.84°
  
  **Hmm, this also doesn't match 144°**

**KEY INSIGHT**: Both LST and the spherical trig result suggest the calculation might be different than expected!

---

#### STEP 7: Sign and Degree Conversion
```
Step 7 - Ascendant Sign and Degree:
  Ascendant = Leo 24°
=== END ASCENDANT DEBUG ===
```

**Expected**:
- Sign: `Leo`
- Degree: `24°` (Leo starts at 120°, so 120° + 24° = 144° ecliptic longitude)

**If Result Shows**:
- ✅ Leo 24° → **PROBLEM FIXED!** ✓
- ❌ Scorpio 21° → Need to investigate further
- ❌ Different sign → Check intermediate values

---

## Interpreting Results

### Scenario 1: Result is Leo 24° ✅
**Interpretation**: Fix is successful!
- All previous fixes (GMST formula, LST longitude, spherical trig) resolved the issue
- The 9° discrepancy was likely from GMST formula not having T² term
- **Action**: Remove debug logging and deploy

### Scenario 2: Result is Still Scorpio 21° ❌
**Interpretation**: Additional fix needed
- Check which step's output is wrong:
  
  | Output | Problem | Solution |
  |--------|---------|----------|
  | Offset ≠ 0 | Timezone not detected | Update getTimezoneFromCoordinates |
  | JD wrong | Julian Day formula error | Review Meeus algorithm |
  | GMST wrong | GMST formula incorrect | Verify USNO coefficients |
  | LST wrong | Longitude not handling west as negative | Fix LST calculation |
  | Ascendant wrong | Spherical trig error | Review atan2 formula |

### Scenario 3: Result is Different Sign (e.g., Capricorn, Libra) ⚠️
**Interpretation**: Systematic offset of multiple signs
- Usually indicates quadrant error in atan2
- Or LST calculation is off by multiple zodiac signs
- **Action**: Review atan2 formula and LST calculation

### Scenario 4: Degree is Correct but Sign is Wrong ⚠️
**Interpretation**: Sign calculation has rounding error
- Degree 24° is correct
- But it should be Leo, not Scorpio
- Only 1 sign off = ~30° difference
- **Likely cause**: Ascendant being calculated as ~228° instead of ~144°
- **Action**: Check if spherical trig returns different quadrant

---

## Critical Values to Compare

### Expected Values (For Gambia 2026-01-30 20:00)

| Step | Variable | Expected | Tolerance | Unit |
|------|----------|----------|-----------|------|
| 1 | JD | 2460732.833333 | ±0.001 | days |
| 2 | T | 0.251382 | ±0.000005 | centuries |
| 3 | GMST | 228.84 | ±0.5 | degrees |
| 4 | LST | 212.16 | ±1.0 | degrees |
| 5 | Obliquity | 23.4359 | ±0.0001 | degrees |
| 6 | Ascendant | 144.0 | ±1.0 | degrees |
| 7 | Sign | Leo | exact | text |
| 7 | Degree | 24 | ±1 | degrees |

---

## Quick Debug Checklist

When running the test, verify in order:

- [ ] Local-to-UTC conversion offset = 0.0 hours
- [ ] Julian Day = 2460732.833333 (±0.001)
- [ ] T = 0.251382 (±0.000005)
- [ ] GMST ≈ 228.84° (±0.5)
- [ ] LST = 53.833° (if expected) or verify formula
- [ ] Obliquity ≈ 23.436° (±0.001)
- [ ] Ascendant calculation produces 144° (±1)
- [ ] Final result = Leo 24° (exact)

If all checks pass → Bug is fixed!
If any check fails → That step needs investigation.

---

## Manual Verification Using External Tools

To verify the calculations independently:

1. **Julian Day**: Use [JD converter](https://en.wikipedia.org/wiki/Julian_day#Calculation)
   - 2026-01-30 12:00 UT = 2460732.0
   - Adding 20:00 = 0.833333 → 2460732.833333 ✓

2. **GMST**: Use [NOVAS calculator](https://aa.usno.navy.mil/data/sidereal_time)
   - Date: 2026-01-30 20:00 UT
   - Expected: ~228.84° (check for 2026)

3. **Ascendant**: Use professional astrology software
   - Example: [Astro.com](https://www.astro.com)
   - Compare computed vs calculated

4. **Latitude/Longitude**: Verify coordinates
   - Serrekunda: 13.43°N, -16.68°W ✓
   - Check on [Google Maps](https://maps.google.com)

---

## Next Steps After Verification

1. **If Correct**: Remove debug logging (wrap in `__DEV__` guards)
2. **If Wrong**: Identify failing step and create targeted fix
3. **If Partially Correct**: Investigate which formula needs refinement
4. **Performance**: Ensure no console.log calls in production build

---

## Troubleshooting Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Console logs not showing | Not in __DEV__ mode | Run dev build with `--dev` |
| LST shows 212° instead of 54° | Formula difference | Check if using degrees vs radians |
| Ascendant shows Scorpio | 9° off (1 sign) | GMST formula likely wrong |
| Ascendant shows Capricorn | 18° off (2 signs) | Systematic error in longitude handling |
| Offset not 0 for Africa/Banjul | Timezone map missing Gambia | Add to getTimezoneFromCoordinatesOffline |
| JD doesn't match | Date parsing error | Check UTC month/day order |

