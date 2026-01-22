# Premium Features Map (Code-Accurate)

This document maps **every `PremiumFeatureId`** and where it is currently used to gate UI in the app.

## Current reality

Premium infrastructure already exists in the codebase:

- `hooks/usePremiumFeature.ts` defines the canonical list of `PremiumFeatureId`s.
- `components/subscription/PremiumSection.tsx` gates content (soft-lock UI) and routes to `/paywall`.
- `contexts/SubscriptionContext.tsx` exists and determines `isPremium` / `isAdmin`.
- `app/paywall.tsx` exists (purchase + restore UI).

Whether **RevenueCat is effectively “enabled”** depends on configuration. When RevenueCat is not configured/initialized, the app defaults to **free tier** (except admin/dev overrides).

## How gating works

- `PremiumSection` calls `usePremiumFeature(featureId)`.
- `usePremiumFeature` grants access when `isPremium || isAdmin`.
- If locked, `PremiumSection` shows an upgrade CTA and navigates to `/paywall` with `{ feature, featureId }`.

## Premium features index (source of truth)

Source: `hooks/usePremiumFeature.ts` (`PREMIUM_FEATURES`).

### Tier: High

#### `aiGuidance`
- Used in: `app/(tabs)/divine-timing.tsx` (PremiumSection at [L696](app/(tabs)/divine-timing.tsx#L696))

#### `aiInterpretation`
- Used in: `features/name-destiny/screens/ResultsScreen.tsx` (PremiumSection at [L423](features/name-destiny/screens/ResultsScreen.tsx#L423))

### Tier: Medium

#### `personalGuidance`
- Used in: `app/(tabs)/planet-transit-details.tsx` (PremiumSections at [L1364](app/(tabs)/planet-transit-details.tsx#L1364), [L1614](app/(tabs)/planet-transit-details.tsx#L1614), [L1796](app/(tabs)/planet-transit-details.tsx#L1796), [L1862](app/(tabs)/planet-transit-details.tsx#L1862))
- Used in: `app/(tabs)/daily-guidance-details.tsx` (PremiumSection at [L247](app/(tabs)/daily-guidance-details.tsx#L247))
- Used in: `app/(tabs)/moment-alignment-detail.tsx` (PremiumSection at [L592](app/(tabs)/moment-alignment-detail.tsx#L592))
- Used in: `app/(tabs)/results.tsx` (PremiumTabWrapper uses PremiumSection at [L263](app/(tabs)/results.tsx#L263))

#### `quranResonance`
- Used in: `features/name-destiny/screens/ResultsScreen.tsx` (PremiumSection at [L694](features/name-destiny/screens/ResultsScreen.tsx#L694))

#### `divineNameResonance`
- Used in: `features/name-destiny/screens/ResultsScreen.tsx` (PremiumSection at [L479](features/name-destiny/screens/ResultsScreen.tsx#L479))

#### `lineageInsights`
- **Not used as a `PremiumSection featureId` currently.**
- Lineage content exists in the enhanced calculator engine/UI, but it’s currently gated under `advancedCalculator` (see below).

#### `elementalHarmony`
- Used in: `app/(tabs)/planet-transit-details.tsx` (PremiumSection at [L1427](app/(tabs)/planet-transit-details.tsx#L1427))

#### `spiritualGuidance`
- Used in: `features/name-destiny/screens/HomeScreen.tsx` (PremiumSection at [L425](features/name-destiny/screens/HomeScreen.tsx#L425))
- Used in: `features/name-destiny/screens/ResultsScreen.tsx` (PremiumSection at [L721](features/name-destiny/screens/ResultsScreen.tsx#L721))
- Used in: `app/(tabs)/prayer-guidance.tsx` (PremiumSection at [L324](app/(tabs)/prayer-guidance.tsx#L324))
- Used in: `app/(tabs)/results.tsx` (PremiumTabWrapper uses PremiumSection at [L277](app/(tabs)/results.tsx#L277) and [L309](app/(tabs)/results.tsx#L309))
- Used in: `components/istikhara/tabs/OverviewTab.tsx` (PremiumSection at [L172](components/istikhara/tabs/OverviewTab.tsx#L172))

#### `timingAdvice`
- Used in: `app/(tabs)/results.tsx` (PremiumTabWrapper uses PremiumSection at [L295](app/(tabs)/results.tsx#L295))

#### `compatibilityDeep`
- Used in: `components/compatibility/RelationshipCompatibilityView.tsx` (PremiumSections at [L206](components/compatibility/RelationshipCompatibilityView.tsx#L206), [L329](components/compatibility/RelationshipCompatibilityView.tsx#L329), [L393](components/compatibility/RelationshipCompatibilityView.tsx#L393), [L455](components/compatibility/RelationshipCompatibilityView.tsx#L455), [L542](components/compatibility/RelationshipCompatibilityView.tsx#L542))
- Used in: `components/compatibility/CompatibilityResultViewEnhanced.tsx` (PremiumSections at [L218](components/compatibility/CompatibilityResultViewEnhanced.tsx#L218), [L237](components/compatibility/CompatibilityResultViewEnhanced.tsx#L237), [L252](components/compatibility/CompatibilityResultViewEnhanced.tsx#L252), [L365](components/compatibility/CompatibilityResultViewEnhanced.tsx#L365), [L1717](components/compatibility/CompatibilityResultViewEnhanced.tsx#L1717), [L1785](components/compatibility/CompatibilityResultViewEnhanced.tsx#L1785), [L2205](components/compatibility/CompatibilityResultViewEnhanced.tsx#L2205))

#### `manazilPractices`
- Used in: `app/(tabs)/manazil.tsx` (PremiumSection at [L408](app/(tabs)/manazil.tsx#L408))

### Tier: Low

#### `pdfExport`
- **Not used as a `PremiumSection featureId` currently.**
- PDF export functionality exists and appears to be currently free:
  - `app/(tabs)/results.tsx` uses `expo-print` (`printToFileAsync`) and sharing.
  - `components/istikhara/tabs/CareerTabAdvanced.tsx` uses `expo-print` (`printToFileAsync`).

#### `cloudSync`
- **Not used as a `PremiumSection featureId` currently.**
- No explicit UI gating found for cloud sync yet.

#### `advancedCalculator`
- Used in: `components/calculator/EnhancedResultsDisplay.tsx` (PremiumSection at [L196](components/calculator/EnhancedResultsDisplay.tsx#L196))
- Note: This PremiumSection wraps multiple “deep” sections (AI enhancements, advanced methods, lineage insights, etc.), so some premium-like content is effectively gated here.

## Paywall / upgrade UI entrypoints

- Paywall screen: `app/paywall.tsx`
- Soft-paywall components:
  - `components/subscription/PremiumSection.tsx`
  - `components/subscription/UpgradeCard.tsx`
  - `components/subscription/PaywallModal.tsx`

## Premium candidates currently ungated (FYI)

These features exist but are not currently tied to a `PremiumFeatureId` gate:

- Profile export (JSON): `app/profile.tsx` (exports JSON via `expo-sharing`)
- PDF export: `app/(tabs)/results.tsx`, `components/istikhara/tabs/CareerTabAdvanced.tsx`

If you want these to be premium, the cleanest approach is to introduce `PremiumSection`/`usePremiumFeature('pdfExport')` gates at the export action points.

---

Last updated: 2026-01-22 (generated from repo grep + feature registry)
