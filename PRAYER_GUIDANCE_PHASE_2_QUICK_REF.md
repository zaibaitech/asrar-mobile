# Prayer Guidance Phase 2 - Quick Reference

## 🚀 Service Files

### 1. PrayerGuidanceEngine.ts
**Location:** `services/PrayerGuidanceEngine.ts`  
**Lines:** 586  
**Purpose:** Generate personalized spiritual guidance

#### Main Function
```typescript
PrayerGuidanceEngine.generateGuidance(
  prayer: Prayer,           // 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'
  prayerTime: Date,
  userProfile: UserProfile,
  planetaryHour: PlanetaryHourContext
): PrayerGuidanceRecommendation
```

#### Quick Example
```typescript
const recommendation = PrayerGuidanceEngine.generateGuidance(
  'Fajr',
  new Date(),
  {
    userId: 'user123',
    name: 'Ahmad',
    abjadValue: 86,
    derived: { element: 'Fire', temperament: 'hot', reduction: 5, planet: 'Sun' }
  },
  {
    planet: 'Sun',
    hourNumber: 1,
    dayOfWeek: 'Sunday',
    element: 'Fire',
    arabicName: 'ساعة الشمس'
  }
);

// Access recommendation data:
console.log(recommendation.divineName.arabic);        // "النُّور"
console.log(recommendation.divineName.count);         // 33
console.log(recommendation.context.alignment);        // "exceptional"
console.log(recommendation.adhkar.length);            // 5 Sunnah adhkar
```

---

### 2. PrayerPracticeStorage.ts
**Location:** `services/PrayerPracticeStorage.ts`  
**Lines:** 672  
**Purpose:** Track and persist prayer practices

#### Core Operations

**Save Practice:**
```typescript
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
  divineName: 'النُّور',
  divineNameTransliteration: 'An-Nur',
  targetCount: 33,
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
```

**Complete Practice:**
```typescript
await PrayerPracticeStorage.completePractice(
  'user123',
  practiceId,
  33,  // actualCount
  5    // quality (1-5)
);
```

**Get Today's Practices:**
```typescript
const today = await PrayerPracticeStorage.getTodaysPractices('user123');
// Returns: PrayerPracticeRecord[]
```

**Get Streak:**
```typescript
const streak = await PrayerPracticeStorage.getPrayerStreak('user123', 'Fajr');
// Returns: number (consecutive days)
```

**Get Statistics:**
```typescript
const stats = await PrayerPracticeStorage.getStatistics('user123', 30);
// Returns: {
//   totalPractices: 45,
//   completedPractices: 42,
//   totalDuration: 12600,
//   averageDuration: 300,
//   completionRate: 93.3,
//   favoriteNames: [{ name: 'النُّور', count: 12 }, ...],
//   averageQuality: 4.2
// }
```

**Export/Import:**
```typescript
// Backup
const json = await PrayerPracticeStorage.exportData('user123');
await saveToFile(json);

// Restore
await PrayerPracticeStorage.importData('user123', json);
```

---

## 🎯 Common Use Cases

### Use Case 1: Generate Guidance at Prayer Time
```typescript
import { PrayerGuidanceEngine } from '@/services/PrayerGuidanceEngine';

function onPrayerTime(prayer, prayerTime, user, currentHour) {
  const guidance = PrayerGuidanceEngine.generateGuidance(
    prayer,
    prayerTime,
    user,
    currentHour
  );
  
  // Show notification with Divine Name
  showNotification({
    title: `Time for ${prayer}`,
    body: `Recommended: ${guidance.divineName.transliteration} (${guidance.divineName.count}x)`,
    data: guidance
  });
}
```

### Use Case 2: Track Practice Session
```typescript
import PrayerPracticeStorage from '@/services/PrayerPracticeStorage';

async function startPracticeSession(userId, prayer, guidance) {
  const practiceId = PrayerPracticeStorage.generatePracticeId(
    userId,
    prayer,
    new Date()
  );
  
  await PrayerPracticeStorage.savePractice({
    id: practiceId,
    userId,
    prayer,
    prayerTime: new Date(),
    divineName: guidance.divineName.arabic,
    divineNameTransliteration: guidance.divineName.transliteration,
    targetCount: guidance.divineName.count,
    actualCount: 0,
    completed: false,
    startedAt: new Date(),
    planetaryHour: guidance.context.currentPlanetaryHour.planet,
    hourNumber: guidance.context.currentPlanetaryHour.number,
    userElement: guidance.context.userElement,
    alignment: guidance.context.alignment,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return practiceId;
}
```

### Use Case 3: Display User Progress
```typescript
async function getUserProgress(userId) {
  const [fajrStreak, stats, todayPractices] = await Promise.all([
    PrayerPracticeStorage.getPrayerStreak(userId, 'Fajr'),
    PrayerPracticeStorage.getStatistics(userId, 30),
    PrayerPracticeStorage.getTodaysPractices(userId)
  ]);
  
  return {
    currentStreak: fajrStreak,
    monthlyStats: stats,
    todayCompleted: todayPractices.filter(p => p.completed).length,
    todayTotal: todayPractices.length
  };
}
```

---

## 📊 Type Reference

### Key Types

```typescript
// Prayer type
type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

// Planetary types
type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';

// Elemental types
type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

// Alignment levels
type Alignment = 'exceptional' | 'strong' | 'favorable' | 'moderate' | 'balanced';
```

### UserProfile
```typescript
interface UserProfile {
  userId: string;
  name: string;
  abjadValue: number;
  derived: {
    element: Element;
    temperament: Temperament;
    reduction: number;
    planet?: Planet;
  };
}
```

