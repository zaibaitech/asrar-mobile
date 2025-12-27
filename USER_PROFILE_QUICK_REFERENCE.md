# User Profile System - Quick Reference

## 🚀 Quick Start

### 1. Access Profile in Any Component

```typescript
import { useProfile } from '@/contexts/ProfileContext';

function MyComponent() {
  const { profile, completionStatus, setProfile } = useProfile();
  
  // Use profile data
  const userName = profile.nameAr || 'Guest';
  const userElement = profile.derived?.element || 'fire';
  
  // Update profile
  await setProfile({ nameAr: 'محمد', dobISO: '1990-01-15' });
}
```

### 2. Check Feature Availability

```typescript
const { canUseNameDestiny } = useProfile();

if (!canUseNameDestiny) {
  // Show banner: "Add your Arabic name"
}
```

### 3. Navigate to Profile Screen

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/profile');
```

---

## 📊 Profile Completion Status

```typescript
const { completionStatus } = useProfile();

completionStatus.hasDOB        // boolean
completionStatus.hasName       // boolean
completionStatus.hasLocation   // boolean
completionStatus.completionPercent  // 0-100
completionStatus.missingFields      // ['dob', 'name', 'location']
```

---

## 🎨 UI Integration Patterns

### Show Banner When Data Missing

```typescript
{!completionStatus.hasDOB && (
  <TouchableOpacity onPress={() => router.push('/profile')}>
    <Text>Add DOB to unlock personalization</Text>
  </TouchableOpacity>
)}
```

### Auto-Fill Forms

```typescript
useEffect(() => {
  if (profile.nameAr && !localName) {
    setLocalName(profile.nameAr);
  }
}, [profile.nameAr]);
```

### Personalize Content

```typescript
const element = profile.derived?.element || 'fire';
const burj = profile.derived?.burj || 'الحمل';

<Text>Your element: {element}</Text>
<Text>Your burj: {burj}</Text>
```

---

## 🔧 Storage Operations

### Save Profile

```typescript
import { saveProfile } from '@/services/UserProfileStorage';

const updatedProfile = {
  ...profile,
  nameAr: 'محمد',
  dobISO: '1990-01-15',
};

await saveProfile(updatedProfile);
```

### Load Profile

```typescript
import { loadProfile } from '@/services/UserProfileStorage';

const profile = await loadProfile();
if (profile) {
  // Use profile
}
```

### Clear Profile

```typescript
import { clearProfile } from '@/services/UserProfileStorage';

await clearProfile(); // Resets to guest mode
```

---

## 🧮 Astrological Derivations

### Get Burj from DOB

```typescript
import { deriveBurjFromDOB } from '@/services/ProfileDerivationService';

const burjData = deriveBurjFromDOB('1990-01-15');
// { burjAr: 'الجدي', burjEn: 'Capricorn', burjIndex: 9 }
```

### Get Element

```typescript
import { deriveElementFromBurj } from '@/services/ProfileDerivationService';

const element = deriveElementFromBurj(9); // 'earth'
```

### Full Derivation

```typescript
import { deriveAstrologicalData } from '@/services/ProfileDerivationService';

const derived = deriveAstrologicalData(profile);
// {
//   burj: 'الجدي',
//   burjIndex: 9,
//   element: 'earth',
//   planetaryRuler: 'saturn',
//   manazilBaseline: 12
// }
```

---

## 📝 Type Definitions

### UserProfile

```typescript
interface UserProfile {
  mode: 'guest' | 'account';
  nameAr?: string;
  nameLatin?: string;
  motherName?: string;
  dobISO?: string;  // YYYY-MM-DD
  location?: { latitude: number; longitude: number; label: string };
  timezone: string;
  derived: DerivedAstrologicalData | null;
  createdAt: number;
  updatedAt: number;
}
```

### DerivedAstrologicalData

```typescript
interface DerivedAstrologicalData {
  burj: string;        // Arabic zodiac name
  burjIndex: number;   // 0-11
  element: 'fire' | 'earth' | 'air' | 'water';
  planetaryRuler: 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';
  manazilBaseline: number;  // 0-27
}
```

---

## 🎯 Common Use Cases

### 1. Personalize Divine Timing

```typescript
const element = profile.derived?.element || 'fire';
<PeakWindowsCard userElement={element} />
```

### 2. Auto-Fill Compatibility

```typescript
useEffect(() => {
  if (profile.nameAr) {
    setPerson1Arabic(profile.nameAr);
  }
}, [profile.nameAr]);
```

### 3. Auto-Fill Istikhara

```typescript
useEffect(() => {
  if (profile.nameAr) setPersonName(profile.nameAr);
  if (profile.motherName) setMotherName(profile.motherName);
}, [profile.nameAr, profile.motherName]);
```

### 4. Show Welcome Message

```typescript
const { profile } = useProfile();
const greeting = profile.nameAr 
  ? `مرحباً ${profile.nameAr}` 
  : 'مرحباً';

<Text>{greeting}</Text>
```

### 5. Conditional Feature Access

```typescript
const { canUseNameDestiny } = useProfile();

{canUseNameDestiny ? (
  <NameDestinyCalculator />
) : (
  <Banner text="Add your Arabic name to unlock Name Destiny" />
)}
```

---

## 🔐 Privacy Notes

- All data stored locally in AsyncStorage
- No external transmission in guest mode
- User can clear data anytime via Profile screen
- Account mode (cloud sync) is stubbed for future

---

## 🐛 Troubleshooting

### Profile not loading?

```typescript
const { isLoading } = useProfile();

if (isLoading) {
  return <ActivityIndicator />;
}
```

### Derived data is null?

Check if DOB is provided:
```typescript
if (!profile.dobISO) {
  // Show message: "Add DOB to see astrological data"
}
```

### Auto-fill not working?

Ensure useEffect dependencies include profile fields:
```typescript
useEffect(() => {
  if (profile.nameAr && !localName) {
    setLocalName(profile.nameAr);
  }
}, [profile.nameAr]); // ← Include profile.nameAr
```

---

## 📚 Additional Resources

- **Complete Documentation**: `USER_PROFILE_SYSTEM_COMPLETE.md`
- **Type Definitions**: `types/user-profile.ts`
- **Context Provider**: `contexts/ProfileContext.tsx`
- **Profile UI**: `app/profile.tsx`

---

## ✅ Checklist for New Features

When adding a new feature that could use profile data:

- [ ] Import `useProfile` hook
- [ ] Check if required data exists (`completionStatus.hasDOB`, etc.)
- [ ] Auto-fill forms from profile when available
- [ ] Show banner if required profile data missing
- [ ] Allow per-session override (don't force profile data)
- [ ] Update profile when user saves (optional)

---

**Last Updated**: Implementation Complete
**Status**: Production Ready ✅
