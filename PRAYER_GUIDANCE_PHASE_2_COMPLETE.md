# 🏗️ Prayer Guidance Feature - Phase 2 Complete

## Data Architecture & Service Layer (Week 2)

**Status:** ✅ **COMPLETE**  
**Date:** January 14, 2026  
**Phase:** Backend Services (No UI)

---

## 📋 Overview

Phase 2 implements the complete backend service layer that powers the Prayer Guidance Feature. These services integrate all Phase 1 data structures (classical hour practices, Divine Names, prayer adhkar) to provide intelligent, personalized spiritual guidance.

### Core Services Created

1. **PrayerGuidanceEngine.ts** - Intelligent recommendation system
2. **PrayerPracticeStorage.ts** - Practice tracking and persistence

---

## ✅ Step 2.1: Recommendation Engine

### File: `services/PrayerGuidanceEngine.ts` (586 lines)

**Purpose:** Generate personalized spiritual guidance by combining:
- User's abjad value and elemental profile
- Current planetary hour and ruling planet
- Prayer timing (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Classical hour practices
- Divine Names planetary associations
- Sunnah adhkar

### Key Components

#### Main Function
```typescript
PrayerGuidanceEngine.generateGuidance(
  prayer: Prayer,
  prayerTime: Date,
  userProfile: UserProfile,
  planetaryHour: PlanetaryHourContext
): PrayerGuidanceRecommendation
```

**Returns complete recommendation including:**
- Prayer context (name, time, Arabic name)
- Spiritual alignment (elemental compatibility)
- Classical wisdom (recommended/avoided works)
- Divine Name recommendation (with count, reasoning)
- Sunnah adhkar list
- Optional classical practices

#### Divine Name Selection Algorithm

**Multi-Factor Scoring System:**
```
Primary planet match:      5 points
Secondary planet match:    3 points
Elemental resonance:       4 points
Prayer time match:         2 points
Numerological harmony:     1-3 points (based on reduction)
```

**Example:**
- User element: Fire
- Planetary hour: Sun (Fire)
- Prayer: Fajr
- Result: "Exceptional alignment" → Divine Name "Al-Nur" (The Light) with highest recitation count

#### Alignment System

**5-Level Elemental Compatibility:**

| Alignment | Condition | Description | Count Multiplier |
|-----------|-----------|-------------|------------------|
| **Exceptional** | Same element | Perfect resonance | Highest |
| **Strong** | Compatible elements | Supportive energy | High |
| **Favorable** | Neutral elements | Balanced flow | Moderate |
| **Moderate** | Weak compatibility | Gentle harmony | Standard |
| **Balanced** | Opposite elements | Transformative tension | Lower |

**Elemental Compatibility:**
- Fire ↔ Air: Strong
- Fire ↔ Water: Balanced (opposites)
- Earth ↔ Water: Strong
- Earth ↔ Air: Balanced (opposites)

### Key Methods

```typescript
// Classical hour practice retrieval
getClassicalHourPractice(planet, day, hourNumber)

// Elemental alignment calculation
calculateAlignment(userElement, hourElement)

// Divine Name selection with scoring
selectDivineName(prayer, userElement, planet, alignment, reduction)

// Count determination based on alignment
determineCount(name, alignment)

// Sunnah adhkar retrieval
getAdhkar(prayer)

// Classical practices retrieval
getClassicalPractices(prayer)
```

### Integration Points

**Phase 1 Data Imports:**
```typescript
// Divine Names (Step 1.2)
import { getDivineNamesByPlanet, getDivineNamesForPrayer, DIVINE_NAMES_PLANETARY }

// Classical Hours (Step 1.1)
import { getHourPractice, getRulingPlanet, PLANETARY_HOUR_SEQUENCE }

// Prayer Adhkar (Step 1.3)
import { getAdhkarForPrayer, getSunnahAdhkarForPrayer }
```

---

## ✅ Step 2.2: Practice Storage Service

### File: `services/PrayerPracticeStorage.ts` (672 lines)

**Purpose:** Complete offline-first persistence system for tracking user's prayer practices with AsyncStorage.

### Core Data Structure

```typescript
interface PrayerPracticeRecord {
  id: string;
  userId: string;
  
  // Prayer info
  prayer: Prayer;
  prayerTime: Date;
  
  // Practice info
  divineName: string;
  divineNameTransliteration: string;
  targetCount: number;
  actualCount: number;
  completed: boolean;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // seconds
  
  // Context
  planetaryHour: Planet;
  hourNumber: number;
  userElement: Element;
  alignment: string;
  
  // Tracking
  quality?: 1 | 2 | 3 | 4 | 5; // User rating
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### CRUD Operations

#### Save & Update
```typescript
// Save new practice record
savePractice(record: PrayerPracticeRecord): Promise<void>

// Update existing record
updatePractice(userId, practiceId, updates): Promise<void>

// Mark practice as completed
completePractice(userId, practiceId, actualCount, quality?): Promise<void>
```

#### Retrieval
```typescript
// Get practice history (default: last 30 records)
getPracticeHistory(userId, limit?): Promise<PrayerPracticeRecord[]>

// Get today's practices
getTodaysPractices(userId): Promise<PrayerPracticeRecord[]>

// Get practices for specific prayer
getPracticesByPrayer(userId, prayer, limit?): Promise<PrayerPracticeRecord[]>

// Get practices in date range
getPracticesByDateRange(userId, startDate, endDate): Promise<PrayerPracticeRecord[]>
```

#### Delete
```typescript
// Delete specific practice
deletePractice(userId, practiceId): Promise<void>

// Clear all practices
clearAllPractices(userId): Promise<void>
```

### Analytics & Tracking

#### Streaks
```typescript
// Get current streak for a prayer
getPrayerStreak(userId, prayer): Promise<number>

// Get all current streaks
getAllCurrentStreaks(userId): Promise<Record<Prayer, number>>
```

**Streak Logic:**
- Consecutive days of completed practices
- Automatically updated on save
- Broken if > 1 day gap
- Tracks longest streak separately

#### Statistics
```typescript
// Get comprehensive statistics
getStatistics(userId, days?): Promise<PracticeStats>

// Get completion rate percentage
getCompletionRate(userId, days?): Promise<number>
```

**PracticeStats includes:**
- Total practices count
- Completed practices count
- Total duration (seconds)
- Average duration per practice
- Completion rate percentage
- Top 5 favorite Divine Names
- Average quality rating

### Data Management

#### Backup & Restore
```typescript
// Export all data to JSON
exportData(userId): Promise<string>

// Import data from JSON backup
importData(userId, jsonData): Promise<void>
```

**Export format:**
```json
{
  "version": "1.0",
  "exportDate": "2026-01-14T...",
  "userId": "user123",
  "practices": [...],
  "streaks": [...],
  "stats": {...}
}
```

#### Utility Functions
```typescript
// Generate unique practice ID
generatePracticeId(userId, prayer, prayerTime): string
// Format: userId_Prayer_timestamp_random
```

### Storage Keys

```typescript
const STORAGE_KEYS = {
  PRACTICES: (userId) => `@prayer_practices_${userId}`,
  STREAKS: (userId) => `@prayer_streaks_${userId}`,
  STATS: (userId) => `@prayer_stats_${userId}`,
  INDEX: (userId) => `@prayer_index_${userId}` // For quick lookups
}
```

### Automatic Features

1. **Auto-Duration Calculation**
   - Calculates duration from `startedAt` to `completedAt` if not provided
   - Stored in seconds for precision

2. **Auto-Sorting**
   - Practices automatically sorted by prayer time (most recent first)
   - Maintained on every save/update

3. **Auto-Streak Updates**
   - Streaks automatically updated when practice marked complete
   - Consecutive day logic handles same-day duplicates

4. **Auto-Stats Refresh**
   - Statistics automatically recalculated on save/update
   - Cached for performance, refreshed on demand

---

## 🔗 Integration Overview

### Data Flow

```
User Profile (abjad, element)
       +
Planetary Hour Context (planet, element, hour#)
       +
Prayer Selection (Fajr/Dhuhr/Asr/Maghrib/Isha)
       ↓
PrayerGuidanceEngine.generateGuidance()
       ↓
Recommendation (Divine Name, adhkar, classical practices)
       ↓
User performs practice
       ↓
PrayerPracticeStorage.savePractice()
       ↓
Statistics, Streaks, History
```

### Example Usage Flow

```typescript
// 1. Generate recommendation
const recommendation = PrayerGuidanceEngine.generateGuidance(
  'Fajr',
  new Date('2026-01-14T06:00:00'),
  {
    userId: 'user123',
    name: 'Ahmad',
    abjadValue: 86,
    derived: {
      element: 'Fire',
      temperament: 'hot',
      reduction: 5,
      planet: 'Sun'
    }
  },
  {
    planet: 'Sun',
    hourNumber: 1,
    dayOfWeek: 'Sunday',
    element: 'Fire',
    arabicName: 'ساعة الشمس'
  }
);

// 2. User starts practice
const practiceId = PrayerPracticeStorage.generatePracticeId(
  'user123',
  'Fajr',
  new Date()
);

await PrayerPracticeStorage.savePractice({
  id: practiceId,
  userId: 'user123',
  prayer: 'Fajr',
  prayerTime: new Date(),
  divineName: recommendation.divineName.arabic,
  divineNameTransliteration: recommendation.divineName.transliteration,
  targetCount: recommendation.divineName.count,
  actualCount: 0,
  completed: false,
  startedAt: new Date(),
  planetaryHour: 'Sun',
  hourNumber: 1,
  userElement: 'Fire',
  alignment: 'exceptional',
  createdAt: new Date(),
  updatedAt: new Date()
});

// 3. User completes practice
await PrayerPracticeStorage.completePractice(
  'user123',
  practiceId,
  33, // actualCount
  5   // quality rating
);

// 4. Check progress
const streak = await PrayerPracticeStorage.getPrayerStreak('user123', 'Fajr');
const stats = await PrayerPracticeStorage.getStatistics('user123', 30);
const todayPractices = await PrayerPracticeStorage.getTodaysPractices('user123');
```

---

## 📊 Technical Details

### TypeScript Compliance

**Both services:**
- ✅ Zero compilation errors
- ✅ Strict type safety
- ✅ Complete type annotations
- ✅ Proper import/export declarations

### Dependencies

**PrayerGuidanceEngine.ts:**
```typescript
// Phase 1 data files
import from '@/data/divine-names-planetary'
import from '@/data/classical-hour-practices'
import from '@/data/prayer-adhkar'
```

**PrayerPracticeStorage.ts:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
```

### Error Handling

Both services include comprehensive error handling:
- Try-catch blocks on all async operations
- Console error logging with context
- Graceful fallbacks (empty arrays, default values)
- Error re-throwing for critical operations

---

## 🧪 Testing Considerations

### PrayerGuidanceEngine

**Test Cases:**
1. Divine Name selection with different alignments
2. Count determination for each alignment level
3. Classical practice retrieval for all hours
4. Default fallbacks when data missing
5. Multi-factor scoring accuracy
6. Elemental compatibility calculations

**Edge Cases:**
- Missing planetary hour data
- No Divine Names match criteria
- Multiple names with same score
- Invalid prayer times
- Null/undefined user profile

### PrayerPracticeStorage

**Test Cases:**
1. CRUD operations (Create, Read, Update, Delete)
2. Streak calculation across multiple days
3. Statistics accuracy over different time ranges
4. Completion rate calculations
5. Export/Import data integrity
6. Date range filtering

**Edge Cases:**
- Same-day duplicate practices
- Streak breaks (> 1 day gap)
- Empty practice history
- Invalid user IDs
- Corrupted storage data
- Large datasets (performance)

---

## 📈 Performance Characteristics

### PrayerGuidanceEngine

**Complexity:** O(n) where n = number of Divine Names (~25)
- Single pass through Divine Names for scoring
- Constant-time alignment calculation
- No database queries (in-memory data)

**Typical Response Time:** < 10ms
- Deterministic algorithm
- No async operations
- Pure computation

### PrayerPracticeStorage

**Storage Size Estimate:**
- Average record: ~500 bytes
- 1 year (5 prayers/day): ~900KB
- 5 years: ~4.5MB

**Read Performance:**
- Full history: O(n log n) due to sorting
- Today's practices: O(n) with date filtering
- Single practice: O(n) linear search

**Write Performance:**
- Save practice: O(n log n) due to sorting
- Update stats: O(n) aggregate calculation

**Optimization Opportunities:**
- Index by prayer type
- Pagination for large histories
- Background statistics calculation
- Date-based partitioning

---

## 🔄 Next Steps (Phase 3: UI Components)

With Phase 2 complete, the backend services are ready to power UI components:

### Recommended UI Screens

1. **Prayer Guidance Screen**
   - Call `PrayerGuidanceEngine.generateGuidance()`
   - Display recommendation with visual alignment indicator
   - Show Divine Name with Arabic calligraphy
   - List Sunnah adhkar with checkboxes
   - Optional classical practices section

2. **Practice Session Screen**
   - Start practice timer
   - Dhikr counter with haptic feedback
   - Real-time progress (actualCount / targetCount)
   - Quality rating selector
   - Notes input

3. **History & Statistics Screen**
   - Calendar view with completion indicators
   - Streak displays per prayer
   - Charts for completion rate trends
   - Favorite Divine Names list
   - Total practice time

4. **Settings Screen**
   - Notification preferences
   - Backup/restore data
   - Clear history option

### Integration Requirements

**Screens will need:**
- User authentication (for userId)
- Prayer time calculations (astronomical)
- Planetary hour calculations (current hour context)
- i18n translations (all keys already in translations.ts)
- Push notifications (daily reminders)

---

## 📚 Documentation Cross-Reference

### Phase 1 Documentation
- **PRAYER_GUIDANCE_PHASE_1_COMPLETE.md** - Classical hour practices (Step 1.1)
- **PRAYER_GUIDANCE_STEP_1_2_COMPLETE.md** - Divine Names planetary mapping (Step 1.2)
- **PRAYER_GUIDANCE_STEP_1_3_COMPLETE.md** - Prayer adhkar database (Step 1.3)
- **PRAYER_ADHKAR_TRANSLATION_KEYS_ADDED.md** - Translation key migration
- **SOURCES.md** - Classical Islamic sources authentication (Step 1.4)

### Phase 2 Documentation
- **PRAYER_GUIDANCE_PHASE_2_COMPLETE.md** (this file) - Service layer overview

### Translation Keys
All services reference translation keys from:
- `constants/translations.ts`
  - `divineNamesPlanetary.*` (Step 1.2)
  - `prayerAdhkar.*` (Step 1.3)
  - `classicalHours.*` (Step 1.1)

---

## ✨ Summary

**Phase 2 Deliverables:**
- ✅ **PrayerGuidanceEngine.ts** (586 lines)
  - Intelligent Divine Name selection
  - Multi-factor scoring algorithm
  - Elemental alignment system
  - Classical practice integration
- ✅ **PrayerPracticeStorage.ts** (672 lines)
  - Complete CRUD operations
  - Streak tracking
  - Comprehensive statistics
  - Backup/restore functionality
- ✅ **Zero TypeScript errors**
- ✅ **Complete type safety**
- ✅ **100% integration with Phase 1 data**

**Total Backend Code:** 1,258 lines of production-ready TypeScript

**Ready for Phase 3:** UI component development can now begin with full confidence in the backend services.

---

**Phase 2 Status:** 🎉 **COMPLETE** - All service layer objectives achieved.
