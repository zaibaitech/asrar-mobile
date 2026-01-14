# Prayer Guidance Feature - Phase 1: Classical Content Foundation ✅

## Overview
Phase 1 establishes the foundational data structure for Classical Planetary Hour Practices based on West African Maghribi tradition. This provides authentic content that will be used throughout the Prayer Guidance feature.

## ✅ What Was Completed

### 1. Data Structure Created
**File**: [data/classical-hour-practices.ts](data/classical-hour-practices.ts)

#### TypeScript Interfaces
```typescript
// Core types
type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
type HourNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Work/Practice definition
interface ClassicalWork {
  id: string;                    // Unique identifier
  nameKey: string;                // Translation key for work name
  descriptionKey?: string;        // Translation key for description
}

// Hour practice definition
interface ClassicalHourPractice {
  day: DayOfWeek;
  hourNumber: HourNumber;
  planet: Planet;
  recommendedWorks: ClassicalWork[];
  avoidWorks: ClassicalWork[];
  arabicText: string;            // Original classical Arabic text
  source: {
    title: string;
    tradition: string;
    page?: string;
  };
  notes?: string;
}
```

### 2. Sunday Hours Complete (12/12 Hours)
All 12 planetary hours for Sunday have been implemented with:
- ✅ Ruling planet for each hour
- ✅ Recommended works (translation keys)
- ✅ Works to avoid (translation keys)
- ✅ Original Arabic classical text
- ✅ Source attribution (West African Maghribi tradition)

#### Sunday Hour Sequence
| Hour | Planet  | Recommended Works | Avoid Works |
|------|---------|-------------------|-------------|
| 1    | Sun     | Talismans, Reversal Work, al-Maski, Hindu Binding, Burnt Wool Ink | - |
| 2    | Venus   | Correctness & Sweetness, Dominance over Rulers, Works on Judges | - |
| 3    | Mercury | Learning & Study, Communication, Trade & Commerce | - |
| 4    | Moon    | Journeys & Travel, Water Works, Emotional Matters | - |
| 5    | Saturn  | Binding & Restriction, Protection Work | Marriage, Joyful Works |
| 6    | Jupiter | Seeking Favor, Wealth & Expansion, Religious Matters | - |
| 7    | Mars    | Courage & Strength, Conflict Resolution | Peaceful Negotiations |
| 8    | Sun     | Authority & Leadership, Honors & Recognition | - |
| 9    | Venus   | Love & Attraction, Beauty & Arts, Harmony & Peace | - |
| 10   | Mercury | Writing & Documentation, Contracts & Agreements, Intellectual Pursuits | - |
| 11   | Moon    | Dreams & Visions, Intuition Work, Feminine Matters | - |
| 12   | Saturn  | Endings & Closures, Deep Meditation, Ancestral Work | New Beginnings |

### 3. Translation Keys Added (Bilingual EN/FR)
**File**: [constants/translations.ts](constants/translations.ts)

#### Structure
```typescript
prayerGuidance: {
  title: "Prayer Guidance" / "Guidance de Prière",
  subtitle: "Classical planetary hour practices..." / "Pratiques classiques...",
  
  days: { Sunday, Monday, ... } // EN & FR
  planets: { Sun, Moon, Mars, ... } // EN & FR
  hours: { hour, hourNumber, rulingPlanet, ... } // Labels EN & FR
  
  works: {
    // 31 different classical works with:
    talismansSeals: {
      name: "..." / "...",           // EN & FR
      description: "..." / "...",    // EN & FR
    },
    // ... (31 total works)
  }
}
```

#### Complete Work Categories (31 Works Total)
1. **Talismans & Sacred Works** (5 works)
   - Talismans and Blessed Seals
   - Reversal Work (al-Radd)
   - Al-Maski
   - Hindu Binding
   - Burnt Wool Ink

2. **Social & Authority** (3 works)
   - Correctness & Sweetness
   - Dominance over Rulers
   - Works on Judges

3. **Learning & Communication** (6 works)
   - Learning & Study
   - Communication
   - Trade & Commerce
   - Writing & Documentation
   - Contracts & Agreements
   - Intellectual Pursuits

4. **Emotional & Intuitive** (5 works)
   - Journeys & Travel
   - Water Works
   - Emotional Matters
   - Dreams & Visions
   - Intuition Work
   - Feminine Matters

