# Divine Timing - Phase 1 Implementation

## 📋 Overview

Divine Timing is a spiritual reflection tool based on the Maghribī ʿIlm al-Ḥurūf system. It provides timing awareness, elemental tone, and reflective guidance for daily intentions.

**IMPORTANT:** Divine Timing does NOT:
- Predict outcomes
- Give religious rulings
- Replace prayer or istikhārah
- Provide yes/no answers
- Make promises about the future

## ✅ Phase 1 Completion Status

### Files Created

1. **`types/divine-timing.ts`** - Type definitions
   - Input/output interfaces
   - Intention categories
   - Timing quality types
   - Cycle state enums

2. **`services/DivineTimingService.ts`** - Core calculation engine
   - Pure, deterministic calculations
   - Hadad → Cycle State mapping
   - Day → Element mapping
   - Timing quality calculation
   - Reflective message generation

3. **`components/divine-timing/DivineTimingCard.tsx`** - Display component
   - Timing quality visualization
   - Cycle state display
   - Elemental tone indicator
   - Guidance message
   - Disclaimer text

4. **`app/divine-timing.tsx`** - Main screen
   - Intention category selection
   - Calculate button
   - Result display
   - Reset functionality

## 🎯 Core Features Implemented

### 1. Input System

**User Abjad Result:**
```typescript
{
  kabir: number;        // Grand total
  saghir: number;       // Digital root (1-9)
  hadad: number;        // Mod 4 result (0-3)
  dominantElement: ElementalTone;
}
```

**Date Context:**
```typescript
{
  dayOfWeek: number;    // 0-6 (Sunday-Saturday)
  date: string;         // YYYY-MM-DD
}
```

**Intention Categories:**
- `start` - New beginnings
- `travel` - Journey/movement
- `communication` - Dialogue/writing
- `relationship` - Connection/partnership
- `study` - Learning/contemplation
- `rest` - Pause/recovery
- `custom` - General reflection

### 2. Calculation Logic

#### A. Cycle State (from Hadad)
```
Hadad 0 → "completion / closure"
Hadad 1 → "initiation"
Hadad 2 → "growth / expansion"
Hadad 3 → "review / restraint"
```

#### B. Day Element Mapping
```
Sunday    → Fire   (Sun)
Monday    → Water  (Moon)
Tuesday   → Fire   (Mars)
Wednesday → Air    (Mercury)
Thursday  → Air    (Jupiter)
Friday    → Water  (Venus)
Saturday  → Earth  (Saturn)
```

#### C. Timing Quality Algorithm

Factors:
1. **Elemental Harmony**
   - Same elements: +2 points (favorable)
   - Complementary (fire↔air, water↔earth): +1 point
   - Opposition (fire↔water, air↔earth): +2 delicate points

2. **Cycle-Intention Alignment**
   - Action intentions + action cycles: +1 favorable
   - Action intentions + reflection cycles: +1 delicate
   - Delicate intentions + growth cycle: +1 favorable
   - Delicate intentions + initiation: +1 delicate

3. **Results:**
   - `favorable`: ≥2 favorable points, 0 delicate
   - `delicate`: ≥2 delicate points
   - `neutral`: Mixed or balanced

#### D. Guidance Level
```
Favorable + Action Cycle → "act"
Favorable + Reflection    → "slow"
Delicate (any)            → "observe"
Neutral + Action          → "slow"
Neutral + Reflection      → "observe"
```

### 3. Output Structure

```typescript
{
  timingQuality: "favorable" | "neutral" | "delicate",
  cycleState: CycleState,
  elementalTone: ElementalTone,
  guidanceLevel: "act" | "slow" | "observe",
  shortMessage: string,
  context?: {
    hadad: number,
    dominantElement: ElementalTone,
    dayElement: ElementalTone,
    intentionCategory: IntentionCategory
  }
}
```

### 4. Message Generation

**Principles:**
- ✅ Reflective language ("invites", "suggests", "may")
- ✅ Non-authoritative ("appear", "favor")
- ✅ Optional framing ("consider", "contemplate")
- ❌ Never predictive ("will", "shall")
- ❌ Never certain ("definitely", "guaranteed")
- ❌ Never yes/no answers

**Example Messages:**
- Favorable: "Conditions appear supportive for reflection and considered action."
- Neutral: "Energy suggests proceeding with awareness and flexibility."
- Delicate: "Energy favors reflection over decisive action today."

## 🧪 Testing

### Manual Test Cases

#### Test 1: Favorable Timing
```typescript
Input:
  userAbjadResult: { kabir: 786, saghir: 3, hadad: 1, dominantElement: 'fire' }
  currentDate: { dayOfWeek: 0, date: '2025-12-26' } // Sunday (fire day)
  userIntentionCategory: 'start'

Expected:
  timingQuality: 'favorable'
  cycleState: 'initiation'
  elementalTone: 'fire'
  guidanceLevel: 'act'
```

#### Test 2: Delicate Timing
```typescript
Input:
  userAbjadResult: { kabir: 100, saghir: 1, hadad: 0, dominantElement: 'fire' }
  currentDate: { dayOfWeek: 1, date: '2025-12-26' } // Monday (water day)
  userIntentionCategory: 'travel'

Expected:
  timingQuality: 'delicate'
  cycleState: 'completion / closure'
  elementalTone: 'water'
  guidanceLevel: 'observe'
```

#### Test 3: Neutral Timing
```typescript
Input:
  userAbjadResult: { kabir: 50, saghir: 5, hadad: 2, dominantElement: 'air' }
  currentDate: { dayOfWeek: 6, date: '2025-12-26' } // Saturday (earth day)
  userIntentionCategory: 'study'

Expected:
  timingQuality: 'neutral'
  cycleState: 'growth / expansion'
  elementalTone: 'earth'
  guidanceLevel: 'slow'
```

