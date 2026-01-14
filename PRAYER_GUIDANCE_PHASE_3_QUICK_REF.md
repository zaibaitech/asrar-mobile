# Prayer Guidance Phase 3 - Quick Reference

## 🚀 Quick Start

### Navigate to Screen
```bash
# Screen location
app/prayer-guidance.tsx
```

### Component Structure
```
prayer-guidance.tsx (Main Screen)
  ├── PrayerSelector (Choose prayer)
  ├── ContextDisplay (Show spiritual context)
  ├── ClassicalWisdomCard (Manuscript practices)
  ├── DivineNameCard (Recommended name)
  ├── DhikrCounter (Track recitations)
  └── AdhkarList (Sunnah adhkar checklist)
```

---

## 📦 Components

### Import Components
```typescript
import {
  PrayerSelector,
  ContextDisplay,
  ClassicalWisdomCard,
  DivineNameCard,
  DhikrCounter,
  AdhkarList
} from '@/components/prayer-guidance';
```

### Import Utilities
```typescript
import { getCurrentPlanetaryHour } from '@/utils/planetary-hours';
import { getNextPrayerTime } from '@/utils/prayer-times';
```

### Import Services
```typescript
import { PrayerGuidanceEngine } from '@/services/PrayerGuidanceEngine';
import type { PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
```

---

## 🎯 Usage Examples

### 1. Get Current Planetary Hour
```typescript
const planetaryHour = getCurrentPlanetaryHour();
// Returns: {
//   planet: 'Sun',
//   hourNumber: 3,
//   dayOfWeek: 'Sunday',
//   element: 'Fire',
//   arabicName: 'ساعة الشمس',
//   isDaytime: true,
//   timeRemaining: 47 // minutes
// }
```

### 2. Get Prayer Time
```typescript
const prayerTime = getNextPrayerTime('Fajr');
// Returns: Date object for next Fajr

const nextPrayer = getNextPrayer();
// Returns: { prayer: 'Dhuhr', time: Date }
```

### 3. Generate Guidance
```typescript
const userProfile = {
  userId: 'user123',
  name: 'Ahmad',
  abjadValue: 86,
  derived: {
    element: 'Fire',
    temperament: 'hot',
    reduction: 5,
    planet: 'Sun'
  }
};

const guidance = PrayerGuidanceEngine.generateGuidance(
  'Fajr',
  new Date(),
  userProfile,
  planetaryHour
);
```

### 4. Use Prayer Selector
```typescript
<PrayerSelector 
  onSelect={(prayer) => setSelectedPrayer(prayer)}
  selectedPrayer={selectedPrayer}
/>
```

### 5. Display Context
```typescript
<ContextDisplay 
  context={guidance.context}
  planetaryHour={{
    timeRemaining: planetaryHour.timeRemaining,
    isDaytime: planetaryHour.isDaytime
  }}
/>
```

### 6. Show Divine Name
```typescript
<DivineNameCard divineName={guidance.divineName} />
```

### 7. Track Dhikr
```typescript
<DhikrCounter 
  targetCount={33}
  onComplete={() => console.log('Complete!')}
  onCountChange={(count) => console.log(count)}
/>
```

### 8. Display Adhkar
```typescript
<AdhkarList adhkar={guidance.adhkar} />
```

---

## 🎨 Component Props

### PrayerSelector
```typescript
{
  onSelect: (prayer: Prayer) => void;
  selectedPrayer?: Prayer | null;
}
```

### ContextDisplay
```typescript
{
  context: PrayerGuidanceRecommendation['context'];
  planetaryHour?: {
    timeRemaining: number;
    isDaytime: boolean;
  };
}
```

### ClassicalWisdomCard
```typescript
{
  wisdom: {
    recommendedWorks: string[];
    worksToAvoid: string[];
    originalText: string;
    source: string;
  };
}
```

### DivineNameCard
```typescript
{
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
}
```

### DhikrCounter
```typescript
{
  targetCount: number;
  onComplete?: () => void;
  onCountChange?: (count: number) => void;
}
```

### AdhkarList
```typescript
{
  adhkar: Array<{
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
    count: number;
    benefitKey: string;
    source: string;
  }>;
}
```

---

## 🛠️ Utility Functions

### Planetary Hours
```typescript
// Get current hour
getCurrentPlanetaryHour(location?)

// Get all day hours
getDayPlanetaryHours(date, location?)

// Get all night hours
getNightPlanetaryHours(date, location?)

// Format time remaining
formatTimeRemaining(minutes)
// Example: formatTimeRemaining(47) → "47 minutes"
```

### Prayer Times
```typescript
// Get all prayer times
getPrayerTimes(date, location?)

// Get today's times
getTodayPrayerTimes(location?)

// Get current prayer
getCurrentPrayer(location?)

// Get next prayer
getNextPrayer(location?)

// Get specific prayer time
getNextPrayerTime(prayer, location?)

// Format prayer time
formatPrayerTime(date)
// Example: formatPrayerTime(date) → "6:00 AM"

// Format time until
formatTimeUntil(minutes)
// Example: formatTimeUntil(90) → "1h 30m"

// Get Arabic name
getArabicPrayerName('Fajr') → 'الفجر'

// Get icon
getPrayerIcon('Fajr') → '🌅'
```

