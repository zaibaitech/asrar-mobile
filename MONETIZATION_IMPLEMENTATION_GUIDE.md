# 💰 Asrār Mobile Monetization Implementation Guide

**Last Updated**: January 18, 2026  
**Current Phase**: Phase 2 ✅ COMPLETE  
**Overall Status**: 🟢 Ready for RevenueCat

---

## 📊 Executive Summary

### Monetization Model: **Freemium + Ads**
- **Free Tier**: Core Islamic features + banner ads
- **Premium Tier**: $3.99/month or $29.99/year (no ads + advanced features)

### Revenue Projections (Conservative)
| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Downloads | 1,000 | 10,000 | 50,000 |
| Conversion Rate | 2% | 3% | 4% |
| Subscribers | 20 | 300 | 2,000 |
| MRR | $80 | $1,200 | $8,000 |
| Ad Revenue | $50 | $500 | $2,500 |

---

## 🗺️ Phase Overview

| Phase | Name | Status | Time Estimate |
|-------|------|--------|---------------|
| **1** | Subscription Infrastructure | ✅ COMPLETE | 1 day |
| **2** | Feature Gating | ✅ COMPLETE | 1 day |
| **3** | RevenueCat Account Setup | 🔲 Not Started | 1 day |
| **4** | AdMob Integration | 🔲 Not Started | 2 days |
| **5** | Testing & QA | 🔲 Not Started | 2-3 days |
| **6** | App Store Submission | 🔲 Not Started | 1-2 weeks |

**Total Estimated Time**: 2-3 weeks

---

# ✅ PHASE 1: Subscription Infrastructure (COMPLETE)

## What Was Implemented

### 1. RevenueCat Service
**File**: `services/RevenueCatService.ts`

```typescript
// Core Functions Implemented:
- initializeRevenueCat(userId?)     // Initialize SDK
- getSubscriptionStatus()           // Check premium status
- getSubscriptionProducts()         // Get available plans
- purchasePackage(pkg)              // Process purchase
- restorePurchases()                // Restore previous purchases
- loginUser(userId)                 // Sync user across devices
- logoutUser()                      // Reset to anonymous
- openSubscriptionManagement()      // Open App Store/Play Store
```

### 2. Subscription Context
**File**: `contexts/SubscriptionContext.tsx`

```typescript
// Context provides:
interface SubscriptionContextType {
  isPremium: boolean;        // Quick premium check
  isAdmin: boolean;          // Developer bypass
  tier: 'free' | 'premium' | 'admin';
  isLoading: boolean;
  isProcessing: boolean;
  products: SubscriptionProduct[];
  
  // Actions
  checkSubscription(): Promise<void>;
  showPaywall(feature?: string): void;
  purchase(product): Promise<boolean>;
  restorePurchases(): Promise<boolean>;
  loadProducts(): Promise<void>;
}
```

### 3. Paywall Screen
**File**: `app/paywall.tsx`

Features:
- ✅ Beautiful gradient UI matching app theme
- ✅ Premium features showcase (6 features listed)
- ✅ Monthly/Yearly plan selection with radio buttons
- ✅ "Save 37%" badge for yearly plan
- ✅ Purchase button with loading state
- ✅ Restore purchases option
- ✅ Error handling and display
- ✅ RTL support (Arabic)
- ✅ Localization ready (EN/FR/AR)
- ✅ Terms & conditions text

### 4. PaywallModal Component
**File**: `components/subscription/PaywallModal.tsx`

Features:
- ✅ Modal overlay for inline paywalls
- ✅ Lock icon with gradient
- ✅ Feature-specific messaging
- ✅ 3 quick benefits preview
- ✅ "Upgrade" and "Maybe Later" buttons
- ✅ Blur effect on iOS

### 5. UpgradeCard Component
**File**: `components/subscription/UpgradeCard.tsx`

Features:
- ✅ Default variant (full card with icon, title, description, button)
- ✅ Compact variant (smaller inline card)
- ✅ Minimal variant (just a button)
- ✅ `PremiumLockedOverlay` - wrap content to show lock overlay

### 6. Admin Bypass System
**File**: `.env`

```env
# Your admin email - gets free premium access
EXPO_PUBLIC_ADMIN_EMAILS=csibaka920@gmail.com
```

### 7. Environment Configuration
**Files**: `.env`, `.env.example`

```env
# Added placeholders for RevenueCat
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=
```

