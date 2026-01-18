# Notification Copy Benchmark (EN/FR) — Launch Standard

This is the internal standard for *production-ready* notification content in Asrār.

## Goals

- **Clarity first**: user immediately understands *what this is* and *what to do next*.
- **Actionable**: every non-test notification suggests a single next step.
- **Consistent tone**: calm, respectful, spiritually aligned — never pushy.
- **Bilingual parity (EN/FR)**: same meaning and CTA across languages.
- **Brevity**: fits typical notification trays without truncation.

## Copy Rules

### Title
- 28–45 characters preferred.
- Starts with a meaningful icon only if it adds quick scannability.
- Uses consistent naming:
  - Prayer: `🕌 {Prayer}`
  - Reminder: `⏰ {Prayer} in {minutes} min`
  - Timing: `✨ Alignment Peak — {Element}` / `Morning Briefing — {Day}`

### Body
- 1–2 short sentences max.
- Structure:
  1) Context (“what is happening”)
  2) Action (“what to do next”)
- Avoid absolute claims (“perfect”, “guaranteed”). Prefer “favorable”, “supportive”, “good for”.

### CTA phrasing
- Always ends with an in-app destination:
  - “Tap to view Prayer Times.”
  - “Open Divine Timing for guidance.”
  - “Open Daily Check‑In for guidance.”

### Localization
- Don’t translate proper spiritual terms incorrectly.
- Keep Arabic script as-is when included.
- Use localized labels for planets/elements when shown.

## Acceptance Checklist

A notification is *launch ready* if:

- [ ] Title and body are correct in **English**.
- [ ] Title and body are correct in **French**.
- [ ] Tap opens a screen where the user can **read the full content**.
- [ ] There is an obvious next step (CTA) and a button/link to the target feature.
- [ ] It doesn’t fire during quiet hours (unless intentionally exempt).
- [ ] It doesn’t exceed rate limits (unless test/debug).

## Where Copy Lives

- Templates are stored in `constants/translations.ts` under:
  - `notifications.harmony.*`
  - `notifications.timing.*`
  - `notifications.prayer.*`
  - `notifications.detail.*` (notification detail screen UI strings)