### Determinism Test

Run the same input 10 times - should always return identical results:

```typescript
const input = {
  userAbjadResult: { kabir: 786, saghir: 3, hadad: 2, dominantElement: 'fire' },
  currentDate: { dayOfWeek: 3, date: '2025-12-26' },
  userIntentionCategory: 'communication' as IntentionCategory
};

for (let i = 0; i < 10; i++) {
  const result = computeDivineTiming(input);
  console.log(result.timingQuality); // Should be same every time
}
```

## 📱 UI Components

### DivineTimingCard Layout

```
┌─────────────────────────────────┐
│ 🕰️ Divine Timing               │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ✨ Timing Quality           │ │
│ │    Favorable                │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐      │
│ │Cycle     │ │Elemental │      │
│ │State     │ │Tone      │      │
│ │initiation│ │🔥 Fire   │      │
│ └──────────┘ └──────────┘      │
├─────────────────────────────────┤
│ 💡 Reflective Guidance          │
│    [Message text here]          │
│    → Engage mindfully           │
├─────────────────────────────────┤
│ ℹ️ Disclaimer text              │
└─────────────────────────────────┘
```

### Color Coding

**Timing Quality:**
- Favorable: Green (#4CAF50)
- Neutral: Blue (#64B5F6)
- Delicate: Amber (#FFB74D)

**Elements:**
- Fire: Red-Orange (#FF5722)
- Water: Blue (#2196F3)
- Air: Yellow (#FFC107)
- Earth: Brown (#795548)

## 🔧 Usage Example

```typescript
import { computeDivineTiming } from '@/services/DivineTimingService';

// Get user's Abjad results (from calculator or profile)
const userAbjad = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire' as const
};

// Get current date
const now = new Date();
const currentDate = {
  dayOfWeek: now.getDay(),
  date: now.toISOString().split('T')[0]
};

// User selects intention
const intention = 'start';

// Calculate Divine Timing
const result = computeDivineTiming({
  userAbjadResult: userAbjad,
  currentDate,
  userIntentionCategory: intention
});

console.log(result.timingQuality);  // "favorable" | "neutral" | "delicate"
console.log(result.cycleState);     // e.g., "initiation"
console.log(result.shortMessage);   // Reflective guidance text
```

## 🚫 What's NOT in Phase 1

The following features are planned for future phases:

- ❌ Advanced astrological calculations
- ❌ AI-generated text
- ❌ Qur'an ayah recommendations
- ❌ Notification system
- ❌ History/journal storage
- ❌ Multi-day forecasting
- ❌ Personalized user profiles
- ❌ Free-text intention input
- ❌ Istikhārah integration
- ❌ Translation/localization

## 📊 Architecture

### Service Purity

`DivineTimingService` is a **pure module**:
- No side effects
- No external dependencies
- Deterministic (same input → same output)
- Fully testable
- Reusable across features

### Separation of Concerns

```
┌──────────────────────────────┐
│  UI Layer                    │
│  - divine-timing.tsx         │
│  - DivineTimingCard.tsx      │
└──────────┬───────────────────┘
           │
┌──────────▼───────────────────┐
│  Service Layer               │
│  - DivineTimingService.ts    │
│  - computeDivineTiming()     │
└──────────┬───────────────────┘
           │
┌──────────▼───────────────────┐
│  Type Layer                  │
│  - divine-timing.ts          │
└──────────────────────────────┘
```

### Future Integration Points

The Divine Timing service can be integrated with:

1. **Istikhārah Feature** (Phase 2)
   - Use Divine Timing as one input
   - Add Qur'an verse reflection
   - Enhanced spiritual guidance

2. **Daily Check-in** (Phase 3)
   - Morning reflection prompt
   - Evening review
   - Journal integration

3. **Notifications** (Phase 4)
   - Daily timing reminder
   - Intention-based alerts
   - Cycle change notifications

## ⚖️ Ethical Guidelines

### Language Rules

**Always Use:**
- "may", "could", "suggests"
- "invites", "favors", "supports"
- "consider", "reflect", "contemplate"
- "appears", "seems", "tends"

**Never Use:**
- "will", "shall", "must"
- "definitely", "certainly", "guaranteed"
- "yes", "no" (to decisions)
- "fate", "destiny", "predetermined"
- "should", "shouldn't" (absolute commands)

### Disclaimer Requirement

Every UI displaying Divine Timing results MUST include:

> "This guidance is for spiritual reflection only and does not replace prayer, istikhārah, or qualified religious advice."

## 🎨 Design Principles

1. **Clarity**: Results should be immediately understandable
2. **Calm**: Use soft colors and gentle language
3. **Respectful**: Never authoritative or commanding
4. **Transparent**: Show the factors (cycle, element, intention)
5. **Optional**: User can engage or not - no pressure

## 🔍 Debugging

Enable debug context in results:

```typescript
const result = computeDivineTiming(input);

console.log('Debug Context:', result.context);
// {
//   hadad: 2,
//   dominantElement: 'fire',
//   dayElement: 'air',
//   intentionCategory: 'start'
// }
```

## 📚 References

- **ʿIlm al-Ḥurūf**: Classical Islamic science of letters
- **Maghribī System**: North African Abjad tradition
- **Elemental Theory**: Four classical elements (Aristotelian)
- **Cycle Theory**: Four-phase temporal cycles

---

**Status**: ✅ Phase 1 Complete  
**Last Updated**: December 26, 2025  
**Next Phase**: Advanced calculations & Qur'an integration