### PlanetaryHourContext
```typescript
interface PlanetaryHourContext {
  planet: Planet;
  hourNumber: number;
  dayOfWeek: DayOfWeek;
  element: Element;
  arabicName: string;
}
```

### PrayerGuidanceRecommendation
```typescript
interface PrayerGuidanceRecommendation {
  prayer: {
    name: Prayer;
    time: Date;
    arabicName: string;
  };
  context: {
    userElement: Element;
    currentPlanetaryHour: {
      planet: Planet;
      number: number;
      arabicName: string;
    };
    dayRuler: Planet;
    alignment: Alignment;
    alignmentDescription: string;
  };
  classicalWisdom: {
    recommendedWorks: string[];
    worksToAvoid: string[];
    originalText: string;
    source: string;
  };
  divineName: {
    arabic: string;
    transliteration: string;
    translationKey: string;
    count: number;
    abjadValue: number;
    reasoning: {
      planetaryAlignment: string;
      elementalResonance: string;
      numerologicalSignificance: string;
      classicalSource: string;
    };
    benefitKeys: string[];
  };
  adhkar: Array<{
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
    count: number;
    benefitKey: string;
    source: string;
  }>;
  classicalPractices: Array<...>;
}
```

### PrayerPracticeRecord
```typescript
interface PrayerPracticeRecord {
  id: string;
  userId: string;
  prayer: Prayer;
  prayerTime: Date;
  divineName: string;
  divineNameTransliteration: string;
  targetCount: number;
  actualCount: number;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  planetaryHour: Planet;
  hourNumber: number;
  userElement: Element;
  alignment: string;
  quality?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ⚡ Key Algorithms

### Divine Name Selection Scoring

```
Score Calculation:
1. Planetary Alignment:
   - Primary planet match: +5 points
   - Secondary planet match: +3 points

2. Elemental Resonance:
   - Element match: +4 points

3. Prayer Time Match:
   - Name in prayer-specific list: +2 points

4. Numerological Harmony:
   - Perfect reduction match: +3 points
   - Close reduction match: +2 points
   - Distant match: +1 point

Highest scoring name wins!
```

### Elemental Alignment

```
Same Element (Fire-Fire):        → Exceptional
Compatible (Fire-Air):           → Strong
Neutral (Fire-Earth):            → Favorable
Weak Compatibility:              → Moderate
Opposite (Fire-Water):           → Balanced
```

### Streak Calculation

```
Last Practice: Yesterday → Continue streak (+1)
Last Practice: Today     → Same streak (no change)
Last Practice: 2+ days   → Reset streak to 0
```

---

## 🔗 Integration Points

### Phase 1 Data Dependencies

**PrayerGuidanceEngine imports:**
```typescript
// Divine Names (Step 1.2)
import { getDivineNamesByPlanet } from '@/data/divine-names-planetary';
import { getDivineNamesForPrayer } from '@/data/divine-names-planetary';

// Classical Hours (Step 1.1)
import { getHourPractice } from '@/data/classical-hour-practices';
import { getRulingPlanet } from '@/data/classical-hour-practices';

// Prayer Adhkar (Step 1.3)
import { getSunnahAdhkarForPrayer } from '@/data/prayer-adhkar';
import { getAdhkarForPrayer } from '@/data/prayer-adhkar';
```

### Storage Keys (AsyncStorage)

```typescript
@prayer_practices_${userId}  // All practice records
@prayer_streaks_${userId}    // Streak data per prayer
@prayer_stats_${userId}      // Cached statistics
@prayer_index_${userId}      // Quick lookup index
```

---

## 🧪 Quick Testing

### Test Recommendation Engine
```typescript
// Create test user profile
const testUser = {
  userId: 'test123',
  name: 'Test User',
  abjadValue: 86,
  derived: {
    element: 'Fire' as Element,
    temperament: 'hot' as Temperament,
    reduction: 5,
    planet: 'Sun' as Planet
  }
};

// Create test planetary hour
const testHour = {
  planet: 'Sun' as Planet,
  hourNumber: 1,
  dayOfWeek: 'Sunday' as DayOfWeek,
  element: 'Fire' as Element,
  arabicName: 'ساعة الشمس'
};

// Generate recommendation
const result = PrayerGuidanceEngine.generateGuidance(
  'Fajr',
  new Date(),
  testUser,
  testHour
);

console.log('Recommendation:', result);
```

### Test Storage Service
```typescript
// Test save
const practiceId = PrayerPracticeStorage.generatePracticeId(
  'test123',
  'Fajr',
  new Date()
);

await PrayerPracticeStorage.savePractice({
  id: practiceId,
  userId: 'test123',
  prayer: 'Fajr',
  prayerTime: new Date(),
  divineName: 'النُّور',
  divineNameTransliteration: 'An-Nur',
  targetCount: 33,
  actualCount: 33,
  completed: true,
  startedAt: new Date(Date.now() - 300000), // 5 min ago
  completedAt: new Date(),
  duration: 300,
  planetaryHour: 'Sun',
  hourNumber: 1,
  userElement: 'Fire',
  alignment: 'exceptional',
  quality: 5,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Verify
const history = await PrayerPracticeStorage.getPracticeHistory('test123');
console.log('Saved practices:', history.length);
```

---

## 📚 Documentation

**Complete Documentation:** `PRAYER_GUIDANCE_PHASE_2_COMPLETE.md`

**Related Files:**
- Phase 1 Data: `data/divine-names-planetary.ts`
- Phase 1 Data: `data/classical-hour-practices.ts`
- Phase 1 Data: `data/prayer-adhkar.ts`
- Translations: `constants/translations.ts`
- Sources: `SOURCES.md`

---

## ✅ Status

**Both services:** Zero TypeScript errors, production ready!

**Total Code:** 1,258 lines of tested, type-safe backend logic.
