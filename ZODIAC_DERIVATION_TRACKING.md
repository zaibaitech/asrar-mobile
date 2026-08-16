# Zodiac Derivation & Percentage Display — Tracking

Follow-ups identified while fixing the ingress-ambiguity bug (see commits
`a6033d0`, `8379e04`, and the estimation-bug hotfix on top of `a6033d0`).
None of these are started.

## 1. Cosmetic/inert callers still on the old `deriveBurjFromDOB`

`services/ProfileDerivationService.ts::deriveBurjFromDOB()` is a fixed
calendar date-range table with no timezone/ingress-ambiguity handling. The
ingress-aware `resolveBurjWithIngressGuard()` was migrated into every
consumer that renders sign-specific content as fact (Who Am I/Sadaqah,
Moment Alignment, Daily Guidance, Planet Transit, Prayer Guidance). The
following consumers were deliberately left on the old function because
their output is cosmetic-only or the wiring is inert — listed here so
they aren't silently forgotten if their usage becomes more substantive
later:

- `components/istikhara/tabs/BirthProfileTab.tsx` — sun-sign badge/chip
  display only, no interpretive text derived from it.
- `app/(tabs)/index.tsx` — home screen element pill (label/color only).
- `app/(tabs)/index.tsx` (`MomentAlignmentStrip`'s `userBurjIndex` prop) —
  currently a **dead/inert** input: `SimpleAlignmentBadge.ts::getAlignmentBadge()`'s
  `_userRuler` parameter is unused in the function body, so this wiring has
  no effect on what's rendered today. Worth deleting the dead parameter
  entirely, or wiring it up for real, rather than leaving it as
  silently-inert plumbing.
- `components/home/RightStackWidgets.tsx` — selects *which* live transit is
  shown as "yours" (mildly substantive — an attribution effect, not
  fabricated text). Lower priority than the above.
- `components/home/PlanetTransitWidget.tsx` (home widget) — label + harmony
  color tint only.
- `app/profile.tsx` — live-preview label while the user is typing their DOB,
  never persisted from this screen.

## 2. Who Am I still shows raw percentages

`app/(tabs)/results.tsx` (via `OverviewTab.tsx` and related tabs) renders
**Overall Alignment 95%, Career Match 92%, Spiritual Practice 88%** — the
same false-precision problem that was just removed from the DOB
compatibility screens (`PersonPersonZodiacResultView.tsx`). This is a
higher-stakes screen than compatibility: it's the one carrying the Cheikh
Mahdiyou Niane Sadaqah attribution, and it's built from a single calendar
date (or date+optional time/location) — the same input-resolution ceiling
that motivated removing percentages from compatibility applies here too.

Scope not investigated yet — flagging only. When picked up, this should at
minimum answer:
- Where each percentage is actually computed (which service, what inputs).
- Whether a 3-tier (Saʿīd/Muʿtadil/Maḥdhūr) or similar non-numeric output
  is appropriate here too, mirroring `services/compatibility/compatibilityTier.ts`.
- Whether removing the percentage requires a UI redesign of the Overview/
  Career/Spiritual Practice tab cards (likely yes, they're built around a
  numeric ring/badge).

**Do not start this without explicit instruction** — filed for visibility only.
