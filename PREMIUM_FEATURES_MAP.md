# 🗺️ Premium Features Map - Where to Add Paywalls

**Quick reference showing where premium features are in codebase and where to add subscription checks**

---

## 🎯 CURRENT STATE

**REALITY**: All features are currently 100% FREE and accessible to everyone.

**Files with `isPremium` checks**: EXIST but set to `false` (disabled)
**Subscription context**: DOES NOT EXIST
**Paywall screens**: DO NOT EXIST
**RevenueCat**: NOT INSTALLED

---

## 📍 PREMIUM FEATURES BY LOCATION

### 1. 🌟 Planet Details - Premium Spiritual Layer
**File**: `app/(tabs)/planet-detail.tsx.frozen_backup`  
**Status**: ⚠️ Frozen (backup), has premium structure but disabled  
**Current**: All users see all content  
**Should Be**: Premium users only

```typescript
// LINE 67 - Currently set to false
const isPremium = false; // TODO: integrate with actual subscription state

// LINE 431-443 - Divine Names Card (should be premium)
<View style={[styles.card, !isPremium && styles.cardLocked]}>
  {isPremium && (
    <DivineNamesDisplay names={snapshot.premium.divineNames} />
  )}
</View>

// LINE 443-516 - Premium spiritual layer
{isPremium && snapshot.premium ? (
  <PremiumSpiritualContent />
) : (
  <PremiumAppetiteCard />  // Already shows "upgrade" card
)}
```

**ACTION NEEDED**:
```typescript
// Replace line 67 with:
const { isPremium } = useSubscription();
```

---

### 2. 🌙 Divine Timing - AI Guidance Enhancement
**File**: `app/(tabs)/divine-timing.tsx`  
**Status**: ✅ Active, fully accessible  
**Current**: Free AI guidance for all  
**Should Be**: Premium feature

```typescript
// AI enhancement section (around line 200+)
// Currently no paywall check

// Add before AI call:
const { isPremium } = useSubscription();

if (!isPremium) {
  // Show paywall modal or upgrade prompt
  return <PaywallPrompt feature="AI Guidance" />;
}
```

**Features to Lock**:
- AI-enhanced Divine Timing interpretation
- Personalized guidance based on astrological profile
- Advanced recommendations

**File**: `services/AIReflectionService.ts`
```typescript
// LINE 111 - AI availability check
export function isAIAvailable(): boolean {
  return ENABLE_AI_CAPABILITY && Boolean(GROQ_API_KEY);
}

// Should also check subscription:
export function isAIAvailable(isPremium: boolean = false): boolean {
  return isPremium && ENABLE_AI_CAPABILITY && Boolean(GROQ_API_KEY);
}
```

---

### 3. 📖 Quran Resonance - Advanced Insights
**File**: `services/QuranResonanceService.ts`  
**Used In**: Multiple calculator result screens  
**Status**: ✅ Active, fully accessible  
**Current**: All users get Quran resonance  
**Should Be**: Premium feature

```typescript
// Main function - line 27
export async function getQuranResonance(
  kabir: number,
  language: Language = 'en'
): Promise<QuranResonance | null> {
  // Add premium check at start
  // For now, return null if not premium
}
```

**Used In**:
- `features/name-destiny/screens/ResultsScreen.tsx` (line 24+)
- Calculator results
- Name analysis results

**ACTION NEEDED**:
```typescript
// In ResultsScreen.tsx
const { isPremium } = useSubscription();

// Only fetch if premium
useEffect(() => {
  if (isPremium && totalKabir) {
    fetchQuranResonance();
  }
}, [isPremium, totalKabir]);

// Show upgrade card if not premium
{!isPremium && (
  <QuranResonanceUpgradeCard />
)}
```

---

### 4. 💑 Compatibility Analysis - Advanced Features
**Files**: Multiple compatibility-related files  
**Status**: ✅ Active, fully accessible  
**Current**: Full compatibility analysis for all  
**Should Be**: Basic free, advanced premium

```typescript
// Free tier:
- Basic name compatibility
- Element harmony
- Simple compatibility score

// Premium tier:
- Lineage insights (mother's name influence)
- Advanced numerology breakdown
- Detailed recommendations
- PDF export
```

**Files to Modify**:
- `features/name-destiny/screens/ResultsScreen.tsx`
- `services/InsightAdapters.ts` (line 90-130 - lineage insights)

**ACTION NEEDED**:
```typescript
// In compatibility results
const { isPremium } = useSubscription();

// Show lineage only if premium
{isPremium && result.lineageInsights && (
  <LineageInsightsCard insights={result.lineageInsights} />
)}

{!isPremium && (
  <UpgradeCard
    title="Unlock Lineage Insights"
    description="Discover how your mother's name influences your destiny"
  />
)}
```

