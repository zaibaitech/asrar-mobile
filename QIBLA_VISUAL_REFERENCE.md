# Qibla Feature - Quick Visual Reference

## 🧭 Qibla Screen Layout

```
┌─────────────────────────────────────────┐
│  ← Back    Qibla Direction         ⚪   │  ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📍 Cairo, Egypt                   │  │  ← Location Info
│  │ 🧭 1,234 km to Kaaba              │  │
│  └───────────────────────────────────┘  │
│                                         │
│         ┌─────────────────┐             │
│         │        N        │             │
│         │                 │             │
│         │    ┌─────┐     │             │  ← Compass Ring
│         │ W  │ 🕋  │  E  │             │    (240×240px)
│         │    └─────┘     │             │
│         │        ↑       │             │  ← Green Needle
│         │        S        │             │    (pointing to Qibla)
│         └─────────────────┘             │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Facing        │      Qibla       │  │  ← Bearing Info
│  │   145°         │       67°        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ How to Use                        │  │  ← Instructions
│  │ 1. Hold device flat and level     │  │
│  │ 2. Rotate until arrow points up   │  │
│  │ 3. You're facing Qibla            │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🏠 Home Screen - Before vs After

### **BEFORE:**
```
┌──────────────────────────────────┐
│  Daily Guidance  │  Moment       │
├──────────────────────────────────┤
│  [Check In] [View Insights]      │
├──────────────────────────────────┤
│  Next Prayer  │  Today's Blessing│
├──────────────────────────────────┤
│  Spiritual Modules            ▼  │  ← Collapsible section
│  ┌────┬────┬────┬────┬────┐     │
│  │🧮  │📜  │🌙  │💞  │🕰️ │     │  ← 5 modules in a row
│  └────┴────┴────┴────┴────┘     │
├──────────────────────────────────┤
│  Quick Access                    │  ← Separate section
│  ┌──────────┬──────────┐         │
│  │🕌 Prayer │🔔 Daily  │         │  ← 2×2 grid
│  │  Times   │ Reminder │         │
│  ├──────────┼──────────┤         │
│  │📿 Dhikr │🧮 Calc   │         │  ← DUPLICATE Calculator!
│  │  Counter │          │         │
│  └──────────┴──────────┘         │
└──────────────────────────────────┘
```

### **AFTER:**
```
┌──────────────────────────────────┐
│  Daily Guidance  │  Moment       │
├──────────────────────────────────┤
│  [Check In] [View Insights]      │
├──────────────────────────────────┤
│  Next Prayer  │  Today's Blessing│
├──────────────────────────────────┤
│  Spiritual Modules            ▼  │  ← Single unified section
│  ┌────┬────┬────┐               │
│  │🧮  │📜  │🌙  │               │  ← Row 1: 3 modules
│  ├────┼────┼────┤               │
│  │💞  │🕰️ │🕌  │               │  ← Row 2: 3 modules
│  ├────┼────┼────┤               │
│  │🧭  │📿  │    │               │  ← Row 3: 2 modules + space
│  └────┴────┴────┘               │
└──────────────────────────────────┘
     ↑
   NEW Qibla tile!
```

**Changes:**
- ❌ Removed "Quick Access" section
- ❌ Removed duplicate Calculator
- ✅ Added Prayer Times to main grid
- ✅ Added Qibla (NEW feature)
- ✅ Added Dhikr Counter to main grid
- ✅ 3-column responsive layout
- ✅ More compact, less scrolling

---

## 📱 Module Grid Layout

### Responsive 3-Column Grid:
```css
flexDirection: 'row'
flexWrap: 'wrap'
gap: Spacing.sm
```

Each tile:
- **Width:** 31% (3 columns with gap)
- **Min width:** 90px (prevents too small on tiny screens)
- **Icon size:** 56×56px
- **Icon emoji:** 28px font size
- **Label:** 10px, centered, max 1 line

### Module List (8 total):

| # | Icon | Title | Arabic | Element | Route |
|---|------|-------|--------|---------|-------|
| 1 | 🧮 | Calculator | حاسبة الأبجد | Fire | `/calculator` |
| 2 | 📜 | Name Destiny | قدر الأسماء | Earth | `/(tabs)/name-destiny` |
| 3 | 🌙 | Istikhara | الاستخارة | Water | `/istikhara` |
| 4 | 💞 | Compatibility | التوافق | Air | `/compatibility` |
| 5 | 🕰️ | Divine Timing | التوقيت الإلهي | Fire | `/divine-timing` |
| 6 | 🕌 | Prayer Times | مواقيت الصلاة | Water | `/prayer-times` |
| 7 | 🧭 | **Qibla** | **القبلة** | Earth | `/qibla` |
| 8 | 📿 | Dhikr Counter | عداد الأذكار | Air | `/dhikr-counter` |

---

## 🎨 Design Tokens Used

### Colors:
```typescript
DarkTheme.textPrimary       // #FFFFFF
DarkTheme.textSecondary     // rgba(255, 255, 255, 0.7)
DarkTheme.textTertiary      // rgba(255, 255, 255, 0.5)
DarkTheme.cardBackground    // rgba(255, 255, 255, 0.05)
DarkTheme.accent            // #10b981 (green - for Qibla)
```

### Spacing:
```typescript
Spacing.xs           // 4px
Spacing.sm           // 8px
Spacing.md           // 16px
Spacing.lg           // 24px
Spacing.xl           // 32px
Spacing.screenPadding // 16px
```

### Typography:
```typescript
Typography.weightMedium    // 500
Typography.weightSemibold  // 600
Typography.weightBold      // 700
```

### Cards:
```typescript
borderRadius: 16
borderWidth: 1
borderColor: 'rgba(255, 255, 255, 0.1)'
backgroundColor: 'rgba(255, 255, 255, 0.05)'
```

---

## 🔧 Qibla Calculations

### Bearing Formula:
```typescript
// Calculate bearing from user to Kaaba
function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const toDegrees = (rad) => (rad * 180) / Math.PI;

  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
            Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  return bearing;
}
```

### Distance Formula (Haversine):
```typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### Relative Qibla Angle:
```typescript
// Angle to rotate compass needle
const qiblaRelative = (qiblaBearing - deviceHeading + 360) % 360;
```