### 8. App Integration
**File**: `app/_layout.tsx`

- ✅ SubscriptionProvider wrapped around app
- ✅ Inside ProfileProvider (has access to user email)

---

# ✅ PHASE 2: Feature Gating (COMPLETE)

## Philosophy
> "Cosmic data is free. Personal meaning is premium."

We monetize interpretation, personalization, and depth — never access to core spiritual tools or daily guidance. Homepage widgets are ALWAYS free previews.

## What Was Implemented

### 1. Premium Feature Hook
**File**: `hooks/usePremiumFeature.ts`

```typescript
// Centralized premium feature definitions
export const PREMIUM_FEATURES = {
  aiGuidance: { tier: 'high', category: 'ai' },
  personalGuidance: { tier: 'medium', category: 'guidance' },
  quranResonance: { tier: 'high', category: 'interpretation' },
  divineNameResonance: { tier: 'high', category: 'interpretation' },
  compatibilityDeep: { tier: 'medium', category: 'analysis' },
  spiritualGuidance: { tier: 'medium', category: 'guidance' },
  // ... more features
};

// Hook usage
const { canAccess, showPaywall } = usePremiumFeature('aiGuidance');
```

### 2. PremiumSection Component
**File**: `components/subscription/PremiumSection.tsx`

Features:
- ✅ Soft-lock component (blurred preview with upgrade prompt)
- ✅ Compact and full variants
- ✅ Localized copy (EN/FR/AR)
- ✅ Gradient upgrade button
- ✅ RTL support
- ✅ Feature-specific icons

```tsx
// Usage pattern
<PremiumSection
  featureId="aiGuidance"
  title="AI-Powered Insight"
  description="Unlock personalized guidance"
  icon="sparkles"
>
  {/* Premium content rendered only for subscribers */}
  <AIGuidanceContent />
</PremiumSection>
```

### 3. InlineUpgradeBanner Component
**File**: `components/subscription/PremiumSection.tsx`

- ✅ Minimal inline banner for subtle premium prompts
- ✅ Uses same localization system

## Screens Gated

### Moment Alignment Detail
**File**: `app/(tabs)/moment-alignment-detail.tsx`
- FREE: Element display, alignment status, planetary hours, reason bullets
- PREMIUM: Personal Guidance section (Best Now / Avoid Now lists)

### Daily Guidance Details
**File**: `app/(tabs)/daily-guidance-details.tsx`
- FREE: Day ruler, element, timing quality, "Why This?" educational section
- PREMIUM: "Best For" section (action guidance)

### Divine Timing
**File**: `app/(tabs)/divine-timing.tsx`
- FREE: Timing results, Quran reflection, basic analysis
- PREMIUM: AI Guidance section (question card, response cards)

### Name Destiny Results
**File**: `features/name-destiny/screens/ResultsScreen.tsx`
- FREE: Sacred numbers (Kabīr, Ṣaghīr), Element Hero Card, Elemental Composition
- PREMIUM: AI Enhancement, Divine Name Resonance, Quran Resonance, Key Takeaways, Practical Guidance

### Who Am I Results
**File**: `app/(tabs)/results.tsx`
- FREE: Overview tab (basic numbers, element, zodiac)
- PREMIUM: Personality, Career, Blessed Day, Spiritual Practice tabs
- Implementation: `PremiumTabWrapper` component wraps gated tabs

### Compatibility Results
**File**: `components/compatibility/RelationshipCompatibilityView.tsx`
- FREE: Overall score gauge, method score gauges (numeric display)
- PREMIUM: Summary interpretation, AI Enhancement, Personalized Insight, Spiritual/Elemental/Planetary detailed analysis, Recommendations tab

## What Stays FREE (Never Lock)

### Homepage Widgets (Always Free)
- ✅ Daily Energy / Moment Alignment
- ✅ Today's Blessing
- ✅ Next Prayer widget
- ✅ Manazil widget
- ✅ Quick Access shortcuts

### Core Islamic Utilities
- ✅ Prayer times
- ✅ Qibla direction
- ✅ Islamic calendar / Hijri dates
- ✅ Basic Abjad calculator

### Basic Data Display
- ✅ Raw numeric results (scores, numbers)
- ✅ Element identification
- ✅ Zodiac/Burj display
- ✅ Timing quality indicators

## Copy Guidelines Used

