# Unified User Profile System - Asrār Mobile

## Overview

The Unified Profile System is the **single source of truth** for all user data across the Asrār mobile app. It enables personalization, auto-fill, spiritual tracking, and prepares the app for future paid features while maintaining a privacy-first, guest-mode-first approach.

## ✅ Implementation Status: COMPLETE

All core components of the unified profile system have been successfully implemented:

- ✅ Type definitions (`types/user-profile.ts`)
- ✅ Local storage service (`services/UserProfileStorage.ts`)
- ✅ Derivation service (`services/ProfileDerivationService.ts`)
- ✅ Global context (`contexts/ProfileContext.tsx`)
- ✅ Profile UI (`app/profile.tsx`)
- ✅ Auth service stub (`services/AuthService.ts`)
- ✅ Privacy features (Export & Delete)
- ✅ Integration with all modules

---

## Architecture

### 1. Data Model

**Location**: `/types/user-profile.ts`

```typescript
interface UserProfile {
  mode: "guest" | "account";
  nameAr?: string;
  nameLatin?: string;
  motherName?: string;
  dobISO?: string;  // YYYY-MM-DD
  timezone: string;
  location?: {
    latitude: number;
    longitude: number;
    label?: string;
  };
  derived?: {
    burj?: string;
    burjIndex?: number;
    element?: "fire" | "water" | "air" | "earth";
    planetaryRuler?: string;
    manazilBaseline?: number;
  };
  createdAt: number;
  updatedAt: number;
}
```

**Key Design Decisions**:
- All fields are **optional** except `mode`, `timezone`, `createdAt`, `updatedAt`
- Guest mode is the **default** (no account required)
- Privacy-first: No required fields that collect personal data

---

### 2. Local Storage Service

**Location**: `/services/UserProfileStorage.ts`

**Key Functions**:

| Function | Purpose |
|----------|---------|
| `loadProfile()` | Load profile from AsyncStorage |
| `saveProfile(profile)` | Save complete profile |
| `updateProfile(partial)` | Update specific fields |
| `clearProfile()` | Delete all data (privacy feature) |
| `initializeProfile()` | Create new default profile |
| `exportProfile()` | Export as JSON (privacy feature) |
| `importProfile(json)` | Import from JSON backup |
| `getProfileCompletionStatus()` | Check what's filled |
| `getPersonalizationLevel()` | 0-3 scale |
| `canUseFeature()` | Check if feature requirements met |
| `validateProfile()` | Zod-based validation |

**Storage Key**: `"asrar.profile.v1"`

---

### 3. Derivation Service

**Location**: `/services/ProfileDerivationService.ts`

**Derives astrological data from DOB**:

```typescript
// Derive burj (zodiac sign) from date of birth
deriveBurjFromDOB(dobISO: string) → { burjAr, burjEn, burjIndex }

// Derive element from burj
deriveElementFromBurj(burjIndex: number) → Element

// Get planetary attributes
getPlanetaryAttributes(planet: string) → { name, arabicName, element, ... }

// Apply all derivations
deriveAstrologicalData(profile) → DerivedAstrologicalData
```

**Mapping**:
- Uses traditional Maghribī astrological mappings
- Burj → Element → Planetary Ruler
- Supports optional Manāzil (moon mansions) baseline

---

### 4. Profile Context

**Location**: `/contexts/ProfileContext.tsx`

**Global State Management**:

```typescript
const {
  profile,                  // Current UserProfile
  isLoading,               // Loading state
  completionStatus,        // What's filled in
  personalizationLevel,    // 0-3
  setProfile,              // Update profile
  refreshDerived,          // Recompute derived data
  resetProfile,            // Clear all data
  reloadProfile,           // Reload from storage
  canUseDivineTiming,      // Feature flags
  canUseNameDestiny,
  canUseCompatibility,
  canUseIstikhara,
} = useProfile();
```

**Integration**:
- Wraps entire app in `<ProfileProvider>`
- All modules read from context
- Auto-derives burj/element when DOB changes
- Tracks completion for UI hints

---

### 5. Profile UI

