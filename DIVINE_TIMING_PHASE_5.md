# Divine Timing Phase 5: Guided Istikhārah & Decision Companion
## ✅ COMPLETE

**Status:** Production Ready  
**Implementation Date:** January 2025  
**Integration:** ✅ Fully Integrated

---

## Overview

Phase 5 provides **preparation and reflection support** for ṣalāt al-istikhārah, the Islamic prayer for seeking guidance from Allah when facing permissible decisions.

### ⚠️ CRITICAL SAFETY PRINCIPLES

This feature is **NOT**:
- ❌ A replacement for ṣalāt al-istikhārah
- ❌ A dream interpreter
- ❌ An authoritative religious ruling system
- ❌ A yes/no answer generator
- ❌ A prediction or fortune-telling tool

This feature **IS**:
- ✅ A preparation wizard for intention-setting
- ✅ A daily reflection tracker (observational only)
- ✅ A pattern awareness tool (no verdicts)
- ✅ A spiritual support companion

---

## Architecture

### Type Definitions
**File:** `types/guided-istikhara.ts`

```typescript
export type EmotionalState = 'calm' | 'neutral' | 'uneasy';
export type DirectionFeeling = 'inclined' | 'unclear' | 'resistant';
export type EaseLevel = 'ease' | 'mixed' | 'obstacles';

export interface IstikharaReflectionEntry {
  date: string; // YYYY-MM-DD
  emotionalState: EmotionalState;
  directionFeeling: DirectionFeeling;
  easeLevel: EaseLevel;
  note?: string;
}

export interface GuidedIstikharaSession {
  id: string;
  createdAt: number;
  decisionText: string;
  intentionText?: string; // If custom
  timingSnapshot: DivineTimingResult; // From Phase 1
  reflectionVerse?: QuranReflectionVerse; // From Phase 2
  reflections: IstikharaReflectionEntry[];
  closedAt?: number;
}

export interface IstikharaSelfCheck {
  notClearlyHaram: boolean;
  takenWorldlySteps: boolean;
  notRushing: boolean;
}

export interface IstikharaPatternSummary {
  totalDays: number;
  calmDays: number;
  uneasyDays: number;
  inclinedDays: number;
  resistantDays: number;
  easeDays: number;
  obstacleDays: number;
  observationalSummary: string; // NO VERDICTS
}
```

### Storage Service
**File:** `services/GuidedIstikharaStorage.ts`

**Key Functions:**
- `loadIstikharaSessions()`: Load all sessions
- `saveIstikharaSession(session)`: Save new session (max 5 active)
- `addReflectionEntry(sessionId, entry)`: Add daily reflection
- `calculatePatternSummary(session)`: Generate observational summary
- `closeIstikharaSession(sessionId)`: Mark session complete
- `deleteIstikharaSession(sessionId)`: Remove session

**Safety Features:**
- Max 5 active sessions at a time
- Pattern summaries use observational language only
- No verdicts, no authoritative statements
- Example output: "You noted calmness on most days. You may wish to reflect further or consult trusted counsel."

---

## User Flow

### 1. Preparation Wizard (5 Steps)

**Screen:** `app/istikhara-preparation.tsx`

#### Step 1: Decision Clarification
- User describes the decision (max 200 characters)
- Disclaimer: "Istikhārah is for permissible decisions, not obligations or prohibitions"

#### Step 2: Self-Check (Non-authoritative)
Three optional checkboxes:
- ☐ This decision is not clearly ḥarām
- ☐ I have taken reasonable worldly steps
- ☐ I am not rushing under pressure

**Disclaimer:** "These are self-reflections only, not religious requirements."

#### Step 3: Timing Awareness
- Displays Divine Timing result (from Phase 1)
- Shows Qur'an reflection verse (from Phase 2)
- **Strong disclaimer:** "This is observational context only. It does not dictate when you should or should not perform istikhārah."

#### Step 4: Intention Framing
Choice between:
1. **Guided template** (default):
   > O Allah, if this matter is good for me in my religion, life, and outcome, then decree it for me and make it easy for me. And if it is bad for me, then turn it away from me and turn me away from it, and decree for me what is good wherever it may be.

2. **Custom intention** (user-written)

**Note:** This is NOT the duʿāʾ itself—only intention framing.

#### Step 5: Ready
- Confirmation screen
- Reminder: "Istikhārah is a prayer seeking Allah's guidance. This app supports your preparation and reflection, but does not replace the prayer itself."
- Button: "I have performed Istikhārah" → Creates session and navigates to reflection tracker

---

### 2. Daily Reflection Tracker

**Screen:** `app/istikhara-reflection/[sessionId].tsx`

**Fields to Track:**
1. **Emotional State**
   - 😊 Calm
   - 😐 Neutral
   - 😟 Uneasy

2. **Directional Feeling**
   - ➡️ Inclined
   - ❓ Unclear
   - ⛔ Resistant

3. **Ease Level**
   - ✅ Ease
   - ↔️ Mixed
   - ⚠️ Obstacles

4. **Optional Note** (max 300 characters)