✅ **Good Copy** (Aspirational):
- "Unlock deeper insight"
- "Discover how this applies to you"
- "Personalize your guidance"
- "Explore the deep spiritual connection"

❌ **Avoided Copy** (Blocking):
- "This feature is locked"
- "Pay to continue"
- "Subscribe to access"

---
      {/* Free content */}
      <BasicResults data={results} />
      
      {/* Premium content */}
      {isPremium ? (
        <QuranResonanceCard data={resonance} />
      ) : (
        <UpgradeCard 
          feature="Quran Resonance"
          icon="📖"
          description="Discover ayat connected to your numbers"
        />
      )}
    </View>
  );
}
```

### Pattern C: Locked Overlay
```tsx
// For blurred/locked preview
import { PremiumLockedOverlay } from '@/components/subscription';

<PremiumLockedOverlay feature="Advanced Analysis">
  <ExpensiveContent />
</PremiumLockedOverlay>
```

### Pattern D: Service-Level Gate
```tsx
// In service files
export async function getQuranResonance(
  kabir: number,
  isPremium: boolean = false
): Promise<QuranResonance | null> {
  if (!isPremium) {
    return null; // Or return limited data
  }
  // ... full implementation
}
```

## Files to Modify

### High Priority (AI Features)
- [ ] `services/AIReflectionService.ts` - Add `isPremium` check to `isAIAvailable()`
- [ ] `app/(tabs)/divine-timing.tsx` - Gate AI guidance section
- [ ] `app/who-am-i/reflection.tsx` - Gate AI interpretation
- [ ] `features/divine-timing/services/AIGuidanceService.ts` - Gate AI calls

### Medium Priority (Analysis)
- [ ] `services/QuranResonanceService.ts` - Gate or return limited data
- [ ] `features/name-destiny/screens/ResultsScreen.tsx` - Gate advanced sections
- [ ] `app/compatibility.tsx` - Gate lineage insights
- [ ] `app/universal-compatibility.tsx` - Gate advanced features

### Lower Priority (Extras)
- [ ] `app/(tabs)/planet-detail.tsx` - Enable existing `isPremium` checks
- [ ] `app/profile.tsx` - Gate export functionality
- [ ] `components/calculator/SacredResonance.tsx` - Gate advanced methods

---

# 🔲 PHASE 3: RevenueCat Account Setup (NOT STARTED)

## Objective
Set up actual payment processing through RevenueCat and app stores.

## Step-by-Step Checklist

### 3.1 RevenueCat Account
- [ ] Create account at [app.revenuecat.com](https://app.revenuecat.com)
- [ ] Create new project named "Asrar" or "Asrariya"
- [ ] Note your project ID

### 3.2 iOS Setup (App Store Connect)
- [ ] Log into [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Go to your app → Subscriptions
- [ ] Create Subscription Group: "Asrar Premium"
- [ ] Create Products:
  
  | Product ID | Name | Price | Duration |
  |------------|------|-------|----------|
  | `asrariya_premium_monthly` | Asrariya Premium Monthly | $3.99 | 1 month |
  | `asrariya_premium_yearly` | Asrariya Premium Yearly | $29.99 | 1 year |

- [ ] Set localized names (EN, FR, AR)
- [ ] Configure App Store promotional images
- [ ] Get Shared Secret (App-Specific)
- [ ] Add Shared Secret to RevenueCat

### 3.3 Android Setup (Google Play Console)
- [ ] Log into [Google Play Console](https://play.google.com/console)
- [ ] Go to your app → Monetize → Subscriptions
- [ ] Create Products:
  
  | Product ID | Name | Price | Duration |
  |------------|------|-------|----------|
  | `asrariya_premium_monthly` | Asrariya Premium Monthly | $3.99 | 1 month |
  | `asrariya_premium_yearly` | Asrariya Premium Yearly | $29.99 | 1 year |

- [ ] Get Service Account credentials
- [ ] Upload credentials to RevenueCat

### 3.4 RevenueCat Configuration
- [ ] Add iOS app with Bundle ID: `com.zaibaitech.asrariya`
- [ ] Add Android app with Package: `com.zaibaitech.asrariya`
- [ ] Create Entitlement: `premium`
- [ ] Add both products to `premium` entitlement
- [ ] Create Offering: `default`
- [ ] Add packages to offering:
  - `$rc_monthly` → `asrariya_premium_monthly`
  - `$rc_annual` → `asrariya_premium_yearly`
- [ ] Get API Keys:
  - iOS: `appl_xxxxxxxxxxxxxx`
  - Android: `goog_xxxxxxxxxxxxxx`

### 3.5 Environment Update
- [ ] Add keys to `.env`:
```env
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_your_key_here
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_your_key_here
```

### 3.6 RevenueCat Webhooks (Optional but Recommended)
- [ ] Set up webhook URL for subscription events
- [ ] Integrate with Supabase for server-side validation

---

# 🔲 PHASE 4: AdMob Integration (NOT STARTED)

## Objective
Add tasteful ads for free users to generate additional revenue.

## Ad Strategy

### Where to Show Ads
| Location | Ad Type | Frequency | Notes |
|----------|---------|-----------|-------|
| Home Screen Bottom | Banner | Always | Fixed position |
| After Calculation | Interstitial | Every 3rd | Not too aggressive |
| Results Screen | Native | Always | Blends with content |
| Between Modules | Interstitial | Max 2/session | Respect user |

### Where NOT to Show Ads
- ❌ During prayer times display
- ❌ During Quran reading
- ❌ During Adhan playback
- ❌ During Guided Istikhara prayer guide
- ❌ On paywall/subscription screens

## Implementation Checklist

### 4.1 AdMob Account Setup
- [ ] Create account at [admob.google.com](https://admob.google.com)
- [ ] Create iOS app
- [ ] Create Android app
- [ ] Create Ad Units:
  
  | Unit Name | Type | Size |
  |-----------|------|------|
  | `asrar_banner_home` | Banner | Adaptive |
  | `asrar_interstitial_calc` | Interstitial | Full screen |
  | `asrar_native_results` | Native Advanced | Custom |

- [ ] Note App IDs and Ad Unit IDs

### 4.2 Install SDK
```bash
npm install react-native-google-mobile-ads
```

### 4.3 Configure app.json
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx",
          "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
        }
      ]
    ]
  }
}
```

