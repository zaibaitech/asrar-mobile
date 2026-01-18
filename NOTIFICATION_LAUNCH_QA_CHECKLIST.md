# Notification Launch QA Checklist (EN/FR)

Scope: **Adhan (Prayer)**, **Morning Briefing (Daily Guidance)**, **Harmony Hour (Moment Alignment)**.

This checklist is designed to validate **scheduling + content + language + tap navigation** in realistic conditions (not “test buttons”).

---

## 0) Preconditions (Do this once)

- Use a **development build / production build** (not Expo Go).
- On device:
  - Disable battery restrictions for the app (Android): *Settings → Battery → Unrestricted* (wording varies).
  - Ensure system time/timezone are correct.
- In-app:
  - Ensure notification permissions are granted.
  - Set app language to **English**, then repeat key cases in **French**.

---

## 1) Sanity: Permissions + Channels

### Android
1. Fresh install the app.
2. Launch app → grant notification permission.
3. Confirm notifications appear in **System Settings → Notifications → (your app)**.

Expected:
- Notifications permission is **Allowed**.
- Notifications show your app icon (not Expo).

### iOS
1. Fresh install the app.
2. Launch app → allow notifications.

Expected:
- Permission is **Allowed**.

---

## 2) Adhan (Prayer) Notifications

### Setup
1. Go to Prayer/Adhan settings.
2. Enable Adhan notifications.
3. Enable at least 1 upcoming prayer (e.g. Dhuhr/Asr).

### Case A — Fire at the right time
- Wait for the next enabled prayer notification.

Expected:
- Title/body reference the prayer correctly (name + Arabic when present).
- Tap notification → opens **Notification Detail**.
- CTA opens **Prayer Guidance**.
- Prayer Guidance shows the correct prayer selected (if payload includes it) or defaults sensibly.

### Case B — Quiet hours behavior
1. Enable Quiet Hours in notification prefs (if available) for a window that overlaps a non-prayer notification time.

Expected:
- Prayer notifications still show.
- Non-prayer notifications are suppressed during quiet hours.

---

## 3) Morning Briefing (Daily Guidance)

### Setup
1. Enable Divine Timing notifications.
2. Enable Morning Briefing.
3. Set Morning Briefing time to **~3–5 minutes from now**.

Expected when it fires:
- Title and body are professional and coherent.
- Language matches current app language (repeat once in FR).
- Tap notification → opens **Notification Detail**.
- CTA opens **Daily Guidance Details** route: `/(tabs)/daily-guidance-details`.
- Daily Guidance details render immediately (no blank screen), with:
  - Timing quality
  - Day element
  - Best For / Avoid
  - **Manazil (Lunar Mansion)** section (if profile DOB is present)

---

## 4) Harmony Hour (Moment Alignment)

### Setup
1. Enable Harmony notifications.
2. Ensure Harmony notifications are enabled for at least one type you support (favorable/transformative/delicate).

Expected when it fires:
- Tap notification → Notification Detail.
- CTA opens **Moment Alignment** (`/moment-alignment-details`).
- Screen loads and reflects current timing state (no crash).

---

## 5) Tap Navigation Scenarios (Must pass for launch)

Run these at least once (any notification type):

- **Foreground**: app open → notification arrives → tap
- **Background**: app in background → tap
- **Cold start**: kill app (swipe away) → tap

Expected:
- Always lands on Notification Detail first.
- CTA always routes to the correct module.

---

## 6) Rate Limiting / Spam Safety

1. Enable Harmony + Divine Timing.
2. Use normal app usage for half a day.

Expected:
- Notifications do not exceed the daily limit.
- No obvious duplicate storms after re-opening the app.

---

## 7) Language QA (EN/FR)

Repeat sections **2–4** in both languages.

Expected:
- Scheduled notifications use the correct language.
- Notification detail + CTA labels are localized.

---

## Pass/Fail Recording

For each category, record:
- Device + OS version
- Language (EN/FR)
- Pass/Fail
- Screenshot of tray + Notification Detail + destination screen if fail
