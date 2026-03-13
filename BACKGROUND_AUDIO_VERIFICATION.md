# Background Audio - Verification Checklist

## ✅ Pre-Build Verification

Use this checklist before building to ensure everything is configured correctly.

### 1. Core Files Present

- [x] `services/AdhanAudioService.ts` - Adhan playback service
- [x] `services/TrackPlayerService.ts` - Track Player setup (already existed)
- [x] `components/NotificationReceivedHandler.tsx` - Notification listener
- [x] `components/MiniPlayer.tsx` - Persistent player UI (optional)
- [x] `service.js` - Track Player service registration
- [x] `components/quran/AudioPlayer.tsx` - Updated to use Track Player

### 2. Configuration Files

**package.json:**
```json
{
  "dependencies": {
    "react-native-track-player": "^4.1.2"  ✅
  },
  "react-native-track-player": {
    "playbackServicePath": "./service.js"  ✅
  }
}
```

**app.json (iOS):**
```json
{
  "ios": {
    "infoPlist": {
      "UIBackgroundModes": ["audio", "fetch"]  ✅
    }
  }
}
```

**app.json (Android):**
```json
{
  "android": {
    "permissions": [
      "android.permission.INTERNET",       ✅
      "android.permission.WAKE_LOCK"       ✅
    ]
  }
}
```

### 3. App Layout Integration

**app/_layout.tsx:**
- [x] Import `NotificationReceivedHandler`
- [x] Include `<NotificationReceivedHandler />` in layout
- [x] Import `registerPlaybackService` from TrackPlayerService
- [x] Call `registerPlaybackService()` at module level

**Verify:**
```bash
grep "NotificationReceivedHandler" app/_layout.tsx
# Should show import and usage

grep "registerPlaybackService" app/_layout.tsx
# Should show import and call
```

### 4. Assets Present

Check audio files exist:
```bash
ls -lh assets/sounds/adhan_*.mp3
```

Expected files:
- [x] `adhan_default.mp3`
- [x] `adhan_mishary.mp3`
- [x] `adhan_mecca.mp3`
- [x] `adhan_medina.mp3`
- [x] `adhan_fajr.mp3`

### 5. Code Quality

**No compilation errors:**
```bash
npm run typecheck:app
```

**Check specific files:**
- [ ] `services/AdhanAudioService.ts` - No errors
- [ ] `components/NotificationReceivedHandler.tsx` - No errors
- [ ] `components/MiniPlayer.tsx` - No errors
- [ ] `components/quran/AudioPlayer.tsx` - No errors

## 🏗️ Build Verification

### Development Build

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

### EAS Build

**Development:**
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

**Production:**
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

## 🧪 Functional Testing

### Test 1: Adhan Playback
- [ ] Schedule a prayer notification for 1 minute from now
- [ ] When notification fires → Adhan audio plays
- [ ] Minimize app → Audio continues
- [ ] Lock screen → Audio continues
- [ ] Audio completes and stops automatically

**Test Command:**
```typescript
// In Adhan settings screen, create test notification
import { scheduleTestPrayerNotification } from '@/services/AdhanNotificationService';

await scheduleTestPrayerNotification(new Date(Date.now() + 60000));
```

### Test 2: Lock Screen Controls (iOS)
- [ ] Play Adhan
- [ ] Lock device
- [ ] Lock screen shows: Prayer name, artist, album art
- [ ] Lock screen controls: Play, Pause, Stop work
- [ ] Swipe to Control Center → Playback info shown

### Test 3: Notification Controls (Android)
- [ ] Play Adhan
- [ ] Foreground service notification appears
- [ ] Notification shows: Prayer name, controls
- [ ] Tap Play/Pause → Works correctly
- [ ] Tap Stop → Audio stops, notification dismisses
- [ ] Swipe notification → Audio continues

### Test 4: App Kill Behavior

**Android:**
- [ ] Play Adhan
- [ ] Swipe app away from recents
- [ ] Audio continues playing ✅
- [ ] Notification remains visible
- [ ] Tap notification → App reopens

