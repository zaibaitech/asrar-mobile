# Phase 7 Quick Reference Guide 🚀

**Divine Timing Personalization - Fast Implementation Guide**

---

## 🎯 What Phase 7 Adds

1. **Peak Windows** - Personalized timing recommendations based on real ephemeris
2. **Energy Tracking** - Slider to record how you feel (0-100)
3. **Pattern Learning** - System learns your best times from check-ins
4. **Weekly Heatmap** - Visual analytics of your timing patterns
5. **Insights Screen** - Trends, recommendations, success rates

---

## ⚡ 30-Second Demo Path

1. **Home Screen** → See "Your Peak Windows" card
2. Tap **"Check In Now"**
3. Select intention → Set energy slider → Get Guidance
4. **Save Check-In**
5. Return home → Tap **"View Insights"**
6. See heatmap + analytics

---

## 📦 New Files Created

### Services
- `services/EphemerisService.ts` - NASA JPL Horizons API integration
- `services/IlmNujumMapping.ts` - Harmony score computation
- `services/PeakWindowLearner.ts` - Pattern learning engine
- `services/CheckInStorage.ts` - Enhanced local storage

### Types
- `types/divine-timing-personal.ts` - All Phase 7 types

### Components
- `components/divine-timing/PeakWindowsCard.tsx` - Home widget
- `components/divine-timing/WeeklyHeatmap.tsx` - Analytics viz

### Screens
- `app/divine-timing-insights.tsx` - Analytics screen
- `app/daily-checkin.tsx` - Enhanced with energy slider

### Docs
- `PHASE_7_DIVINE_TIMING_PERSONALIZATION.md` - Full documentation

---

## 🔑 Key Functions

### Get Planetary Positions
```typescript
import { getPlanetPositions } from '@/services/EphemerisService';

const positions = await getPlanetPositions(new Date(), 'America/New_York');
// Returns: PlanetPositions with Sun, Moon, planets
// Source: 'ephemeris' (real) or 'approx' (fallback)
```

### Compute Harmony Score
```typescript
import { computeHarmonyScore } from '@/services/IlmNujumMapping';

const result = computeHarmonyScore({
  datetime: new Date(),
  timezone: 'UTC',
  userElement: 'fire',
  intentionCategory: 'start',
  timeSegment: 'morning',
  planetPositions: positions,
  peakWindowScore: 0.7,
  recentOutcomes: ['good', 'good', 'neutral'],
});
// Returns: { score: 0-100, components: {...}, explanationBullets: [...] }
```

### Save Check-In
```typescript
import { saveCheckIn } from '@/services/CheckInStorage';

const checkin: CheckInRecord = {
  id: `${dateISO}-${Date.now()}`,
  createdAt: Date.now(),
  localDayKey: '2025-12-27',
  intentionKey: 'start',
  note: 'Starting a new project',
  timingSnapshot: divineTimingResult,
  timeSegment: 'morning',
  energy: 75,
  harmonyScore: 82,
  planetarySnapshot: positions,
};

await saveCheckIn(checkin);
// Auto-updates peak window model
```

### Load Insights
```typescript
import { loadCheckIns, loadUserTimingProfile } from '@/services/CheckInStorage';
import { getSegmentStatistics } from '@/services/PeakWindowLearner';

const checkins = await loadCheckIns();
const stats = getSegmentStatistics(checkins, 'morning');
// Returns: { count, avgEnergy, avgHarmony, outcomes, successRate }
```

---

## 🎨 UI Components Usage

### Peak Windows Card
```tsx
import { PeakWindowsCard } from '@/components/divine-timing/PeakWindowsCard';

<PeakWindowsCard 
  userElement="fire" 
  userBurjRuler="mars" 
/>
```

### Weekly Heatmap
```tsx
import { WeeklyHeatmap } from '@/components/divine-timing/WeeklyHeatmap';

<WeeklyHeatmap
  data={heatmapData} // Array of {dayOfWeek, segment, value, count}
  metric="harmony" // or "success"
  onCellPress={(cell) => console.log(cell)}
/>
```

---

## 📊 Data Flow

```
User Check-In
    ↓
Compute Harmony Score (ephemeris + user element + learned patterns)
    ↓
Save to CheckInStorage (AsyncStorage)
    ↓
Auto-update Peak Window Model (learning algorithm)
    ↓
Home Screen shows updated Peak Windows
    ↓
Insights Screen shows analytics
```

---

## 🔐 Privacy Notes

✅ All data stored locally (AsyncStorage)  
✅ No cloud sync (optional future feature)  
✅ Ephemeris API is public (no personal data sent)  
✅ No tracking or analytics  
✅ Export/import for user control

---

## 🧪 Testing Quick Commands

```typescript
// Clear all check-ins (reset)
import { clearAllCheckIns } from '@/services/CheckInStorage';
await clearAllCheckIns();

// Clear ephemeris cache (force re-fetch)
import { clearEphemerisCache } from '@/services/EphemerisService';
await clearEphemerisCache();

// Export data (backup)
import { exportData } from '@/services/CheckInStorage';
const backup = await exportData();
console.log(JSON.stringify(backup, null, 2));

// Get summary stats
import { getCheckInSummary } from '@/services/CheckInStorage';
const summary = await getCheckInSummary();
console.log(summary);
```

---

## 🎯 Integration Checklist

