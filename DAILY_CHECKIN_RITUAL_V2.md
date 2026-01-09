# Daily Check-In Ritual V2

## Overview

The Daily Check-In has been redesigned from a dense information dashboard into a calm, guided spiritual ritual. This transformation makes the check-in feel more like a meaningful 60-second daily practice rather than a data collection task.

## Design Philosophy

### Before (V1)
- **Dense**: Multiple stacked cards with technical details
- **Dashboard-like**: Information-heavy, cognitively demanding
- **Configuration-focused**: Planetary day, cycle tone, zahir/batin upfront
- **All-at-once**: Everything visible simultaneously

### After (V2)
- **Progressive**: 4 clear steps that flow naturally
- **Ritual-like**: Calm, breathing, guided micro-copy
- **Experience-focused**: User's state comes first, data is secondary
- **Collapsible**: Advanced details hidden by default

## Structure

### Step 1: Daily Alignment (Observe)
**Philosophy**: "Take a breath — here's where you are today"

- **Always visible**: 
  - Planetary day + icon
  - Element of the day
  - Harmony score (visual ring)
  - One sentence of guidance

- **Collapsible details** ("View details"):
  - Cycle tone
  - Bāṭin element  
  - Current hour
  - Full technical breakdown

**Goal**: Quick spiritual context without cognitive overload.

---

### Step 2: Inner State (Feel)
**Philosophy**: "How are you arriving today?"

**Micro-copy**: Clear, gentle, inviting

**Components**:
1. **Mood chips** (select one):
   - 🕊️ Calm
   - ⚡ Motivated
   - 🤲 Grateful
   - 🧘 Centered
   - 🌀 Scattered
   - 🌧️ Heavy
   - 😰 Anxious
   - 😴 Tired

2. **Energy slider** (0-100%):
   - Large, visual display
   - Simple slider interaction
   - No labels like "this helps us learn" upfront

3. **Optional brief note** (max 120 chars):
   - Placeholder: "A short note about your day..."
   - Not required, just offered

**Goal**: Capture user's current state quickly and expressively.

---

### Step 3: Intention Setting (Intend)
**Philosophy**: "What do you wish to align with?"

**Components**:
- **Focused intention chips** (4 primary, expandable):
  - ▶️ Start
  - 💬 Communication
  - 👥 Relationship
  - 📖 Study

- **Selection feedback**:
  - Selected chip has gold border + background glow
  - Shows "Today's intention: [Name]" below

**Note**: Advanced compatibility details removed from first layer. Users don't need to see alignment scores during check-in — they just need to set an intention.

**Goal**: Make intention-setting feel like choosing a direction, not analyzing compatibility.

---

### Step 4: Complete Ritual (Close)
**Philosophy**: "Seal your practice"

**Components**:
1. **Primary button**:
   - Icon: ⭐ (star)
   - Text: "Complete Check-In"
   - Full-width, prominent
   - Gold background when ready
   - Disabled (greyed) until mood + intention selected

2. **Success state**:
   - Icon changes to ✓ (checkmark circle)
   - Background turns green
   - Text: "Check-In Saved ✓"
   - Haptic feedback
   - Auto-closes after 2 seconds

3. **Footer**:
   - Small italic text
   - "For reflection only • Not a ruling"
   - Reinforces spiritual context

**Goal**: Gentle closure with positive reinforcement.

---

## Visual Improvements

### Spacing & Breathing
- **Increased vertical gaps** between sections (24px instead of 16px)
- **Section headers** with step badges (1, 2, 3)
- **Card backgrounds** subtle, not heavy
- **Dividers** soft, minimal

### Micro-Copy
Replaced technical labels with gentle guidance:
- ~~"Planetary Day"~~ → "Daily Alignment"
- ~~"Configuration"~~ → "Observe"
- ~~"Focus Intention"~~ → "What do you wish to align with?"
- ~~"Request Reflection"~~ → "Complete Check-In"

### Animations
- **Fade-in** on screen load
- **Scale spring** for gentle entrance
- **Haptic feedback** on chip selection
- **Success animation** on button press

### Typography Hierarchy
- **Step titles**: Large, bold (Typography.h2)
- **Subtitles**: Small, gentle (Typography.label, secondary color)
- **Field labels**: Medium weight, clear
- **Values**: Bold, branded gold color

---

## Data Flow

### Input Data (What We Collect)
The check-in stores only:
- `mood` (MoodState)
- `energy` (0-100)
- `intention` (IntentionCategory)
- `note` (optional string, max 120 chars)
- `timestamp`

### Guidance Data (Read-Only)
Computed from:
- `AsrarTimingSnapshot` (day, hour, elements, harmony)
- `DailyGuidance` (message, best activities)

**Separation**: 
- **Input** = user's state
- **Guidance** = contextual alignment

This keeps the check-in lightweight and the logic clean.

---

## Technical Improvements

