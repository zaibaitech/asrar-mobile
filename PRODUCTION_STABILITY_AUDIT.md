# Production Stability Audit (No Crash / No Close)

This is a practical checklist + a few benchmarks to reduce “app closes on open” and other launch-time crashes for this Expo Router (Expo SDK 54 / RN 0.81) app.

## 1) Startup safety (highest impact)

- **No unhandled promises at startup**
  - Wrap `SplashScreen.preventAutoHideAsync()` / `hideAsync()` in `.catch()`.
  - Any “fire-and-forget” async calls must be `void fn().catch(...)`.

- **Wrap *all* startup initializers in an error boundary**
  - Deep-link handler, onboarding gate, notifications setup must not crash the tree.

- **Global JS exception handler installed**
  - Install a global handler for uncaught exceptions (and `unhandledrejection` on web).

## 2) Environment + config guards

- Ensure `.env` is complete for **production builds** (EAS).
  - Supabase: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - RevenueCat: `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`, `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`
  - AI (optional): `EXPO_PUBLIC_GROQ_API_KEY`, `EXPO_PUBLIC_GROQ_MODEL`

- Prefer “feature disabled” over throwing:
  - If backend keys are missing, show UI explaining what’s disabled instead of crashing.

## 3) Navigation + deep links

- Treat deep links as **untrusted input**:
  - Parse defensively; `queryParams` may be null/undefined.
  - Wrap the whole handler in `try/catch` and fallback to a safe route.

- Provide a global error boundary:
  - Prefer exporting `ErrorBoundary` from the root layout and wrapping startup initializers.

## 4) Network + timeouts

- For any startup fetch:
  - Add timeouts and `try/catch`.
  - Use “best-effort” prefetch; never block initial render.

- Ensure services called on first screen do not throw uncaught.

## 5) Release build checks (benchmark)

Run these before shipping:

- `npm run typecheck:app`
- `npm run typecheck:caching`
- `expo doctor` (optional but recommended)

On device:

- Cold start (kill app → open) 10 times
- Launch offline mode once
- Deny notification permission once
- Open the app from a deep link once

## 6) Crash reporting (recommended)

Add crash reporting before production release:

- **Sentry** (`@sentry/react-native` or `sentry-expo`) with:
  - release + build number
  - breadcrumbs for navigation + network
  - sampling tuned for production

This turns “it crashed” into a stack trace + device context.