- ✅ PeakWindowsCard added to home screen
- ✅ Daily check-in enhanced with energy slider
- ✅ Insights screen accessible from home
- ✅ Navigation flow complete
- ✅ AsyncStorage keys unique (`v2` suffix)
- ✅ Dark theme styles consistent
- ✅ Loading states handled
- ✅ Empty states handled
- ✅ Error handling with graceful fallbacks

---

## 📱 User Experience Flow

### First Check-In
1. Home shows empty state: "Check in daily to discover your peak windows"
2. User taps "Check In Now"
3. Selects intention (e.g., "Start")
4. Sets energy slider (e.g., 70%)
5. Gets Divine Timing + Harmony Score (e.g., 65)
6. Saves check-in
7. Returns to home → Harmony score stored

### After 7+ Check-Ins
1. Home shows top 3 personalized peak windows
2. Each window has harmony score + guidance
3. User can tap "View Insights"
4. Sees weekly heatmap, segment stats, recommendations
5. Identifies patterns (e.g., "Best time for study: Morning")

---

## 🔧 Configuration

### Time Segments (Editable)
```typescript
// In types/divine-timing-personal.ts
export const DEFAULT_SEGMENT_RANGES: SegmentTimeRanges = {
  preDawn: { start: '04:00', end: '06:00' },
  morning: { start: '06:00', end: '10:00' },
  midday: { start: '10:00', end: '14:00' },
  afternoon: { start: '14:00', end: '18:00' },
  evening: { start: '18:00', end: '21:00' },
  night: { start: '21:00', end: '04:00' },
};
```

### Learning Parameters
```typescript
// In services/PeakWindowLearner.ts
const OUTCOME_HALF_LIFE_DAYS = 14; // Recent outcomes weighted more
const MIN_CHECKINS_FOR_LEARNING = 3; // Per segment
const ENERGY_WEIGHT = 0.01; // Energy contribution to score
```

### Harmony Score Weights
```typescript
// In services/IlmNujumMapping.ts
Base: 50
Planetary day match: +10
Hour ruler match: +8
Moon element match: +5
Peak window bonus: +0 to +20
Bad outcome penalty: -5
```

---

## 🌐 API Integration

### JPL Horizons Endpoint
```
https://ssd.jpl.nasa.gov/api/horizons.api
```

### Parameters
- `COMMAND`: Planet code (10=Sun, 301=Moon, etc.)
- `CENTER`: '500@399' (Geocentric)
- `QUANTITIES`: '31' (Ecliptic lon & lat)

### Caching
- Key: `ephemeris.cache.${YYYY-MM-DDTHH}:00_${tz}`
- TTL: 24 hours
- Fallback: Approx mode if API fails

**No API key required** (public endpoint)

---

## 🎓 Educational Framework

### Ilm al-Nujum Principles
- **Planetary Day Rulers**: Sun=Sunday, Moon=Monday, Mars=Tuesday, etc.
- **Planetary Hours**: Chaldean sequence (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon)
- **Zodiac Elements**: Fire (Aries, Leo, Sag), Earth (Taurus, Virgo, Cap), Air (Gemini, Libra, Aqua), Water (Cancer, Scorpio, Pisces)
- **Burj Rulers**: Aries=Mars, Taurus=Venus, Gemini=Mercury, etc.

### Reflection Only
- ✅ No predictions ("may favor" not "will succeed")
- ✅ No certainty claims
- ✅ Transparent scoring
- ✅ Educational context
- ✅ Disclaimers in UI

---

## 🐛 Common Issues

### "Approx Mode" Badge
**Normal**: Ephemeris API unavailable. Uses simplified calculations.  
**Solution**: Check network. Will auto-retry on next check-in.

### Harmony Scores Not Personalized
**Cause**: Not enough check-ins (< 3 per segment)  
**Solution**: Continue checking in daily. Takes ~7 days for patterns.

### Insights Screen Empty
**Cause**: No check-ins recorded  
**Solution**: Complete daily check-ins first.

---

## 📈 Future Roadmap (Phase 8+)

- [ ] Outcome tracking (add rating after X hours)
- [ ] Location-based sunrise/sunset times
- [ ] Cloud sync (optional, encrypted)
- [ ] Month/year trends
- [ ] Intention success prediction
- [ ] Energy pattern analysis
- [ ] Friend/family timing compatibility

---

## ✅ Quick Validation

Run these checks to verify Phase 7:

```bash
# 1. Files exist
ls services/EphemerisService.ts
ls services/IlmNujumMapping.ts
ls services/PeakWindowLearner.ts
ls services/CheckInStorage.ts
ls types/divine-timing-personal.ts
ls components/divine-timing/PeakWindowsCard.tsx
ls components/divine-timing/WeeklyHeatmap.tsx
ls app/divine-timing-insights.tsx

# 2. Run app
npm start

# 3. Test flow
# - Home → See Peak Windows Card
# - Tap Check In Now
# - Select intention, set energy, save
# - Return home → Tap View Insights
# - See heatmap + stats
```

---

**Phase 7 Status**: ✅ Complete & Production Ready  
**Version**: 7.0.0  
**Date**: December 27, 2025

For full documentation, see [PHASE_7_DIVINE_TIMING_PERSONALIZATION.md](PHASE_7_DIVINE_TIMING_PERSONALIZATION.md)