### 4.4 Create Ad Service
- [ ] Create `services/AdMobService.ts`
- [ ] Initialize ads on app start
- [ ] Implement ad loading logic
- [ ] Handle ad events (loaded, failed, clicked)

### 4.5 Create Ad Components
- [ ] Create `components/ads/BannerAd.tsx`
- [ ] Create `components/ads/InterstitialTrigger.tsx`
- [ ] Create `components/ads/NativeAdCard.tsx`

### 4.6 Integrate with Subscription
```tsx
// Only show ads for free users
const { isPremium } = useSubscription();

{!isPremium && <BannerAd />}
```

### 4.7 Add to Screens
- [ ] Add banner to Home screen
- [ ] Add interstitial trigger to Calculator
- [ ] Add native ad to Results screens

---

# 🔲 PHASE 5: Testing & QA (NOT STARTED)

## Objective
Thoroughly test all monetization flows before release.

## Test Scenarios

### 5.1 Subscription Flow Testing
- [ ] Fresh install → See free tier
- [ ] Admin email → See premium automatically
- [ ] Tap locked feature → Navigate to paywall
- [ ] View paywall → Products load correctly
- [ ] Select monthly → Radio selected
- [ ] Select yearly → Radio selected, savings badge visible
- [ ] Purchase monthly → Success flow
- [ ] Purchase yearly → Success flow
- [ ] Cancel purchase → Handle gracefully
- [ ] Restore purchases → Works for previous subscriber
- [ ] Restore purchases → Shows "no subscription" for new user

### 5.2 Feature Gating Testing
| Feature | Free User | Premium User |
|---------|-----------|--------------|
| Basic Calculator | ✅ Works | ✅ Works |
| AI Who Am I | 🔒 Paywall | ✅ Works |
| Quran Resonance | 🔒 UpgradeCard | ✅ Works |
| Divine Timing AI | 🔒 Paywall | ✅ Works |
| Compatibility Basic | ✅ Works | ✅ Works |
| Compatibility Advanced | 🔒 UpgradeCard | ✅ Works |
| Prayer Times | ✅ Works | ✅ Works |
| Qibla | ✅ Works | ✅ Works |

### 5.3 Ad Testing (After Phase 4)
- [ ] Banner loads on home screen
- [ ] Banner hidden for premium users
- [ ] Interstitial shows after 3 calculations
- [ ] Interstitial skippable after 5 seconds
- [ ] Ads don't show during sacred content
- [ ] Ad clicks track properly