5. **Protection & Binding** (2 works)
   - Binding & Restriction
   - Protection Work

6. **Spiritual & Religious** (4 works)
   - Seeking Favor
   - Wealth & Expansion
   - Religious Matters
   - Ancestral Work

7. **Strength & Conflict** (2 works)
   - Courage & Strength
   - Conflict Resolution

8. **Leadership & Recognition** (2 works)
   - Authority & Leadership
   - Honors & Recognition

9. **Love & Harmony** (3 works)
   - Love & Attraction
   - Beauty & Arts
   - Harmony & Peace

10. **Cycles & Timing** (3 works)
    - Endings & Closures
    - Deep Meditation
    - New Beginnings (to avoid)

11. **To Avoid** (3 works)
    - Marriage Matters (during Saturn)
    - Joyful Works (during Saturn)
    - Peaceful Negotiations (during Mars)

### 4. Helper Functions Created

```typescript
// Planetary hour sequence for all 7 days (Chaldean order)
export const PLANETARY_HOUR_SEQUENCE: Record<DayOfWeek, Planet[]>;

// Get ruling planet for specific day/hour
export function getRulingPlanet(day: DayOfWeek, hourNumber: HourNumber): Planet;

// Get all practices for a day
export function getHourPracticesForDay(day: DayOfWeek): ClassicalHourPractice[];

// Get specific hour practice
export function getHourPractice(day: DayOfWeek, hourNumber: HourNumber): ClassicalHourPractice | null;

// Calculate current planetary hour (placeholder - needs astronomical calc)
export function getCurrentPlanetaryHour(date?: Date): { day: DayOfWeek; hour: HourNumber; planet: Planet } | null;
```

## 📊 Translation Coverage

| Category | EN Keys | FR Keys | Coverage |
|----------|---------|---------|----------|
| Days | 7 | 7 | 100% ✅ |
| Planets | 7 | 7 | 100% ✅ |
| Hour Labels | 7 | 7 | 100% ✅ |
| Classical Works | 31 | 31 | 100% ✅ |
| **TOTAL** | **52** | **52** | **100% ✅** |

## 🎯 How to Use

### 1. Access Sunday Hour Data
```typescript
import { sundayHourPractices, getHourPractice } from '@/data/classical-hour-practices';

// Get all Sunday hours
const allHours = sundayHourPractices;

// Get specific hour
const hour5 = getHourPractice('Sunday', 5);
console.log(hour5?.planet); // "Saturn"
console.log(hour5?.recommendedWorks); // Array of ClassicalWork objects
```

### 2. Display Translated Content
```typescript
import { useLanguage } from '@/contexts/LanguageContext';
import { getHourPractice } from '@/data/classical-hour-practices';

function HourDisplay() {
  const { t } = useLanguage();
  const hourData = getHourPractice('Sunday', 1);
  
  if (!hourData) return null;
  
  return (
    <View>
      {/* Planet name */}
      <Text>{t(`prayerGuidance.planets.${hourData.planet}`)}</Text>
      
      {/* Recommended works */}
      {hourData.recommendedWorks.map(work => (
        <View key={work.id}>
          <Text>{t(work.nameKey)}</Text>
          {work.descriptionKey && <Text>{t(work.descriptionKey)}</Text>}
        </View>
      ))}
      
      {/* Arabic classical text */}
      <Text>{hourData.arabicText}</Text>
    </View>
  );
}
```

### 3. Get Current Planetary Hour
```typescript
import { getCurrentPlanetaryHour } from '@/data/classical-hour-practices';

// NOTE: Currently returns null - needs astronomical calculation in Phase 2
const current = getCurrentPlanetaryHour();
if (current) {
  const { day, hour, planet } = current;
  console.log(`Current: ${day} Hour ${hour} (${planet})`);
}
```

## 📝 Data Quality

### Authenticity
- ✅ Based on classical West African Maghribi tradition
- ✅ Original Arabic text included for each hour
- ✅ Source attribution provided
- ✅ Traditional work categories preserved

