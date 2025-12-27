# Divine Timing Developer Quick Reference
## Fast Navigation & Code Snippets

---

## 🗺️ File Structure

```
types/
  ├── divine-timing.ts             # Phase 1 types
  ├── divine-timing-guidance.ts    # Phase 3 types
  ├── daily-checkin.ts             # Phase 4 types
  └── guided-istikhara.ts          # Phase 5 types

services/
  ├── DivineTimingService.ts       # Phase 1 calculations (469 lines)
  ├── QuranReflectionService.ts    # Phase 2 verse selection (277 lines)
  ├── DivineTimingGuidanceService.ts  # Phase 3 guidance (470 lines)
  ├── DivineTimingStorage.ts       # Phase 4 storage (300+ lines)
  └── GuidedIstikharaStorage.ts    # Phase 5 storage

components/divine-timing/
  ├── DivineTimingCard.tsx         # Timing display (shared)
  ├── QuranReflectionCard.tsx      # Verse display
  ├── ManualVerseSelector.tsx      # Manual picker modal
  ├── DivineTimingQuestionCard.tsx # Question UI (Phase 3)
  ├── DivineTimingGuidanceCard.tsx # Guidance UI (Phase 3)
  └── DailyCheckInCard.tsx         # Home widget (Phase 4)

app/
  ├── divine-timing.tsx            # Main screen (Phases 1-3)
  ├── daily-checkin.tsx            # Check-in flow (Phase 4)
  ├── istikhara-preparation.tsx   # 5-step wizard (Phase 5)
  ├── istikhara-sessions.tsx      # Session list (Phase 5)
  └── istikhara-reflection/
      └── [sessionId].tsx          # Daily tracker (Phase 5)

data/
  └── quranReflectionVerses.ts    # 20 curated verses
```

---

## 🚀 Quick Start Code Snippets

### Phase 1: Calculate Divine Timing

```typescript
import { computeDivineTiming } from '@/services/DivineTimingService';
import { UserAbjadResult } from '@/types/divine-timing';

const userAbjad: UserAbjadResult = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire',
};

const now = new Date();
const result = computeDivineTiming({
  userAbjadResult: userAbjad,
  currentDate: {
    dayOfWeek: now.getDay(),
    date: now.toISOString().split('T')[0],
  },
  userIntentionCategory: 'custom',
});

// result.timingQuality: 'auspicious' | 'neutral' | 'challenging'
// result.cycleState: 'expansion' | 'balance' | 'contraction'
// result.elementalTone: 'fire' | 'earth' | 'air' | 'water'
// result.shortMessage: "Your timing carries..."
```

### Phase 2: Select Qur'an Verse

```typescript
import { selectReflectionVerse } from '@/services/QuranReflectionService';

const verse = selectReflectionVerse({
  timingQuality: result.timingQuality,
  cycleState: result.cycleState,
  elementalTone: result.elementalTone,
  intentionCategory: 'spiritual_growth',
  seedKey: '2025-01-15', // For determinism
});

// verse.verse.arabicText
// verse.verse.translationEn
// verse.verse.surahNameEn
```

### Phase 3: Generate Guidance

```typescript
import { generateGuidance } from '@/services/DivineTimingGuidanceService';

const guidance = generateGuidance({
  question: 'Should I start this new project?',
  intentionCategory: 'work_career',
  timingResult: result,
});

// guidance.guidanceText: Reflective prompt
// guidance.actionPrompts: Array of suggestions
// guidance.reflectionQuestions: Deeper contemplation
```

### Phase 4: Save Daily Check-In

```typescript
import { saveCheckIn } from '@/services/DivineTimingStorage';

await saveCheckIn({
  date: '2025-01-15',
  intentionCategory: 'spiritual_growth',
  note: 'Feeling grateful today',
  timingSnapshot: result,
  timestamp: Date.now(),
});

// Auto-computes streak
// Auto-prunes > 90 days
```

### Phase 5: Create Istikhārah Session

```typescript
import { saveIstikharaSession } from '@/services/GuidedIstikharaStorage';
import { GuidedIstikharaSession } from '@/types/guided-istikhara';

const session: GuidedIstikharaSession = {
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  createdAt: Date.now(),
  decisionText: 'Accepting new job offer',
  timingSnapshot: result,
  reflectionVerse: { /* Qur'an verse */ },
  reflections: [],
};

await saveIstikharaSession(session);
```

---

## 🎨 UI Component Usage

### DivineTimingCard (Shared Component)

```tsx
import { DivineTimingCard } from '@/components/divine-timing/DivineTimingCard';

<DivineTimingCard result={timingResult} colorScheme={colorScheme} />
```

### QuranReflectionCard

```tsx
import { QuranReflectionCard } from '@/components/divine-timing/QuranReflectionCard';

<QuranReflectionCard
  reflection={quranReflection}
  colorScheme={colorScheme}
  onManualSelect={() => setShowManualPicker(true)}
/>
```

### DailyCheckInCard (Home Widget)

```tsx
import { DailyCheckInCard } from '@/components/divine-timing/DailyCheckInCard';

<DailyCheckInCard
  streak={7}
  todaySummary={{
    intentionCategory: 'spiritual_growth',
    note: 'Feeling grateful',
    timingQuality: 'auspicious',
  }}
  onPress={() => router.push('/daily-checkin')}
/>
```

---

## 🗂️ AsyncStorage Keys