### 5.4 Sandbox Testing
- [ ] iOS Sandbox testing with test accounts
- [ ] Android test purchases with license testing
- [ ] Subscription expiry simulation
- [ ] Subscription renewal simulation

### 5.5 Edge Cases
- [ ] Network offline during purchase
- [ ] App killed during purchase
- [ ] User signs out → Subscription status
- [ ] User signs in on new device → Restore works
- [ ] Subscription expires → Graceful downgrade

---

# 🔲 PHASE 6: App Store Submission (NOT STARTED)

## Objective
Submit app with monetization to app stores.

## Pre-Submission Checklist

### 6.1 App Store Requirements
- [ ] Privacy Policy updated for in-app purchases
- [ ] Terms of Service updated for subscriptions
- [ ] Subscription terms clearly visible
- [ ] Restore purchases button accessible
- [ ] Subscription management link works

### 6.2 App Store Screenshots
- [ ] Update screenshots showing premium features
- [ ] Show paywall screen (optional)
- [ ] Highlight value proposition

### 6.3 App Store Metadata
- [ ] Update description mentioning subscription
- [ ] Add subscription pricing to description
- [ ] List premium features

### 6.4 Review Guidelines Compliance

**Apple (App Store Review Guidelines 3.1)**
- [ ] Subscription clearly described before purchase
- [ ] Price and duration visible
- [ ] Renewal terms explained
- [ ] How to cancel explained
- [ ] Restore purchases available

**Google (Play Store Policies)**
- [ ] Subscription disclosure before purchase
- [ ] Clear pricing
- [ ] Cancellation instructions
- [ ] No misleading claims

### 6.5 Submission
- [ ] Build production app with EAS
- [ ] Submit to App Store Connect
- [ ] Submit to Google Play Console
- [ ] Monitor review status
- [ ] Respond to any reviewer questions

---

# 📋 Quick Reference

## Usage Examples

### Check Premium Status
```tsx
import { useSubscription } from '@/contexts/SubscriptionContext';

const { isPremium, isAdmin, tier } = useSubscription();
```

### Navigate to Paywall
```tsx
const { showPaywall } = useSubscription();

<Button onPress={() => showPaywall('AI Guidance')} title="Unlock" />
```

### Show UpgradeCard
```tsx
import { UpgradeCard } from '@/components/subscription';

{!isPremium && (
  <UpgradeCard 
    feature="Quran Resonance" 
    icon="📖"
    description="Discover ayat connected to your numbers"
  />
)}
```

### Lock Content with Overlay
```tsx
import { PremiumLockedOverlay } from '@/components/subscription';

<PremiumLockedOverlay feature="Advanced Analysis">
  <ExpensiveComponent />
</PremiumLockedOverlay>
```

### Show PaywallModal
```tsx
import { PaywallModal } from '@/components/subscription';

const [showModal, setShowModal] = useState(false);

<PaywallModal
  visible={showModal}
  feature="AI Guidance"
  onClose={() => setShowModal(false)}
/>
```

---

## File Locations

| Component | Path |
|-----------|------|
| RevenueCat Service | `services/RevenueCatService.ts` |
| Subscription Context | `contexts/SubscriptionContext.tsx` |
| Paywall Screen | `app/paywall.tsx` |
| PaywallModal | `components/subscription/PaywallModal.tsx` |
| UpgradeCard | `components/subscription/UpgradeCard.tsx` |
| Environment Config | `.env` |

---

## Pricing Reference

| Plan | Price | Effective Monthly | Savings |
|------|-------|-------------------|---------|
| Monthly | $3.99/mo | $3.99 | - |
| Yearly | $29.99/yr | $2.50 | 37% |
| Lifetime | $79.99 | One-time | - |

---

## Admin Bypass

Add emails to `.env` for free premium access:
```env
EXPO_PUBLIC_ADMIN_EMAILS=your@email.com,another@email.com
```

Current admin: `csibaka920@gmail.com`

---

## Support

For issues with:
- **RevenueCat**: [docs.revenuecat.com](https://docs.revenuecat.com)
- **AdMob**: [developers.google.com/admob](https://developers.google.com/admob)
- **App Store**: [developer.apple.com](https://developer.apple.com)
- **Play Store**: [play.google.com/console](https://play.google.com/console)