**Location**: `/app/profile.tsx`

**Features**:

✅ **Profile Completion Banner**
- Shows % complete
- Lists missing fields
- Displays personalization level (None → Basic → Enhanced → Full)

✅ **Data Input Sections**:
1. **Date of Birth** (DatePicker)
   - Required for Divine Timing
   - Auto-derives burj, element, planet

2. **Name** (Arabic + Latin)
   - Required for Name Destiny
   - Used in Compatibility

3. **Mother's Name** (Optional)
   - Only stored if user enables
   - For advanced Abjad calculations

4. **Location** (Optional, permission-based)
   - Auto-detect or manual entry
   - For prayer times & advanced timing

✅ **Live Preview**:
- Shows derived burj, element as you type
- Instant feedback on astrological profile

✅ **Privacy & Data Section**:
- **Export My Data** button
- **Delete All My Data** button
- Privacy notice about local storage

✅ **AI Settings** quick access

---

## User Modes

### A) Guest Mode (Default)

✅ **Fully Functional**:
- All features work without account
- Profile stored locally (AsyncStorage)
- Auto-fill works across all modules
- Daily check-ins and insights saved locally
- No cloud sync
- No subscription required

**Perfect for**: Privacy-conscious users, trial users, offline use

### B) Account Mode (Future)

🔄 **Prepared but not required**:
- Same profile structure as guest
- Syncs to backend (Supabase/Firebase)
- Required for:
  - Cross-device sync
  - Paid subscriptions
  - Advanced tracking
  - Cloud backup

**Location**: `/services/AuthService.ts` (stub implementation)

**Critical**: Features are NOT locked behind auth. Account is purely additive.

---

## Module Integration

All modules now read from ProfileContext:

### 1. Home Screen

**Location**: `/app/(tabs)/index.tsx`

✅ Uses `useProfile()` to:
- Show personalized greetings
- Display profile completion banner
- Auto-populate daily check-in data
- Show personalization level

**UI Logic**:
```typescript
if (!completionStatus.hasDOB) {
  // Show banner: "Add DOB to personalize Divine Timing"
}
```

### 2. Divine Timing

**Peak Windows Card**: `/components/divine-timing/PeakWindowsCard.tsx`

✅ Uses:
- `profile.derived.element` for harmony calculations
- `profile.dobISO` for personalized timing
- `profile.location` for geographic adjustments

### 3. Name Destiny

**Results Screen**: `/features/name-destiny/screens/ResultsScreen.tsx`

✅ Auto-fills:
- `profile.nameAr` → Name input
- `profile.motherName` → Mother name input (if enabled)

### 4. Compatibility

**Compatibility View**: `/components/compatibility/RelationshipCompatibilityView.tsx`

✅ Uses:
- `profile.nameAr` for Person 1
- `profile.derived.burj` for astrological compatibility
- `profile.derived.element` for elemental harmony

### 5. Calculator

**Enhanced Results**: `/components/calculator/EnhancedResultsDisplay.tsx`

✅ Uses:
- `profile.derived.burj` for zodiac-specific insights
- `profile.derived.element` for elemental interpretations

### 6. Istikhārah

**Form**: `/app/(tabs)/istikhara.tsx`

✅ Auto-fills:
- `profile.nameAr` → Person name
- `profile.motherName` → Mother name (if available)

---

## Privacy & Safety

### ✅ Implemented Safeguards

1. **No Background Tracking**
   - App only stores what user explicitly provides
   - No device surveillance
   - No automatic data collection

2. **Local-First Storage**
   - Guest mode uses AsyncStorage only
   - No external transmission in guest mode
   - User controls all data

3. **Export & Delete**
   - **Export My Data**: JSON file with all profile data
   - **Delete All My Data**: Complete removal, cannot be undone
   - GDPR/privacy-compliant

4. **Optional Fields**
   - Mother name only stored if user enables
   - Location requires explicit permission
   - DOB recommended but not forced

5. **Minimal Logging**
   - No logging of personal data values
   - Development logs only (__DEV__ flag)
   - No analytics tracking

