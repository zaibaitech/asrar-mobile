# Monetization Architecture Audit Report

**Date**: February 14, 2026  
**Scope**: Pre-RevenueCat & Pre-AdMob Integration Analysis  
**App**: Asrariya (Asrār Everyday) - Spiritual/Esoteric Mobile App

---

## Executive Summary

The Asrariya app has a **well-structured monetization foundation** already in place, designed around the philosophy: *"Cosmic data is free. Personal meaning is premium."* The infrastructure is technically sound and ready for RevenueCat integration with minimal changes.

### Current State
- ✅ Premium gating infrastructure exists and works
- ✅ Clean separation of concerns (hooks, context, components)
- ✅ 14 premium feature definitions with tiered categorization
- ✅ Paywall screen implemented with product display
- ❌ RevenueCat SDK not configured (runs in stub mode)
- ❌ No ad SDK integrated
- ⚠️ All users default to free tier (except admin bypass)

### Key Findings
1. **Strengths**: Excellent technical foundation, thoughtful UX copy, scalable architecture
2. **Risks**: Free tier may feel incomplete, potential over-gating
3. **Recommendation**: Proceed with RevenueCat integration; consider freemium adjustments

---

## 1. Premium Gates Inventory

### 1.1 All Premium Gates by Type

| File | Component/Location | What is Locked | Gate Type |
|------|-------------------|----------------|-----------|
| `app/(tabs)/divine-timing.tsx:696` | AI Guidance section | AI-powered Divine Timing guidance | PremiumSection (inline) |
| `features/name-destiny/screens/ResultsScreen.tsx:423` | AI Interpretation | Personalized AI analysis of name | PremiumSection (inline) |
| `features/name-destiny/screens/ResultsScreen.tsx:479` | Divine Name Resonance | Divine Name connection to user | PremiumSection (inline) |
| `features/name-destiny/screens/ResultsScreen.tsx:694` | Quran Resonance | Quranic verses connected to numbers | PremiumSection (inline) |
| `features/name-destiny/screens/ResultsScreen.tsx:721,743` | Spiritual Guidance | Practical spiritual guidance | PremiumSection (inline) |
| `features/name-destiny/screens/HomeScreen.tsx:425` | Spiritual Details | Deep spiritual meaning explanation | PremiumSection (collapsible) |
| `app/(tabs)/planet-transit-details.tsx:2843,3231,3413,3479` | Personal Guidance | Personalized transit impact | PremiumSection (inline) |
| `app/(tabs)/planet-transit-details.tsx:2906` | Elemental Harmony | Element balance analysis | PremiumSection (inline) |
| `app/(tabs)/prayer-guidance.tsx:330` | Spiritual Guidance | Enhanced prayer guidance | PremiumSection (inline) |
| `app/(tabs)/results.tsx:255-345` | Multiple sections | Personal, spiritual, timing tabs | PremiumSection (tabbed) |
| `app/(tabs)/manazil.tsx:1091` | Manzil Practices | Lunar mansion practices | PremiumSection (inline) |
| `components/compatibility/*.tsx` (7 locations) | Deep Compatibility | Advanced compatibility analysis | PremiumSection (inline) |
| `components/calculator/EnhancedResultsDisplay.tsx:196` | Advanced Calculator | Deep Abjad analysis sections | PremiumSection (wrapper) |
| `components/istikhara/tabs/OverviewTab.tsx:243` | Spiritual Guidance | Istikhara guidance | PremiumSection (inline) |

### 1.2 Premium Feature IDs (Source of Truth)

From `hooks/usePremiumFeature.ts`:

| Feature ID | Tier | Description | Currently Used |
|------------|------|-------------|----------------|
| `aiGuidance` | High | AI-powered personalized guidance | ✅ Yes (1 location) |
| `aiInterpretation` | High | AI interpretation of results | ✅ Yes (1 location) |
| `personalGuidance` | Medium | Personal impact analysis | ✅ Yes (5 locations) |
| `quranResonance` | Medium | Quranic verse connections | ✅ Yes (1 location) |
| `divineNameResonance` | Medium | Divine Name associations | ✅ Yes (1 location) |
| `lineageInsights` | Medium | Family lineage analysis | ❌ Not used |
| `elementalHarmony` | Medium | Element balance analysis | ✅ Yes (1 location) |
| `spiritualGuidance` | Medium | Practical spiritual guidance | ✅ Yes (6 locations) |
| `timingAdvice` | Medium | Timing recommendations | ✅ Yes (1 location) |
| `compatibilityDeep` | Medium | Advanced compatibility | ✅ Yes (12 locations) |
| `manazilPractices` | Medium | Lunar mansion practices | ✅ Yes (1 location) |
| `pdfExport` | Low | PDF export functionality | ❌ Not gated |
| `cloudSync` | Low | Cloud synchronization | ❌ Not gated |
| `advancedCalculator` | Low | Enhanced calculator features | ✅ Yes (1 location) |