```typescript
// Phase 3: Guidance history
'@divine_timing_history'

// Phase 4: Daily check-ins
'@divine_timing_daily_checkins'

// Phase 4: Streak data
'@divine_timing_streak'

// Phase 5: Istikhārah sessions
'@guided_istikhara_sessions'
```

---

## 🔧 Common Patterns

### Loading Data with useFocusEffect

```typescript
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

const [data, setData] = useState(null);

useFocusEffect(
  useCallback(() => {
    loadData();
  }, [])
);

async function loadData() {
  const result = await loadFromAsyncStorage();
  setData(result);
}
```

### Deterministic Selection

```typescript
// Always use a seed for determinism (same input = same output)
const seedKey = `${date}-${intentionCategory}-${timingQuality}`;
const hashValue = hashString(seedKey);
const index = hashValue % array.length;
const selected = array[index];
```

### Observational Language Pattern

```typescript
// ❌ FORBIDDEN
"You should proceed with this decision."
"This is a sign to stop."
"The answer is yes."

// ✅ CORRECT
"You noted calmness on most days."
"Resistance was recorded more frequently."
"You may wish to reflect further or consult trusted counsel."
```

---

## 🛡️ Safety Checklist

When adding new spiritual features:

- [ ] Use deterministic logic (no randomness)
- [ ] Add strong disclaimers
- [ ] Use observational language ("You noted..." not "You should...")
- [ ] Never provide yes/no answers
- [ ] Never claim religious authority
- [ ] Direct users to consult scholars
- [ ] Respect Islamic adab (manners)
- [ ] Test with TypeScript strict mode
- [ ] Handle empty states gracefully
- [ ] Implement proper loading states

---

## 📱 Navigation Routing

```typescript
// Divine Timing main screen
router.push('/divine-timing');

// Daily check-in flow
router.push('/daily-checkin');

// Istikhārah sessions list
router.push('/istikhara-sessions');

// Istikhārah preparation wizard
router.push('/istikhara-preparation');

// Daily reflection tracker
router.push(`/istikhara-reflection/${sessionId}`);

// Life Guidance tab
router.push('/(tabs)/two');

// Home screen
router.push('/(tabs)/index');
```

---

## 🧪 Testing Snippets

### Clear All Data (Testing Only)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear all Divine Timing data
await AsyncStorage.multiRemove([
  '@divine_timing_history',
  '@divine_timing_daily_checkins',
  '@divine_timing_streak',
  '@guided_istikhara_sessions',
]);
```

### Mock Data for Testing

```typescript
const mockUserAbjad: UserAbjadResult = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire',
};

const mockCheckIn: DailyCheckIn = {
  date: '2025-01-15',
  intentionCategory: 'spiritual_growth',
  note: 'Test check-in',
  timingSnapshot: mockTimingResult,
  timestamp: Date.now(),
};
```

---

## 🎯 Intention Categories

```typescript
type IntentionCategory =
  | 'spiritual_growth'
  | 'work_career'
  | 'relationships'
  | 'health_wellbeing'
  | 'learning_knowledge'
  | 'financial_matters'
  | 'family_community'
  | 'custom';
```

---

## 🌙 Timing Quality States

```typescript
type TimingQuality = 'auspicious' | 'neutral' | 'challenging';
type CycleState = 'expansion' | 'balance' | 'contraction';
type ElementalTone = 'fire' | 'earth' | 'air' | 'water';
```

---

## 📖 Qur'an Verse Structure

```typescript
interface QuranVerse {
  surahNumber: number;
  ayahNumber: number;
  surahNameEn: string;
  surahNameAr: string;
  arabicText: string;
  translationEn: string;
}
```

---

## 🔍 Debugging Tips

### Check AsyncStorage Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const debugStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('All keys:', keys);
  
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(`${key}:`, JSON.parse(value || '{}'));
  }
};
```

### Log Divine Timing Result

```typescript
const result = computeDivineTiming({ /* ... */ });
console.log('Timing Quality:', result.timingQuality);
console.log('Cycle State:', result.cycleState);
console.log('Elemental Tone:', result.elementalTone);
console.log('Message:', result.shortMessage);
```

---

## ⚡ Performance Tips

1. **Use useMemo for calculations:**
   ```typescript
   const timingResult = useMemo(() => 
     computeDivineTiming(params), 
     [date, intention]
   );
   ```

2. **Use useCallback for handlers:**
   ```typescript
   const handlePress = useCallback(() => {
     // handler logic
   }, [dependencies]);
   ```

3. **Lazy load AsyncStorage:**
   ```typescript
   const [data, setData] = useState(null);
   useEffect(() => {
     loadData().then(setData);
   }, []);
   ```

---

## 🎨 Color Constants

```typescript
import Colors from '@/constants/Colors';

const colors = Colors[colorScheme];

// Available colors:
colors.background
colors.card
colors.text
colors.textSecondary
colors.textTertiary
colors.primary
colors.border
```

---

## 📚 Documentation References

- **Phase 1:** `DIVINE_TIMING_PHASE_1.md`
- **Phase 2:** `DIVINE_TIMING_PHASE_2.md`
- **Phase 3:** `DIVINE_TIMING_PHASE_3.md`
- **Phase 4:** `DIVINE_TIMING_PHASE_4.md`
- **Phase 5:** `DIVINE_TIMING_PHASE_5.md`
- **Complete Summary:** `DIVINE_TIMING_COMPLETE_SUMMARY.md`

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Maintained By:** Divine Timing Development Team