6. **Consent-Based**
   - Clear explanations for each field
   - "Why we need this" descriptions
   - User can skip any optional field

---

## Personalization Levels

The system calculates a 0-3 personalization level:

| Level | Name | Requirements | Features Unlocked |
|-------|------|--------------|-------------------|
| 0 | None | No data | Generic app usage |
| 1 | Basic | Name OR DOB | Name-based or timing-based features |
| 2 | Enhanced | Name AND DOB | Full personalization |
| 3 | Full | Name + DOB + Location | All features + geographic personalization |

**UI Display**:
- Profile screen shows current level
- Missing fields listed with prompts
- Completion percentage (0-100%)

---

## Feature Availability Flags

Context provides boolean flags for feature requirements:

```typescript
const {
  canUseDivineTiming,     // true always (DOB optional)
  canUseNameDestiny,      // true if nameAr provided
  canUseCompatibility,    // true if nameAr provided
  canUseIstikhara,        // true always
} = useProfile();
```

**Philosophy**: Features degrade gracefully without data, rather than blocking access.

---

## Data Flow

```
User Input (Profile Screen)
         ↓
ProfileContext.setProfile()
         ↓
UserProfileStorage.updateProfile()
         ↓
AsyncStorage.setItem("asrar.profile.v1")
         ↓
ProfileDerivationService.deriveAstrologicalData()
         ↓
ProfileContext updates
         ↓
All modules re-render with new data
         ↓
Auto-fill + Personalization
```

---

## Future: Account Mode

**When user signs up** (optional):

1. `profile.mode` changes from "guest" → "account"
2. Profile synced to backend (Supabase/Firebase)
3. Same data structure, different storage layer
4. Guest data migrates to account
5. Cross-device sync enabled
6. Subscription features unlocked

**Implementation**:
- Stub exists in `/services/AuthService.ts`
- Backend integration deferred (Phase 2)
- Guest mode remains fully functional forever

---

## Testing & Validation

### Profile Validation

**Built-in Zod schemas**:
- DOB must be valid date (YYYY-MM-DD)
- Timezone must be IANA format
- Location coordinates must be valid
- Name fields: Arabic script validation (optional)

**Error Handling**:
- Invalid data gracefully ignored
- Validation errors shown to user
- Partial updates supported

### Test Scenarios

✅ **Guest Mode**:
1. Fresh install → Empty profile created
2. Add DOB → Burj/element auto-derived
3. Add name → Name Destiny unlocked
4. Export data → JSON file generated
5. Clear data → Profile reset to default

✅ **Auto-Fill**:
1. Set profile DOB/name
2. Navigate to Name Destiny → Auto-filled
3. Navigate to Compatibility → Auto-filled
4. Navigate to Istikhara → Auto-filled

✅ **Privacy**:
1. Export data → File contains all profile fields
2. Delete data → AsyncStorage cleared
3. Restart app → New empty profile

---

## Benefits

### For Users

✅ **Convenience**:
- Enter data once, use everywhere
- No repetitive form filling
- Consistent personalization

✅ **Privacy**:
- Full control over data
- Local storage by default
- Export/delete anytime
- No forced account creation

✅ **Spiritual Tracking**:
- Long-term insights based on profile
- Personalized guidance
- Progress tracking (like Fitbit for spirituality)

### For Development

✅ **Clean Architecture**:
- Single source of truth
- No duplicate data entry logic
- Centralized validation
- Easy to extend

✅ **Future-Ready**:
- Subscription model prepared
- Account mode architecture in place
- No breaking changes needed

✅ **Maintainable**:
- Well-documented
- TypeScript + Zod validation
- Separation of concerns

---

## File Structure

```
/workspaces/asrar-mobile/
├── types/
│   └── user-profile.ts          # UserProfile types & interfaces
├── services/
│   ├── UserProfileStorage.ts    # AsyncStorage CRUD operations
│   ├── ProfileDerivationService.ts  # Burj/element derivation
│   └── AuthService.ts           # Future account mode (stub)
├── contexts/
│   └── ProfileContext.tsx       # Global profile state
├── app/
│   └── profile.tsx              # Profile UI screen
└── components/
    ├── divine-timing/           # Uses profile for personalization
    ├── calculator/              # Uses profile for auto-fill
    ├── compatibility/           # Uses profile for auto-fill
    └── name-destiny/            # Uses profile for auto-fill
```