---

## 2. Feature Classification & Recommendations

### 2.1 Recommended Tier Structure

| Feature | File | Current Gate | Recommended Tier | Reason |
|---------|------|--------------|------------------|--------|
| Basic Abjad Calculation | calculator/* | Free | **Core Free** | Entry point, demonstrates value |
| Name Destiny Numbers (raw) | ResultsScreen.tsx | Free | **Core Free** | Basic result, hooks users |
| Element Identification | Multiple | Free | **Core Free** | Foundation of system |
| Daily Energy Score | index.tsx | Free | **Core Free** | Daily engagement driver |
| Prayer Times | prayerTimes | Free | **Core Free** | Religious utility, trust-building |
| Qibla Finder | qibla.tsx | Free | **Core Free** | Essential utility |
| Manazil (basic) | manazil.tsx | Free | **Core Free** | Cosmic data is free |
| Planetary Hours (basic) | divine-timing.tsx | Free | **Core Free** | Cosmic data is free |
| Compatibility (basic score) | compatibility.tsx | Free | **Core Free** | Teaser for premium |
| AI Guidance | divine-timing.tsx | Premium | **Premium Only** | High compute cost, high value |
| AI Interpretation | ResultsScreen.tsx | Premium | **Premium Only** | High compute cost, high value |
| Deep Compatibility | compatibility/*.tsx | Premium | **Premium Only** | Detailed personal analysis |
| Quran Resonance | ResultsScreen.tsx | Premium | **Premium/Rewarded** | Medium value, ad-unlock candidate |
| Divine Name Resonance | ResultsScreen.tsx | Premium | **Premium Only** | High spiritual value |
| Spiritual Guidance | Multiple | Premium | **Premium Only** | Personalized advice |
| Manzil Practices | manazil.tsx | Premium | **Premium/Rewarded** | Medium value, ad-unlock candidate |
| Personal Impact (transits) | planet-transit-details.tsx | Premium | **Premium Only** | Personalized analysis |
| PDF Export | results.tsx | Free | **Freemium Limited** | 1 free/week, then premium |
| Advanced Calculator | EnhancedResultsDisplay.tsx | Premium | **Premium Only** | Deep analysis |

### 2.2 Freemium Limits (Recommended)

| Feature | Free Limit | After Limit |
|---------|------------|-------------|
| Name Calculations | **5 per day** | Premium or wait 24h |
| Compatibility Checks | **3 per day** | Premium or wait 24h |
| AI Guidance Requests | **0** | Premium only |
| Quran Resonance Views | **1 per day** | Premium or watch ad |
| PDF Exports | **1 per week** | Premium only |
| Deep Transit Analysis | **1 per day** | Premium or watch ad |

---

## 3. Free Tier Evaluation

### 3.1 Current Free Tier Analysis

**What's Free Now:**
- ✅ Home screen with daily overview
- ✅ Basic Abjad calculator
- ✅ Prayer times & Qibla
- ✅ Manazil (lunar mansions) - basic view
- ✅ Planetary hours - basic view
- ✅ Compatibility - input forms only
- ✅ Name Destiny - input forms only
- ✅ Who Am I - input forms only

**What's Gated (Premium):**
- 🔒 All AI-powered features
- 🔒 Quran Resonance results
- 🔒 Divine Name connections
- 🔒 Spiritual guidance sections
- 🔒 Deep compatibility analysis
- 🔒 Personal transit impact
- 🔒 Manzil practices

### 3.2 Free Tier Strength Assessment

| Criterion | Score | Notes |
|-----------|-------|-------|
| Completeness | ⭐⭐⭐☆☆ | Forms work, but results feel incomplete |
| Value Demonstration | ⭐⭐⭐⭐☆ | Shows enough to prove concept |
| Daily Usability | ⭐⭐⭐⭐⭐ | Prayer times, daily energy work great |
| Conversion Hook | ⭐⭐⭐⭐☆ | Premium badges visible, enticing |
| Over-gating Risk | ⭐⭐⭐☆☆ | Some core spiritual content locked |

### 3.3 Recommendations

**Unlock for Free:**
1. **Basic Quran Resonance** (first verse only) - demonstrates unique value
2. **Basic element breakdown** in Name Destiny - shows depth
3. **One free compatibility check per day** - builds habit

**Limit Instead of Fully Lock:**
1. Name calculations: 5/day free → premium for unlimited
2. Compatibility: 3/day free → premium for unlimited
3. Manzil practices: 1/day free → premium or rewarded ad

**Keep Strictly Premium:**
1. All AI-powered features (cost + value)
2. Deep compatibility analysis
3. Divine Name resonance
4. Personalized transit guidance
5. PDF exports beyond free tier

---

## 4. Rewarded Ad Placement Strategy

### 4.1 Philosophy
- **Voluntary only** - no forced interruptions
- **Value exchange clear** - user understands what they unlock
- **Spiritual respect** - never interrupt prayer/sacred content
- **Non-intrusive placement** - end of flows, not mid-experience

### 4.2 Recommended Placements

| Screen | Action | Ad Type | Unlock Scope | UX Placement |
|--------|--------|---------|--------------|--------------|
| Name Destiny Results | Tap "View Quran Resonance" | Rewarded Video | One Quran Resonance view | Bottom sheet with "Watch to unlock" |
| Compatibility Results | Tap "Deep Analysis" | Rewarded Video | Full compatibility report | After basic score shown |
| Manazil Screen | Tap "Practices" | Rewarded Video | One manzil practice view | Lock icon → modal offer |
| Daily Guidance | After viewing free daily | Rewarded Video | Extended guidance (+3 tips) | Natural "Want more?" prompt |
| Calculator Results | After 5th calculation | Rewarded Video | +3 additional calculations | Soft limit reached modal |
| Divine Timing | After intention selected | Rewarded Video | Advanced timing analysis | "Unlock deeper insight" button |

### 4.3 Ad Placement Anti-Patterns (DO NOT USE)

❌ **Never Place Ads:**
- During prayer times display
- Inside Quran reading experience
- Mid-calculation flow
- On paywall screen
- During onboarding
- Over sacred/spiritual imagery

---

## 5. Subscription Strategy Review

### 5.1 Current Premium Grouping Analysis

**Current Structure**: Single "Premium" tier
- All premium features unlocked together
- Price points: Monthly ($3.99), Yearly ($29.99), Lifetime ($79.99)

**Assessment**: ✅ **Good structure for launch**
- Simple to understand
- No decision paralysis
- Clear value proposition

### 5.2 Recommended Premium Feature Set

**Asrariya Premium Includes:**
1. 🌙 **AI-Powered Guidance** - Personalized spiritual insights
2. 📜 **Full Name Destiny Analysis** - Quran resonance, divine names
3. ⚖️ **Deep Compatibility** - Complete relationship analysis
4. 🕰️ **Divine Timing Optimizer** - AI-enhanced timing
5. 🌌 **Personal Transit Impact** - How planetary movements affect you
6. 📖 **Quran Resonance** - Ayat connected to your numbers
7. 🚫 **Ad-Free Experience** - Uninterrupted spiritual journey
8. 📄 **Unlimited PDF Exports** - Save and share results
9. ☁️ **Cloud Sync** - Cross-device synchronization

### 5.3 Tier Strategy Recommendation

**For Launch**: Single Premium tier ✅
- Simpler implementation
- Easier to communicate
- Lower decision friction

**Future Consideration** (Post-launch optimization):
- **Basic Premium** ($2.99/mo): Ad-free + increased limits
- **Full Premium** ($5.99/mo): All features + AI
- **Analysis**: Monitor which features drive conversion

### 5.4 Pricing Strategy Notes

| Plan | Price | Positioning |
|------|-------|-------------|
| Monthly | $3.99 | Value-conscious, try before commit |
| Yearly | $29.99 | Best value (37% savings), commitment users |
| Lifetime | $79.99 | One-time, dedicated users |

**Recommendation**: Default to yearly selection (already implemented ✅)

---

## 6. UX Flow Review

### 6.1 Current Paywall Journey

```
User Journey:
┌─────────────────────────────────────────────────────────────────┐
│ Home Screen (Free)                                               │
│     ↓                                                            │
│ Feature Screen (Free input)                                      │
│     ↓                                                            │
│ Results Screen (Free basics + Premium badges)                    │
│     ↓                                                            │
│ Tap Premium Section → PremiumSection shows upgrade CTA           │
│     ↓                                                            │
│ Tap "Unlock deeper insight" → Navigate to /paywall               │
│     ↓                                                            │
│ Paywall Screen (Purchase flow)                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Paywall Timing Analysis

| Touchpoint | When Paywall Appears | Assessment |
|------------|---------------------|------------|
| PremiumSection tap | After seeing free content | ✅ Good - value demonstrated |
| Feature badge tap | From feature lists | ⚠️ Okay - might be too early |
| Settings "Upgrade" | Manual navigation | ✅ Good - user-initiated |
| After calculation limit | After 5+ uses | ✅ Good - habit formed |

### 6.3 UX Improvement Recommendations

**Current Issues:**
1. Premium sections can feel "blocking" in result screens
2. Upgrade messaging could be more value-focused
3. No trial period to experience premium

**Suggested Improvements:**

1. **Softer Premium Preview**
   ```
   Current: "🔒 Premium Feature - Upgrade to unlock"
   Better:  "✨ Unlock deeper insight into your spiritual path"
   ```

2. **Progressive Disclosure**
   - Show blurred preview of premium content
   - Tease 1-2 lines of what's behind the gate
   - Already implemented in PremiumSection ✅

3. **First-Time Value Gift**
   - Give 1 free AI guidance on first use
   - Builds habit before asking for payment
   - Demonstrates premium value

4. **Spiritual Framing**
   ```
   Current CTA: "Upgrade to Premium"
   Better CTA:  "Continue Your Spiritual Journey"
   ```

5. **Timing Optimization**
   - Don't show paywall during onboarding
   - Wait until user completes at least 2 calculations
   - Show after user has engaged 3+ times

### 6.4 Psychological Framing Guidelines

**Do:**
- ✅ "Discover deeper meaning"
- ✅ "Unlock personalized guidance"
- ✅ "Continue your journey"
- ✅ "Access advanced wisdom"

**Don't:**
- ❌ "This feature is locked"
- ❌ "Pay to access"
- ❌ "Premium users only"
- ❌ "Upgrade required"

---

## 7. Technical Readiness Check

### 7.1 Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Monetization Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ SubscriptionCtx │  │ RevenueCatSvc   │  │ usePremiumHook  │ │
│  │ (State Manager) │  │ (SDK Wrapper)   │  │ (Feature Gates) │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                    │            │
│           │                    │                    │            │
│  ┌────────▼────────────────────▼────────────────────▼────────┐  │
│  │                     UI Components                          │  │
│  │  • PremiumSection (soft lock with preview)                │  │
│  │  • UpgradeCard (inline upgrade prompt)                    │  │
│  │  • PaywallModal (full-screen purchase)                    │  │
│  │  • paywall.tsx (dedicated paywall screen)                 │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Technical Assessment

| Component | Status | Notes |
|-----------|--------|-------|
| `contexts/SubscriptionContext.tsx` | ✅ Ready | Handles state, admin bypass, purchase flow |
| `services/RevenueCatService.ts` | ✅ Ready | Lazy loading, stub mode support |
| `hooks/usePremiumFeature.ts` | ✅ Ready | Clean feature gating |
| `components/subscription/*` | ✅ Ready | PremiumSection, UpgradeCard, PaywallModal |
| `app/paywall.tsx` | ✅ Ready | Full purchase UI |
| Backend Guards | ⚠️ Missing | No server-side entitlement check |
| Usage Tracking | ⚠️ Missing | No daily limit enforcement |
| Ad Infrastructure | ❌ Missing | No AdMob integration |

### 7.3 Readiness Checklist

**Before RevenueCat Integration:**
- ✅ API key env variables defined (empty, ready to fill)
- ✅ Product identifiers defined in code
- ✅ Entitlement identifier defined ("premium")
- ✅ Subscription context ready
- ✅ Admin bypass for testing
- ⬜ Create RevenueCat account
- ⬜ Configure products in App Store Connect
- ⬜ Configure products in Google Play Console
- ⬜ Add API keys to `.env`

**Before AdMob Integration:**
- ⬜ Create AdMob account
- ⬜ Install `react-native-google-mobile-ads`
- ⬜ Create `services/AdMobService.ts`
- ⬜ Create rewarded ad hook
- ⬜ Define ad unit placements

### 7.4 Centralization Recommendations

**Current State**: ✅ Well-centralized
- Single `SubscriptionContext` for state
- Single `usePremiumFeature` for gating
- Single `RevenueCatService` for SDK

**Improvements Needed:**

1. **Server-Side Entitlement Check**
   ```typescript
   // supabase/functions/check-entitlement/index.ts
   // Verify subscription status before serving AI content
   ```

2. **Usage Tracking Service**
   ```typescript
   // services/UsageLimitService.ts
   interface UsageLimit {
     feature: PremiumFeatureId;
     dailyLimit: number;
     currentUsage: number;
   }
   ```

3. **Ad Service Abstraction**
   ```typescript
   // services/AdService.ts
   // Unified interface for rewarded ads
   async showRewardedAd(placement: AdPlacement): Promise<boolean>
   ```

---

## 8. Final Recommendations

### 8.1 Summary of Current Architecture

| Aspect | Rating | Summary |
|--------|--------|---------|
| Technical Foundation | ⭐⭐⭐⭐⭐ | Excellent - ready for integration |
| Feature Gating | ⭐⭐⭐⭐☆ | Good - well-organized, minor gaps |
| UX Copy | ⭐⭐⭐⭐⭐ | Excellent - respectful, value-focused |
| Free Tier Balance | ⭐⭐⭐☆☆ | Okay - needs more free value |
| Scalability | ⭐⭐⭐⭐☆ | Good - centralized, extensible |

### 8.2 Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Over-gating leads to poor reviews | Medium | Unlock basic Quran resonance |
| AI costs exceed revenue | Low | Keep AI strictly premium |
| Free users churn quickly | Medium | Add daily limits, not full blocks |
| No server validation | Medium | Add Edge Function verification |

### 8.3 Strengths

1. **Clean architecture** - Easy to extend and maintain
2. **Thoughtful UX** - Respects spiritual context
3. **Admin bypass** - Easy testing without payment
4. **Localization ready** - EN/FR/AR support in place
5. **Tiered features** - Logical value progression

### 8.4 Pre-Integration Changes

**Required Before RevenueCat:**
1. ⬜ Create RevenueCat account and configure products
2. ⬜ Add API keys to environment

**Recommended Before Launch:**
1. ⬜ Unlock first Quran Resonance view (free)
2. ⬜ Add daily usage limits (not full blocks)
3. ⬜ Implement server-side entitlement check
4. ⬜ Add usage tracking service

**Optional (Post-Launch):**
1. ⬜ Integrate rewarded ads (AdMob)
2. ⬜ Add "first AI guidance free" trial
3. ⬜ Analytics for conversion optimization

### 8.5 Recommended Monetization Model

```
┌─────────────────────────────────────────────────────────────────┐
│                  ASRARIYA MONETIZATION MODEL                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FREE TIER (Build Habit & Trust)                                │
│  ├── Daily Energy & Prayer Times (unlimited)                     │
│  ├── Basic Calculations (5/day)                                  │
│  ├── Basic Compatibility (3/day)                                 │
│  ├── Planetary Hours & Manazil (basic view)                     │
│  ├── First Quran Resonance (1 view)                             │
│  └── Qibla & Islamic Utilities (unlimited)                      │
│                                                                  │
│  REWARDED AD UNLOCK (Voluntary Value Exchange)                  │
│  ├── Extra Quran Resonance views                                │
│  ├── Extended daily guidance                                     │
│  ├── Manzil practice of the day                                 │
│  └── Additional calculation quota                                │
│                                                                  │
│  PREMIUM SUBSCRIPTION ($3.99/mo or $29.99/yr)                   │
│  ├── All AI-powered features                                     │
│  ├── Unlimited calculations                                      │
│  ├── Deep compatibility analysis                                 │
│  ├── Divine Name resonance                                       │
│  ├── Personal transit impact                                     │
│  ├── PDF exports                                                 │
│  ├── Cloud sync                                                  │
│  └── Ad-free experience                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: File Reference

### Key Monetization Files

| File | Purpose |
|------|---------|
| `contexts/SubscriptionContext.tsx` | Global subscription state |
| `services/RevenueCatService.ts` | RevenueCat SDK wrapper |
| `hooks/usePremiumFeature.ts` | Feature gate hook |
| `components/subscription/PremiumSection.tsx` | Soft-lock UI component |
| `components/subscription/UpgradeCard.tsx` | Inline upgrade prompt |
| `components/subscription/PaywallModal.tsx` | Modal paywall |
| `app/paywall.tsx` | Full paywall screen |

### Premium Section Usage Locations

Total: **31 PremiumSection usages** across **12 files**

---

## Appendix B: Environment Variables

```env
# RevenueCat (required for subscriptions)
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=

# Admin bypass (for testing)
EXPO_PUBLIC_ADMIN_EMAILS=dev@example.com,admin@example.com

# AdMob (future - for rewarded ads)
EXPO_PUBLIC_ADMOB_APP_ID_IOS=
EXPO_PUBLIC_ADMOB_APP_ID_ANDROID=
EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID=
```

---

**Report Generated**: February 14, 2026  
**Next Steps**: Configure RevenueCat account, add API keys, test purchase flow
