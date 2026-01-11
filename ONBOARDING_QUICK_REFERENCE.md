# Onboarding Quick Reference

## 🚀 Quick Start

The onboarding system is fully implemented and will automatically show on first app launch.

## 📝 Key Files

| File | Purpose |
|------|---------|
| `/app/(onboarding)/index.tsx` | Main onboarding screen |
| `/services/OnboardingService.ts` | Onboarding state management |
| `/services/SessionModeService.ts` | Guest/account mode management |
| `/constants/translations.ts` | All onboarding text (EN/FR) |

## 🎯 User Actions

### Final Slide CTAs

1. **Sign Up** (Primary) → Purple gradient button
2. **Sign In** (Secondary) → Purple outline button  
3. **Continue as Guest** (Tertiary) → Text-only gray button

### Navigation

- **Skip**: Jump to final slide
- **Next**: Go to next slide
- **Back**: Return to previous slide

## 🔧 Testing Commands

Reset onboarding (show it again):
```typescript
import { resetOnboarding } from '@/services/OnboardingService';
await resetOnboarding();
```

Check current status:
```typescript
import { getOnboardingCompleted } from '@/services/OnboardingService';
const completed = await getOnboardingCompleted();
console.log('Onboarding completed:', completed);
```

Check guest mode:
```typescript
import { getGuestMode } from '@/services/SessionModeService';
const isGuest = await getGuestMode();
console.log('Guest mode:', isGuest);
```

## 📱 Storage Keys

- `@asrar_onboarding_completed` - "true" or not set
- `@asrar_guest_mode` - "true" or "false"

## 🎨 Theme Colors

- Background gradient: `#1A1625`, `#0D0A1A`, `#1A1625`
- Primary accent: `#8B5CF6` (purple)
- Active dot: `#8B5CF6`
- Text primary: `#FFFFFF`
- Text secondary: `#E5E5E5`

## 🌍 Translations

All text uses `t()` function:
```typescript
t('onboarding.slides.1.title')
t('onboarding.signUp')
t('onboarding.continueGuest')
```

## 🔄 Flow

```
First Launch → Onboarding → Auth/Guest Choice → Home
                    ↓
             Mark completed
                    ↓
          Never show again
```

## ✅ Checklist

- [ ] Onboarding shows on fresh install
- [ ] Skip button works
- [ ] Navigation works (Next/Back)
- [ ] All 3 CTAs route correctly
- [ ] Language switch updates text
- [ ] Guest mode persists
- [ ] Sign in clears guest mode
- [ ] Never shows after completion

---

**Quick Tip**: Use the "Skip" button to jump directly to the auth/guest choice screen during testing.