---

## API Reference

### ProfileContext

```typescript
import { useProfile } from '@/contexts/ProfileContext';

const {
  profile,                      // UserProfile
  isLoading,                    // boolean
  completionStatus,             // ProfileCompletionStatus
  personalizationLevel,         // 0 | 1 | 2 | 3
  setProfile,                   // (updates: Partial<UserProfile>) => Promise<void>
  refreshDerived,               // () => Promise<void>
  resetProfile,                 // () => Promise<void>
  reloadProfile,                // () => Promise<void>
  canUseDivineTiming,           // boolean
  canUseNameDestiny,            // boolean
  canUseCompatibility,          // boolean
  canUseIstikhara,              // boolean
} = useProfile();
```

### UserProfileStorage

```typescript
import { 
  loadProfile,
  saveProfile,
  updateProfile,
  clearProfile,
  exportProfile,
  getProfileCompletionStatus,
  getPersonalizationLevel,
} from '@/services/UserProfileStorage';

// Load
const profile = await loadProfile(); // UserProfile | null

// Save
await saveProfile(profile);

// Update partial
await updateProfile({ dobISO: '1990-01-01' });

// Clear all
await clearProfile();

// Export for backup
const jsonString = await exportProfile(); // JSON string

// Check completion
const status = getProfileCompletionStatus(profile);
// { hasDOB, hasName, hasLocation, completionPercent, missingFields }

// Get level
const level = getPersonalizationLevel(profile); // 0-3
```

### ProfileDerivationService

```typescript
import {
  deriveBurjFromDOB,
  deriveElementFromBurj,
  deriveAstrologicalData,
  getPlanetaryAttributes,
} from '@/services/ProfileDerivationService';

// Derive burj from DOB
const burjData = deriveBurjFromDOB('1990-01-15');
// { burjAr: 'الجدي', burjEn: 'Capricorn', burjIndex: 9 }

// Derive element from burj index
const element = deriveElementFromBurj(9); // 'earth'

// Get full derived data
const derived = deriveAstrologicalData(profile);
// { burj, burjIndex, element, planetaryRuler, manazilBaseline }

// Get planet attributes
const saturn = getPlanetaryAttributes('Saturn');
// { name, arabicName, element, qualities, ... }
```

---

## Migration Guide

For existing screens that manually handle user input:

### Before:
```typescript
const [userName, setUserName] = useState('');
const [userDOB, setUserDOB] = useState('');
// ... duplicated across multiple screens
```

### After:
```typescript
import { useProfile } from '@/contexts/ProfileContext';

const { profile } = useProfile();
// Auto-filled from profile!
const userName = profile.nameAr || '';
const userDOB = profile.dobISO || '';
```

---

## Next Steps (Optional Future Enhancements)

### Phase 2: Account Mode
- Implement Supabase/Firebase backend
- User authentication (email/password)
- Profile sync API
- Migration from guest → account

### Phase 3: Advanced Features
- Subscription management
- Cross-device sync
- Cloud backup
- Family/relationship profiles
- Historical tracking dashboard

### Phase 4: Analytics (Privacy-Preserving)
- Local-only usage patterns
- Spiritual progress tracking
- Insights based on check-in history
- No external data transmission

---

## Conclusion

The Unified Profile System is **production-ready** and provides:

✅ **Single source of truth** for user data
✅ **Privacy-first** guest mode (fully functional)
✅ **Auto-fill** across all modules
✅ **Spiritual tracking** foundation
✅ **Future-proof** architecture for accounts/subscriptions
✅ **Export & delete** for GDPR compliance

**The app now has a robust, scalable foundation for personalization while respecting user privacy and maintaining full functionality in guest mode.**

---

**Document Version**: 1.0  
**Last Updated**: December 28, 2025  
**Status**: ✅ Implementation Complete