---

### 5. 📊 Calculator - Premium Results
**File**: `services/EnhancedCalculatorEngine.ts`  
**Status**: ✅ Active, fully accessible  
**Current**: All calculation types available  
**Should Be**: Basic free, advanced premium

```typescript
// Free tier:
- Basic Abjad calculation
- Simple kabir/saghir values
- Basic element

// Premium tier:
- Advanced methods (wusta, kamal, bast, sirr)
- Sacred number resonance
- Divine name recommendations
- Detailed analytics
```

**Files to Modify**:
- `components/calculator/SacredResonance.tsx` (line 21+)
- Calculator result displays

---

### 6. 🤲 Istikhara - AI Enhancement
**Files**: Istikhara module (multiple files)  
**Status**: ✅ Active, fully accessible  
**Current**: Full AI istikhara for all  
**Should Be**: Premium feature

**Features to Lock**:
- AI-powered spiritual interpretation
- Personalized recommendations
- Advanced buruj insights

**ACTION NEEDED**: Add premium checks before AI calls

---

### 7. 💾 Cloud Sync & Export
**File**: `app/profile.tsx`  
**Status**: ⚠️ Partially implemented (export only)  
**Current**: Data export available to all  
**Should Be**: Premium feature

```typescript
// LINE 499+ - Export functionality
// Currently accessible to all users

// Add premium check:
const { isPremium } = useSubscription();

// In render:
{isPremium ? (
  <ExportProfileButton />
) : (
  <UpgradeCard feature="Data Export & Cloud Sync" />
)}
```

**Cloud Sync**:
- File: `services/AuthService.ts` (stub exists)
- Currently: Local storage only
- Premium: Supabase cloud sync

---

## 🔒 WHERE TO ADD SUBSCRIPTION CHECKS

### Pattern 1: Screen-Level Paywall
```typescript
// For entire features (e.g., AI Istikhara)
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function PremiumFeatureScreen() {
  const { isPremium, showPaywall } = useSubscription();
  
  if (!isPremium) {
    return <PaywallScreen feature="Feature Name" />;
  }
  
  return <ActualFeature />;
}
```

### Pattern 2: Feature-Level Lock
```typescript
// For specific cards/sections within a screen
const { isPremium } = useSubscription();

{isPremium ? (
  <PremiumContent />
) : (
  <UpgradeCard />
)}
```

### Pattern 3: Function-Level Gate
```typescript
// For services/utilities
export async function premiumFeature(isPremium: boolean) {
  if (!isPremium) {
    throw new Error('Premium feature');
  }
  // ... actual logic
}
```

---

## 📝 FILES TO CREATE

### 1. Subscription Context
**File**: `contexts/SubscriptionContext.tsx`
```typescript
interface SubscriptionContextType {
  isPremium: boolean;
  isLoading: boolean;
  products: PurchasesPackage[];
  purchasePackage: (pkg: PurchasesPackage) => Promise<void>;
  restorePurchases: () => Promise<void>;
  showPaywall: (feature?: string) => void;
}
```

### 2. RevenueCat Service
**File**: `services/RevenueCatService.ts`
```typescript
export class RevenueCatService {
  static async initialize(): Promise<void>;
  static async purchasePackage(pkg: PurchasesPackage): Promise<void>;
  static async restorePurchases(): Promise<void>;
  static async getOfferings(): Promise<PurchasesOfferings>;
  static async getCustomerInfo(): Promise<CustomerInfo>;
}
```

### 3. Paywall Screen
**File**: `app/paywall.tsx`
- Main paywall UI
- Subscription options
- Purchase buttons
- Feature comparison

### 4. Paywall Modal
**File**: `components/PaywallModal.tsx`
- Reusable modal version
- Can be triggered from locked features

### 5. Upgrade Cards
**File**: `components/subscription/UpgradeCard.tsx`
- Reusable upgrade prompt
- Shows for locked features
- Links to paywall

---

## 🎨 UI COMPONENTS THAT EXIST (Reusable)

### Premium Appetite Cards
**File**: `PLANET_DETAILS_PREMIUM_IMPLEMENTATION.md` (documented)  
**Example**: Lines 112-131

```tsx
<LinearGradient
  colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)']}
  style={styles.premiumAppetiteCard}
>
  <View style={styles.premiumIconContainer}>
    <Ionicons name="lock-closed" size={24} color="#FFD700" />
  </View>
  <Text style={styles.premiumAppetiteTitle}>
    Unlock Divine Name Guidance
  </Text>
  <Text style={styles.premiumAppetiteDescription}>
    Discover personalized Divine Name recommendations...
  </Text>
  <Pressable style={styles.premiumAppetiteButton} onPress={showPaywall}>
    <Text>Unlock Premium</Text>
    <Ionicons name="arrow-forward" />
  </Pressable>
</LinearGradient>
```