**iOS:**
- [ ] Play Adhan
- [ ] Swipe app away from recents
- [ ] Audio stops (expected iOS behavior) ✅
- [ ] Restart app → No audio playing

### Test 5: Quran Audio
- [ ] Open Quran reader
- [ ] Tap play on an ayah
- [ ] Audio plays
- [ ] Minimize app → Audio continues
- [ ] Return to app → Play/pause button shows correct state

### Test 6: Audio Interruptions

**Phone Call:**
- [ ] Play Adhan
- [ ] Receive phone call
- [ ] Audio pauses automatically
- [ ] End call → Audio resumes

**Alarm:**
- [ ] Play Adhan
- [ ] Alarm fires
- [ ] Audio ducks/pauses
- [ ] Dismiss alarm → Audio resumes

**Another App:**
- [ ] Play Adhan
- [ ] Open music app
- [ ] Play music → Adhan stops
- [ ] Pause music → Adhan doesn't auto-resume (expected)

## 🔍 Debug Checklist

If audio doesn't work, check:

### Console Logs
```
✅ Track Player initialized successfully
✅ Playing [PrayerName] adhan ([type])
❌ Track Player not available (means: Expo Go or build failed)
```

### Runtime Checks
```typescript
import { isTrackPlayerAvailable } from '@/services/TrackPlayerService';

console.log('Track Player available:', isTrackPlayerAvailable);
// Should be: true (in native build)
// Will be: false (in Expo Go)
```

### Native Module Check
```typescript
import { NativeModules } from 'react-native';

console.log('TrackPlayerModule:', !!NativeModules.TrackPlayerModule);
// Should be: true
```

### Permissions (Android)
```bash
adb shell dumpsys package com.zaibaitech.asrariya | grep permission
```
Should show:
```
android.permission.WAKE_LOCK: granted=true
android.permission.INTERNET: granted=true
```

## 📊 Performance Testing

### Memory Usage
- [ ] Play Adhan → Check memory usage
- [ ] Play 10 ayahs in sequence → Memory doesn't leak
- [ ] Stop playback → Memory released

### Battery Impact
- [ ] Play Adhan for 5 minutes
- [ ] Check battery usage in device settings
- [ ] Should be minimal (foreground service is efficient)

### Network Usage
- [ ] Play online ayah → Network request made
- [ ] Play same ayah again → Uses cache (if implemented)

## ✅ Production Readiness

Before submitting to stores:

- [ ] All functional tests pass
- [ ] Background audio works on both platforms
- [ ] No crashes or memory leaks
- [ ] App Store/Play Store privacy policies updated
- [ ] TestFlight/Internal testing complete
- [ ] User documentation updated

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Device: ___________
OS Version: ___________
Build: Development / Production

Test 1: Adhan Playback         [ PASS / FAIL ]
Test 2: Lock Screen Controls    [ PASS / FAIL ]
Test 3: Notification Controls   [ PASS / FAIL ]
Test 4: App Kill Behavior       [ PASS / FAIL ]
Test 5: Quran Audio            [ PASS / FAIL ]
Test 6: Audio Interruptions    [ PASS / FAIL ]

Issues found:
1. _________________________________
2. _________________________________
3. _________________________________

Overall: [ APPROVED / NEEDS WORK ]
```

## 🚀 Next Steps After Verification

1. **Green Checkmarks on All Tests:**
   - Merge to main branch
   - Create production build
   - Submit to TestFlight/Internal Testing
   - Gather user feedback

2. **Some Tests Failing:**
   - Document failures
   - Fix issues
   - Re-test
   - Repeat until all pass

3. **Enhancement Backlog:**
   - Add progress bar to MiniPlayer
   - Implement audio caching
   - Add playback speed control
   - Support playlist/queue

---

**Current Status:** Ready for testing in development build
**Last Updated:** [Current Date]
**Verified By:** [Your Name]