### Component Structure
```
DailyCheckInV2Screen
├─ Header (back button + title)
├─ Scroll Container
│  ├─ Step 1: Daily Alignment
│  │  ├─ Collapsible header
│  │  ├─ Summary card (gradient)
│  │  └─ Expanded details (optional)
│  ├─ Step 2: Inner State
│  │  ├─ Mood chips grid
│  │  ├─ Energy slider
│  │  └─ Optional note
│  ├─ Step 3: Intention Setting
│  │  ├─ Intention chips
│  │  └─ Selected feedback
│  └─ Step 4: Complete Ritual
│     ├─ Primary button
│     └─ Footer disclaimer
```

### State Management
- Minimal useState hooks
- No complex reducers
- Animation values isolated
- Validation at button press

### Styling
- Uses DarkTheme constants
- Consistent spacing (Spacing.md, Spacing.lg, Spacing.xl)
- Typography.h1, h2, h3, body, label, caption
- Gold brand color for highlights

---

## User Experience Goals

### Emotional Experience
- **Calm**: No information overwhelm
- **Clear**: Step-by-step progression
- **Guided**: Micro-copy walks you through
- **Meaningful**: Feels like a ritual, not a task
- **Quick**: 60 seconds max

### Habit Formation
- **Low friction**: Easy to complete daily
- **Positive reinforcement**: Success state feels good
- **Lightweight**: Not cognitively taxing
- **Grounded**: Spiritual disclaimer keeps expectations realistic

---

## Implementation Status

### ✅ Completed
- V2 screen component (`daily-checkin-v2.tsx`)
- Progressive 4-step structure
- Mood chips + energy slider + note input
- Intention selection
- Complete button with animations
- Collapsible daily alignment section
- Translations (English + French)
- Integration with existing services (DailyGuidanceService, CheckInStorage)

### 🔄 Optional Enhancements (Future)
1. **Weekly rhythm insights** (after 7 check-ins)
2. **AI reflection suggestion** (only if AI enabled)
3. **Trend visualization** (energy over time)
4. **Premium upsell** (lock advanced alignment details)
5. **Custom mood states** (user-defined chips)
6. **Streak counter** (visual reinforcement)

---

## Migration Path

### From V1 to V2

**Option 1: Gradual rollout**
- Keep both screens
- Add toggle in settings: "Use simplified check-in"
- Collect feedback

**Option 2: Direct replacement**
- Replace `app/daily-checkin.tsx` with V2
- Archive V1 as `daily-checkin-v1.tsx`
- Monitor completion rates

**Option 3: A/B test**
- Randomly assign users to V1 or V2
- Track:
  - Daily completion rate
  - Time to complete
  - User retention
  - Subjective feedback

**Recommendation**: Option 1 (gradual rollout with user choice)

---

## Success Metrics

Track these to validate the redesign:

1. **Completion rate**: % of users who complete check-in daily
2. **Time to complete**: Average seconds from open to save
3. **Step abandonment**: Where users drop off
4. **Mood selection rate**: How often users select a mood
5. **Note usage**: % who write a note
6. **User feedback**: Qualitative responses

**Hypothesis**: V2 should increase daily completion rate by 15-25% due to reduced friction.

---

## Developer Notes

### File Locations
- **Screen**: `app/daily-checkin-v2.tsx`
- **Translations**: `constants/translations.ts` (sections: `dailyCheckIn.ritual`)
- **Services**: 
  - `services/DailyGuidanceService.ts` (guidance data)
  - `services/CheckInStorage.ts` (save check-in)
  - `services/DivineTimingAsrarService.ts` (timing snapshot)

### Dependencies
- `SimpleSlider` component (already exists)
- `expo-haptics` (tactile feedback)
- `expo-linear-gradient` (subtle backgrounds)
- `@expo/vector-icons` (Ionicons)

### Testing Checklist
- [ ] All 4 steps render correctly
- [ ] Collapsible section expands/collapses
- [ ] Mood chips selection updates state
- [ ] Energy slider updates value smoothly
- [ ] Intention chips show selected state
- [ ] Complete button disabled until ready
- [ ] Save completes successfully
- [ ] Success state shows and auto-closes
- [ ] Haptic feedback triggers (on device)
- [ ] Translations work in French
- [ ] Dark theme styling correct

---

## Conclusion

The V2 Daily Check-In transforms the experience from:
- **Dashboard** → **Ritual**
- **Dense** → **Calm**
- **Technical** → **Spiritual**
- **All-at-once** → **Progressive**

This redesign aligns with Asrār's core philosophy: **meaningful spiritual tools, not just data**.

The result is a **habit-forming, emotionally grounding, 60-second daily practice** that users will actually want to return to.

---

**Next Steps**:
1. Test V2 screen in app
2. Gather user feedback
3. Compare completion rates with V1
4. Iterate based on data
5. Consider gradual migration strategy