### Completeness
- ✅ Sunday: 12/12 hours complete
- ⏳ Monday: 0/12 (pending Phase 1 continuation)
- ⏳ Tuesday: 0/12 (pending Phase 1 continuation)
- ⏳ Wednesday: 0/12 (pending Phase 1 continuation)
- ⏳ Thursday: 0/12 (pending Phase 1 continuation)
- ⏳ Friday: 0/12 (pending Phase 1 continuation)
- ⏳ Saturday: 0/12 (pending Phase 1 continuation)

**Total Progress: 12/84 hours (14%)**

## 🔄 Next Steps

### Phase 1 Continuation
1. **Complete remaining days** (Monday - Saturday)
   - Each day follows same pattern as Sunday
   - Planetary sequence is different for each day (see `PLANETARY_HOUR_SEQUENCE`)
   - Works may vary based on classical sources

2. **Add more classical sources**
   - Document different traditions (if available)
   - Add page references
   - Include scholarly notes

### Phase 2: Data Architecture & Service Layer
1. **Astronomical calculations**
   - Implement sunrise/sunset calculation
   - Calculate actual planetary hour durations
   - Create `getCurrentPlanetaryHour()` implementation

2. **Service layer**
   - `PrayerGuidanceService.ts`
   - Hour calculation logic
   - Caching strategy
   - User preference handling

3. **Database integration** (if needed)
   - Store user's preferred tradition
   - Track hour practice history
   - Save favorite practices

### Phase 3: Basic UI Components
1. **Hour display component**
2. **Day selector**
3. **Work list component**
4. **Arabic text display**

## 🧪 Testing Checklist

### Data Integrity
- [x] All Sunday hours have ruling planet
- [x] All works have translation keys
- [x] All translation keys exist in both EN and FR
- [x] Arabic text present for all hours
- [x] Source attribution complete

### Translation System
- [x] All `nameKey` values resolve correctly
- [x] All `descriptionKey` values resolve correctly
- [x] French translations are accurate
- [x] No missing keys in either language

### Helper Functions
- [x] `getRulingPlanet()` returns correct planet for Sunday hours
- [x] `getHourPracticesForDay('Sunday')` returns 12 hours
- [x] `getHourPractice()` returns correct hour data
- [ ] `getCurrentPlanetaryHour()` calculates correctly (Phase 2)

## 📚 Developer Notes

### Adding New Days
To add Monday-Saturday:

1. Create array similar to `sundayHourPractices`
2. Use `PLANETARY_HOUR_SEQUENCE` to get correct planet order
3. Add classical Arabic text for each hour
4. Ensure all works use existing translation keys (or add new ones)

Example:
```typescript
export const mondayHourPractices: ClassicalHourPractice[] = [
  {
    day: 'Monday',
    hourNumber: 1,
    planet: 'Moon', // First hour of Monday is Moon
    recommendedWorks: [
      {
        id: 'journeys_travel',
        nameKey: 'prayerGuidance.works.journeysTravel.name',
        descriptionKey: 'prayerGuidance.works.journeysTravel.description',
      },
      // ... more works
    ],
    avoidWorks: [],
    arabicText: '...',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  // ... hours 2-12
];
```

### Translation Key Convention
- **Pattern**: `prayerGuidance.works.{workId}.{name|description}`
- **Work ID**: camelCase, descriptive (e.g., `talismansSeals`, `reversalWork`)
- **Consistency**: Same work across different hours uses same translation key

### Classical Source Notes
The West African Maghribi tradition represents a specific lineage of planetary hour practice. Future phases could include:
- Ottoman tradition
- Persian tradition
- North African variations
- Modern interpretations

Each tradition could be stored with `tradition` field and UI could allow users to filter/select.

## 🎉 Phase 1 Summary

**Status**: ✅ COMPLETE (Sunday hours foundation established)

**Deliverables**:
1. ✅ TypeScript data structure (`classical-hour-practices.ts`)
2. ✅ Complete Sunday 12-hour cycle
3. ✅ Bilingual translation keys (EN/FR)
4. ✅ 31 classical works defined
5. ✅ Helper functions for data access
6. ✅ Documentation

**Ready for**:
- Phase 1 continuation (add remaining 6 days)
- Phase 2 (astronomical calculations & service layer)
- Phase 3 (UI component development)

---

**Last Updated**: Phase 1 Foundation - Sunday Hours Complete  
**Next Phase**: Continue Phase 1 (Monday-Saturday) or begin Phase 2 (Services)