**Safety Features:**
- One reflection per day (today's date)
- Red disclaimer at top: "This is observational tracking only. Do NOT expect dream interpretation or verdicts."
- Reflection history shown below
- Pattern summary updated in real-time (observational only)

---

### 3. Pattern Summary Display

**Auto-generated after reflections:**

```
Pattern Observations (7 days)
😊 5 calm · 2 uneasy
➡️ 4 inclined · 1 resistant
✅ 6 ease · 1 obstacles

"You noted calmness on most days. Your directional feeling was 
mostly inclined. You may wish to reflect further or consult 
trusted counsel."
```

**Critical:** Summary uses **"You noted..."** language, never **"You should..."**

---

### 4. Session Management

**Screen:** `app/istikhara-sessions.tsx`

**Features:**
- View all active sessions (max 5)
- View completed sessions
- Create new session (if under limit)
- Complete session (mark as done)
- Delete session

**UI Structure:**
- Each session card shows:
  - Decision text
  - Start date
  - Number of reflections
  - Timing quality badge
  - Action buttons (Complete | Delete)

---

## Integration

### Navigation Entry Points

1. **Life Guidance Tab** (`app/(tabs)/two.tsx`)
   - Added "Guided Istikhārah" module card
   - Icon: 🕊️
   - Routes to `/istikhara-sessions`

2. **Direct Routes:**
   - `/istikhara-sessions` → Session list
   - `/istikhara-preparation` → 5-step wizard
   - `/istikhara-reflection/[sessionId]` → Daily tracker

---

## Safety Guardrails

### Language Guidelines

✅ **ALLOWED:**
- "You noted calmness..."
- "Resistance was recorded on 3 days..."
- "You may wish to reflect further..."
- "Consider consulting trusted counsel..."
- "These are observations only..."

❌ **FORBIDDEN:**
- "You should proceed with this decision."
- "This is a sign to stop."
- "Allah is telling you..."
- "The answer is yes/no."
- "Your dream means..."

### Disclaimers

**Every screen must include:**
1. Feature does NOT replace ṣalāt al-istikhārah
2. No verdicts or authoritative interpretations
3. Observational support only
4. Consult scholars for religious guidance

---

## Testing Checklist

- [x] Preparation wizard (all 5 steps)
- [x] Session creation (max 5 limit enforced)
- [x] Daily reflection logging
- [x] Pattern summary generation
- [x] Session list display
- [x] Session completion
- [x] Session deletion
- [x] Navigation integration
- [x] All disclaimers present
- [x] No authoritative language used
- [x] Observational summaries only

---

## Files Created

### Types
- ✅ `types/guided-istikhara.ts` (all data structures)

### Services
- ✅ `services/GuidedIstikharaStorage.ts` (AsyncStorage CRUD + pattern calculator)

### Screens
- ✅ `app/istikhara-preparation.tsx` (5-step wizard)
- ✅ `app/istikhara-reflection/[sessionId].tsx` (daily tracker)
- ✅ `app/istikhara-sessions.tsx` (session list + management)

### Integration
- ✅ `app/(tabs)/two.tsx` (added to Life Guidance tab)

---

## Example User Journey

1. User navigates to **Life Guidance** tab
2. Taps **"Guided Istikhārah"** card
3. Views session list (empty state if new)
4. Taps **"Start New Istikhārah Session"**
5. Goes through 5-step preparation wizard:
   - Describes decision
   - Self-reflects on readiness
   - Reviews timing awareness
   - Frames intention
   - Confirms readiness
6. Performs ṣalāt al-istikhārah (outside app)
7. Taps **"I have performed Istikhārah"**
8. Session created → Redirected to daily reflection tracker
9. Logs daily reflections for 7-10 days
10. Views pattern summary (observational only)
11. Decides to either:
    - Continue reflecting
    - Consult trusted counsel
    - Mark session complete

---

## Maintenance Notes

### Future Enhancements (Optional)
- Add reminder notifications (respectful, not pushy)
- Export session data as PDF for offline review
- Multi-language support for template text
- Custom reflection period (default 7-10 days)

### Known Limitations
- No cloud sync (local-only by design for privacy)
- Max 5 active sessions (prevents decision overload)
- One reflection per day (prevents obsessive checking)
- No automated "answers" (by design—observational only)

---

## Religious Compliance

This feature was designed with **extreme care for Islamic adab**:

1. **No Replacement Claims:** Never suggests it replaces actual prayer
2. **No Predictions:** Strictly observational, never predictive
3. **No Dream Interpretation:** Explicitly forbidden in disclaimers
4. **No Religious Rulings:** No fatwā, no authoritative statements
5. **Consultation Encouraged:** Always directs to scholars/trusted counsel
6. **Deterministic Only:** Pattern summaries are mathematical aggregations
7. **User Agency:** User makes all decisions, app only reflects patterns

---

## Conclusion

**Phase 5 Status:** ✅ **COMPLETE**

This feature provides respectful, non-authoritative support for one of Islam's most sacred spiritual practices. All safety guardrails are in place, all disclaimers are present, and the language is purely observational.

**Integration:** Fully integrated into the Life Guidance tab and ready for production use.

**Next Steps:** Test in production environment, gather user feedback, ensure all religious scholars approve the approach.

---

**Documentation Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Divine Timing Implementation Team