---

## 📋 Permission Flow

```
User opens Qibla screen
         ↓
Request location permission
         ↓
    ┌────┴────┐
    │         │
 Granted   Denied
    │         │
    ↓         ↓
Get user   Show error
location   with retry
    ↓
Calculate
 Qibla
    ↓
Subscribe to
 heading
    ↓
Show compass
  (live)
```

### States:
1. **Loading**: Spinner + "Finding your location..."
2. **Permission Denied**: Icon + message + "Enable Location" button
3. **Success**: Compass + info cards
4. **No Compass Sensor**: Warning banner + static bearing

---

## 🌐 Translation Keys

### English:
```typescript
t('qibla.title')              → "Qibla Direction"
t('qibla.yourLocation')       → "Your Location"
t('qibla.facing')             → "Facing"
t('qibla.qibla')              → "Qibla"
t('qibla.permissionRequired') → "Location Permission Required"
t('qibla.enableLocation')     → "Enable Location"
t('qibla.locating')           → "Finding your location..."
t('qibla.noCompass')          → "Compass sensor not available..."
t('qibla.calibrate')          → "Move device in figure-8..."
t('qibla.howToUse')           → "How to Use"
t('qibla.instruction1')       → "Hold device flat and level"
t('qibla.instruction2')       → "Rotate until arrow points up"
t('qibla.instruction3')       → "You're facing Qibla"
```

### French:
```typescript
t('qibla.title')              → "Direction de la Qibla"
t('qibla.yourLocation')       → "Votre Position"
t('qibla.facing')             → "Direction"
t('qibla.qibla')              → "Qibla"
// ... (same keys, French values)
```

---

## ✅ Testing Scenarios

### Home Screen:
1. ✓ Open app → See 8 modules in 3-column grid
2. ✓ No "Quick Access" section visible
3. ✓ Only one Calculator tile (no duplicate)
4. ✓ Qibla tile shows 🧭 icon
5. ✓ Tap Qibla → Navigate to `/qibla`
6. ✓ Rotate device → Grid wraps properly
7. ✓ No overlap with bottom tab bar

### Qibla Screen:
1. ✓ First launch → Request location permission
2. ✓ Deny permission → Show error with retry
3. ✓ Grant permission → Show loading spinner
4. ✓ Get location → Display compass
5. ✓ Move device → Compass heading updates
6. ✓ Needle points to Qibla (relative to heading)
7. ✓ City name displays (if available)
8. ✓ Distance to Kaaba shown
9. ✓ Back button → Return to Home
10. ✓ Switch language → All strings update

### Edge Cases:
- ✓ No internet → GPS still works
- ✓ Indoors → May have weak GPS signal
- ✓ No magnetometer → Show static bearing only
- ✓ Low accuracy → Show calibration hint
- ✓ Airplane mode → Permission flows work

---

## 📦 Files Summary

| File | Purpose | Status |
|------|---------|--------|
| [app/(tabs)/index.tsx](app/(tabs)/index.tsx) | Home screen with unified modules grid | ✅ Updated |
| [app/qibla.tsx](app/qibla.tsx) | Qibla compass screen (MVP) | ✅ Created |
| [constants/translations.ts](constants/translations.ts) | EN/FR translations for Qibla | ✅ Updated |
| [HOME_SCREEN_QIBLA_IMPLEMENTATION.md](HOME_SCREEN_QIBLA_IMPLEMENTATION.md) | Implementation guide | ✅ Created |

**Total Lines Added:** ~680  
**Total Lines Changed:** ~80  
**New Dependencies:** 0 (uses existing packages)

---

## 🚀 Ready to Ship

All requirements met:
- ✅ Quick Access merged into Spiritual Modules
- ✅ Qibla feature implemented (MVP)
- ✅ Dark theme consistency
- ✅ SafeArea handling
- ✅ Translations (EN/FR)
- ✅ Error handling & loading states
- ✅ No duplicate tiles
- ✅ Responsive 3-column grid
- ✅ Smooth animations
- ✅ Permission flows
- ✅ No new dependencies

**Status: Production-ready** 🎉
