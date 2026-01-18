# Notification System Quick Reference

## Launch Note (Jan 2026)

The in-app test screen/buttons and `sendTest*()` helpers were removed for launch readiness.
Use `NOTIFICATION_LAUNCH_QA_CHECKLIST.md` for end-to-end validation (scheduling, EN/FR content, and tap navigation).

## 30-Second Overview

✅ **Icon Fixed**: White silhouette replaces Expo logo  
✅ **Services Created**: Harmony hours + Divine timing notifications  
✅ **Settings UI**: Full control panel at `app/(tabs)/notification-settings.tsx`  
✅ **Status**: 95% production-ready (needs device testing)

---

## Quick Test

Follow the steps in `NOTIFICATION_LAUNCH_QA_CHECKLIST.md` (adjust notification times a few minutes ahead, then validate taps and destinations).

---

## File Locations

| File | Purpose | Lines |
|------|---------|-------|
| `services/NotificationService.ts` | Base infrastructure | 584 |
| `services/HarmonyHourNotificationService.ts` | Favorable timing alerts | 340 |
| `services/DivineTimingNotificationService.ts` | Morning briefings + alignment | 315 |
| `app/(tabs)/notification-settings.tsx` | Settings UI | 450 |
| `assets/images/notification-icon.png` | White silhouette icon | replaced |

---

## Notification Types

### Harmony Hours
- 🌟 **Favorable** (harmony ≥ 0.7) - "Perfect time for..."
- ✨ **Transformative** (harmony 0.4-0.7) - "Good for..."  
- ⚠️ **Delicate** (harmony < 0.4) - "Exercise caution..."

### Divine Timing
- 🌅 **Morning Briefing** (07:00 default) - Daily spiritual guidance
- ✨ **Element Alignment** - When user element strongly activated

---

## Enable in App

1. Open notification settings screen
2. Grant permissions if needed
3. Toggle "Enable Harmony Notifications"
4. Toggle "Enable Divine Timing"
5. Use test buttons to verify
6. Notifications auto-schedule

---

## Settings Structure

```typescript
{
  harmony: {
    enabled: boolean,
    notifyFavorable: boolean,
    notifyTransformative: boolean,
    notifyDelicate: boolean,
  },
  timing: {
    enabled: boolean,
    morningBriefing: boolean,
    morningBriefingTime: string, // "07:00"
    elementalAlignment: boolean,
  },
  general: {
    quietHoursStart: string,     // "22:00"
    quietHoursEnd: string,       // "07:00"
    maxNotificationsPerDay: number, // 12
  }
}
```

---

## Schedule Notifications

```typescript
// Schedule harmony hours
import HarmonyService from '@/services/HarmonyHourNotificationService';
await HarmonyService.scheduleHarmonyNotifications();

// Schedule divine timing
import TimingService from '@/services/DivineTimingNotificationService';
await TimingService.scheduleMorningBriefing();
await TimingService.scheduleElementAlignmentAlerts();
```

---

## Common Issues

### Icon Still Expo Logo
```bash
# Rebuild app with cache clear
npx expo start -c
```

### Notifications Not Showing
```typescript
// Check permissions
const { status } = await Notifications.getPermissionsAsync();

// Check enabled
const prefs = await NotificationService.getNotificationPreferences();
console.log(prefs.harmony.enabled, prefs.timing.enabled);

// Check scheduled
const all = await Notifications.getAllScheduledNotificationsAsync();
console.log(`${all.length} notifications scheduled`);
```

### Quiet Hours Blocking
- Quiet hours: 22:00 - 07:00 by default
- Prayer notifications exempt
- Other categories blocked during quiet hours

---

## Integration Points

### Required Services
1. **AsrarTimingService** - Must provide:
   ```typescript
   getAsrarTimingSnapshot(date?: Date): {
     harmony: number,
     planetaryHour: { ruler: string, element: string },
     dayElement: string,
     islamicDay: { dayName: string }
   }
   ```

2. **UserProfileStorage** - Must provide:
   ```typescript
   getUserProfile(): { element: 'fire' | 'earth' | 'air' | 'water' }
   ```

### App Startup Integration
```typescript
// In app startup or main layout
import NotificationService from '@/services/NotificationService';
import HarmonyService from '@/services/HarmonyHourNotificationService';
import TimingService from '@/services/DivineTimingNotificationService';

// Initialize
await NotificationService.initializeNotifications();

// Schedule if enabled
const prefs = await NotificationService.getNotificationPreferences();
if (prefs.harmony.enabled) {
  await HarmonyService.scheduleHarmonyNotifications();
}
if (prefs.timing.enabled) {
  await TimingService.scheduleMorningBriefing();
  await TimingService.scheduleElementAlignmentAlerts();
}
```

---

## Testing Checklist

- [ ] Send test harmony notification
- [ ] Send test divine timing notification  
- [ ] Verify white icon appears (not Expo)
- [ ] Check Android notification channels
- [ ] Test quiet hours (schedule during 22:00-07:00)
- [ ] Test rate limiting (schedule 15+ notifications)
- [ ] Verify Do Not Disturb respected
- [ ] Test notification taps

---

## What's Next

1. **Device Testing** (30 min) - Install and test on real device
2. **Integration** (1 hour) - Add to app startup, link settings
3. **Launch** - Enable for users

---

## Support

**Documentation**: See `NOTIFICATION_IMPLEMENTATION_COMPLETE.md` (full guide)  
**Status**: 95% complete, pending device testing  
**Estimated Testing Time**: 30 minutes  
**Ready for**: Production launch after device verification

---

## Key Numbers

- **1,689** lines of code
- **4** new service files
- **7** notification categories
- **5** Android channels
- **12** max notifications/day
- **100** notification history entries
- **24** hours scheduled in advance
- **5** second test notification delay

---

🚀 **Ready to test on device!**