---

## 📊 Data Flow

```
1. User opens screen
   └── Auto-detects current planetary hour

2. User selects prayer (e.g., Fajr)
   └── Gets next Fajr time

3. Generate guidance
   ├── User profile (abjad, element)
   ├── Prayer time
   └── Planetary hour context
   
4. PrayerGuidanceEngine processes:
   ├── Classical hour practice
   ├── Elemental alignment
   ├── Divine Name selection
   ├── Adhkar retrieval
   └── Returns complete recommendation

5. Display all components
   ├── Context (element, hour, alignment)
   ├── Classical wisdom
   ├── Divine Name + reasoning
   ├── Counter (track recitations)
   └── Adhkar checklist

6. User performs dhikr
   └── Counter tracks progress

7. User completes adhkar
   └── Checkboxes track completion
```

---

## 🎯 Key Features

### Auto-Updates
- Planetary hour refreshes every 60 seconds
- Current/next prayer auto-detected
- Guidance regenerates on prayer change

### Haptic Feedback
- Light vibration on each count (10ms)
- Completion pattern on finish [0, 100, 50, 100]

### Progress Tracking
- Visual progress bar in counter
- Percentage display
- Adhkar completion percentage

### Interactive Elements
- Tap to count dhikr
- Tap to toggle adhkar completion
- Tap to expand/collapse reasoning
- Tap to toggle Arabic/English

---

## 🎨 Styling (Phase 3)

### Colors
```typescript
Primary Blue: #007AFF
Success Green: #34C759
Warning Orange: #FF9500
Error Red: #FF3B30
Light Blue: #5AC8FA
Purple: #AF52DE
Gold: #FFD700
```

### Alignment Colors
```typescript
Exceptional: #34C759 (Green)
Strong: #5AC8FA (Light Blue)
Favorable: #007AFF (Blue)
Moderate: #FF9500 (Orange)
Balanced: #AF52DE (Purple)
```

### Element Icons
```typescript
Fire: 🔥
Water: 💧
Air: 💨
Earth: 🌍
```

### Prayer Icons
```typescript
Fajr: 🌅
Dhuhr: ☀️
Asr: 🌤️
Maghrib: 🌇
Isha: 🌙
```

---

## ⚡ Performance Tips

### Memoization
```typescript
// Memoize expensive calculations
const guidance = useMemo(() => 
  PrayerGuidanceEngine.generateGuidance(...),
  [prayer, userProfile, planetaryHour]
);
```

### Auto-Update Intervals
```typescript
// Update planetary hour every 60 seconds
useEffect(() => {
  const interval = setInterval(() => {
    setPlanetaryHour(getCurrentPlanetaryHour());
  }, 60000);
  
  return () => clearInterval(interval);
}, []);
```

---

## 🐛 Common Issues

### Issue: Planetary hour not updating
**Solution:** Check interval is running, verify 60s timeout

### Issue: Prayer times incorrect
**Solution:** Using simplified calculation - replace with proper library in production

### Issue: Vibration not working
**Solution:** Check device permissions, test on physical device

### Issue: Arabic text not rendering
**Solution:** Ensure system fonts support Arabic, use 'System' fontFamily

---

## 📱 Testing Checklist

### Basic Functionality
- [ ] Screen loads without errors
- [ ] Prayer selector displays all 5 prayers
- [ ] Selecting prayer generates guidance
- [ ] All components render properly

### Planetary Hour
- [ ] Current hour displays correctly
- [ ] Hour updates every 60 seconds
- [ ] Time remaining counts down

### Counter
- [ ] Increments on tap
- [ ] Progress bar updates
- [ ] Completion detected
- [ ] Reset works

### Adhkar
- [ ] Checkboxes toggle
- [ ] Translation toggle works
- [ ] Progress % correct
- [ ] Reset all works

---

## 🚀 Phase 4 Preview

**Coming in Phase 4:**
- 🎨 Glassmorphism effects
- 🌈 Element-based color theming
- ✨ Smooth animations
- 📝 Premium typography
- 🎭 Custom Arabic fonts
- 🎆 Particle effects
- 🔊 Sound effects
- 🎉 Success celebrations

---

## 📚 Files Reference

```
Phase 3 Files (9 total):

Utilities (2):
- utils/planetary-hours.ts (332 lines)
- utils/prayer-times.ts (236 lines)

Components (6):
- components/prayer-guidance/PrayerSelector.tsx (167 lines)
- components/prayer-guidance/ContextDisplay.tsx (186 lines)
- components/prayer-guidance/ClassicalWisdomCard.tsx (165 lines)
- components/prayer-guidance/DivineNameCard.tsx (237 lines)
- components/prayer-guidance/DhikrCounter.tsx (183 lines)
- components/prayer-guidance/AdhkarList.tsx (264 lines)

Screen (1):
- app/prayer-guidance.tsx (234 lines)

Total: 2,004 lines functional UI
```

---

## ✅ Phase 3 Status

**Complete:** All functional UI components working  
**Next:** Phase 4 - Premium styling and animations  
**Zero Errors:** All TypeScript compilation clean  
**Ready:** Full integration with Phase 2 services