**Status**: ✅ UI exists, just need to wire up `onPress` handlers

---

## 🔄 INTEGRATION FLOW

### Step 1: Create Subscription System
```
1. Install react-native-purchases
2. Create RevenueCatService.ts
3. Create SubscriptionContext.tsx
4. Wrap app in SubscriptionProvider
```

### Step 2: Add Paywalls
```
1. Create app/paywall.tsx
2. Create PaywallModal component
3. Create UpgradeCard component
4. Test paywall UI
```

### Step 3: Gate Features
```
1. Update planet-detail.tsx (change isPremium = false to useSubscription)
2. Update divine-timing.tsx (add AI lock)
3. Update QuranResonanceService.ts (add premium check)
4. Update compatibility results (lock advanced)
5. Update calculator results (lock premium insights)
6. Update profile export (lock for free)
```

### Step 4: Test
```
1. Free user → verify locks work
2. Premium user → verify all unlocked
3. Purchase flow → verify subscription activates
4. Restore → verify works cross-platform
```

---

## 📊 SUMMARY TABLE

| Feature | File(s) | Current Access | Should Be | Priority |
|---------|---------|----------------|-----------|----------|
| **Planet Details Premium Layer** | `planet-detail.tsx` | All users | Premium | 🔴 HIGH |
| **AI Divine Timing** | `divine-timing.tsx` | All users | Premium | 🔴 HIGH |
| **Quran Resonance** | `QuranResonanceService.ts` | All users | Premium | 🔴 HIGH |
| **Advanced Compatibility** | Multiple | All users | Premium | 🟡 MEDIUM |
| **Premium Calculator Insights** | `EnhancedCalculatorEngine.ts` | All users | Premium | 🟡 MEDIUM |
| **AI Istikhara** | Istikhara module | All users | Premium | 🟡 MEDIUM |
| **Cloud Sync** | `AuthService.ts` | None | Premium | 🟢 LOW (v1.1) |
| **Data Export** | `profile.tsx` | All users | Premium | 🟢 LOW |
| **PDF Reports** | Various | All users | Premium | 🟢 LOW |

---

## 🚀 FASTEST IMPLEMENTATION PATH

### Day 1: Foundation (8 hours)
```
✅ Set up RevenueCat account
✅ Install react-native-purchases
✅ Create RevenueCatService.ts (basic)
✅ Create SubscriptionContext.tsx
✅ Wrap app in provider
✅ Create basic paywall.tsx
```

### Day 2: Core Gating (6 hours)
```
✅ Update planet-detail.tsx (isPremium from context)
✅ Update divine-timing.tsx (lock AI)
✅ Update QuranResonanceService.ts (premium check)
✅ Test free vs premium access
```

### Day 3: Polish & Test (6 hours)
```
✅ Create PaywallModal component
✅ Create UpgradeCard component
✅ Wire up all "Unlock Premium" buttons
✅ Test purchase flow
✅ Test restore purchases
```

**Total**: 20 hours minimum viable monetization

---

## 📞 CRITICAL FILES CHECKLIST

When implementing monetization, you MUST touch these files:

### Must Create (6 files):
- [ ] `services/RevenueCatService.ts`
- [ ] `contexts/SubscriptionContext.tsx`
- [ ] `app/paywall.tsx`
- [ ] `components/PaywallModal.tsx`
- [ ] `components/subscription/UpgradeCard.tsx`
- [ ] `utils/subscriptionHelpers.ts`

### Must Modify (10+ files):
- [ ] `app/_layout.tsx` (wrap in SubscriptionProvider)
- [ ] `app/(tabs)/planet-detail.tsx` (use context)
- [ ] `app/(tabs)/divine-timing.tsx` (lock AI)
- [ ] `app/profile.tsx` (show subscription, lock export)
- [ ] `services/QuranResonanceService.ts` (premium check)
- [ ] `services/AIReflectionService.ts` (premium check)
- [ ] `features/name-destiny/screens/ResultsScreen.tsx` (lock Quran)
- [ ] `services/InsightAdapters.ts` (lock lineage)
- [ ] `components/calculator/SacredResonance.tsx` (lock advanced)
- [ ] `app.json` (add RevenueCat plugin)
- [ ] `.env` (add RevenueCat keys)

---

**Status**: 📍 MAP COMPLETE  
**Next**: Choose monetization strategy → implement → test → launch  
**Timeline**: 7-10 days to monetized launch

---

*Feature map created: January 17, 2026*
*Based on codebase analysis and documentation review*
